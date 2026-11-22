# Costo por respuesta

Medido el 22-11-2026 sobre las 15 respuestas de `respuestas.json` (41 a 450 palabras), con los mismos prompts de la app. Precios de lista sin caché: Opus 5.5 US$ 4 / 20 y Haiku 5.5 US$ 0,10 / 0,50 por millón de tokens de entrada / salida. Los tokens de salida incluyen el razonamiento del modelo. La transcripción (Whisper por OpenRouter, ~US$ 0,0002 por minuto según convex/procesar.ts) no está medida acá.

| Paso | Modelo | Llamadas | Entrada promedio | Salida promedio | Costo promedio por llamada | Llamada con la 1.ª respuesta | Llamada con la 15.ª | Total 15 respuestas |
|---|---|---|---|---|---|---|---|---|
| extraer | claude-opus-5-5 | 15 | 1269 | 463 | US$ 0.0143 | US$ 0.0105 | US$ 0.0134 | US$ 0.2151 |
| agrupar | claude-opus-5-5 | 15 | 2384 | 1321 | US$ 0.0360 | 0.988 ¢ | US$ 0.0577 | US$ 0.5394 |
| haiku_solo | claude-haiku-5-5 | 15 | 1547 | 913 | 0.061 ¢ | 0.027 ¢ | 0.048 ¢ | 0.917 ¢ |
| normalizar_haiku | claude-haiku-5-5 | 15 | 4329 | 3975 | 0.242 ¢ | 0.032 ¢ | 0.366 ¢ | US$ 0.0363 |
| normalizar_opus | claude-opus-5-5 | 15 | 3586 | 1426 | US$ 0.0429 | 0.937 ¢ | US$ 0.0693 | US$ 0.6430 |

Costo promedio por respuesta en estas 15, sumando todas sus llamadas:

- Pipeline de la app hoy (extraer + agrupar, Opus low): **US$ 0.0503**.
- Más Haiku solo guardado en una fila: **US$ 0.0509**.
- Más Haiku solo y normalizar con Haiku: **US$ 0.0533**; con normalizar en Opus low: **US$ 0.0938**.

Agrupar y normalizar reenvían todas las frases o temas de la encuesta en cada respuesta nueva, así que su llamada crece con N y el costo total de una encuesta crece más rápido que lineal. Extraer y Haiku solo cuestan lo mismo con cualquier N.
