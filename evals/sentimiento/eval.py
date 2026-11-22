#!/usr/bin/env python3
"""Eval de sentimiento por columna sobre respuestas de encuesta. Ver PLAN.md.

  python3 eval.py generar                 # Claude (opus) escribe dataset.json desde preguntas.json
  python3 eval.py correr --modelo opus    # corre las 4 condiciones, guarda resultados/<modelo>/
  python3 eval.py puntuar                 # escribe resultados/RESULTADOS.md

Claude corre con `claude -p` (usa la suscripción, no API key). Jev necesita TYPESAFE_API_KEY.
"""
import argparse
import json
import os
import re
import ssl
import subprocess
import tempfile
import threading
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

AQUI = Path(__file__).parent
PREG = json.loads((AQUI / "preguntas.json").read_text())
PREGUNTAS = {p["id"]: p for p in PREG["preguntas"]}
ESCALA = PREG["escala"]
NIVELES = [-2, -1, 0, 1, 2]
DATASET = AQUI / "dataset.json"
RES = AQUI / "resultados"
# Genera el dataset y alinea columnas inducidas con las de referencia. Fijo para que cambiar
# el modelo bajo prueba no cambie el dataset ni la vara con que se mide.
MODELO_FIJO = "opus"
CONDICIONES = ["claude_solo", "jev_columnas_sabidas", "claude_pregunta_jev", "claude_respuestas_jev"]
TIPO_TEXTO = ("Transcripción automática de una respuesta hablada (audio de hasta 3 minutos). "
              "Puede tener muletillas y errores de transcripción.")
_claude_slots = threading.Semaphore(8)  # procesos `claude -p` simultáneos
TOKENS_JEV, _tokens_lock = [0], threading.Lock()  # tokens de entrada de Jev en esta corrida
# El Python de python.org en macOS no trae certificados raíz; el bundle del sistema sí.
SSL = ssl.create_default_context(cafile="/etc/ssl/cert.pem" if os.path.exists("/etc/ssl/cert.pem") else None)


def claude(prompt, schema, modelo, sistema):
    cmd = ["claude", "-p", prompt, "--model", modelo, "--effort", "medium", "--tools", "",
           "--setting-sources", "", "--strict-mcp-config", "--disable-slash-commands",
           "--no-session-persistence", "--system-prompt", sistema,
           "--output-format", "json", "--json-schema", json.dumps(schema)]
    error = ""
    with _claude_slots, tempfile.TemporaryDirectory() as cwd:  # fuera del repo: no carga AGENTS.md
        for _ in range(3):
            p = subprocess.run(cmd, cwd=cwd, stdin=subprocess.DEVNULL, capture_output=True,
                               text=True, timeout=900)
            try:
                out = json.loads(p.stdout)
                if not out.get("is_error") and out.get("structured_output") is not None:
                    return out["structured_output"]
                error = p.stdout[-800:]
            except json.JSONDecodeError:
                error = (p.stderr or p.stdout)[-800:]
    raise RuntimeError(f"claude -p falló 3 veces: {error}")


def jev(state, questions):
    body = json.dumps({"model": "jev-latest", "state": state, "questions": questions}).encode()
    req = urllib.request.Request(
        "https://api.typesafe.ai/v1/systemone", data=body,
        headers={"Authorization": f"Bearer {os.environ['TYPESAFE_API_KEY']}",
                 "Content-Type": "application/json"})
    for intento in range(5):
        try:
            with urllib.request.urlopen(req, timeout=120, context=SSL) as r:
                return json.loads(r.read())
        except urllib.error.HTTPError as e:
            if e.code != 429 or intento == 4:
                raise RuntimeError(f"Jev {e.code}: {e.read()[:500]!r}") from e
            time.sleep(2 ** intento)


def lista_escala():
    return "\n".join(f"{n}: {ESCALA[str(n)]}" for n in NIVELES)


def lista_columnas(columnas):
    return "\n".join(f"- {c}: {d}" for c, d in columnas.items())


# ---------- generar ----------

