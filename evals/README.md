# Evals: por qué Audem le pasa las respuestas completas a Claude

Audem tiene que convertir audios abiertos en algo que se pueda contar: de qué habla la gente, qué opina de cada cosa y con cuánta fuerza. Antes de decidir cómo, probamos varias alternativas con datos donde la respuesta correcta era conocida y después con respuestas "orgánicas" leídas a mano. Este documento junta todo lo que probamos, lo que quedó y lo que descartamos.

La conclusión corta es que un LLM que lee la respuesta completa y arma sus propios temas le gana a todo lo demás que probamos: a un clasificador con columnas fijas (Jev), a grillas armadas de antemano y a deducir el sentimiento desde la emoción. No hace falta entrenar nada. Lo que todavía falta resolver es cómo juntar esos temas libres en tópicos comunes para contarlos en volumen.

## Decisiones

| Técnica | Estado | Por qué |
|---|---|---|
| Claude lee la respuesta completa y propone temas libres con dirección, intensidad y tendencia | Aceptada | 90 a 93% de celdas completas con Opus, Sonnet y Haiku. Cero errores graves en el juicio a ciegas |
| Haiku 5.5 en vez de Opus para ese análisis | Aceptada | Rinde casi lo mismo (90% contra 93%) y cuesta unas 40 veces menos |
| Jev (TypeSafe) clasificando contra columnas | Descartada | 55 a 67% de celdas completas. Falla sobre todo en intensidad (cerca de 68%) |
| Grilla de columnas armada viendo solo la pregunta | Descartada | Lo peor que medimos (48 a 52%). Le faltan columnas para temas centrales |
| Escala única de sentimiento de -2 a 2 | Descartada | El 0 juntaba neutro con mixto y no había dónde poner la tendencia ni el riesgo de fuga |
| Entrenar un modelo propio | Descartada sin probar | Solo conviene con muchos datos etiquetados, y no los tenemos |
| Pipeline actual de la app: frases con emoción (Opus low) agrupadas en temas de postura | Se queda para el mapa | El mapa se lee bien, pero mide peor por persona: 65% de celdas sin exigir tendencia, contra 92% de Haiku solo |
| Deducir la dirección de una opinión a partir de la emoción de la frase | Descartada | Confunde negativo con mixto: basta una frase positiva dentro de un tema negativo |
| Guardar el análisis de Haiku solo en una fila por respuesta | Propuesta | Agrega dirección, tendencia y propuestas por 0,06 ¢ por respuesta |
| Normalizar temas libres en tópicos comunes de la encuesta | En prueba | Sin una regla de granularidad, Haiku arma 34 tópicos y Opus 11. Un juez a ciegas propone 16 |

## 1. Sentimiento por columnas con respuesta conocida

Carpeta [sentimiento/](sentimiento/). Método completo en [PLAN.md](sentimiento/PLAN.md).

No teníamos respuestas etiquetadas, así que fabricamos un dataset donde la respuesta correcta es conocida. Definimos 5 preguntas de clima laboral con 4 temas de referencia cada una y 3 perfiles por pregunta, y un subagente Opus escribió 15 transcripciones de 300 a 450 palabras en español chileno hablado, con muletillas y errores de transcriptor ([DATASET.md](sentimiento/DATASET.md)). Las columnas y los valores de referencia solo sirven para medir: ningún sistema los ve, salvo Jev en la condición que los recibe a propósito.

Por tema medimos dirección (positivo, negativo, neutro, mixto o no lo menciona), intensidad (leve, moderada, fuerte) y tendencia (mejora, igual, empeora, no dice). Por respuesta medimos riesgo de fuga, emoción principal y si propone una mejora. La métrica principal es la **celda completa**: dirección, intensidad y tendencia correctas a la vez.

Cada rol de Claude corrió como subagente sin contexto, con una carpeta de trabajo fuera del repo que no contenía las respuestas correctas. Un subagente Opus ciego emparejó las columnas propuestas con las de referencia, y otro juzgó las corridas a ciegas.

| Condición | Opus | Sonnet | Haiku |
|---|---|---|---|
| `claude_solo`: Claude arma temas libres y clasifica en la misma pasada | **93%** | **93%** | 90% |
| `claude_respuestas_jev`: Claude arma una lista por pregunta leyendo las respuestas y Jev clasifica | 67% | 60% | 65% |
| `claude_pregunta_jev`: Claude arma la lista viendo solo la pregunta y Jev clasifica | 52% | 48% | 52% |
| `jev_columnas_sabidas`: Jev con las columnas de referencia | 55% | | |

