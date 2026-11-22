# Audem

**Encuestas de opinión que se responden con un audio, como en WhatsApp, y muestran lo que piensa la gente en un mapa, no en un porcentaje.**

## El problema

Encuestas como Cadem o Criteria reducen cada opinión a sí, no o una alternativa cerrada. Pero una opinión rara vez cabe en una casilla: apoya una parte, le preocupa otra y propone algo distinto. El matiz y el porqué se pierden.

## Cómo funciona

1. **Pregunta abierta.** Audem hace una pregunta y cada persona responde con un audio, como ya habla por WhatsApp, sin instalar nada.
2. **De audio a postura.** Cada audio se transcribe y se lee entero: de qué temas habla, qué piensa de cada uno, qué propone y con qué emoción lo dice.
3. **Mapa en vivo.** Las ideas se agrupan por postura en un mapa que se actualiza con cada respuesta: qué voces aparecen, cuánta gente hay en cada una y qué tan cerca están entre sí.
4. **Categorías que nadie fijó.** No hay alternativas fijadas de antemano: los temas y posturas salen de lo que dice la gente y se reordenan con cada respuesta, así que la representación se ajusta a la pregunta.

## Por qué es multiplayer

Con una sola persona no hay mapa ni posturas que comparar. Cada respuesta cambia cómo se agrupan las demás, así que el retrato de lo que piensa la ciudadanía se vuelve más fino con cada voz que se suma.

## Stack

Web con micrófono o texto para responder · Whisper para transcribir · Claude (Opus y Haiku) para extraer posturas y agrupar el mapa · Convex con queries en vivo · React.