def generar_respuesta(pregunta, perfil):
    sobre = [f"- {pregunta['columnas'][c]}: {v} ({ESCALA[str(v)]})"
             for c, v in perfil["valores"].items() if v is not None]
    evitar = [f"- {pregunta['columnas'][c]}" for c, v in perfil["valores"].items() if v is None]
    prompt = f"""Escribe la transcripción automática de una respuesta hablada a esta pregunta de una encuesta de clima laboral en una empresa chilena.

Pregunta: {pregunta['texto']}
Quién responde: {perfil['persona']}

La respuesta debe expresar exactamente estas opiniones, con esta intensidad (escala de -2 a 2):
{chr(10).join(sobre)}

Temas que la persona NO debe tocar, ni siquiera de pasada:
{chr(10).join(evitar)}

Requisitos:
- Entre 300 y 450 palabras, como un audio de 2 a 3 minutos.
- Español chileno hablado: muletillas ("eh", "o sea", "cachai", "igual"), frases que se cortan, repeticiones y una digresión breve sobre algo que no tiene que ver con ninguno de los temas de arriba.
- Que parezca salida de un transcriptor automático: sin signos de exclamación, puntuación imperfecta y uno o dos errores de transcripción.
- No nombres los temas como etiquetas ni uses las palabras de la escala. La opinión y su intensidad se deducen de lo que cuenta, con ejemplos concretos.
- Tú eliges el orden en que aparecen los temas."""
    out = claude(prompt, {"type": "object", "properties": {"respuesta": {"type": "string"}},
                          "required": ["respuesta"]},
                 MODELO_FIJO, "Escribes datos sintéticos realistas para evaluar sistemas que analizan encuestas.")
    return out["respuesta"]


def cmd_generar(_):
    trabajos = [(p, i, perfil) for p in PREG["preguntas"] for i, perfil in enumerate(p["perfiles"])]
    with ThreadPoolExecutor(len(trabajos)) as pool:
        textos = list(pool.map(lambda t: generar_respuesta(t[0], t[2]), trabajos))
    dataset = [{"id": f"{p['id']}_r{i + 1}", "pregunta_id": p["id"], "persona": perfil["persona"],
                "gold": perfil["valores"], "respuesta": texto}
               for (p, i, perfil), texto in zip(trabajos, textos)]
    DATASET.write_text(json.dumps(dataset, ensure_ascii=False, indent=2) + "\n")
    print(f"{len(dataset)} respuestas en {DATASET}")


# ---------- clasificadores ----------

def clasificar_claude_libre(item, modelo):
    """Claude sin columnas: inventa los temas de esta respuesta y les pone sentimiento."""
    pregunta = PREGUNTAS[item["pregunta_id"]]
    prompt = f"""Esta es la respuesta de una persona a una pregunta abierta de una encuesta de clima laboral. {TIPO_TEXTO}

Pregunta: {pregunta['texto']}

Respuesta:
{item['respuesta']}

Identifica los temas sobre los que la persona da una opinión y, para cada uno, qué opina según esta escala:
{lista_escala()}

Ignora lo que no tenga que ver con la pregunta. Cada tema tiene que ser distinto de los demás y describirse en una frase concreta."""
    out = claude(prompt, {"type": "object", "properties": {"temas": {
        "type": "array", "minItems": 1, "maxItems": 8, "items": {"type": "object", "properties": {
            "id": {"type": "string", "pattern": "^[a-z_]+$"}, "descripcion": {"type": "string"},
            "valor": {"type": "integer", "enum": NIVELES}}, "required": ["id", "descripcion", "valor"]}}},
        "required": ["temas"]}, modelo, "Clasificas respuestas abiertas de encuestas de clima laboral.")["temas"]
    temas = {t["id"]: t for t in out}  # si repite un id, queda el último
    return ({c: t["descripcion"] for c, t in temas.items()},
            {c: {"menciona": True, "valor": t["valor"]} for c, t in temas.items()})


def clasificar_jev(item, columnas):
    pregunta = PREGUNTAS[item["pregunta_id"]]
    preguntas = {}
    for i, (c, desc) in enumerate(columnas.items()):
        preguntas[f"m{i}"] = {
            "type": "noul",
            "instructions": f"¿La persona habla de este tema en `respuesta`? Tema: {desc}",
            "criteria": {"true": "Dice algo sobre el tema, aunque sea breve",
                         "false": "No toca el tema; habla solo de otras cosas"}}
        preguntas[f"s{i}"] = {
            "type": "score",
            "instructions": f"¿Qué opina la persona en `respuesta` sobre este tema? Tema: {desc}",
            "criteria": [ESCALA[str(n)] for n in NIVELES]}
    state = {"pregunta_encuesta": pregunta["texto"], "tipo_de_texto": TIPO_TEXTO, "respuesta": item["respuesta"]}
    resp = jev(state, preguntas)
    ans = resp["answers"]
    with _tokens_lock:
        TOKENS_JEV[0] += resp["usage"]["input_tokens"]
    pred = {}
    for i, c in enumerate(columnas):
        noul = ans[f"m{i}"]["noul"]
        probs = {int(k): v for k, v in ans[f"s{i}"]["probabilities"].items()}
        menciona = noul >= 0.5  # el gold es binario; la banda 0.3-0.7 se reporta aparte como dudosa
        pred[c] = {"menciona": menciona,
                   "valor": NIVELES[max(probs, key=probs.get)] if menciona else None,
                   "noul": noul, "score": ans[f"s{i}"]["score"], "probabilidades": probs}
    return pred


