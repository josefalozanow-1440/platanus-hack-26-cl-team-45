#!/usr/bin/env python3
"""Eval de sentimiento multidimensional. Claude corre como subagentes sin contexto (ver PLAN.md);
este script prepara sus entradas, importa sus salidas, corre Jev y puntúa.

Todos los comandos reciben DIR: la carpeta de trabajo de los subagentes, FUERA del repo, para que
no puedan leer preguntas.json ni dataset.json (las respuestas correctas).

  python3 eval.py entradas-generar DIR     # DIR/generar/especificaciones.json
  python3 eval.py importar-dataset DIR     # dataset.json + DIR/clasificar/{preguntas,respuestas}.json
  python3 eval.py jev DIR                  # corre Jev, importa claude_solo, escribe DIR/alinear/tareas.json
  python3 eval.py importar-alineacion DIR  # lee DIR/alinear/alineacion.json
  python3 eval.py puntuar                  # resultados/RESULTADOS.md y COLUMNAS.md
  python3 eval.py entradas-juicio DIR      # DIR/juzgar/S*.md (corridas a ciegas)
  python3 eval.py importar-juicio DIR      # resultados/JUICIO.md
"""
import argparse
import json
import os
import re
import ssl
import threading
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

AQUI = Path(__file__).parent
PREG = json.loads((AQUI / "preguntas.json").read_text())
PREGUNTAS = {p["id"]: p for p in PREG["preguntas"]}
DIM = PREG["dimensiones_tema"]
DIM_R = PREG["dimensiones_respuesta"]
DATASET = AQUI / "dataset.json"
RES = AQUI / "resultados"
MODELOS = ["opus", "sonnet", "haiku"]
CONDICIONES = ["claude_solo", "claude_respuestas_jev", "claude_pregunta_jev", "jev_columnas_sabidas"]
TIPO_TEXTO = ("Transcripción automática de una respuesta hablada (audio de hasta 3 minutos). "
              "Puede tener muletillas y errores de transcripción.")
TOKENS_JEV, _lock = [0], threading.Lock()
# El Python de python.org en macOS no trae certificados raíz; el bundle del sistema sí.
SSL = ssl.create_default_context(cafile="/etc/ssl/cert.pem" if os.path.exists("/etc/ssl/cert.pem") else None)


def leer(p):
    return json.loads(Path(p).read_text())


def escribir(p, data):
    Path(p).parent.mkdir(parents=True, exist_ok=True)
    Path(p).write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")


def jev(state, questions):
    body = json.dumps({"model": "jev-latest", "state": state, "questions": questions}).encode()
    req = urllib.request.Request(
        "https://api.typesafe.ai/v1/systemone", data=body,
        headers={"Authorization": f"Bearer {os.environ['TYPESAFE_API_KEY']}", "Content-Type": "application/json"})
    for intento in range(5):
        try:
            with urllib.request.urlopen(req, timeout=120, context=SSL) as r:
                resp = json.loads(r.read())
                with _lock:
                    TOKENS_JEV[0] += resp["usage"]["input_tokens"]
                return resp["answers"]
        except urllib.error.HTTPError as e:
            if e.code != 429 or intento == 4:
                raise RuntimeError(f"Jev {e.code}: {e.read()[:500]!r}") from e
            time.sleep(2 ** intento)


# ---------- dataset ----------

def describir_tema(v):
    if v is None:
        return None
    partes = [f"dirección {v['direccion']} ({DIM['direccion'][v['direccion']]})"]
    if v["intensidad"]:
        partes.append(f"intensidad {v['intensidad']} ({DIM['intensidad'][v['intensidad']]})")
    partes.append(f"tendencia {v['tendencia']} ({DIM['tendencia'][v['tendencia']]})")
    return "; ".join(partes)


