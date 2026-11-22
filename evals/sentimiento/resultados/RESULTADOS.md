# Resultados

15 respuestas, 60 celdas (respuesta × columna de referencia). Ver PLAN.md para qué mide cada métrica.

## Claude haiku (effort medium)

Tokens de entrada Jev: 58505

| Condición | Celdas exactas | F1 mención | MAE valor | Signo invertido | Cobertura | Columnas extra por respuesta | Nouls dudosos | Segundos |
|---|---|---|---|---|---|---|---|---|
| claude_solo | 97% | 1.00 | 0.04 | 0 | 100% | 1.5 | - | 96.3 |
| claude_pregunta_jev | 68% | 0.80 | 0.06 | 0 | 73% | 2.0 | 0 | 35.4 |
| claude_respuestas_jev | 90% | 0.97 | 0.07 | 0 | 100% | 0.2 | 1 | 37.6 |

## Sin Claude (Jev con las columnas de referencia)

Tokens de entrada Jev: 25873

| Condición | Celdas exactas | F1 mención | MAE valor | Signo invertido | Cobertura | Columnas extra por respuesta | Nouls dudosos | Segundos |
|---|---|---|---|---|---|---|---|---|
| jev_columnas_sabidas | 85% | 0.94 | 0.07 | 0 | 100% | 0.0 | 4 | 0.9 |

## Claude opus (effort medium)

Tokens de entrada Jev: 64967

| Condición | Celdas exactas | F1 mención | MAE valor | Signo invertido | Cobertura | Columnas extra por respuesta | Nouls dudosos | Segundos |
|---|---|---|---|---|---|---|---|---|
| claude_solo | 88% | 0.93 | 0.03 | 0 | 87% | 3.1 | - | 49.7 |
| claude_pregunta_jev | 65% | 0.82 | 0.16 | 0 | 82% | 2.6 | 5 | 49.1 |
| claude_respuestas_jev | 87% | 0.92 | 0.02 | 0 | 96% | 1.0 | 5 | 51.5 |

## Claude sonnet (effort medium)

Tokens de entrada Jev: 65873

| Condición | Celdas exactas | F1 mención | MAE valor | Signo invertido | Cobertura | Columnas extra por respuesta | Nouls dudosos | Segundos |
|---|---|---|---|---|---|---|---|---|
| claude_solo | 85% | 0.97 | 0.14 | 0 | 96% | 2.3 | - | 36.5 |
| claude_pregunta_jev | 62% | 0.78 | 0.12 | 0 | 73% | 3.0 | 4 | 23.7 |
| claude_respuestas_jev | 87% | 0.92 | 0.02 | 0 | 96% | 1.4 | 3 | 29.7 |

## Celdas exactas por pregunta

| Modelo | Condición | p1_jefatura | p2_carga | p3_remuneracion | p4_crecimiento | p5_equipo |
|---|---|---|---|---|---|---|
| haiku | claude_solo | 100% | 100% | 92% | 100% | 92% |
| haiku | claude_pregunta_jev | 75% | 67% | 75% | 75% | 50% |
| haiku | claude_respuestas_jev | 92% | 83% | 92% | 92% | 92% |
| jev | jev_columnas_sabidas | 83% | 75% | 92% | 92% | 83% |
| opus | claude_solo | 100% | 100% | 75% | 100% | 67% |
| opus | claude_pregunta_jev | 67% | 67% | 75% | 67% | 50% |
| opus | claude_respuestas_jev | 92% | 83% | 83% | 83% | 92% |
| sonnet | claude_solo | 100% | 92% | 75% | 92% | 67% |
| sonnet | claude_pregunta_jev | 58% | 67% | 58% | 75% | 50% |
| sonnet | claude_respuestas_jev | 92% | 83% | 75% | 92% | 92% |
