> Juicio a ciegas de un subagente Opus sin contexto sobre [NORMALIZACION.md](NORMALIZACION.md). No sabía qué modelo era cada sistema: A es Opus 5.5 con effort low y B es Haiku 5.5 con effort medium.

# Juicio de los sistemas A y B

Leí las 15 respuestas completas antes de mirar los tópicos. El criterio fue el que pidió la organizadora: un tópico dice de qué se habla (sin opinión en el nombre), junta lo que es lo mismo, separa lo que tiene un arreglo distinto y sirve para tomar una decisión.

## Sistema A (Opus 5.5 low) (11 tópicos)

### 1. Duplicados

Casi no tiene. Los más cercanos:

- "nivel técnico propio" y parte de "equipo": h11 dice "el equipo bien, pero yo no estoy rindiendo nada" y A lo deja en equipo ("rendimiento en el hackatón"), cuando es lo mismo que "nivel técnico propio".
- "otros participantes" y "experiencia general": los temas "ambiente del evento", "ambiente de la hackatón" y "ambiente del fin de semana" están en experiencia general, y "contactos y conocer gente" en otros participantes. Las dos cosas hablan del ambiente y de la gente.

### 2. Mezclas

Este es el problema grande de A. Tres tópicos son bolsas:

- **organización y lugar** (10 personas, 7 negativas) junta wifi (h04, h07), estacionamiento (h05), ruido de noche (h08, h10), duchas (h10), frío al lado de la puerta (h11), audio de la charla de apertura (h13), créditos de API (h09), enchufe arreglado (h12) y "la organización bien" (h03). Cada cosa tiene un responsable y un arreglo distinto. Con "7 negativas" la organizadora no sabe si arreglar el wifi, poner duchas o hablar con el equipo del reguetón. Peor aún, mezcla las mejores menciones de la organización (créditos rápidos, enchufe "al tiro") con las quejas del lugar.
- **avance del proyecto** (8 personas, 16 temas) junta Docker en Mac (h04), rate limit de la API (h09), Kubernetes de un compañero (h03), pivots (h04), uso de shadcn contra el diseño propio (h06), el pitch (h15) y los datos sucios de micros (h10). El pitch es lo único accionable para la organización (ensayos, tiempo) y queda escondido.
- **experiencia general** se tragó "aprendizaje de Convex" (h12), "presión por ganar" (h10) y "resultado en competencia" (h04). Las tres tienen tópico propio posible y ninguna es "experiencia general".
- **cansancio** junta sueño, estrés emocional (h03 llorando en el baño por el equipo), resfrío con fiebre (h11) y "salir antes del pitch". El resfrío viene del frío del lugar, no del sueño.

### 3. Asignaciones equivocadas

- "hablar en público" (h15) en **nivel técnico propio**. Es nervio por el pitch, no nivel técnico.
- "créditos de la organización" (h09) en **organización y lugar** está bien, pero "límite de uso de la API" queda en avance del proyecto: el mismo episodio partido en dos.
- "tarea de scraping" (h02) en **avance del proyecto** con −. h02 lo cuenta como algo bueno del equipo ("me dejaron hacerla aunque me demoré el triple").
- "rendimiento en el hackatón" (h11) en **equipo**.
- "salir antes del pitch" (h11) en **cansancio** es defendible, pero es una consecuencia, no un tema.

### 4. ¿Le sirve a la organizadora?

Sirve para contar de qué se habla a grandes rasgos: equipo, comida, mentores y cansancio salen bien contados. Para decidir, no: los tres tópicos más grandes (organización y lugar, experiencia general, avance del proyecto) son demasiado amplios. No podría decidir "el wifi es el problema número uno" ni "hay que dar información de estacionamiento", porque todo eso vive en una celda con 7 negativos. Para la segunda ronda tampoco sirve bien: mostrarle a h05 (estacionamiento) que h12 opina distinto sobre "organización y lugar" (le gustó el lugar) no es un contraste real, hablan de cosas distintas.

### 5. Conteos revisados contra el texto

| Celda | A dice | Texto | ¿Cuadra? |
|---|---|---|---|
| h03 · organización y lugar | 0 | "la organización bien, la comida bien, el lugar bien" | No, es + |
| h10 · experiencia general | ± | Lo disfruta "mucho más", va a volver. Lo negativo es del año pasado | No, es + (con mejora) |
| h02 · avance del proyecto | − | Agradece que le pasaran el scraping. Cambiaron harto la idea y eso fue bueno | No, a lo más ± |
| h11 · equipo | ± | "El equipo bien, no tengo nada contra ellos". Lo negativo es su propio rendimiento | No, es + |
| h13 · cansancio | − | "dormí debajo de la mesa... amanecí con la cara marcada jaja" | Dudoso, es más 0 o ± |
| h10 · comida y bebida | + | "el almuerzo de ayer buenísimo, el de hoy medio frío pero bien" | Pasable, más bien ± |
| h14 · nivel técnico propio | − | "me siento un poco atrás... pero puedo seguirles el ritmo si me esfuerzo" | No, es ± |
| h06 · mentoría | ± | La mentora le dio la razón. Con la mentora le fue bien; la rabia es con el equipo | Dudoso, es + |
| h01 · comida y bebida | ± | Comida bien, café se acabó | Cuadra |
| h09 · avance del proyecto | − | Rate limit, backend cambiado, respuestas "más tontas" | Cuadra |

