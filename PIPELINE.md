# Pipeline de Audem: de la respuesta al mapa

## En simple

1. **Entra.** La persona abre el link de la encuesta y responde con un audio o escribiendo. No crea cuenta.
2. **Se transcribe.** Si es audio, se convierte a texto.
3. **Se lee de dos formas a la vez.**
   - Para el mapa: se sacan de 1 a 5 ideas clave, cada una con su cita textual, la emoción y qué tan fuerte la dice.
   - Para contar: se anota cada tema que toca la persona y qué opina de cada uno (a favor, en contra o mixto), con cuánta fuerza, si dice que mejoró o empeoró y si propone algo.
4. **Se junta con el resto del grupo.** Con las primeras 9 respuestas se reordena todo cada vez; desde la 10 los grupos ya están armados y cada respuesta nueva solo se suma al grupo que le corresponde, al tiro y en paralelo con las demás. Las ideas se agrupan por postura y forman el mapa en vivo ("sueldo bajo" y "sueldo mejorado" quedan como grupos distintos). Los temas se juntan en tópicos de qué se habla ("sueldo"), para contar cuántos están a favor y en contra de cada cosa.
5. **Sale.** La pantalla se actualiza sola con el mapa y cuánta gente hay en cada grupo. Los conteos por tópico, las propuestas y las emociones ya se guardan, pero falta la pantalla que los muestre.

Por ejemplo, alguien dice "la comida bien, pero el café se acabó a las cuatro de la mañana y nadie lo repuso". En el mapa cae en el grupo de la comida. En los tópicos queda como comida: mixto, con la propuesta "reponer el café". Con texto, la respuesta aparece en el mapa en unos 15 segundos.

Todo el backend vive en Convex. [convex/encuestas.ts](convex/encuestas.ts) tiene las queries y mutaciones, [convex/procesar.ts](convex/procesar.ts) las acciones que llaman a modelos y [convex/extraccion.ts](convex/extraccion.ts) los prompts y schemas, que los evals también importan para medir exactamente lo mismo que corre la app. El porqué de cada decisión, con números, está en [evals/README.md](evals/README.md).

## Detalle técnico

```
texto ─────────────────────────────┐
audio → transcribir (Whisper) ─────┤
                                   ▼
                                extraer (Opus 5.5 low) ──→ frases ──→ agrupar (Haiku 5.5 low) ──→ temas de postura ──→ query mapa
                                   │
                                   └─→ analizar (Haiku 5.5 medium) ──→ analisis ──→ normalizar (Haiku 5.5 low) ──→ tópicos neutros ──→ query topicos
```

Hay dos ramas que parten de la misma respuesta. La de frases arma el mapa en vivo, agrupado por postura ("sueldo bajo", "sueldo mejorado"). La de análisis mide qué opina cada persona de cada tópico ("sueldo": positivo, negativo o mixto), y eso se puede contar en volumen. Las dos corren en paralelo, y si la de análisis falla, el mapa no se entera.

## Paso a paso

### 1. Entra la respuesta

La persona abre la encuesta por su slug (`/<slug>`) y responde desde la web, con texto o grabando un audio. No tiene que crear cuenta: el navegador genera un id anónimo de participante.

- **Texto:** la mutación `responder` revisa que la encuesta esté abierta, que el texto tenga entre 3 y 6000 caracteres y que el id de participante no pase de 64. Inserta una fila en `respuestas` con `estado: "procesando"` y agenda `extraer`.
- **Audio:** la web pide una URL con `urlSubida`, sube el audio al storage de Convex y llama a `responderAudio`. Esa mutación revisa que la encuesta esté abierta y que el audio pese menos de 20 MB; si algo falla, borra el audio. Inserta la respuesta con `texto: ""` y `estado: "transcribiendo"`, y agenda `transcribir`.

### 2. Transcribir (solo audio)

`transcribir` baja el audio del storage y lo manda a Whisper large v3 turbo por OpenRouter, en español. Elige la extensión según el formato, porque Safari graba mp4 y Chrome y Firefox graban webm. Si la transcripción sale vacía o con menos de 3 caracteres, la respuesta queda en `estado: "error"`. Si sale bien, `guardarTexto` guarda hasta 6000 caracteres, pasa a `estado: "procesando"` y agenda `extraer`.

### 3. Extraer frases (Opus 5.5, effort low)

