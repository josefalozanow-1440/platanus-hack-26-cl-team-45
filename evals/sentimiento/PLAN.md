# Eval de sentimiento en respuestas de encuesta

Queremos saber qué combinación de Claude y Jev clasifica mejor el sentimiento de respuestas abiertas, antes de tener las preguntas reales (las trae Edo). Las respuestas reales van a ser transcripciones de audios de hasta 3 minutos, en español y sin etiquetas.

## Por qué así

La literatura dice que:

- Los LLM ya codifican respuestas abiertas con un acuerdo parecido al de humanos entre sí.
- En respuestas largas el sentimiento global se diluye en "mixto". Por eso medimos el sentimiento por tema (columna).
- Entrenar un modelo propio solo conviene con muchos datos etiquetados. No tenemos, así que queda fuera.
- El flujo más usado es que un LLM proponga las categorías y después se clasifique contra ellas (TopicGPT, GATOS).

Como no hay etiquetas, fabricamos un dataset con la respuesta correcta conocida: definimos las columnas y los valores, y Claude escribe respuestas que los expresan.

## Dataset

- 5 preguntas de clima laboral, cada una con 4 columnas de referencia. Están en [preguntas.json](preguntas.json).
- 3 perfiles por pregunta. Cada perfil le asigna a cada columna un valor de -2 a 2, o `null` si la persona no habla de ese tema.
- Claude Opus (effort medium) escribe una transcripción de 300 a 450 palabras por perfil, en español chileno hablado, con muletillas y errores de transcriptor. El resultado queda en `dataset.json`: 15 respuestas y 60 celdas.

Escala:

| Valor | Significado |
|---|---|
| -2 | Lo critica con fuerza |
| -1 | Lo critica de forma moderada |
| 0 | Neutro o mixto |
| 1 | Lo valora de forma moderada |
| 2 | Lo elogia con entusiasmo |
| null | No habla del tema |

## Condiciones

| Condición | Quién arma las columnas | Quién clasifica |
|---|---|---|
| `claude_solo` | De referencia | Claude |
| `jev_columnas_sabidas` | De referencia | Jev |
| `claude_pregunta_jev` | Claude, viendo solo la pregunta | Jev |
| `claude_respuestas_jev` | Claude, viendo la pregunta y las 3 respuestas | Jev |

Cuando Claude induce las columnas, hay que saber cuál corresponde a cuál columna de referencia. Para eso Opus las alinea. Una columna de referencia sin pareja cuenta como "no mencionada" en todas las respuestas.

Por cada columna, Jev recibe:

- Un Noul: "¿la persona habla de este tema?". Con 0,5 o más cuenta como mencionado.
- Una Score con los 5 niveles de la escala. El valor es el nivel más probable.

## Métricas

- **Celdas exactas:** % de las 60 celdas donde el valor predicho (incluido `null`) es igual al de referencia. Es la métrica principal.
- **F1 mención:** si acierta qué temas toca cada respuesta.
- **MAE valor:** error promedio en la escala, solo en celdas donde ambos dicen que se menciona.
- **Signo invertido:** celdas donde dijo positivo y era negativo, o al revés. Es el error más caro para un informe.
- **Cobertura columnas:** % de columnas de referencia que la condición logró recuperar. Es 100% cuando se usan las de referencia.
- **Columnas extra:** columnas inducidas que no calzaron con ninguna de referencia. No restan puntaje, pero se reportan.
- **Nouls dudosos:** menciones con probabilidad entre 0,3 y 0,7.

## Pasos

1. Commitear preguntas, script y este plan.
2. `python3 eval.py generar`: Opus escribe el dataset. Leer algunas respuestas para confirmar que expresan los valores pedidos.
3. `TYPESAFE_API_KEY=... python3 eval.py correr --modelo opus`: las 4 condiciones corren en paralelo, cada una con hasta 8 llamadas simultáneas (`claude -p` o Jev).
4. Repetir con `--modelo sonnet` y `--modelo haiku`. El dataset y el alineador siguen en Opus para que la vara no cambie.
5. `python3 eval.py puntuar` escribe `resultados/RESULTADOS.md`.
6. Commitear dataset y resultados.

Claude corre con `claude -p` sobre la suscripción, no con API key. Cada llamada va aislada: sin tools, sin settings, sin MCP y fuera del repo, para que no cargue instrucciones del proyecto.

## Límites conocidos

- El dataset lo escribe Claude y Claude también clasifica. Eso puede favorecer a `claude_solo`, porque reconoce su propia forma de expresar un "-1".
- 15 respuestas son pocas: diferencias de 1 o 2 celdas son ruido.
- El alineador puede ser más o menos estricto y eso mueve la cobertura de las condiciones inducidas.
- No medimos sarcasmo ni tono de voz, que se pierden al transcribir.

## Hallazgos (corrida del 21-11-2026)

Detalle en [resultados/RESULTADOS.md](resultados/RESULTADOS.md).

- `claude_solo` gana con los tres modelos: 97% de celdas exactas con Opus y 93% con Sonnet y Haiku. Puede estar inflado, porque Claude escribió el dataset (ver límites).
- `claude_respuestas_jev` empata o casi empata a `claude_solo`: 93% con Sonnet y 87% con Opus y Haiku. Inducir columnas mirando las respuestas recupera entre 90% y 100% de las columnas de referencia.
- `claude_pregunta_jev` es la peor (63% a 72%). Mirando solo la pregunta, Claude propone columnas razonables que no son las que la gente después menciona.
- `jev_columnas_sabidas` da entre 85% y 87%, y la variación es de una celda en corridas con la misma entrada. Sus errores son sobre todo falsos positivos de mención en temas vecinos, más algunos errores de un nivel de intensidad.
- Ninguna condición invirtió el signo en ninguna celda.
- El modelo de Claude pesa poco: Haiku queda a 4 puntos de Opus en `claude_solo` y empata en `claude_respuestas_jev`.
- Jev responde las 15 respuestas en alrededor de 1 segundo. Las condiciones con Claude tardan entre 10 y 30 segundos. Cada modelo usó unos 90k tokens de entrada de Jev en 45 requests.