SCHEMA_COLUMNAS = {"type": "object", "properties": {"columnas": {
    "type": "array", "minItems": 3, "maxItems": 6,
    "items": {"type": "object", "properties": {"id": {"type": "string", "pattern": "^[a-z_]+$"},
                                               "descripcion": {"type": "string"}},
              "required": ["id", "descripcion"]}}}, "required": ["columnas"]}


def inducir_columnas(pregunta, respuestas, modelo):
    prompt = f"""Vamos a medir el sentimiento de las respuestas abiertas a esta pregunta de una encuesta de clima laboral. Las respuestas son transcripciones de audios de hasta 3 minutos.

Pregunta: {pregunta['texto']}

Propón entre 3 y 6 temas (columnas). Para cada respuesta vamos a medir si habla de cada tema y qué opina de él, de muy negativo a muy positivo. Cada tema tiene que ser distinto de los demás y describirse en una frase concreta."""
    if respuestas:
        prompt += "\n\nBasa los temas en lo que dicen estas respuestas:\n\n" + "\n\n---\n\n".join(respuestas)
    out = claude(prompt, SCHEMA_COLUMNAS, modelo, "Diseñas categorías para analizar encuestas de clima laboral.")
    return {c["id"]: c["descripcion"] for c in out["columnas"]}


def alinear(pregunta, inducidas):
    prompt = f"""Tengo columnas de referencia y columnas propuestas para clasificar respuestas a la pregunta "{pregunta['texto']}".

Columnas de referencia:
{lista_columnas(pregunta['columnas'])}

Columnas propuestas:
{lista_columnas(inducidas)}

Para cada columna de referencia, elige la columna propuesta que mide el mismo tema, o null si ninguna lo mide. Calza si una persona que lee ambas descripciones diría que miden el mismo tema, aunque el nombre sea distinto. Cada columna propuesta se usa a lo sumo una vez."""
    schema = {"type": "object", "properties": {"alineacion": {"type": "object", "properties": {
        g: {"type": ["string", "null"], "enum": list(inducidas) + [None]} for g in pregunta["columnas"]},
        "required": list(pregunta["columnas"])}}, "required": ["alineacion"]}
    out = claude(prompt, schema, MODELO_FIJO, "Comparas esquemas de categorías de encuestas.")["alineacion"]
    usadas, limpia = set(), {}
    for g, ind in out.items():  # si el modelo repite una propuesta, vale solo la primera
        limpia[g] = ind if ind not in usadas else None
        usadas.add(ind)
    return limpia


# ---------- correr ----------

def correr_condicion(nombre, dataset, modelo):
    """Devuelve columnas, alineación y predicciones por respuesta (id de item)."""
    por_pregunta = {pid: [it for it in dataset if it["pregunta_id"] == pid] for pid in PREGUNTAS}
    with ThreadPoolExecutor(8) as pool:
        if nombre == "claude_solo":
            libres = list(pool.map(lambda it: clasificar_claude_libre(it, modelo), dataset))
            columnas = {it["id"]: cols for it, (cols, _) in zip(dataset, libres)}
            items = {it["id"]: preds for it, (_, preds) in zip(dataset, libres)}
            alineacion = dict(zip(columnas, pool.map(
                lambda it: alinear(PREGUNTAS[it["pregunta_id"]], columnas[it["id"]]), dataset)))
        else:
            if nombre == "jev_columnas_sabidas":
                por_pid = {pid: p["columnas"] for pid, p in PREGUNTAS.items()}
                ali_pid = {pid: {c: c for c in p["columnas"]} for pid, p in PREGUNTAS.items()}
            else:
                usar_resp = nombre == "claude_respuestas_jev"
                pids = list(PREGUNTAS)
                por_pid = dict(zip(pids, pool.map(
                    lambda pid: inducir_columnas(PREGUNTAS[pid], [it["respuesta"] for it in por_pregunta[pid]]
                                                 if usar_resp else None, modelo), pids)))
                ali_pid = dict(zip(pids, pool.map(lambda pid: alinear(PREGUNTAS[pid], por_pid[pid]), pids)))
            columnas = {it["id"]: por_pid[it["pregunta_id"]] for it in dataset}
            alineacion = {it["id"]: ali_pid[it["pregunta_id"]] for it in dataset}
            items = dict(zip(columnas, pool.map(lambda it: clasificar_jev(it, columnas[it["id"]]), dataset)))
    return {"condicion": nombre, "modelo_claude": modelo, "columnas": columnas,
            "alineacion": alineacion, "items": items}


