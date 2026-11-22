# Resultados

15 respuestas, 60 celdas (respuesta × tema de referencia). Ver PLAN.md para qué mide cada métrica. «Celda sin tendencia» es la celda completa sin exigir tendencia, porque pipeline_app no la extrae.

| Modelo | Condición | Celda completa | Celda sin tendencia | Dirección | Intensidad | Tendencia | F1 mención | Signo invertido | Riesgo de fuga | Emoción | Propone | Cobertura | Extras por respuesta | Nouls dudosos |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| jev | jev_columnas_sabidas | 55% | 63% | 80% | 69% | 80% | 0.93 | 0 | 100% | 93% | 100% | 100% | 0.0 | 4 |
| opus | claude_solo | 93% | 95% | 98% | 94% | 96% | 1.00 | 0 | 100% | 93% | 100% | 100% | 0.1 | - |
| opus | claude_respuestas_jev | 67% | 73% | 92% | 67% | 87% | 0.97 | 0 | 100% | 93% | 100% | 100% | 0.0 | 5 |
| opus | claude_pregunta_jev | 52% | 55% | 67% | 70% | 86% | 0.82 | 0 | 100% | 93% | 100% | 78% | 3.0 | 1 |
| opus | pipeline_app | 27% | 65% | 80% | 70% | 17% | 0.93 | 0 | 87% | 47% | 73% | 100% | 0.2 | - |
| sonnet | claude_solo | 93% | 95% | 97% | 97% | 98% | 0.98 | 0 | 100% | 93% | 100% | 96% | 0.1 | - |
| sonnet | claude_respuestas_jev | 60% | 65% | 82% | 70% | 82% | 0.94 | 0 | 100% | 93% | 100% | 100% | 1.0 | 2 |
| sonnet | claude_pregunta_jev | 48% | 50% | 60% | 71% | 85% | 0.80 | 0 | 100% | 93% | 100% | 73% | 2.2 | 0 |
| haiku | claude_solo | 90% | 92% | 95% | 94% | 98% | 0.98 | 0 | 100% | 100% | 100% | 96% | 0.2 | - |
| haiku | claude_respuestas_jev | 65% | 68% | 85% | 68% | 88% | 0.94 | 0 | 100% | 93% | 100% | 96% | 0.0 | 2 |
| haiku | claude_pregunta_jev | 52% | 57% | 67% | 74% | 74% | 0.83 | 0 | 100% | 100% | 100% | 78% | 1.6 | 1 |
| haiku | pipeline_app | 23% | 58% | 75% | 64% | 18% | 0.92 | 0 | 100% | 40% | 67% | 100% | 0.2 | - |

Jev: 105 requests, 330834 tokens de entrada.