`extraer` es el punto por el que pasan todas las respuestas con texto. Lo primero que hace es agendar `analizar` (paso 5). Después le manda a Opus la pregunta y la transcripción, con la instrucción de sacar de 1 a 5 ideas clave sin inventar nada. Para cada idea devuelve:

- `texto`: la idea en una frase de máximo 12 palabras
- `cita`: el fragmento textual que la respalda
- `emocion`: una de una lista cerrada de 22, que la web divide en positivas, negativas y neutras
- `intensidad`: de 0 a 1
- `conceptos`: 1 o 2 palabras clave, reutilizando los mismos términos entre frases

`guardarFrases` borra las frases anteriores de esa respuesta (por si se reprocesa), inserta las nuevas, deja la respuesta en `estado: "listo"` y pide reagrupar. Si Opus falla, la respuesta queda en `estado: "error"` y el admin puede reprocesarla.

### 4. Agrupar en temas de postura (Haiku 5.5, effort low)

`pedirAgrupar` guarda un token con la hora en la encuesta y agenda `agrupar` para 1,5 segundos después. Si en ese lapso llega otra respuesta, el token cambia y solo corre el último agrupamiento. Así una ráfaga de respuestas no dispara una llamada por cada una.

`agrupar` manda en **una sola llamada** todas las frases de la encuesta junto con los temas que ya existen. Haiku devuelve entre 2 y 8 temas, cada uno con un nombre que dice la postura (no solo el tópico), un resumen de una oración y coordenadas x e y entre -3 y 3, donde los temas parecidos quedan cerca. También devuelve a qué tema va cada frase. Para que el mapa no salte en cada vuelta, se le pide reutilizar los ids de los temas que sigan calzando. `guardarTemas` reemplaza los temas y anota el tema de cada frase.

**Desde la respuesta 10 ya no se reagrupa.** Con las 25 respuestas sintéticas de Edo, los temas se estabilizan en unos 8 hacia la respuesta 6 a 8. Después, reagrupar todo no suma temas y solo cambia de grupo cerca del 10% de lo que ya estaba agrupado ([evals/hackaton/CONVERGENCIA.md](evals/hackaton/CONVERGENCIA.md)). Por eso `UMBRAL_CONVERGENCIA` es 9: converge en 8, más uno de margen. Desde la respuesta 10, `guardarFrases` agenda `asignar` de inmediato, sin la espera de 1,5 segundos. `asignar` le pasa a Haiku solo las frases de esa respuesta y los temas existentes, y cada frase va a un tema existente; solo si de verdad no calza en ninguno se crea un tema nuevo, sin tocar los demás. Cada respuesta asigna por su cuenta, así que varias corren en paralelo. Si el último reagrupamiento completo termina después de cruzar el umbral, al final barre las frases que quedaron sin tema.

### 5. Analizar la respuesta completa (Haiku 5.5, effort medium)

`analizar` corre en paralelo con `extraer`. Le manda a Haiku la pregunta y la transcripción completa, y Haiku devuelve los temas que la persona toca, con nombres propios de lo que dice y no de una lista genérica. Para cada tema trae:

- `direccion`: positivo, negativo, neutro o mixto. Es lo que opina hoy, y lo que cuenta en broma no se toma como queja.
- `intensidad`: leve, moderada o fuerte, solo si es positivo o negativo
- `tendencia`: mejora, igual o empeora, solo si la persona dice que algo cambió; si no, `no_dice`
- `cita`: el fragmento textual

Para la respuesta completa trae además la emoción que domina y la mejora concreta que propone, si propone alguna. `guardarAnalisis` lo guarda como una fila en `analisis` (reemplaza la anterior si se reprocesa) y pide normalizar. Si Haiku falla, solo queda en el log: la respuesta no pasa a error.

### 6. Normalizar en tópicos neutros (Haiku 5.5, effort low)

Cada respuesta nombra los temas a su manera ("equipo", "compañeros de equipo", "equipo de trabajo"), así que para contarlos hay que juntarlos. `normalizar` usa el mismo token de 1,5 segundos que `agrupar`, y en una sola llamada recibe todos los temas libres de todas las respuestas de la encuesta, más los tópicos que ya existen. Devuelve el diccionario completo de tópicos y a qué tópico va cada tema.

Un tópico es de qué se habla, no qué se opina: "cobrar por usar el quincho" y "no cobrar" van al mismo tópico con direcciones opuestas. No hay una lista previa; los tópicos salen de las respuestas, así que funciona con cualquier pregunta. El prompt pide entre 12 y 18 tópicos cuando hay muchas respuestas y separar problemas que se arreglan de forma distinta. `guardarTopicos` reemplaza los tópicos de la encuesta y anota en cada tema de `analisis` su `topicoId`.