def cmd_correr(args):
    dataset = json.loads(DATASET.read_text())
    if not os.environ.get("TYPESAFE_API_KEY"):
        raise SystemExit("Falta TYPESAFE_API_KEY: sin Jev no corre el experimento.")
    carpeta = RES / args.modelo
    carpeta.mkdir(parents=True, exist_ok=True)
    # jev_columnas_sabidas no usa Claude: corre una sola vez, en resultados/jev/
    condiciones = ["jev_columnas_sabidas"] if args.modelo == "jev" else \
        [c for c in CONDICIONES if c != "jev_columnas_sabidas"]
    pendientes = [c for c in condiciones if args.forzar or not (carpeta / f"{c}.json").exists()]

    def una(c):
        t = time.time()
        r = correr_condicion(c, dataset, args.modelo)
        r["segundos"] = round(time.time() - t, 1)
        (carpeta / f"{c}.json").write_text(json.dumps(r, ensure_ascii=False, indent=2) + "\n")
        print(f"[{args.modelo}] {c} listo en {r['segundos']}s", flush=True)

    with ThreadPoolExecutor(len(pendientes) or 1) as pool:
        list(pool.map(una, pendientes))
    print(f"[{args.modelo}] tokens de entrada Jev: {TOKENS_JEV[0]}")
    (carpeta / "tokens_jev.txt").write_text(f"{TOKENS_JEV[0]}\n")


# ---------- puntuar ----------

def metricas(r, dataset):
    exactas = tp = fp = fn = invertidos = dudosas = 0
    errores, celdas, mencionadas, con_pareja, extras = [], 0, 0, 0, 0
    por_pregunta = {pid: [0, 0] for pid in PREGUNTAS}  # [exactas, celdas]
    for it in dataset:
        pid, ali = it["pregunta_id"], r["alineacion"][it["id"]]
        extras += len(r["columnas"][it["id"]]) - sum(v is not None for v in ali.values())
        for g, gv in it["gold"].items():
            celdas += 1
            ind = ali[g]
            mencionadas += gv is not None
            con_pareja += gv is not None and ind is not None
            p = r["items"][it["id"]][ind] if ind else {"menciona": False, "valor": None}
            pv = p["valor"] if p["menciona"] else None
            exactas += pv == gv
            por_pregunta[pid][0] += pv == gv
            por_pregunta[pid][1] += 1
            tp += gv is not None and p["menciona"]
            fp += gv is None and p["menciona"]
            fn += gv is not None and not p["menciona"]
            if gv is not None and pv is not None:
                errores.append(abs(pv - gv))
                invertidos += gv * pv < 0
            dudosas += "noul" in p and 0.3 <= p["noul"] <= 0.7
    prec = tp / (tp + fp) if tp + fp else 0
    rec = tp / (tp + fn) if tp + fn else 0
    return {"exactas": exactas / celdas, "f1_mencion": 2 * prec * rec / (prec + rec) if prec + rec else 0,
            "mae": sum(errores) / len(errores) if errores else None, "invertidos": invertidos,
            "cobertura": con_pareja / mencionadas, "extras": extras / len(dataset), "dudosas": dudosas,
            "por_pregunta": {pid: e / n for pid, (e, n) in por_pregunta.items()}}