- Claude solo gana con los tres modelos, en números y en el juicio a ciegas ([JUICIO.md](sentimiento/resultados/JUICIO.md)), donde Opus y Haiku quedan como "excelente" y sin errores graves.
- Jev pierde sobre todo en intensidad y en temas vecinos que marca como mencionados, incluso cuando recibe las columnas correctas.
- Armar columnas viendo solo la pregunta es lo peor: el juez la deja como "insuficiente" con los tres modelos.
- Los 10 sistemas aciertan riesgo de fuga y propone en las 15 respuestas, y ninguno invirtió una opinión.

Corregimos dos cosas en el camino. La primera versión medía cada tema con un solo número de -2 a 2 y la reemplazamos por las dimensiones de arriba. En otra versión Claude veía las columnas de referencia, lo que inflaba sus resultados; las sacamos y agregamos un reporte de las columnas que propone cada sistema ([COLUMNAS.md](sentimiento/resultados/COLUMNAS.md)).

## 2. El pipeline de la app contra la misma referencia

Mismo dataset, condición `pipeline_app`. Detalle en la sección "Pipeline de la app" de [PLAN.md](sentimiento/PLAN.md).

[pipeline.ts](sentimiento/pipeline.ts) corre el código real de la app ([convex/extraccion.ts](../convex/extraccion.ts)), con las respuestas entrando de a una como en producción: extraer de 1 a 5 frases con emoción e intensidad, y después reagrupar todas las frases en temas de postura. Como la app no arma columnas, un alineador ciego manda cada tema a una o más columnas de referencia. La dirección sale de la polaridad de las emociones de las frases y la tendencia queda en "no dice".

| | Celda completa | Celda sin tendencia | Dirección | Intensidad |
|---|---|---|---|---|
| `claude_solo` · Haiku | 90% | 92% | 95% | 94% |
| `pipeline_app` · Opus low (lo que corre hoy la app) | 27% | 65% | 80% | 70% |
| `pipeline_app` · Haiku medium | 23% | 58% | 75% | 64% |

El pipeline detecta bien de qué habla cada persona (F1 de mención de 0,93), pero pierde en el matiz. La celda completa se cae porque no extrae tendencia, y aun sin exigirla queda cerca de las condiciones con Jev. Para el mapa del grupo sirve. Para medir qué opina cada persona de cada tema, no.

## 3. Respuestas orgánicas de la hackatón, leídas a mano

Carpeta [hackaton/](hackaton/). Lectura completa en [LECTURA.md](hackaton/LECTURA.md).

Un subagente sin contexto escribió 15 audios respondiendo "¿Cómo ha sido tu experiencia en la Platanus Hack hasta ahora?", sin columnas, sin temas sugeridos y con largos de 41 a 450 palabras ([respuestas.json](hackaton/respuestas.json)). Sobre ellas corrimos el pipeline de la app y Haiku medium solo ([correr.ts](hackaton/correr.ts)).

- **El pipeline arma un buen mapa del grupo:** 9 temas legibles, como "agotamiento y estrés" (8 personas) o "comida bien, pero faltó café y duchas" (5). También detecta casos de una sola persona, como el estacionamiento o la sospecha de código previo, y captó mejor la ironía.
- **El pipeline pierde detalle:** el tope de 5 frases corta las respuestas largas, algunos temas terminan como cajón de sastre y no registra tendencia ni propuestas.
- **Haiku solo es más completo por persona:** saca de 2 a 8 temas por respuesta, marca bien las tendencias ("los mentores mejoraron respecto al año pasado") y separa lo que cada uno propone.
- **Haiku solo no sirve para contar:** cada respuesta nombra distinto el mismo tema ("equipo", "compañeros de equipo", "equipo de trabajo"). Además tiene lecturas forzadas: tendencias que nadie dijo y una ironía leída literal.

De ahí sale la propuesta de guardar el análisis de Haiku por respuesta y agregarle un paso que junte sus temas en tópicos comunes.

## 4. Normalizar temas libres en tópicos

[normalizar.ts](hackaton/normalizar.ts), resultados en [NORMALIZACION.md](hackaton/NORMALIZACION.md) y juicio a ciegas en [JUICIO_NORMALIZACION.md](hackaton/JUICIO_NORMALIZACION.md).