Además faltan menciones: h03 dice "la comida bien" y no aparece en comida; h02 dice "cansado pero bien" y no aparece en cansancio; h10 habló con gente de otros equipos y no aparece en otros participantes.

## Sistema B (Haiku 5.5 medium) (34 tópicos)

### 1. Duplicados

Muchos. Para 15 personas, 34 tópicos y 20 con una sola persona:

- **experiencia general** y **ambiente del evento**.
- **comida** y **café y bebidas** (lo mismo para quien decide: el catering).
- **cansancio y desgaste** y **salud y malestar**.
- **nivel técnico propio**, **rendimiento personal**, **experiencia previa valorada** y **aprendizaje de tecnologías nuevas**: todos son "cómo me siento con mi nivel y qué aprendí".
- **apoyo entre participantes** y **conocer gente y contactos**.
- **problemas con herramientas técnicas**, **decisiones de infraestructura**, **duración de tareas técnicas**, **calidad de respuestas del sistema** y **datos del proyecto**: todos son obstáculos técnicos del proyecto, cada uno con una persona.
- **estacionamiento y transporte** (incluye "costo del pasaje") y **beca de viaje**: h14 queda partida en dos tópicos por la misma queja.
- **resultado en competencia** y **punto de partida del equipo** podrían ir juntos como "competencia y equidad".

### 2. Mezclas

Pocas, porque separa casi todo:

- **estacionamiento y transporte** junta el auto de h05 con el pasaje Temuco-Santiago de h14, mientras deja la beca aparte.
- **organización y lugar** todavía junta el frío del sector (h11, queja del lugar) con los créditos de API (h09) y la atención del staff (h12).
- **diseño propio y su uso** junta el conflicto con el equipo de h06 con la validación de la mentora. Por eso h06 no cuenta en equipo ni en mentores.

### 3. Asignaciones equivocadas

- "salir antes del pitch" (h11) en **demo y presentación**. h11 se iría por la fiebre; no habla del pitch.
- "mentor que criticó la idea" (h02) en **idea del proyecto y feedback** y "validación del diseño por mentora" (h06) en **diseño propio**. Resultado: B cuenta 3 personas que hablan de mentores cuando son 5.
- "trato del equipo" y "rol de diseñadora" de h06 fuera de **compañeros de equipo**. El segundo conflicto de equipo más fuerte de las 15 respuestas no cuenta como tema de equipo.
- "presión por ganar" (h10) en **resultado en competencia** con −. h10 dice que este año le da lo mismo ganar y que así lo disfruta más.

### 4. ¿Le sirve a la organizadora?

Sirve para encontrar quejas concretas y accionables: wifi (2), ruido nocturno (2), duchas, charla de apertura, beca de viaje y estacionamiento quedan visibles. Eso A no lo da. Pero no sirve para contar personas por tópico: con 20 tópicos de una persona no hay contraste para la segunda ronda, y los tópicos que sí importan quedan subcontados (mentores 3 en vez de 5, equipo sin h06). Leer 34 filas para 15 respuestas tampoco es mirar un resumen.

### 5. Conteos revisados contra el texto

| Celda | B dice | Texto | ¿Cuadra? |
|---|---|---|---|
| h03 · organización y lugar | 0 | "la organización bien... el lugar bien" | No, es + |
| h10 · resultado en competencia | − | "me da un poco lo mismo", lo negativo era el año pasado | No, es + (con mejora) |
| h11 · demo y presentación | 0 | Se iría por la fiebre | Asignación equivocada |
| h01 · comida | + | "La comida bien" | Cuadra (el café va aparte con −) |
| h11 · compañeros de equipo | + | "El equipo bien" | Cuadra |
| h14 · experiencia general | + | "no me arrepiento para nada" | Cuadra |
| h13 · cansancio y desgaste | − | Lo cuenta riéndose | Dudoso, 0 o ± |
| h04 · resultado en competencia | 0 | "Si ganamos algo va a ser de puro milagro", lo dice con humor | Cuadra |
| h09 · demo y presentación | 0 | "Veremos en el pitch" | Cuadra |
| h02 · duración de tareas técnicas | − | Lo cuenta como algo bueno del equipo | No, + o ± |

También le falta h03 en comida.

## Mi lista de tópicos (16)