def cmd_entradas_generar(a):
    specs = []
    for p in PREG["preguntas"]:
        for i, pf in enumerate(p["perfiles"]):
            specs.append({
                "id": f"{p['id']}_r{i + 1}", "pregunta": p["texto"], "persona": pf["persona"],
                "opiniones": {p["columnas"][c]: describir_tema(v) for c, v in pf["temas"].items() if v},
                "temas_prohibidos": [p["columnas"][c] for c, v in pf["temas"].items() if v is None],
                "riesgo_fuga": DIM_R["riesgo_fuga"] if pf["riesgo_fuga"] else "No da ninguna señal de querer irse",
                "emocion": f"{pf['emocion']}: {DIM_R['emocion'][pf['emocion']]}",
                "propone": DIM_R["propone"] if pf["propone"] else "No propone ninguna mejora concreta"})
    escribir(Path(a.dir) / "generar" / "especificaciones.json", specs)
    print(f"{len(specs)} especificaciones en {a.dir}/generar/especificaciones.json")


def cmd_importar_dataset(a):
    textos = leer(Path(a.dir) / "generar" / "respuestas.json")
    dataset = []
    for p in PREG["preguntas"]:
        for i, pf in enumerate(p["perfiles"]):
            iid = f"{p['id']}_r{i + 1}"
            dataset.append({"id": iid, "pregunta_id": p["id"], "persona": pf["persona"], "gold": {
                "temas": pf["temas"], "riesgo_fuga": pf["riesgo_fuga"], "emocion": pf["emocion"],
                "propone": pf["propone"]}, "respuesta": textos[iid]})
    escribir(DATASET, dataset)
    # Lo único que ven los clasificadores: sin columnas ni valores correctos.
    escribir(Path(a.dir) / "clasificar" / "preguntas.json", {pid: p["texto"] for pid, p in PREGUNTAS.items()})
    escribir(Path(a.dir) / "clasificar" / "respuestas.json",
             [{"id": it["id"], "pregunta_id": it["pregunta_id"], "pregunta": PREGUNTAS[it["pregunta_id"]]["texto"],
               "respuesta": it["respuesta"]} for it in dataset])
    L = ["# Dataset del eval", "", "Lo escribió un subagente Opus a partir de `preguntas.json`.", ""]
    for it in dataset:
        g = it["gold"]
        L += [f"## {it['id']}: {it['persona']}", "", f"**{PREGUNTAS[it['pregunta_id']]['texto']}**", "",
              "| Tema | Esperado |", "|---|---|"]
        L += [f"| {c} | {describir_corto(v)} |" for c, v in g["temas"].items()]
        L += ["", f"Riesgo de fuga: {'sí' if g['riesgo_fuga'] else 'no'} · Emoción: {g['emocion']} · "
                  f"Propone: {'sí' if g['propone'] else 'no'}", "", it["respuesta"], ""]
    (AQUI / "DATASET.md").write_text("\n".join(L))
    print(f"{len(dataset)} respuestas importadas")


def describir_corto(v):
    if v is None:
        return "no lo menciona"
    return " · ".join(x for x in (v["direccion"], v.get("intensidad"), v["tendencia"]) if x)


# ---------- Jev ----------

def preguntas_jev(columnas):
    q = {"riesgo": {"type": "noul", "instructions": "¿La persona da señales de querer irse de la empresa?"},
         "emocion": {"type": "choice", "instructions": "¿Qué emoción domina en lo que dice la persona?",
                     "criteria": DIM_R["emocion"]},
         "propone": {"type": "noul", "instructions": "¿La persona propone una mejora concreta?"}}
    for i, (c, desc) in enumerate(columnas.items()):
        tema = f"Tema: {desc}"
        q[f"m{i}"] = {"type": "noul", "instructions": f"¿La persona habla de este tema en `respuesta`? {tema}",
                      "criteria": {"true": "Dice algo sobre el tema, aunque sea breve",
                                   "false": "No toca el tema; habla solo de otras cosas"}}
        q[f"d{i}"] = {"type": "choice", "instructions": f"¿Qué opina la persona sobre este tema? {tema}",
                      "criteria": DIM["direccion"]}
        q[f"i{i}"] = {"type": "score", "instructions": f"¿Con qué intensidad da su opinión sobre este tema? {tema}",
                      "criteria": list(DIM["intensidad"].values())}
        q[f"t{i}"] = {"type": "choice", "instructions": f"¿Cómo dice la persona que ha cambiado este tema? {tema}",
                      "criteria": DIM["tendencia"]}
    return q


