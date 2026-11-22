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
            with urllib.request.urlopen(req, timeout=120) as r:
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

def clasificar_claude(item, columnas, modelo):
    pregunta = PREGUNTAS[item["pregunta_id"]]
    prop = {c: {"type": "object",
                "properties": {"menciona": {"type": "boolean"}, "valor": {"type": "integer", "enum": NIVELES}},
                "required": ["menciona", "valor"]} for c in columnas}
    prompt = f"""Esta es la respuesta de una persona a una pregunta abierta de una encuesta de clima laboral. {TIPO_TEXTO}

Pregunta: {pregunta['texto']}

Respuesta:
{item['respuesta']}

Para cada tema, indica si la persona habla de él (menciona) y, si habla, qué opina según esta escala:
{lista_escala()}

Temas:
{lista_columnas(columnas)}

Si la persona no habla de un tema, pon menciona en false y valor en 0."""
    out = claude(prompt, {"type": "object", "properties": {"columnas": {
        "type": "object", "properties": prop, "required": list(columnas)}}, "required": ["columnas"]},
        modelo, "Clasificas respuestas abiertas de encuestas de clima laboral.")["columnas"]
    return {c: {"menciona": out[c]["menciona"], "valor": out[c]["valor"] if out[c]["menciona"] else None}
            for c in columnas}


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
    por_pregunta = {pid: [it for it in dataset if it["pregunta_id"] == pid] for pid in PREGUNTAS}
    with ThreadPoolExecutor(8) as pool:
        if nombre in ("claude_solo", "jev_columnas_sabidas"):
            columnas = {pid: p["columnas"] for pid, p in PREGUNTAS.items()}
            alineacion = {pid: {c: c for c in p["columnas"]} for pid, p in PREGUNTAS.items()}
        else:
            usar_resp = nombre == "claude_respuestas_jev"
            pids = list(PREGUNTAS)
            columnas = dict(zip(pids, pool.map(
                lambda pid: inducir_columnas(PREGUNTAS[pid], [it["respuesta"] for it in por_pregunta[pid]]
                                             if usar_resp else None, modelo), pids)))
            alineacion = dict(zip(pids, pool.map(lambda pid: alinear(PREGUNTAS[pid], columnas[pid]), pids)))
        if nombre == "claude_solo":
            preds = pool.map(lambda it: clasificar_claude(it, columnas[it["pregunta_id"]], modelo), dataset)
        else:
            preds = pool.map(lambda it: clasificar_jev(it, columnas[it["pregunta_id"]]), dataset)
        items = {it["id"]: p for it, p in zip(dataset, preds)}
    return {"condicion": nombre, "modelo_claude": modelo, "columnas": columnas,
            "alineacion": alineacion, "items": items}


def cmd_correr(args):
    dataset = json.loads(DATASET.read_text())
    if not os.environ.get("TYPESAFE_API_KEY"):
        raise SystemExit("Falta TYPESAFE_API_KEY: sin Jev no corre el experimento.")
    carpeta = RES / args.modelo
    carpeta.mkdir(parents=True, exist_ok=True)
    pendientes = [c for c in CONDICIONES if args.forzar or not (carpeta / f"{c}.json").exists()]

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
    errores, celdas = [], 0
    por_pregunta = {pid: [0, 0] for pid in PREGUNTAS}  # [exactas, celdas]
    for it in dataset:
        pid = it["pregunta_id"]
        for g, gv in it["gold"].items():
            celdas += 1
            ind = r["alineacion"][pid][g]
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
    gold_cols = sum(len(p["columnas"]) for p in PREGUNTAS.values())
    alineadas = sum(v is not None for a in r["alineacion"].values() for v in a.values())
    extras = sum(len(r["columnas"][pid]) - sum(v is not None for v in r["alineacion"][pid].values())
                 for pid in PREGUNTAS)
    return {"exactas": exactas / celdas, "f1_mencion": 2 * prec * rec / (prec + rec) if prec + rec else 0,
            "mae": sum(errores) / len(errores) if errores else None, "invertidos": invertidos,
            "cobertura": alineadas / gold_cols, "extras": extras, "dudosas": dudosas,
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
                         f"{m['cobertura']:.0%} | {m['extras']} | "
                         f"{m['dudosas'] if c != 'claude_solo' else '-'} | {r['segundos']} |")
        tokens = carpeta / "tokens_jev.txt"
        lineas += [f"## Claude {carpeta.name} (effort medium)", "",
                   f"Tokens de entrada Jev: {tokens.read_text().strip() if tokens.exists() else '-'}", "",
                   "| Condición | Celdas exactas | F1 mención | MAE valor | Signo invertido | Cobertura columnas | Columnas extra | Nouls dudosos | Segundos |",
                   "|---|---|---|---|---|---|---|---|---|", *filas, ""]
    lineas += ["## Celdas exactas por pregunta", "",
               "| Modelo | Condición | " + " | ".join(PREGUNTAS) + " |",
               "|---|---|" + "---|" * len(PREGUNTAS)]
    for (mod, c), m in resumen.items():
        lineas.append(f"| {mod} | {c} | " + " | ".join(f"{m['por_pregunta'][p]:.0%}" for p in PREGUNTAS) + " |")
    (RES / "RESULTADOS.md").write_text("\n".join(lineas) + "\n")
    print((RES / "RESULTADOS.md").read_text())


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(required=True)
    sub.add_parser("generar").set_defaults(f=cmd_generar)
    c = sub.add_parser("correr")
    c.add_argument("--modelo", required=True, choices=["opus", "sonnet", "haiku"])
    c.add_argument("--forzar", action="store_true")
    c.set_defaults(f=cmd_correr)
    sub.add_parser("puntuar").set_defaults(f=cmd_puntuar)
    a = ap.parse_args()
    a.f(a)