Con el mismo umbral, desde la respuesta 10 `asignarTopicos` solo asigna los temas de la respuesta nueva a los tópicos existentes. Los tópicos se estabilizan en unos 18 hacia la respuesta 7 u 8, y después siguen apareciendo algunos de cola, que se crean como tópicos nuevos.

### 7. Lo que sale

Las queries de Convex son reactivas: cualquier pantalla suscrita recibe los cambios apenas se guardan, sin hacer polling.

- **`mapa({ slug })`** alimenta el panel en vivo y la vista Flujo. Entrega la pregunta, el total de participantes, los temas con su posición y cuántas personas tiene cada uno, las frases con su tema, cita, emoción e intensidad, y los textos de las respuestas.
- **`topicos({ slug })`** entrega, por tópico, cuántas personas lo mencionan, cuántas están positivas, negativas, mixtas o neutras, cuántas dicen que mejoró o empeoró, y una celda por persona con sus citas. Si una persona dice cosas buenas y malas del mismo tópico, su celda queda mixta. Además trae la lista de propuestas y el conteo de emociones. Todavía no hay una pantalla que la use (ver Pendientes en [HACK.md](HACK.md)).

### Herramientas del admin

Con la clave de admin (`ADMIN_KEY` en el entorno de Convex) se crean encuestas (el slug sale de la pregunta), se abren o cierran, y se puede borrar una respuesta, lo que borra sus frases, su análisis y su audio y vuelve a agrupar y normalizar. También se puede reprocesar una respuesta, que vuelve a transcribir si no tiene texto o a extraer si ya lo tiene.

### Tiempo hasta que aparece en el mapa

Medido con una llamada por paso y una encuesta de 15 respuestas ([evals/hackaton/latencia.ts](evals/hackaton/latencia.ts)):

| Paso | Tiempo |
|---|---|
| extraer (Opus low, respuesta de 450 palabras) | ~5 s |
| espera antes de agrupar | 1,5 s |
| agrupar (Haiku low, 72 frases) | ~8 s |
| **Total para una respuesta de texto** | **~15 s** |

Con audio se suma la transcripción, que no medimos. La frase aparece en el mapa recién cuando agrupar le asigna tema. Desde la respuesta 10, en vez de la espera y el agrupar completo corre `asignar`, una llamada chica con solo las frases nuevas, así que el tiempo deja de crecer con la encuesta (no lo medimos). Agrupar devuelve la asignación de todas las frases, así que tarda más a medida que crece la encuesta. Con Opus low tardaba unos 16 s; por eso lo pasamos a Haiku.

Analizar (~6 s) y normalizar (~8,5 s con Haiku low; ~30 s con medium) corren aparte y no frenan el mapa.

### Costo

Medido con 15 respuestas de 41 a 450 palabras, con los modelos de antes del cambio a Haiku low ([evals/hackaton/COSTO.md](evals/hackaton/COSTO.md)):

| Paso | Costo por respuesta |
|---|---|
| extraer (Opus low) | US$ 0,014 |
| agrupar (Opus low, antes del cambio) | US$ 0,036 |
| analizar (Haiku medium) | US$ 0,0006 |
| normalizar (Haiku medium, antes del cambio) | US$ 0,0024 |

Con agrupar y normalizar en Haiku low, el total debería quedar bajo US$ 0,02 por respuesta, casi todo en extraer. Ese número es estimado: no volvimos a medir el costo después del cambio. Agrupar y normalizar reenvían todo lo de la encuesta en cada respuesta nueva, así que su llamada crece con el número de respuestas, y cada uno alcanza para unos cientos de frases o temas antes de tener que pasar a embeddings y clustering. La transcripción (unos US$ 0,0002 por minuto) no está incluida.

## Lo que pivoteamos

### Producto

