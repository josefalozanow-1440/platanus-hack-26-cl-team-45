# Eval de sentimiento en respuestas de encuesta

Queremos saber qué combinación de Claude y Jev analiza mejor respuestas abiertas de encuesta. Las respuestas reales van a ser transcripciones de audios de hasta 3 minutos, en español y sin etiquetas.

## Por qué así

La literatura dice que:

- Los LLM ya codifican respuestas abiertas con un acuerdo parecido al de humanos entre sí.
- En respuestas largas el sentimiento global se diluye en "mixto". Por eso medimos el sentimiento por tema (columna).
- Entrenar un modelo propio solo conviene con muchos datos etiquetados. No tenemos, así que queda fuera.
- El flujo más usado es que un LLM proponga las categorías y después se clasifique contra ellas (TopicGPT, GATOS).

Como no hay etiquetas, fabricamos un dataset con la respuesta correcta conocida: definimos los temas y los valores, y un modelo escribe respuestas que los expresan. Las columnas y los valores de referencia solo sirven para medir. Ningún sistema los conoce, salvo Jev en `jev_columnas_sabidas`.

## Escala: de un número a varias dimensiones

La primera versión medía cada tema de -2 a 2. Ahí el 0 juntaba "neutro" con "mixto", un solo número mezclaba dirección con intensidad, y no había dónde poner si algo empeora o si la persona se quiere ir. Esta versión mide:

Por tema:

| Dimensión | Valores |
|---|---|
| Dirección | positivo, negativo, neutro, mixto, o no lo menciona |
| Intensidad | leve, moderada, fuerte (solo si es positivo o negativo) |
| Tendencia | mejora, igual, empeora, no dice |

Por respuesta: riesgo de fuga (sí o no), emoción principal (frustración, resignación, ansiedad, entusiasmo, gratitud, calma) y si propone una mejora concreta (sí o no).

Las definiciones están en [preguntas.json](preguntas.json).

## Dataset

- 5 preguntas de clima laboral con 4 temas de referencia cada una, y 3 perfiles por pregunta con los valores de cada dimensión.
- Un subagente Opus escribe las 15 transcripciones (300 a 450 palabras, español chileno hablado, con muletillas y errores de transcriptor). Versión legible en [DATASET.md](DATASET.md).

## Condiciones

| Condición | Quién arma las columnas | Quién clasifica |
|---|---|---|
| `claude_solo` | Claude, temas libres en cada respuesta | Claude, en la misma pasada |
| `claude_respuestas_jev` | Claude, una lista por pregunta después de leer las respuestas | Jev |
| `claude_pregunta_jev` | Claude, una lista por pregunta viendo solo la pregunta | Jev |
| `jev_columnas_sabidas` | Las de referencia | Jev |

Cada rol de Claude es un **subagente sin contexto** de Claude Code (Opus, Sonnet y Haiku, effort medium). Recibe solo una carpeta de trabajo fuera del repo con lo mínimo: las preguntas, o las preguntas y las respuestas. Nunca ve `preguntas.json` ni `dataset.json`.

Por cada columna, Jev recibe un Noul ("¿habla de este tema?", con 0,5 o más cuenta como mencionado), una Choice de dirección, una Score de intensidad (nivel más probable) y una Choice de tendencia. Por respuesta, dos Nouls (riesgo de fuga, propone) y una Choice de emoción.

Un subagente Opus sin contexto empareja las columnas propuestas con las de referencia, uno a uno y sin saber de qué modelo ni de qué condición vienen. Otro subagente Opus juzga a ciegas las 10 corridas.

## Métricas

Por tema (60 celdas = 15 respuestas × 4 temas de referencia):

- **Celda completa:** dirección, intensidad y tendencia correctas a la vez, o bien "no lo menciona" cuando no lo menciona. Es la métrica principal.
- **Dirección:** % de celdas con la dirección correcta, contando "no lo menciona".
- **Intensidad:** % correcto entre las celdas positivas o negativas donde acertó la dirección.
- **Tendencia:** % correcto entre las celdas donde ambos dicen que se menciona.
- **F1 mención:** si acierta qué temas toca cada respuesta.
- **Signo invertido:** dijo positivo y era negativo, o al revés.
- **Cobertura:** % de celdas mencionadas cuya columna de referencia tiene pareja entre las propuestas.
- **Extras por respuesta:** columnas propuestas sin pareja. Pueden ser ruido o hallazgos; se revisan en [COLUMNAS.md](resultados/COLUMNAS.md).
- **Nouls dudosos:** menciones de Jev con probabilidad entre 0,3 y 0,7.

Por respuesta (15): % correcto en riesgo de fuga, emoción y propone.

## Cómo correrlo

`DIR` es una carpeta de trabajo fuera del repo.