def cmd_puntuar(_):
    dataset = json.loads(DATASET.read_text())
    celdas = sum(len(it["gold"]) for it in dataset)
    lineas = ["# Resultados", "",
              f"{len(dataset)} respuestas, {celdas} celdas (respuesta × columna de referencia). "
              "Ver PLAN.md para qué mide cada métrica.", ""]
    resumen = {}
    for carpeta in sorted(p for p in RES.iterdir() if p.is_dir()):
        filas = []
        for c in CONDICIONES:
            f = carpeta / f"{c}.json"
            if not f.exists():
                continue
            r = json.loads(f.read_text())
            m = metricas(r, dataset)
            resumen[(carpeta.name, c)] = m
            filas.append(f"| {c} | {m['exactas']:.0%} | {m['f1_mencion']:.2f} | "
                         f"{'-' if m['mae'] is None else f'{m['mae']:.2f}'} | {m['invertidos']} | "
                         f"{m['cobertura']:.0%} | {m['extras']:.1f} | "
                         f"{m['dudosas'] if c != 'claude_solo' else '-'} | {r['segundos']} |")
        tokens = carpeta / "tokens_jev.txt"
        titulo = "Sin Claude (Jev con las columnas de referencia)" if carpeta.name == "jev" \
            else f"Claude {carpeta.name} (effort medium)"
        lineas += [f"## {titulo}", "",
                   f"Tokens de entrada Jev: {tokens.read_text().strip() if tokens.exists() else '-'}", "",
                   "| Condición | Celdas exactas | F1 mención | MAE valor | Signo invertido | Cobertura | Columnas extra por respuesta | Nouls dudosos | Segundos |",
                   "|---|---|---|---|---|---|---|---|---|", *filas, ""]
    lineas += ["## Celdas exactas por pregunta", "",
               "| Modelo | Condición | " + " | ".join(PREGUNTAS) + " |",
               "|---|---|" + "---|" * len(PREGUNTAS)]
    for (mod, c), m in resumen.items():
        lineas.append(f"| {mod} | {c} | " + " | ".join(f"{m['por_pregunta'][p]:.0%}" for p in PREGUNTAS) + " |")
    (RES / "RESULTADOS.md").write_text("\n".join(lineas) + "\n")
    print((RES / "RESULTADOS.md").read_text())
    escribir_columnas(dataset)


def escribir_columnas(dataset):
    """COLUMNAS.md: qué columnas propuso cada LLM y con cuál de referencia calzó cada una."""
    L = ["# Columnas propuestas por los LLM", "",
         "Por pregunta: las de referencia (las conoce solo Jev en `jev_columnas_sabidas`) y las que propuso cada "
         "condición. «→ x» dice con qué columna de referencia la emparejó Opus; «sin pareja» es un tema que "
         "no estaba entre las de referencia.", ""]
    corridas = sorted((m.name, c) for m in RES.iterdir() if m.is_dir() for c in CONDICIONES
                      if c != "jev_columnas_sabidas" and (m / f"{c}.json").exists())
    datos = {mc: json.loads((RES / mc[0] / f"{mc[1]}.json").read_text()) for mc in corridas}

    def lista(cols, ali):
        inv = {v: g for g, v in ali.items() if v}
        return [f"- **{c}**: {d} " + (f"→ {inv[c]}" if c in inv else "*(sin pareja)*") for c, d in cols.items()]

    for pid, p in PREGUNTAS.items():
        items = [it for it in dataset if it["pregunta_id"] == pid]
        L += [f"## {p['texto']}", "", "**Referencia:**", *[f"- **{c}**: {d}" for c, d in p["columnas"].items()], ""]
        for cond in ("claude_pregunta_jev", "claude_respuestas_jev"):
            for (mod, c), r in datos.items():
                if c == cond:
                    i0 = items[0]["id"]
                    L += [f"**{c} · Claude {mod}** (una lista para toda la pregunta):",
                          *lista(r["columnas"][i0], r["alineacion"][i0]), ""]
        for (mod, c), r in datos.items():
            if c == "claude_solo":
                L.append(f"**claude_solo · Claude {mod}** (temas libres por respuesta):")
                for it in items:
                    L += [f"- *{it['id']}*:"] + ["  " + x for x in lista(r["columnas"][it["id"]], r["alineacion"][it["id"]])]
                L.append("")
    (RES / "COLUMNAS.md").write_text("\n".join(L) + "\n")


# ---------- juzgar (cualitativo, Opus a ciegas) ----------

def texto_valor(v):
    return "no lo menciona" if v is None else f"{v:+d} ({ESCALA[str(v)].split(':')[0]})"