El normalizador funciona igual que `agrupar` en la app, pero agrupa por tópico ("de qué se habla") y no por postura. Con cada respuesta nueva recibe todos los temas libres de la encuesta y los tópicos existentes, y devuelve el diccionario completo junto con la asignación de cada tema. No tiene ninguna lista previa: los tópicos salen de lo que dice la gente. Con eso queda una matriz persona × tópico que se cuenta con código, sin LLM.

| Normalizador | Tópicos | Tópicos con una sola persona | Problema |
|---|---|---|---|
| Haiku 5.5 medium | 34 | 18 | Demasiado fino: separa "experiencia general" de "ambiente del evento" y reparte a los mentores en tres tópicos |
| Opus 5.5 low | 11 | 2 | Demasiado grueso: en "organización y lugar" junta wifi, estacionamiento, ruido, duchas y frío (10 personas) |

Un subagente Opus juzgó a ciegas los dos sistemas contra las 15 respuestas. Propuso 16 tópicos y prefirió la base de Opus, partiendo sus tópicos mezclados. Para los dos sugirió una regla de entre 12 y 18 tópicos que separe lo que se arregla distinto o lo arregla otra persona. También detectó un error que comparten los dos y que viene del análisis por respuesta: la dirección debe ser la opinión de hoy, lo del año pasado es tendencia y lo que se cuenta en broma no es negativo.

Esta técnica todavía no está lista. El paso siguiente es agregar esa regla al prompt y repetir la prueba.

## 5. Costo por respuesta

[costo.ts](hackaton/costo.ts), detalle en [COSTO.md](hackaton/COSTO.md). Medido con las 15 respuestas de la hackatón y precios de lista sin caché: Opus 5.5 US$ 4 / 20 y Haiku 5.5 US$ 0,10 / 0,50 por millón de tokens de entrada / salida.

| Paso | Modelo | Costo promedio por llamada | Con la 1.ª respuesta | Con la 15.ª |
|---|---|---|---|---|
| extraer | Opus low | US$ 0,014 | US$ 0,011 | US$ 0,013 |
| agrupar | Opus low | US$ 0,036 | US$ 0,010 | US$ 0,058 |
| Haiku solo | Haiku medium | US$ 0,0006 | US$ 0,0003 | US$ 0,0005 |
| normalizar | Haiku medium | US$ 0,0024 | US$ 0,0003 | US$ 0,0037 |
| normalizar | Opus low | US$ 0,043 | US$ 0,009 | US$ 0,069 |

- Hoy la app cuesta unos **US$ 0,05 por respuesta**. Agrupar se lleva más de dos tercios y crece con cada respuesta, porque reenvía todas las frases de la encuesta.
- Agregar Haiku solo cuesta 0,06 ¢ por respuesta, el 1% de lo que ya se gasta.
- Normalizar con Haiku suma 0,24 ¢. Normalizar con Opus casi duplica el costo total.
- La transcripción (Whisper por OpenRouter, unos US$ 0,0002 por minuto) no está incluida.

## Lo que no medimos

- Todos los datasets los escribió un modelo de Claude, y Claude también clasifica y juzga. Eso puede favorecer a Claude.
- 15 respuestas por dataset son pocas: diferencias de 1 o 2 celdas son ruido.
- No probamos audios reales, sarcasmo ni tono de voz, que se pierden al transcribir.
- No hay juicio a ciegas de las corridas de `pipeline_app`.
- Agrupar y normalizar en una sola llamada alcanza para unos cientos de frases. Más allá habría que pasar a embeddings y clustering, y eso tampoco lo probamos.

## Cómo reproducir

Todo corre con las keys de `.env` (`ANTHROPIC_API_KEY` y, para Jev, `TYPESAFE_API_KEY`):

```bash
set -a; . ./.env; set +a
node evals/sentimiento/pipeline.ts      # pipeline de la app sobre el dataset de clima laboral
node evals/hackaton/correr.ts           # pipeline y Haiku solo sobre la hackatón: LECTURA.md
node evals/hackaton/normalizar.ts       # tópicos con Haiku y Opus: NORMALIZACION.md
node evals/hackaton/costo.ts            # tokens y costo por paso: COSTO.md
```

Los pasos con subagentes de [sentimiento/](sentimiento/) (generar el dataset, `claude_solo`, alinear y juzgar) están en la sección "Cómo correrlo" de [PLAN.md](sentimiento/PLAN.md).