def clasificar_jev(item, columnas):
    ans = jev({"pregunta_encuesta": PREGUNTAS[item["pregunta_id"]]["texto"], "tipo_de_texto": TIPO_TEXTO,
               "respuesta": item["respuesta"]}, preguntas_jev(columnas))
    temas = {}
    for i, c in enumerate(columnas):
        noul, d = ans[f"m{i}"]["noul"], ans[f"d{i}"]["choice"]
        probs = {int(k): v for k, v in ans[f"i{i}"]["probabilities"].items()}
        temas[c] = {"menciona": noul >= 0.5,  # el gold es binario; 0,3-0,7 se reporta como dudoso
                    "direccion": d,
                    "intensidad": list(DIM["intensidad"])[max(probs, key=probs.get)] if d in ("positivo", "negativo") else None,
                    "tendencia": ans[f"t{i}"]["choice"], "noul": noul}
    return {"temas": temas, "riesgo_fuga": ans["riesgo"]["noul"] >= 0.5, "emocion": ans["emocion"]["choice"],
            "propone": ans["propone"]["noul"] >= 0.5, "noul_riesgo": ans["riesgo"]["noul"]}


def cmd_jev(a):
    if not os.environ.get("TYPESAFE_API_KEY"):
        raise SystemExit("Falta TYPESAFE_API_KEY")
    dataset, d = leer(DATASET), Path(a.dir)
    corridas = {("jev", "jev_columnas_sabidas"): {it["id"]: PREGUNTAS[it["pregunta_id"]]["columnas"] for it in dataset}}
    for m in MODELOS:
        for cond, archivo in (("claude_respuestas_jev", "columnas_respuestas"), ("claude_pregunta_jev", "columnas_pregunta")):
            cols = leer(d / "salidas" / m / f"{archivo}.json")
            corridas[(m, cond)] = {it["id"]: {c["id"]: c["descripcion"] for c in cols[it["pregunta_id"]]} for it in dataset}
    trabajos = [(k, it) for k in corridas for it in dataset]
    t0 = time.time()
    with ThreadPoolExecutor(16) as pool:
        preds = list(pool.map(lambda kt: clasificar_jev(kt[1], corridas[kt[0]][kt[1]["id"]]), trabajos))
    for (m, cond), cols in corridas.items():
        items = {it["id"]: p for (k, it), p in zip(trabajos, preds) if k == (m, cond)}
        ali = {iid: {c: c for c in cols[iid]} for iid in cols} if cond == "jev_columnas_sabidas" else None
        escribir(RES / m / f"{cond}.json", {"condicion": cond, "modelo": m, "columnas": cols, "alineacion": ali, "items": items})
    print(f"Jev: {len(trabajos)} requests en {time.time() - t0:.1f}s, {TOKENS_JEV[0]} tokens de entrada")
    escribir(RES / "jev_uso.json", {"requests": len(trabajos), "tokens_entrada": TOKENS_JEV[0]})

    # claude_solo: los temas libres de cada subagente pasan al mismo formato
    for m in MODELOS:
        out = leer(d / "salidas" / m / "solo.json")
        cols, items = {}, {}
        for it in dataset:
            r = out[it["id"]]
            temas = {t["id"]: t for t in r["temas"]}  # si repite un id, queda el último
            cols[it["id"]] = {c: t["descripcion"] for c, t in temas.items()}
            items[it["id"]] = {"temas": {c: {"menciona": True, "direccion": t["direccion"],
                                             "intensidad": t.get("intensidad") if t["direccion"] in ("positivo", "negativo") else None,
                                             "tendencia": t["tendencia"]} for c, t in temas.items()},
                               "riesgo_fuga": r["riesgo_fuga"], "emocion": r["emocion"], "propone": r["propone"]}
        escribir(RES / m / "claude_solo.json", {"condicion": "claude_solo", "modelo": m, "columnas": cols,
                                                 "alineacion": None, "items": items})

    # Tareas de alineación: listas por pregunta (inducidas) o por respuesta (claude_solo)
    tareas = {}
    for m in MODELOS:
        for cond in ("claude_respuestas_jev", "claude_pregunta_jev"):
            r = leer(RES / m / f"{cond}.json")
            for pid in PREGUNTAS:
                iid = next(it["id"] for it in dataset if it["pregunta_id"] == pid)
                tareas[f"{m}|{cond}|{pid}"] = {"pregunta": PREGUNTAS[pid]["texto"], "referencia": PREGUNTAS[pid]["columnas"],
                                               "propuestas": r["columnas"][iid]}
        r = leer(RES / m / "claude_solo.json")
        for it in dataset:
            tareas[f"{m}|claude_solo|{it['id']}"] = {"pregunta": PREGUNTAS[it["pregunta_id"]]["texto"],
                                                     "referencia": PREGUNTAS[it["pregunta_id"]]["columnas"],
                                                     "propuestas": r["columnas"][it["id"]]}
    # el alineador no necesita saber qué modelo ni qué condición: claves ciegas
    ciegas = {f"T{i + 1}": t for i, t in enumerate(tareas.values())}
    escribir(d / "alinear" / "tareas.json", ciegas)
    escribir(RES / "alineacion_mapa.json", dict(zip(ciegas, tareas)))
    print(f"{len(ciegas)} tareas de alineación en {d}/alinear/tareas.json")