- **Viernes 21, de 14:00 a 18:00: Comité.** Un copiloto para comités de vivienda que postulan a un DS49 colectivo. Quedaron un estado de producto, el mapa de leyes y decretos, las pantallas del Figma, una base con FastAPI, Postgres y Next.js, y una propuesta de canal por WhatsApp con Kapso.
- **Viernes 21, 22:34: reset.** Volvimos el repo al estado inicial y escribimos [AGENTS.md](AGENTS.md) para que los agentes cambien sin miedo y sin código legacy.
- **Viernes 21, 23:00: Audem.** Giro a una encuesta multiplayer: cada uno responde con un audio, se arma un mapa en vivo de lo que piensa el grupo y en una segunda ronda cada persona recibe lo que dijo el que piensa distinto. Del Comité quedó la idea de un grupo grande que se coordina por WhatsApp.
- **Domingo 22: encuestas de opinión.** El pitch se enfoca en reemplazar las respuestas discretas de encuestas como Cadem o Criteria por opiniones continuas: cada persona responde con un audio y el mapa muestra posturas que salen de lo que dice la gente. La segunda ronda cruzada sale del pitch.

### Stack

| Antes | Ahora | Por qué |
|---|---|---|
| FastAPI, Postgres y Next.js en Docker, deploy en Render | Convex y React con Vite, deploy en Vercel | Convex trae base de datos, storage de audio, acciones y queries reactivas en un solo lugar. El panel se actualiza solo, sin consultar cada 2 o 3 segundos |
| Responder por WhatsApp con Kapso como canal principal | Responder en la web, con micrófono o texto | El sandbox de Kapso solo responde a celulares registrados y Meta bloqueó el número propio. El bot de [whatsapp/](whatsapp/) quedó como base, sin conectar a Convex |
| Sin QR: el link wa.me por Discord | Admin con QR y rutas por slug | Con la web, el QR es la forma más rápida de que la sala entre a responder |
| Transcripción con "el STT que tenga key el equipo" | Whisper large v3 turbo por OpenRouter, en el servidor | Una sola key para el servidor, sin depender del navegador, por unos US$ 0,0002 por minuto. No medimos su calidad con español chileno |
| Embeddings, UMAP y k-means para el mapa | Una sola llamada a Opus que agrupa todo y pone las coordenadas | Con pocos cientos de frases es más simple y los temas salen con nombre. Pasar a embeddings queda para cuando haya más volumen |

### Análisis

| Probamos | Quedó | Por qué |
|---|---|---|
| Escala única de sentimiento de -2 a 2 | Dirección, intensidad y tendencia por separado | El 0 juntaba neutro con mixto y no había dónde poner si algo mejora o empeora |
| Primera versión del eval, donde Claude veía las columnas de referencia | Claude no ve la referencia; un alineador ciego empareja | Ver la referencia inflaba los resultados de Claude |
| Jev (TypeSafe) clasificando contra columnas | Claude lee la respuesta completa | Claude solo saca 90 a 93% de celdas completas; las combinaciones con Jev, 48 a 67% |
| Grilla de columnas armada desde la pregunta | Temas libres sacados de cada respuesta | La grilla fue lo peor que medimos: le faltan columnas para temas centrales |
| Solo frases con emoción (Opus) | Frases para el mapa y, al lado, el análisis de Haiku por respuesta | Las frases miden peor por persona (65% contra 92%) y no traen tendencia ni propuestas |
| Deducir la dirección a partir de la emoción | Haiku marca la dirección explícitamente | Una frase positiva dentro de un tema negativo volvía mixta toda la celda |
| Pasarle la salida de Haiku a Opus como contexto | No se hace por ahora | Podía hacer que Opus copiara los temas de Haiku y se perdiera la agrupación por postura |
| Normalizar sin regla de granularidad | Regla de 12 a 18 tópicos y separar lo que se arregla distinto | Sin regla, Haiku armó 34 tópicos y Opus 11. Un juez a ciegas propuso 16 |
| Opus para normalizar | Haiku | Opus casi duplicaba el costo total por respuesta (US$ 0,094 contra 0,053) |
| Normalizar con Haiku medium | Haiku low | Con la regla de rango, low arma 18 a 20 tópicos en ~8,5 s; medium tardaba ~30 s con 15 respuestas |
| Agrupar con Opus low | Haiku low | Agrupar define cuándo aparece la respuesta en el mapa: Haiku low tarda ~8 s contra ~16 s y arma temas parecidos, aunque a veces junta dos (por ejemplo infraestructura y comida). Medido solo en tiempo, sin eval de calidad |
| Reagrupar todo con cada respuesta | Reagrupar hasta la respuesta 9 y después solo asignar | Los grupos convergen hacia la respuesta 8; después reagrupar solo rota ~10% de lo agrupado y hace que cada llamada crezca con la encuesta. Asignar es una llamada chica por respuesta, en paralelo |