def comparacion(r, dataset):
    """Texto con transcripción, esperado y obtenido por respuesta, sin nombrar condición ni modelo."""
    bloques = []
    for pid, p in PREGUNTAS.items():
        b = [f"## Pregunta: {p['texto']}"]
        for it in (x for x in dataset if x["pregunta_id"] == pid):
            ali, cols, preds = r["alineacion"][it["id"]], r["columnas"][it["id"]], r["items"][it["id"]]
            usadas = {v for v in ali.values() if v}
            b += ["", f"### {it['id']}", "", "Transcripción:", it["respuesta"], "",
                  "Columnas que usó el sistema en esta respuesta y a qué columna de referencia corresponden:"]
            b += [f"- {g} ({p['columnas'][g]}) → " + (f"{ali[g]}: {cols[ali[g]]}" if ali[g] else "ninguna")
                  for g in p["columnas"]]
            b += [f"- Columna extra del sistema, sin pareja: {c}: {d}" for c, d in cols.items() if c not in usadas]
            b += ["", "| Columna de referencia | Esperado | Obtenido |", "|---|---|---|"]
            for g, gv in it["gold"].items():
                pr = preds[ali[g]] if ali[g] else {"menciona": False, "valor": None}
                b.append(f"| {g} | {texto_valor(gv)} | {texto_valor(pr['valor'] if pr['menciona'] else None)} |")
            extra = [f"{c}: {texto_valor(preds[c]['valor'] if preds[c]['menciona'] else None)}"
                     for c in cols if c not in usadas]
            if extra:
                b.append("Columnas extra: " + "; ".join(extra))
        bloques.append("\n".join(b))
    return "\n\n".join(bloques)


SCHEMA_JUICIO = {"type": "object", "properties": {
    "veredicto": {"type": "string", "enum": ["Excelente", "Bueno", "Aceptable", "Insuficiente"]},
    "errores": {"type": "array", "items": {"type": "object", "properties": {
        "respuesta": {"type": "string"}, "columna": {"type": "string"},
        "tipo": {"type": "string", "enum": ["grave", "menor", "defendible"]},
        "explicacion": {"type": "string"}}, "required": ["respuesta", "columna", "tipo", "explicacion"]}},
    "fortalezas": {"type": "string"}, "debilidades": {"type": "string"},
    "calidad_columnas": {"type": "string"},
    "confiaria_para_un_informe": {"type": "boolean"}, "resumen": {"type": "string"}},
    "required": ["veredicto", "errores", "fortalezas", "debilidades", "calidad_columnas",
                 "confiaria_para_un_informe", "resumen"]}


def juzgar_corrida(r, dataset):
    prompt = f"""Un sistema analizó respuestas habladas a una encuesta de clima laboral. Para cada respuesta y cada tema dijo si la persona habla del tema y qué opina, en una escala de -2 (lo critica con fuerza) a +2 (lo elogia con entusiasmo).

Juzga la calidad de este sistema como lo haría un analista de personas que va a usar el resultado en un informe. No calcules porcentajes. Lee cada transcripción y, para cada diferencia entre lo esperado y lo obtenido, decide:
- grave: cambia la conclusión del informe (opinión al revés, inventa o pierde un tema importante).
- menor: misma dirección, distinta intensidad, o un tema tocado de pasada.
- defendible: leyendo la transcripción, lo obtenido es tan razonable como lo esperado.

Si el sistema no midió un tema de referencia o agregó columnas extra, júzgalo según si un informe con esas columnas sería útil igual. En calidad_columnas di si las columnas que usó el sistema capturan lo que de verdad dicen las personas: si se pisan entre sí, si son demasiado amplias o estrechas, y si alguna extra es un hallazgo valioso que las de referencia no tenían.

{comparacion(r, dataset)}"""
    return claude(prompt, SCHEMA_JUICIO, MODELO_FIJO, "Eres un analista de personas exigente que revisa la calidad de análisis de encuestas.")