def cmd_importar_alineacion(a):
    dataset, mapa = leer(DATASET), leer(RES / "alineacion_mapa.json")
    salida = leer(Path(a.dir) / "alinear" / "alineacion.json")
    por_clave = {}
    for t, clave in mapa.items():
        props = leer(Path(a.dir) / "alinear" / "tareas.json")[t]["propuestas"]
        usadas, limpia = set(), {}
        for g, ind in salida[t].items():  # uno a uno: si repite una propuesta, vale la primera
            ok = ind in props and ind not in usadas
            limpia[g] = ind if ok else None
            usadas.add(ind)
        por_clave[clave] = limpia
    for m in MODELOS:
        for cond in ("claude_solo", "claude_respuestas_jev", "claude_pregunta_jev"):
            f = RES / m / f"{cond}.json"
            r = leer(f)
            r["alineacion"] = {it["id"]: por_clave[f"{m}|{cond}|{it['id'] if cond == 'claude_solo' else it['pregunta_id']}"]
                               for it in dataset}
            escribir(f, r)
    print("alineación importada")


# ---------- puntuar ----------

def corridas_existentes():
    return [(m, c) for m in ["jev"] + MODELOS for c in CONDICIONES if (RES / m / f"{c}.json").exists()]


def pred_tema(r, iid, g):
    ind = r["alineacion"][iid][g]
    p = r["items"][iid]["temas"].get(ind) if ind else None
    return p if p and p["menciona"] else None


def metricas(r, dataset):
    n = {k: [0, 0] for k in ("direccion", "intensidad", "tendencia", "completa", "riesgo", "emocion", "propone")}
    tp = fp = fn = invertidos = dudosos = mencionadas = con_pareja = extras = 0
    for it in dataset:
        iid, ali, pr = it["id"], r["alineacion"][it["id"]], r["items"][it["id"]]
        extras += len(r["columnas"][iid]) - sum(v is not None for v in ali.values())
        for g, gv in it["gold"]["temas"].items():
            p = pred_tema(r, iid, g)
            mencionadas += gv is not None
            con_pareja += gv is not None and ali[g] is not None
            tp += bool(gv and p)
            fp += bool(not gv and p)
            fn += bool(gv and not p)
            gd, pd = (gv or {}).get("direccion"), (p or {}).get("direccion")
            n["direccion"][0] += gd == pd
            n["direccion"][1] += 1
            if gd in ("positivo", "negativo") and pd == gd:
                n["intensidad"][0] += gv["intensidad"] == p["intensidad"]
                n["intensidad"][1] += 1
            if gv and p:
                n["tendencia"][0] += gv["tendencia"] == p["tendencia"]
                n["tendencia"][1] += 1
            n["completa"][0] += (gv is None and p is None) or bool(
                gv and p and gd == pd and gv["intensidad"] == p["intensidad"] and gv["tendencia"] == p["tendencia"])
            n["completa"][1] += 1
            invertidos += {gd, pd} == {"positivo", "negativo"}
            ind = ali[g]
            q = r["items"][iid]["temas"].get(ind) if ind else None
            dudosos += bool(q and "noul" in q and 0.3 <= q["noul"] <= 0.7)
        for k, gk in (("riesgo", "riesgo_fuga"), ("emocion", "emocion"), ("propone", "propone")):
            n[k][0] += pr[gk] == it["gold"][gk]
            n[k][1] += 1
    prec, rec = (tp / (tp + fp) if tp + fp else 0), (tp / (tp + fn) if tp + fn else 0)
    return {**{k: a / b if b else None for k, (a, b) in n.items()},
            "f1_mencion": 2 * prec * rec / (prec + rec) if prec + rec else 0, "invertidos": invertidos,
            "cobertura": con_pareja / mencionadas, "extras": extras / len(dataset), "dudosos": dudosos}