1. `python3 eval.py entradas-generar DIR` y un subagente Opus escribe `DIR/generar/respuestas.json`.
2. `python3 eval.py importar-dataset DIR` deja en `DIR/clasificar/` solo las preguntas y las respuestas.
3. Nueve subagentes en paralelo (3 modelos × 3 roles) escriben `DIR/salidas/<modelo>/{solo,columnas_respuestas,columnas_pregunta}.json`.
4. `python3 eval.py jev DIR` corre Jev (necesita `TYPESAFE_API_KEY`) y escribe las tareas de alineación. Un subagente Opus escribe `DIR/alinear/alineacion.json`, y `python3 eval.py importar-alineacion DIR` las importa.
5. `python3 eval.py puntuar` escribe `resultados/RESULTADOS.md` y `COLUMNAS.md`.
6. `python3 eval.py entradas-juicio DIR`; un subagente Opus escribe `DIR/juzgar/juicio.json`, y `python3 eval.py importar-juicio DIR` lo importa.

## Límites conocidos

- Un modelo de Claude escribe el dataset, clasifica y juzga. Eso puede favorecer a Claude.
- 15 respuestas son pocas: diferencias de 1 o 2 celdas son ruido.
- La alineación uno a uno castiga a quien parte un tema en varios.
- El gasto de los subagentes va por la suscripción de Claude Code y no se puede medir en dólares; Jev sí se mide en tokens.
- No medimos sarcasmo ni tono de voz, que se pierden al transcribir.

## Hallazgos (corrida del 22-11-2026, escala multidimensional, 14 subagentes)

Detalle en [RESULTADOS.md](resultados/RESULTADOS.md), [JUICIO.md](resultados/JUICIO.md) y [COLUMNAS.md](resultados/COLUMNAS.md).

| Condición | Opus | Sonnet | Haiku |
|---|---|---|---|
| `claude_solo` | **93%** | **93%** | 90% |
| `claude_respuestas_jev` | 67% | 60% | 65% |
| `claude_pregunta_jev` | 52% | 48% | 52% |
| `jev_columnas_sabidas` (sin Claude) | 55% | | |

Celda completa: dirección, intensidad y tendencia correctas a la vez.

- Claude solo gana con los tres modelos, en números y en el juicio a ciegas (Opus y Haiku "Excelente", 0 errores graves).
- Jev pierde sobre todo en intensidad (cerca de 68%) y en temas vecinos que marca como mencionados. En dirección y tendencia queda más cerca.
- Las dimensiones por respuesta funcionan en todos: los 10 sistemas aciertan riesgo de fuga y propone en las 15 respuestas, y la emoción en 14 o 15.
- Armar columnas viendo solo la pregunta vuelve a ser lo peor: el juez la deja "Insuficiente" con los tres modelos, porque le faltan columnas para temas centrales.
- Ningún sistema invirtió una opinión.
- Gasto: 14 subagentes con unos 900k tokens en total (el juez, el más caro, 138k), por la suscripción de Claude Code. Jev: 105 requests en 1,7 segundos, 331k tokens de entrada.

## Pipeline de la app (corrida del 22-11-2026)

`pipeline_app` corre el código real de la app (`convex/extraccion.ts`, mismos prompts y schemas) con [pipeline.ts](pipeline.ts). Las respuestas de cada pregunta entran de a una, como en la app: extraer frases y reagrupar con los temas que ya existen. Se probó Haiku 5.5 con effort medium y Opus 5.5 con effort low, que es lo que corre la app hoy.

La app no tiene columnas, así que para puntuarla:

- Un subagente Opus sin contexto manda cada tema a cero o más destinos: columnas de referencia, `riesgo_fuga` o `propone`. Varios temas pueden ir a la misma columna porque cada tema es una postura ("sueldo bajo" y "sueldo mejorado").
- La dirección de cada celda sale de la polaridad de las emociones de las frases (la división POS/NEG de `web/src/comun.js`). La intensidad es la mayor de esas frases (menos de 0,4 es leve, menos de 0,7 moderada).
- La tendencia queda siempre en `no_dice`, porque la app no la extrae. Por eso se agregó «Celda sin tendencia».
- La emoción de la respuesta es la de su frase más intensa, traducida de 22 a 6 emociones.

| | Celda completa | Celda sin tendencia | Dirección | Intensidad | Riesgo de fuga | Propone | Emoción |
|---|---|---|---|---|---|---|---|
| `claude_solo` · Haiku | 90% | 92% | 95% | 94% | 100% | 100% | 100% |
| `pipeline_app` · Haiku medium | 23% | 58% | 75% | 64% | 100% | 67% | 40% |
| `pipeline_app` · Opus low | 27% | 65% | 80% | 70% | 87% | 73% | 47% |

- La celda completa se cae por diseño: la app no extrae tendencia. Sin exigirla, queda entre 58% y 65%, más cerca de las condiciones con Jev que de `claude_solo`.
- Ve los temas: F1 de mención entre 0,92 y 0,93 y cobertura de 100%. Ningún sistema invirtió una opinión.
- Los errores de dirección son sobre todo negativo contra mixto. Basta una frase positiva dentro de un tema negativo para que la celda salga mixta. También pierde opiniones neutras, porque solo saca de 1 a 5 ideas por respuesta.
- La emoción baja es en buena parte culpa de la traducción: la frase más intensa suele ser la positiva, y resignación contra frustración no tiene equivalente limpio en la lista de 22.
- Opus low le gana a Haiku medium por 5 a 7 puntos en casi todo, salvo riesgo de fuga. Con 15 respuestas, eso es apenas 3 o 4 celdas.
- No hubo juicio cualitativo a ciegas de estas corridas.