Regla que usé: un tópico por cada cosa que tendría un arreglo o un responsable distinto. Uno con una sola persona vale solo si es una queja concreta que se puede arreglar. "Experiencia general" no es tópico; la nota global de cada persona va como atributo aparte.

| # | Tópico | Qué entra | Personas |
|---|---|---|---|
| 1 | Equipo y dinámica de trabajo | cómo se llevan, reparto de tareas, integrante que se fue, rol de la diseñadora, decisiones del equipo (Kubernetes) | h02 +, h03 −, h04 +, h06 −, h08 +, h10 +, h11 +, h15 + (8) |
| 2 | Mentoría | frecuencia, calidad y momento de las visitas de mentores | h02 ±, h03 −, h06 +, h10 + mejora, h13 + (5) |
| 3 | Comida y bebida | comidas, café, opciones veganas, cantidad de pizza | h01 ±, h03 +, h10 ±, h11 ±, h13 ±, h14 +, h15 + (7) |
| 4 | Cansancio, sueño y salud | horas sin dormir, dónde dormir, estrés, resfrío | h01 −, h02 ±, h03 −, h08 −, h11 −, h13 0 (6) |
| 5 | Wifi | caídas y zonas sin señal | h04 −, h07 − (2) |
| 6 | Ruido de noche | música y ruido en la madrugada | h08 −, h10 − (2) |
| 7 | Lugar e instalaciones | el lugar en sí, temperatura, duchas, enchufes | h03 +, h10 −, h11 −, h12 + (4) |
| 8 | Organización y comunicación | atención del staff, apoyo con créditos, charla de apertura y reglas | h03 +, h09 +, h12 +, h13 − (4) |
| 9 | Llegar al evento | estacionamiento, costo del viaje, beca de viaje para regiones | h05 −, h14 − (2) |
| 10 | Idea y cambios de rumbo | pivots, feedback que cambió la idea, modelo de cobro | h02 ±, h04 ±, h13 + (3) |
| 11 | Obstáculos técnicos | Docker, rate limit de la API, infraestructura, datos sucios | h03 −, h04 −, h09 −, h10 + (4) |
| 12 | Pitch y demo | preparación, nervios, qué van a mostrar | h03 0, h09 0, h15 − (3) |
| 13 | Nivel propio y aprendizaje | sentirse atrás o a la altura, experiencia previa que sirve, lo que aprendió, rendimiento personal | h02 ±, h04 +, h08 +, h11 −, h12 +, h14 ± (6) |
| 14 | Ambiente y gente de otros equipos | ambiente, contactos, apoyo entre participantes | h03 +, h06 +, h10 +, h14 ± (4) |
| 15 | Competencia y equidad | ganar o no, equipos con código previo | h04 0, h10 + mejora, h12 − (3) |
| 16 | Quién participa | primera vez, venir solo, edad, gente de regiones | h02 +, h08 −, h14 − (3) |

Son 16 tópicos para 15 respuestas, y solo 3 tienen 2 personas; ninguno queda con una sola.

## Veredicto

A está más cerca de mi lista en granularidad y en conteos útiles (equipo, mentoría, comida, cansancio coinciden casi uno a uno). B está más cerca en lo que separa dentro del lugar (wifi, ruido, duchas, estacionamiento), que es justo donde A falla. Usaría **A** como base, porque se puede contar personas por tópico y armar contrastes para la segunda ronda, y le partiría "organización y lugar" y "avance del proyecto" a mano.

Los dos comparten un error de sentimiento: marcan 0 a h03 cuando dice "la organización bien, el lugar bien", y ponen negativo lo que la persona cuenta como algo del pasado o en broma (h10 y ganar, h13 durmiendo bajo la mesa).

### Regla que le agregaría a A

> Entre 12 y 18 tópicos para este tamaño de muestra. Si un tópico tiene temas que se arreglan de formas distintas o los arregla gente distinta (wifi, ruido, duchas, estacionamiento), sepáralos aunque todos sean "del lugar". No uses "experiencia general" como bolsa: un tema que tiene nombre propio (aprendizaje, ganar, pitch) va en su tópico.

### Regla que le agregaría a B

> Entre 12 y 18 tópicos para este tamaño de muestra. Antes de crear un tópico nuevo, revisa si alguno existente responde la misma pregunta ("¿cómo me fue con los mentores?", "¿tuve problemas técnicos?"); si es así, usa ese. Un tópico con una sola persona solo vale si es una queja concreta que la organización puede arreglar. Un tema va en el tópico de lo que trata (un mentor va en mentoría aunque hable de la idea), no en el de la consecuencia.

### Regla para los dos

> El sentimiento es la opinión actual de la persona sobre ese tópico. Lo que cuenta del año pasado es "mejora" o "empeora", no negativo. Lo que cuenta riéndose sin quejarse es neutro. "Bien" es positivo, no neutro.