def pct(x):
    return "-" if x is None else f"{x:.0%}"


def cmd_puntuar(_):
    dataset = leer(DATASET)
    L = ["# Resultados", "", f"{len(dataset)} respuestas, 60 celdas (respuesta × tema de referencia). "
         "Ver PLAN.md para qué mide cada métrica.", "",
         "| Modelo | Condición | Celda completa | Dirección | Intensidad | Tendencia | F1 mención | Signo invertido | "
         "Riesgo de fuga | Emoción | Propone | Cobertura | Extras por respuesta | Nouls dudosos |",
         "|---|---|---|---|---|---|---|---|---|---|---|---|---|---|"]
    for m, c in corridas_existentes():
        x = metricas(leer(RES / m / f"{c}.json"), dataset)
        L.append(f"| {m} | {c} | {pct(x['completa'])} | {pct(x['direccion'])} | {pct(x['intensidad'])} | "
                 f"{pct(x['tendencia'])} | {x['f1_mencion']:.2f} | {x['invertidos']} | {pct(x['riesgo'])} | "
                 f"{pct(x['emocion'])} | {pct(x['propone'])} | {pct(x['cobertura'])} | {x['extras']:.1f} | "
                 f"{x['dudosos'] if c != 'claude_solo' else '-'} |")
    uso = RES / "jev_uso.json"
    if uso.exists():
        u = leer(uso)
        L += ["", f"Jev: {u['requests']} requests, {u['tokens_entrada']} tokens de entrada."]
    (RES / "RESULTADOS.md").write_text("\n".join(L) + "\n")
    print((RES / "RESULTADOS.md").read_text())
    escribir_columnas(dataset)


def escribir_columnas(dataset):
    L = ["# Columnas propuestas por los LLM", "",
         "«→ x» es la columna de referencia con que la emparejó el alineador; «sin pareja» es un tema que no estaba "
         "en la referencia.", ""]

    def lista(cols, ali):
        inv = {v: g for g, v in ali.items() if v}
        return [f"- **{c}**: {d} " + (f"→ {inv[c]}" if c in inv else "*(sin pareja)*") for c, d in cols.items()]

    for pid, p in PREGUNTAS.items():
        items = [it for it in dataset if it["pregunta_id"] == pid]
        L += [f"## {p['texto']}", "", "**Referencia:**", *[f"- **{c}**: {d}" for c, d in p["columnas"].items()], ""]
        for cond in ("claude_respuestas_jev", "claude_pregunta_jev"):
            for m in MODELOS:
                r = leer(RES / m / f"{cond}.json")
                L += [f"**{cond} · {m}** (una lista por pregunta):", *lista(r["columnas"][items[0]["id"]], r["alineacion"][items[0]["id"]]), ""]
        for m in MODELOS:
            r = leer(RES / m / "claude_solo.json")
            L.append(f"**claude_solo · {m}** (temas libres por respuesta):")
            for it in items:
                L += [f"- *{it['id']}*:"] + ["  " + x for x in lista(r["columnas"][it["id"]], r["alineacion"][it["id"]])]
            L.append("")
    (RES / "COLUMNAS.md").write_text("\n".join(L) + "\n")


# ---------- juicio ----------

