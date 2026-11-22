# Eval de sentimiento en respuestas de encuesta

Queremos saber qué combinación de Claude y Jev clasifica mejor el sentimiento de respuestas abiertas, antes de tener las preguntas reales (las trae Edo). Las respuestas reales van a ser transcripciones de audios de hasta 3 minutos, en español y sin etiquetas.

## Por qué así

La literatura dice que:

- Los LLM ya codifican respuestas abiertas con un acuerdo parecido al de humanos entre sí.
- En respuestas largas el sentimiento global se diluye en "mixto". Por eso medimos el sentimiento por tema (columna).
- Entrenar un modelo propio solo conviene con muchos datos etiquetados. No tenemos, así que queda fuera.
- El flujo más usado es que un LLM proponga las categorías y después se clasifique contra ellas (TopicGPT, GATOS).

Como no hay etiquetas, fabricamos un dataset con la respuesta correcta conocida: definimos las columnas y los valores, y Claude escribe respuestas que los expresan. Las columnas de referencia solo sirven para medir. Ningún sistema las conoce, salvo Jev en `jev_columnas_sabidas`.

## Dataset

- 5 preguntas de clima laboral, cada una con 4 columnas de referencia. Están en [preguntas.json](preguntas.json).
- 3 perfiles por pregunta. Cada perfil le asigna a cada columna un valor de -2 a 2, o `null` si la persona no habla de ese tema.
- Claude Opus (effort medium) escribe una transcripción de 300 a 450 palabras por perfil, en español chileno hablado, con muletillas y errores de transcriptor. El resultado queda en `dataset.json` (versión legible en [DATASET.md](DATASET.md)): 15 respuestas y 60 celdas.

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
| `claude_solo` | Claude, temas libres en cada respuesta | Claude, en la misma llamada |
| `claude_respuestas_jev` | Claude, una lista por pregunta viendo sus 3 respuestas | Jev |
| `claude_pregunta_jev` | Claude, una lista por pregunta viendo solo la pregunta | Jev |
| `jev_columnas_sabidas` | Las de referencia | Jev |

Para comparar contra la referencia, Opus alinea las columnas propuestas con las de referencia, uno a uno: cada columna de referencia queda con la propuesta que mide el mismo tema o con ninguna. En `claude_solo` se alinea respuesta por respuesta, porque cada respuesta tiene sus propios temas. Una columna de referencia sin pareja cuenta como "no mencionada".

Por cada columna, Jev recibe:

- Un Noul: "¿la persona habla de este tema?". Con 0,5 o más cuenta como mencionado.
- Una Score con los 5 niveles de la escala. El valor es el nivel más probable.

## Métricas

- **Celdas exactas:** % de las 60 celdas donde el valor predicho (incluido `null`) es igual al de referencia. Es la métrica principal.
- **F1 mención:** si acierta qué temas toca cada respuesta.
- **MAE valor:** error promedio en la escala, solo en celdas donde ambos dicen que se menciona.
- **Signo invertido:** celdas donde dijo positivo y era negativo, o al revés. Es el error más caro para un informe.
- **Cobertura:** % de las 45 celdas mencionadas cuya columna de referencia tiene pareja entre las propuestas.
- **Columnas extra por respuesta:** columnas propuestas sin pareja. No restan puntaje. Pueden ser ruido o hallazgos que la referencia no tenía; se revisan en [COLUMNAS.md](resultados/COLUMNAS.md).
- **Nouls dudosos:** menciones de Jev con probabilidad entre 0,3 y 0,7.

## Cómo correrlo

```sh
set -a; . ../../.env; set +a           # TYPESAFE_API_KEY
python3 eval.py generar                 # Opus escribe dataset.json
python3 eval.py correr --modelo jev     # jev_columnas_sabidas, una sola vez
python3 eval.py correr --modelo opus    # las 3 condiciones con Claude, en paralelo
python3 eval.py correr --modelo sonnet
python3 eval.py correr --modelo haiku
python3 eval.py puntuar                 # resultados/RESULTADOS.md y COLUMNAS.md
python3 eval.py juzgar                  # resultados/JUICIO.md
```

El dataset, el alineador y el juez siempre son Opus, para que cambiar el modelo bajo prueba no cambie la vara. Claude corre con `claude -p` sobre la suscripción, no con API key. Cada llamada va aislada: sin tools, sin settings, sin MCP y fuera del repo, para que no cargue instrucciones del proyecto.

## Límites conocidos

- El dataset lo escribe Claude y Claude también clasifica y juzga. Eso puede favorecer a Claude, porque reconoce su propia forma de expresar un "-1".
- 15 respuestas son pocas: diferencias de 1 o 2 celdas son ruido.
- La alineación uno a uno castiga a quien parte un tema en varios: si Claude separa "beneficios" en seguro, aguinaldos y días libres, ninguno calza con "beneficios" y esas celdas cuentan como perdidas aunque las haya leído bien.
- No medimos sarcasmo ni tono de voz, que se pierden al transcribir.

## Hallazgos (corrida del 22-11-2026)

La primera corrida (21-11) le pasaba a `claude_solo` las columnas de referencia, que ningún sistema debería conocer. Esta corrida lo corrige. Detalle en [RESULTADOS.md](resultados/RESULTADOS.md), [JUICIO.md](resultados/JUICIO.md) y [COLUMNAS.md](resultados/COLUMNAS.md).

| Condición | Opus | Sonnet | Haiku |
|---|---|---|---|
| `claude_solo` | 88% | 85% | **97%** |
| `claude_respuestas_jev` | 87% | 87% | 90% |
| `claude_pregunta_jev` | 65% | 62% | 68% |
| `jev_columnas_sabidas` (sin Claude) | 85% | | |

- `claude_solo` con Haiku es lo mejor en números y en el juicio de Opus ("Excelente", 0 errores graves). Con Opus y Sonnet baja porque parten temas en varios, no porque lean mal: el juez no les encuentra errores graves.
- `claude_respuestas_jev` queda cerca y tiene la ventaja de una sola lista de columnas por pregunta, que es lo que necesita un informe agregado. Su error típico es que Jev marca como mencionado un tema vecino que la persona no tocó.
- `claude_pregunta_jev` es la peor con los tres modelos. Sin ver respuestas, Claude propone columnas razonables pero no las que la gente usa, y Jev mete las quejas en la columna más cercana.
- Ninguna condición invirtió el signo de una opinión.
- Las columnas extra de `claude_solo` a veces son hallazgos: varios modelos sacaron solos "intención de irse" o "desconfianza", que no estaba en la referencia. El juez recomienda sumarla como columna fija.
