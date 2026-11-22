# HACK.md

## Deadline
Entrega: POR CONFIRMAR (¿domingo 22-nov en la mañana?) · Formato del pitch: POR CONFIRMAR (min, demo en vivo, Q&A)

## Equipo
- Kaina: Kapso (webhook entrante, descarga de audio, respuestas por WhatsApp)
- Gonzalo: STT + Jev/LLMs para extraer frases, emoción y clusters
- Diego: visualizaciones, deploy y ronda 2 (mensaje desde el cluster opuesto)
- Edo: datos sintéticos (rotulados como sintéticos en la demo)
- Josefa: ausente por ahora

## Contratos entre lanes
Kaina → Gonzalo: `respuesta {id, participante_id, ronda, audio_url, transcripcion|null, creado_en}`
Gonzalo → Diego: `frase {id, respuesta_id, texto, cita, emocion, intensidad 0-1, cluster_id}` y `cluster {id, nombre, resumen, n, x, y}`
Diego lee `GET /api/mapa` → `{clusters: [...], frases: [...], total_participantes}` y consulta cada 2-3 s.

## Stack (propuesta)
Canal: WhatsApp vía Kapso (webhook entrante + envío) · Backend: FastAPI + Postgres · STT: el que ya tenga key el equipo (español chileno) · LLM: Claude para extracción y nombres de clusters · Embeddings + UMAP + k-means para el mapa · Front: Next.js, pantalla en vivo que consulta cada 2-3 s · Deploy: Render (URL: pendiente)

## Idea
One-liner (borrador): Para grupos grandes que ya se coordinan por WhatsApp (ej. un comité de vivienda), Audem que convierte sus audios en un mapa en vivo de lo que piensa el grupo y le devuelve a cada uno lo que dijeron los demás, porque en un chat de 100 personas nadie escucha 100 audios.

Demo en 3 frases (borrador):
1. A y B abren el link wa.me, responden la pregunta con un audio de WhatsApp y en ~15 s su frase aparece en un cluster en la pantalla grande.
2. Cuando hay suficientes respuestas, cada uno recibe por WhatsApp la postura del cluster opuesto ("otros dicen X, ¿qué les responderías?").
3. A responde con otro audio y en pantalla se ve el puente: qué frases aceptan ambos lados.

Forma: asincrónico por rondas · personas + agente (mediador que escribe la ronda 2) · N mínimo: ~6 para que existan clusters
Por qué es peor con una sola persona: no hay clusters ni ronda 2; la pregunta que te llega depende de lo que dijeron los demás.
Elemento técnico difícil: pipeline audio → texto → frases + emoción → clusters en vivo, y ronda 2 personalizada generada desde el cluster opuesto de cada persona.
Diferencia vs lo que ya existe: Pol.is y Talk to the City son texto y web; esto es voz por WhatsApp (donde ya está el grupo) y cierra el ciclo devolviéndole a cada uno lo que dijo el otro lado.

## Estado compartido
| Entidad | Quién escribe | Quién ve | Notas |
|---|---|---|---|
| participante (teléfono hash, ronda actual) | webhook Kapso | backend | sin nombre |
| respuesta (audio_url, transcripción, ronda) | webhook + worker STT | pantalla | audio se puede borrar tras transcribir |
| frase (texto, cita, emoción, intensidad, embedding, cluster_id) | worker LLM | pantalla | 1-5 frases por respuesta |
| cluster (nombre, resumen, x/y) | job de clustering | pantalla + ronda 2 | se recalcula al entrar respuestas |
| mensaje ronda 2 (participante, texto) | agente mediador | participante por WhatsApp | |

## Scorecard
| Criterio | Peso | Score | Pero | Acción |
|---|---|---|---|---|
| Técnico | 25 | | | |
| Ambición | 20 | | | |
| Ejecución | 20 | | | |
| Impacto | 20 | | | |
| Original | 15 | | | |

## Riesgos
- Kapso: plantillas de envío masivo requieren aprobación de Meta → que la gente escriba primero (QR/wa.me) para abrir la ventana de 24 h.
- Descargar el audio entrante desde Kapso y transcribirlo rápido (spike de 1 h).
- README dice "Track: Hardware": confirmar con organización que competimos en Multiplayer (no editar README).

## Decisiones (con hora)
- 21-nov 23:00: propuesta de giro multiplayer (ronda 2 cruzada + pantalla en vivo). Pendiente de confirmar por el equipo.
- 21-nov 23:15: sin QR; el link wa.me se comparte por el Discord del hackatón. Lanes asignadas (Kaina, Gonzalo, Diego).
- 21-nov ~23:45: datos sintéticos de Edo en `data/respuestas-sinteticas.json` (25 respuestas sobre la experiencia en la hackathon, campos id/participante/texto; `texto` = transcripción ronda 1). Rotular como sintéticos en la demo.
- 21-nov 23:30: nombre Audem (Cadem + audio). jsonc y project-description.md llenos; deploy-url pendiente (Diego).

## Lo que dijeron mentores/jueces