def comparacion(r, dataset):
    b = []
    for it in dataset:
        iid, p, g = it["id"], PREGUNTAS[it["pregunta_id"]], it["gold"]
        ali, cols, pr = r["alineacion"][iid], r["columnas"][iid], r["items"][iid]
        usadas = {v for v in ali.values() if v}
        b += [f"## {iid}", "", f"Pregunta: {p['texto']}", "", "Transcripción:", it["respuesta"], "",
              "Columnas del sistema y su pareja de referencia:"]
        b += [f"- {gc} ({p['columnas'][gc]}) → " + (f"{ali[gc]}: {cols[ali[gc]]}" if ali[gc] else "ninguna") for gc in p["columnas"]]
        b += [f"- Extra sin pareja: {c}: {d}" for c, d in cols.items() if c not in usadas]
        b += ["", "| Tema de referencia | Esperado | Obtenido |", "|---|---|---|"]
        b += [f"| {gc} | {describir_corto(gv)} | {describir_corto(pred_tema(r, iid, gc))} |" for gc, gv in g["temas"].items()]
        extra = [f"{c}: {describir_corto(pr['temas'][c] if pr['temas'][c]['menciona'] else None)}" for c in cols if c not in usadas]
        if extra:
            b.append("Columnas extra: " + "; ".join(extra))
        b += ["", f"Riesgo de fuga: esperado {g['riesgo_fuga']}, obtenido {pr['riesgo_fuga']} · "
                  f"Emoción: esperada {g['emocion']}, obtenida {pr['emocion']} · "
                  f"Propone: esperado {g['propone']}, obtenido {pr['propone']}", ""]
    return "\n".join(b)


def cmd_entradas_juicio(a):
    dataset, corridas = leer(DATASET), corridas_existentes()
    nombres = {}
    for i, (m, c) in enumerate(corridas):
        s = f"S{i + 1}"
        nombres[s] = f"{c} (sin Claude)" if m == "jev" else f"{c} · Claude {m}"
        (Path(a.dir) / "juzgar").mkdir(parents=True, exist_ok=True)
        (Path(a.dir) / "juzgar" / f"{s}.md").write_text(f"# Sistema {s}\n\n" + comparacion(leer(RES / m / f"{c}.json"), dataset))
    escribir(RES / "juicio_mapa.json", nombres)
    print(f"{len(corridas)} corridas ciegas en {a.dir}/juzgar/")


def cmd_importar_juicio(a):
    nombres, j = leer(RES / "juicio_mapa.json"), leer(Path(a.dir) / "juzgar" / "juicio.json")
    escribir(RES / "juicio.json", {"nombres": nombres, "juicio": j})

    def nombrar(t):
        return re.sub(r"\bS(\d+)\b", lambda m: f"«{nombres.get(m.group(0), m.group(0))}»", t)

    L = ["# Juicio cualitativo", "", "Un subagente Opus sin contexto leyó cada corrida sin saber qué condición ni qué "
         "modelo era, y comparó lo esperado con lo obtenido sin calcular porcentajes.", "",
         "| Puesto | Sistema | Veredicto | ¿Lo usaría? | Graves | Menores | Defendibles | Por qué |", "|---|---|---|---|---|---|---|---|"]
    for f in sorted(j["ranking"], key=lambda x: x["puesto"]):
        s = j["sistemas"][f["sistema"]]
        L.append(f"| {f['puesto']} | {nombres[f['sistema']]} | {s['veredicto']} | {'Sí' if f['lo_usaria'] else 'No'} | "
                 f"{s['graves']} | {s['menores']} | {s['defendibles']} | {nombrar(f['porque'])} |")
    L += ["", f"**Conclusión:** {nombrar(j['conclusion'])}", ""]
    for sid, s in j["sistemas"].items():
        L += [f"## {nombres[sid]}", "", nombrar(s["resumen"]), "", f"- Columnas: {nombrar(s['calidad_columnas'])}",
              f"- Dimensiones nuevas (tendencia, riesgo, emoción, propone): {nombrar(s['dimensiones_nuevas'])}", ""]
    (RES / "JUICIO.md").write_text("\n".join(L) + "\n")
    print((RES / "JUICIO.md").read_text())


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    sub = ap.add_subparsers(required=True)
    for nombre, f in (("entradas-generar", cmd_entradas_generar), ("importar-dataset", cmd_importar_dataset),
                      ("jev", cmd_jev), ("importar-alineacion", cmd_importar_alineacion),
                      ("entradas-juicio", cmd_entradas_juicio), ("importar-juicio", cmd_importar_juicio)):
        s = sub.add_parser(nombre)
        s.add_argument("dir")
        s.set_defaults(f=f)
    sub.add_parser("puntuar").set_defaults(f=cmd_puntuar)
    a = ap.parse_args()
    a.f(a)
