# Resultados

15 respuestas, 60 celdas (respuesta × columna de referencia). Ver PLAN.md para qué mide cada métrica.

## Claude haiku (effort medium)

Tokens de entrada Jev: 84555

| Condición | Celdas exactas | F1 mención | MAE valor | Signo invertido | Cobertura columnas | Columnas extra | Nouls dudosos | Segundos |
|---|---|---|---|---|---|---|---|---|
| claude_solo | 93% | 0.98 | 0.04 | 0 | 100% | 0 | - | 12.0 |
| jev_columnas_sabidas | 85% | 0.94 | 0.07 | 0 | 100% | 0 | 4 | 0.7 |
| claude_pregunta_jev | 63% | 0.77 | 0.10 | 0 | 65% | 10 | 2 | 31.8 |
| claude_respuestas_jev | 87% | 0.91 | 0.00 | 0 | 90% | 3 | 4 | 25.4 |

## Claude opus (effort medium)

Tokens de entrada Jev: 91248

| Condición | Celdas exactas | F1 mención | MAE valor | Signo invertido | Cobertura columnas | Columnas extra | Nouls dudosos | Segundos |
|---|---|---|---|---|---|---|---|---|
| claude_solo | 97% | 0.99 | 0.02 | 0 | 100% | 0 | - | 22.3 |
| jev_columnas_sabidas | 87% | 0.95 | 0.07 | 0 | 100% | 0 | 4 | 0.5 |
| claude_pregunta_jev | 72% | 0.84 | 0.08 | 0 | 80% | 14 | 2 | 16.9 |
| claude_respuestas_jev | 87% | 0.93 | 0.05 | 0 | 95% | 6 | 4 | 21.5 |

## Claude sonnet (effort medium)

Tokens de entrada Jev: 93036

| Condición | Celdas exactas | F1 mención | MAE valor | Signo invertido | Cobertura columnas | Columnas extra | Nouls dudosos | Segundos |
|---|---|---|---|---|---|---|---|---|
| claude_solo | 93% | 0.99 | 0.07 | 0 | 100% | 0 | - | 10.7 |
| jev_columnas_sabidas | 85% | 0.94 | 0.07 | 0 | 100% | 0 | 4 | 1.1 |
| claude_pregunta_jev | 67% | 0.82 | 0.14 | 0 | 75% | 14 | 4 | 29.0 |
| claude_respuestas_jev | 93% | 0.97 | 0.02 | 0 | 100% | 8 | 3 | 30.7 |

## Celdas exactas por pregunta

| Modelo | Condición | p1_jefatura | p2_carga | p3_remuneracion | p4_crecimiento | p5_equipo |
|---|---|---|---|---|---|---|
| haiku | claude_solo | 100% | 92% | 92% | 92% | 92% |
| haiku | jev_columnas_sabidas | 83% | 75% | 92% | 92% | 83% |
| haiku | claude_pregunta_jev | 67% | 67% | 58% | 75% | 50% |
| haiku | claude_respuestas_jev | 92% | 83% | 67% | 92% | 100% |
| opus | claude_solo | 100% | 92% | 100% | 100% | 92% |
| opus | jev_columnas_sabidas | 83% | 83% | 92% | 92% | 83% |
| opus | claude_pregunta_jev | 83% | 58% | 83% | 83% | 50% |
| opus | claude_respuestas_jev | 92% | 92% | 75% | 92% | 83% |
| sonnet | claude_solo | 100% | 92% | 92% | 100% | 83% |
| sonnet | jev_columnas_sabidas | 83% | 75% | 92% | 92% | 83% |
| sonnet | claude_pregunta_jev | 83% | 67% | 58% | 75% | 50% |
| sonnet | claude_respuestas_jev | 92% | 92% | 100% | 92% | 92% |