def cmd_juzgar(_):
    dataset = json.loads(DATASET.read_text())
    corridas = [(m, c) for m in ("jev", "opus", "sonnet", "haiku") for c in CONDICIONES
                if (RES / m / f"{c}.json").exists()]
    with ThreadPoolExecutor(len(corridas)) as pool:
        juicios = list(pool.map(lambda mc: juzgar_corrida(json.loads((RES / mc[0] / f"{mc[1]}.json").read_text()),
                                                         dataset), corridas))
    ciegos = {f"S{i + 1}": j for i, j in enumerate(juicios)}
    final = claude(
        "Estos son juicios cualitativos de distintos sistemas que clasificaron las mismas 15 respuestas de encuesta. "
        "Ordénalos del mejor al peor para usar su resultado en un informe real, sin calcular porcentajes. "
        "Para cada uno da su puesto, una frase con el porqué y si lo usarías. Cierra con una conclusión de 2 o 3 oraciones.\n\n"
        + json.dumps(ciegos, ensure_ascii=False, indent=1),
        {"type": "object", "properties": {
            "ranking": {"type": "array", "items": {"type": "object", "properties": {
                "sistema": {"type": "string", "enum": list(ciegos)}, "puesto": {"type": "integer"},
                "porque": {"type": "string"}, "lo_usaria": {"type": "boolean"}},
                "required": ["sistema", "puesto", "porque", "lo_usaria"]}},
            "conclusion": {"type": "string"}}, "required": ["ranking", "conclusion"]},
        MODELO_FIJO, "Eres un analista de personas exigente que revisa la calidad de análisis de encuestas.")
    nombre = {f"S{i + 1}": (f"{c} (sin Claude)" if c == "jev_columnas_sabidas" else f"{c} · Claude {m}")
              for i, (m, c) in enumerate(corridas)}
    (RES / "juicio.json").write_text(json.dumps({"corridas": nombre, "juicios": ciegos, "final": final},
                                                ensure_ascii=False, indent=2) + "\n")
    escribir_juicio()


def escribir_juicio():
    data = json.loads((RES / "juicio.json").read_text())
    nombre, ciegos, final = data["corridas"], data["juicios"], data["final"]
    # el juez escribe con etiquetas ciegas (S1, S2...); en el informe van los nombres reales
    def nombrar(t):
        return re.sub(r"\bS(\d+)\b", lambda m: f"«{nombre.get(m.group(0), m.group(0))}»", t)
    lineas = ["# Juicio cualitativo", "",
              f"Opus (effort medium) leyó cada transcripción y comparó lo esperado con lo obtenido, sin saber qué "
              "condición ni qué modelo estaba juzgando. No usa porcentajes. Ver `eval.py juzgar`.", "",
              "| Puesto | Sistema | Veredicto | ¿Lo usaría? | Errores graves | Errores menores | Defendibles | Por qué |",
              "|---|---|---|---|---|---|---|---|"]
    for f in sorted(final["ranking"], key=lambda x: x["puesto"]):
        j = ciegos[f["sistema"]]
        n = {t: sum(e["tipo"] == t for e in j["errores"]) for t in ("grave", "menor", "defendible")}
        lineas.append(f"| {f['puesto']} | {nombre[f['sistema']]} | {j['veredicto']} | {'Sí' if f['lo_usaria'] else 'No'} | "
                      f"{n['grave']} | {n['menor']} | {n['defendible']} | {nombrar(f['porque'])} |")
    lineas += ["", f"**Conclusión:** {nombrar(final['conclusion'])}", ""]
    for s, j in ciegos.items():
        lineas += [f"## {nombre[s]}", "", nombrar(j["resumen"]), "", f"- A favor: {nombrar(j['fortalezas'])}",
                   f"- En contra: {nombrar(j['debilidades'])}",
                   f"- Columnas: {nombrar(j.get('calidad_columnas', '-'))}", ""]
        lineas += [f"- [{e['tipo']}] {e['respuesta']} / {e['columna']}: {nombrar(e['explicacion'])}" for e in j["errores"]]
        lineas.append("")
    (RES / "JUICIO.md").write_text("\n".join(lineas) + "\n")
    print((RES / "JUICIO.md").read_text())


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(required=True)
    sub.add_parser("generar").set_defaults(f=cmd_generar)
    c = sub.add_parser("correr")
    c.add_argument("--modelo", required=True, choices=["opus", "sonnet", "haiku", "jev"],
                   help="modelo de Claude bajo prueba; 'jev' corre solo jev_columnas_sabidas")
    c.add_argument("--forzar", action="store_true")
    c.set_defaults(f=cmd_correr)
    sub.add_parser("puntuar").set_defaults(f=cmd_puntuar)
    sub.add_parser("juzgar").set_defaults(f=cmd_juzgar)
    a = ap.parse_args()
    a.f(a)
