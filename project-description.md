# Audem

**La encuesta que se responde con un audio de WhatsApp y le devuelve a cada uno lo que dijo el resto del grupo.**

## El problema

Los grupos grandes, como un comité de vivienda, una junta de vecinos o un curso, se coordinan por WhatsApp. Cuando hay que decidir algo, llegan decenas de audios que nadie alcanza a escuchar enteros, y las encuestas de formulario dejan fuera justo lo importante: el porqué, el tono y lo que a la gente le preocupa de verdad.

## Cómo funciona

1. **Pregunta por WhatsApp.** Audem envía una pregunta y cada persona responde con un audio, sin instalar nada ni crear una cuenta.
2. **De audio a frases.** Cada audio se transcribe y se resume en frases clave, cada una con su cita textual, su emoción y su intensidad.
3. **Mapa en vivo.** Las frases se agrupan por similitud en un mapa que se actualiza a medida que llegan respuestas: qué temas aparecen, cuánta gente está en cada uno y con qué emoción.
4. **Segunda ronda cruzada.** Un agente le escribe a cada persona con lo que dijo el grupo que piensa distinto y le pregunta qué le respondería. Las nuevas respuestas muestran qué ideas aceptan ambos lados.

## Por qué es multiplayer

Con una sola persona no hay mapa, ni grupos, ni contraparte. La pregunta que recibe cada uno en la segunda ronda depende de lo que dijeron los demás, así que Audem mejora con cada persona que responde.

## Stack

WhatsApp vía Kapso · transcripción de voz · LLM para extraer frases, emoción y escribir la segunda ronda · embeddings y clustering para el mapa · panel web en vivo.
