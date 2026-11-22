# Lectura a mano: percepción de la hackatón

Pregunta: **¿Cómo ha sido tu experiencia en la Platanus Hack hasta ahora?**

15 respuestas escritas por un subagente Opus sin columnas ni valores esperados. Pipeline = el de la app (claude-opus-5-5, effort low), con las respuestas entrando de a una. Haiku solo = claude-haiku-5-5, effort medium, temas libres por respuesta.

## Mapa del pipeline

| Tema | Personas | Resumen |
|---|---|---|
| Agotamiento, estrés y malestar extremo | 8 | Cansancio, estrés, enfermedad y angustia por el pitch marcaron la experiencia. |
| Proyecto avanza aunque incompleto | 7 | Los proyectos funcionan parcialmente o con pivots, pero avanzan. |
| Comida bien, café y duchas insuficientes | 5 | La comida fue buena en general, pero faltó café, duchas y opciones veganas. |
| Venir solo o nuevo valió la pena | 3 | Participantes nuevos, solos o de regiones valoran haber venido pese a sus miedos. |
| Apoyo y buen ambiente fueron clave | 9 | Equipos, mentores y organización aportaron apoyo y buen ambiente. |
| Compañeros de equipo fallaron | 2 | Algunos compañeros abandonaron, perdieron tiempo o subvaloraron aportes. |
| Fallas técnicas e infraestructura molestan | 4 | Wifi, APIs, Docker y audio causaron pérdidas de tiempo. |
| Falta información de estacionamiento y acceso | 1 | No hubo información sobre estacionamiento ni facilidades de acceso. |
| Sospecha de código previo, revisar commits | 1 | Se sospecha que algunos equipos traían código hecho y piden revisar commits. |

## h01

> ya mira estoy muerto llevo como veintidós horas despierto el proyecto anda a medias pero anda, igual. La comida bien. El café se acabó como a las cuatro de la mañana y nadie lo repuso, eso nomás po. Después te cuento bien

**Pipeline**

- Agotamiento extremo tras unas veintidós horas sin dormir · cansancio 0.9 · tema «Agotamiento, estrés y malestar extremo» · "estoy muerto llevo como veintidós horas despierto"
- El proyecto funciona parcialmente, pero funciona · satisfaccion 0.4 · tema «Proyecto avanza aunque incompleto» · "el proyecto anda a medias pero anda"
- La comida estuvo bien · satisfaccion 0.4 · tema «Comida bien, café y duchas insuficientes» · "La comida bien"
- El café se acabó de madrugada y no lo repusieron · molestia 0.6 · tema «Comida bien, café y duchas insuficientes» · "El café se acabó como a las cuatro de la mañana y nadie lo repuso"

**Haiku solo**

- cansancio fisico: negativo · fuerte · empeora · "ya mira estoy muerto llevo como veintidós horas despierto"
- avance del proyecto: mixto · "el proyecto anda a medias pero anda, igual"
- comida: positivo · leve · "La comida bien"
- falta de cafe: negativo · moderada · empeora · "El café se acabó como a las cuatro de la mañana y nadie lo repuso"
- Emoción: cansancio · Propone: reponer el café

## h02

> Hola, ya, eh, bueno yo llegué solo, o sea me inscribí solo porque mis amigos no quisieron venir, y me tocó armar equipo ahí el viernes en la cosa esa de las mesas donde cada uno dice su idea. Y nada, me daba un susto terrible porque nunca había hecho una hackatón y pensé que iba a ser el que no sabía nada. Y igual soy el que menos sabe, eso es verdad jaja, pero los chiquillos han sido súper buena onda, me pasaron toda la parte del scraping y me dejaron hacerla aunque me demoré como el triple. Ayer en la noche pasó un mentor, no me acuerdo el nombre, uno alto con polerón gris, y se sentó como cuarenta minutos con nosotros a explicarnos por qué la idea estaba mal planteada, y fue medio duro escucharlo pero tenía razón po. Cambiamos harto después de eso. Así que bien, cansado pero bien, contento de haber venido solo al final.

**Pipeline**

- Llegó solo y tuvo que armar equipo en el evento · neutral 0.3 · tema «Venir solo o nuevo valió la pena» · "me inscribí solo porque mis amigos no quisieron venir, y me tocó armar equipo ahí el viernes"
- Sentía miedo por ser su primera hackatón · miedo 0.7 · tema «Venir solo o nuevo valió la pena» · "me daba un susto terrible porque nunca había hecho una hackatón"
- Su equipo lo apoyó aunque es el que menos sabe · gratitud 0.7 · tema «Apoyo y buen ambiente fueron clave» · "los chiquillos han sido súper buena onda, me pasaron toda la parte del scraping y me dejaron hacerla"
- Un mentor les dio feedback duro pero acertado · satisfaccion 0.6 · tema «Apoyo y buen ambiente fueron clave» · "fue medio duro escucharlo pero tenía razón po. Cambiamos harto después de eso"
- Cansado pero contento de haber venido solo · alegria 0.7 · tema «Venir solo o nuevo valió la pena» · "cansado pero bien, contento de haber venido solo al final"

**Haiku solo**

- compañeros de equipo: positivo · fuerte · "los chiquillos han sido súper buena onda"
- mentor que criticó la idea: mixto · "fue medio duro escucharlo pero tenía razón po"
- idea original del proyecto: negativo · moderada · mejora · "la idea estaba mal planteada... Cambiamos harto después de eso"
- su nivel técnico: negativo · leve · "Y igual soy el que menos sabe, eso es verdad jaja"
- tarea de scraping: negativo · leve · "me demoré como el triple"
- haber venido solo: positivo · moderada · mejora · "contento de haber venido solo al final"
- Emoción: satisfaccion · Propone: nada

## h03

> Ya, a ver, te voy a ser honesta porque igual pa eso es la encuesta, no. Ha sido, no sé, ha sido raro. Partimos siendo cuatro. Nos conocíamos de la u, de un ramo, y habíamos hablado harto antes de venir, teníamos la idea más o menos clara, una app para coordinar cuidadores de adultos mayores, que es algo que me toca porque mi abuela, bueno, da lo mismo. La cosa es que el viernes en la noche todo bien, armamos el repo, repartimos tareas, todo súper. El sábado en la mañana uno de los chiquillos dijo que tenía que ir a un matrimonio, cosa que nadie sabía, o sea él sabía obviamente pero no nos dijo, y se fue a las doce y volvió a las once de la noche medio curado. Entonces quedamos tres. Y de los tres, el otro, el Seba, que es muy seco, muy muy seco programando, se obsesionó con hacer la infraestructura perfecta, con Kubernetes, en una hackatón de treinta y seis horas, imagínate, y estuvo como diez horas en eso y al final no lo usamos. Así que en la práctica el producto lo hicimos entre la Cata y yo. Y yo no soy dev, yo soy de diseño, o sea sé un poco de front pero no tanto. Entonces fue mucho estrés, mucho. A las tres de la mañana me puse a llorar en el baño, no me da vergüenza decirlo, ya me da lo mismo. Y una niña de otro equipo que estaba ahí me pasó un chicle y me dijo que a ella le había pasado lo mismo el año pasado, y no sé, eso me ayudó caleta, fue como tonto pero me ayudó. Después volví y lo sacamos. No está lindo, no está lo que queríamos, pero funciona el flujo principal y eso es lo que vamos a mostrar. Lo que sí, no sé si volvería con el mismo equipo. Con la Cata sí, mil veces. Con los otros dos no sé. Y eso, la organización bien, la comida bien, el lugar bien, no tengo nada que decir de eso, mi tema fue el equipo nomás. Ah y que los mentores a veces pasaban justo cuando no estábamos, como que llegaban y nosotros andábamos comiendo, mala suerte nomás supongo. Y el Seba ahora anda diciendo que el Kubernetes lo va a dejar para la versión dos, como si fuera a haber versión dos, y yo ni le contesto porque no tengo energía, te juro que no tengo energía ni para enojarme. Ya, eso.

**Pipeline**

- Un compañero se fue a un matrimonio sin avisar · molestia 0.7 · tema «Compañeros de equipo fallaron» · "uno de los chiquillos dijo que tenía que ir a un matrimonio, cosa que nadie sabía"
- Un compañero perdió horas en infraestructura que no se usó · frustracion 0.8 · tema «Compañeros de equipo fallaron» · "estuvo como diez horas en eso y al final no lo usamos"
- Mucho estrés, llegó a llorar de madrugada · angustia 0.9 · tema «Agotamiento, estrés y malestar extremo» · "A las tres de la mañana me puse a llorar en el baño"
- El apoyo de una participante de otro equipo la ayudó · gratitud 0.7 · tema «Apoyo y buen ambiente fueron clave» · "me pasó un chicle y me dijo que a ella le había pasado lo mismo el año pasado"
- Lograron un producto funcional aunque no ideal · alivio 0.6 · tema «Proyecto avanza aunque incompleto» · "No está lindo, no está lo que queríamos, pero funciona el flujo principal"

**Haiku solo**

- equipo: negativo · fuerte · empeora · "Lo que sí, no sé si volvería con el mismo equipo. Con la Cata sí, mil veces. Con los otros dos no sé."
- abandono de integrante: negativo · moderada · "uno de los chiquillos dijo que tenía que ir a un matrimonio, cosa que nadie sabía"
- infraestructura con Kubernetes: negativo · moderada · "se obsesionó con hacer la infraestructura perfecta, con Kubernetes, en una hackatón de treinta y seis horas"
- estrés: negativo · fuerte · empeora · "Entonces fue mucho estrés, mucho. A las tres de la mañana me puse a llorar en el baño"
- apoyo de otra participante: positivo · moderada · "me pasó un chicle y me dijo que a ella le había pasado lo mismo el año pasado, y no sé, eso me ayudó caleta"
- organización y lugar: neutro · "la organización bien, la comida bien, el lugar bien, no tengo nada que decir de eso"
- mentores: negativo · leve · "los mentores a veces pasaban justo cuando no estábamos"
- producto final: mixto · "No está lindo, no está lo que queríamos, pero funciona el flujo principal"
- Emoción: cansancio · Propone: nada

## h04

> Excelente, increíble, aprendí muchísimo. Aprendí que Docker en Mac con chip M no sé qué no levanta la imagen que usamos, aprendí que el wifi del segundo piso no existe, aprendí que uno puede comer cuatro empanadas a las dos de la mañana y seguir funcionando. Ya no, en serio, igual lo estoy pasando bien, es como que todo ha salido mal pero de una forma chistosa, no sé si me explico. Llevamos tres pivots. El tercero es el bueno, creo. Cachai que la idea original era para veterinarias y ahora es para, ya ni sé cómo explicarlo, es para contadores. No me preguntes cómo llegamos ahí. Pero el equipo se ríe harto y eso vale. Si ganamos algo va a ser de puro milagro.

**Pipeline**

- Problemas técnicos con Docker en Mac con chip M · frustracion 0.5 · tema «Fallas técnicas e infraestructura molestan» · "Docker en Mac con chip M no sé qué no levanta la imagen que usamos"
- El wifi del segundo piso no funciona · molestia 0.5 · tema «Fallas técnicas e infraestructura molestan» · "aprendí que el wifi del segundo piso no existe"
- Lo pasa bien aunque todo sale mal de forma chistosa · alegria 0.6 · tema «Apoyo y buen ambiente fueron clave» · "todo ha salido mal pero de una forma chistosa"
- Tres pivots: de veterinarias a contadores · duda 0.5 · tema «Proyecto avanza aunque incompleto» · "Llevamos tres pivots. El tercero es el bueno, creo"
- El buen ambiente del equipo compensa todo · satisfaccion 0.7 · tema «Apoyo y buen ambiente fueron clave» · "el equipo se ríe harto y eso vale"

**Haiku solo**

- experiencia general: positivo · fuerte · "Excelente, increíble, aprendí muchísimo"
- docker en mac m: negativo · moderada · "Docker en Mac con chip M no sé qué no levanta la imagen que usamos"
- wifi del segundo piso: negativo · leve · "el wifi del segundo piso no existe"
- pivots del proyecto: mixto · "Llevamos tres pivots. El tercero es el bueno, creo."
- nueva idea para contadores: positivo · leve · "ahora es para, ya ni sé cómo explicarlo, es para contadores"
- ambiente del equipo: positivo · fuerte · "el equipo se ríe harto y eso vale"
- resultado en competencia: neutro · "Si ganamos algo va a ser de puro milagro"
- Emoción: alegria · Propone: nada

## h05

> Hola, sí, bien, eh, oye una cosa que no sé si es para esto pero lo digo igual, el estacionamiento. Yo llegué en auto el viernes porque vivo en Puente Alto y venir en micro con el notebook y el saco de dormir era un cacho, y nadie me supo decir dónde estacionar, terminé dejándolo como a cuatro cuadras y me pasé toda la noche pensando que me lo iban a robar. Bajé dos veces a verlo, a las dos y a las cinco. Está bien, el auto está bien. Lo demás bien, o sea, la hackatón en sí bien, estamos haciendo una cosa con transcripción de audios justamente, qué chistoso, a lo mejor esto mismo lo va a leer un modelo, hola modelo. Ya, eso, pongan info del estacionamiento pal próximo año porfa.

**Pipeline**

- No hubo información sobre dónde estacionar · frustracion 0.6 · tema «Falta información de estacionamiento y acceso» · "nadie me supo decir dónde estacionar, terminé dejándolo como a cuatro cuadras"
- Pasó la noche preocupado por un posible robo del auto · preocupacion 0.7 · tema «Falta información de estacionamiento y acceso» · "me pasé toda la noche pensando que me lo iban a robar. Bajé dos veces a verlo"
- Llegar en transporte público con equipaje era difícil · molestia 0.4 · tema «Falta información de estacionamiento y acceso» · "venir en micro con el notebook y el saco de dormir era un cacho"
- La hackatón en sí le parece bien · satisfaccion 0.4 · tema «Apoyo y buen ambiente fueron clave» · "la hackatón en sí bien"
- Pide información de estacionamiento para el próximo año · esperanza 0.5 · tema «Falta información de estacionamiento y acceso» · "pongan info del estacionamiento pal próximo año porfa"

**Haiku solo**

- estacionamiento: negativo · moderada · "nadie me supo decir dónde estacionar, terminé dejándolo como a cuatro cuadras y me pasé toda la noche pensando que me lo iban a robar"
- hackatón en general: positivo · leve · "la hackatón en sí bien"
- Emoción: preocupacion · Propone: Poner información del estacionamiento para el próximo año

## h06

> Ya mira, mi experiencia, eh, mixta diría. Soy diseñadora y vine con tres devs que conocí por Twitter, bueno X, como se llame ahora. Y el tema es que siento que me tratan como la que pone colores, cachai. Yo hice todo un flujo en Figma el viernes, investigué, hice como cinco entrevistas rápidas a gente aquí mismo, a otros participantes, sobre el problema, y cuando lo mostré me dijeron ya sí lindo pero hagámoslo con shadcn por defecto nomás que es más rápido. Y bueno, es más rápido, no les digo que no, pero entonces para qué estoy acá. Hoy en la mañana una mentora vio el producto y lo primero que dijo fue que no se entendía qué hacía la pantalla principal, que era exactamente lo que yo había resuelto en el Figma. Me dio una mezcla de rabia y de, no sé, de razón. Ahora están implementando mi diseño a la rápida. O sea al final pasó, pero me cansó. Aparte de eso el ambiente es súper lindo, he conocido gente bacán, me llevo contactos, eso sí.

**Pipeline**

- Experiencia mixta en la hackathon · neutral 0.4 · tema «Compañeros de equipo fallaron» · "mi experiencia, eh, mixta diría"
- Se siente subvalorada como diseñadora por su equipo · frustracion 0.8 · tema «Compañeros de equipo fallaron» · "siento que me tratan como la que pone colores"
- Su investigación y diseño en Figma fueron descartados por rapidez · decepcion 0.7 · tema «Compañeros de equipo fallaron» · "me dijeron ya sí lindo pero hagámoslo con shadcn por defecto nomás que es más rápido"
- La mentora validó el problema que ella ya había resuelto · rabia 0.7 · tema «Compañeros de equipo fallaron» · "Me dio una mezcla de rabia y de, no sé, de razón"
- Finalmente implementan su diseño, pero quedó agotada · cansancio 0.6 · tema «Agotamiento, estrés y malestar extremo» · "O sea al final pasó, pero me cansó"

**Haiku solo**

- rol de diseñadora: negativo · fuerte · "siento que me tratan como la que pone colores, cachai"
- trabajo de investigación ignorado: negativo · moderada · "hice como cinco entrevistas rápidas a gente aquí mismo... y cuando lo mostré me dijeron ya sí lindo pero hagámoslo con shadcn por defecto"
- uso de shadcn por defecto: negativo · moderada · "hagámoslo con shadcn por defecto nomás que es más rápido"
- validación del diseño por mentora: mixto · "una mentora vio el producto y lo primero que dijo fue que no se entendía qué hacía la pantalla principal, que era exactamente lo que yo había resuelto en el Figma"
- implementación del diseño propio: mixto · "Ahora están implementando mi diseño a la rápida. O sea al final pasó, pero me cansó."
- ambiente del evento: positivo · moderada · "el ambiente es súper lindo"
- contactos y conocer gente: positivo · moderada · "he conocido gente bacán, me llevo contactos"
- Emoción: frustracion · Propone: nada

## h07

> hola sí bien bien, estamos en la recta final así que no puedo hablar mucho. La wifi se cayó un rato en la noche y perdimos como una hora, pero todo bien. Te mando algo más largo después si me acuerdo

**Pipeline**

- Experiencia general positiva en la hackatón · satisfaccion 0.5 · tema «Apoyo y buen ambiente fueron clave» · "hola sí bien bien"
- Poco tiempo para responder por estar en la recta final · cansancio 0.4 · tema «Proyecto avanza aunque incompleto» · "estamos en la recta final así que no puedo hablar mucho"
- La caída del wifi les hizo perder una hora · molestia 0.5 · tema «Fallas técnicas e infraestructura molestan» · "La wifi se cayó un rato en la noche y perdimos como una hora"

**Haiku solo**

- experiencia general: positivo · leve · "sí bien bien"
- caída de wifi: negativo · leve · "La wifi se cayó un rato en la noche y perdimos como una hora, pero todo bien"
- Emoción: neutral · Propone: nada

## h08

> Hola, buenas tardes. Bueno, yo creo que soy de los más viejos acá, tengo cuarenta y seis años, trabajé veinte años en logística y hace dos me puse a estudiar programación en un bootcamp, entonces para mí esto era como una prueba, ver si de verdad me la podía con gente que lleva toda la vida en esto. Y la verdad me ha sorprendido, en el buen sentido. Pensé que me iban a mirar raro y no, para nada, los chiquillos de mi equipo tienen veintidós, veintitrés, y me piden opinión todo el rato porque justo la idea es de bodegas, de inventario, y yo de eso sé harto. Entonces por primera vez siento que lo que hice antes sirve para algo acá. Lo físico sí ha sido duro, no les voy a mentir. Dormí como dos horas en un puf y me duele la espalda entera, y el ruido en la noche, la música, a mí me cuesta concentrarme con eso. Pero bien, muy contento. Ojalá hubiera más gente de mi edad, eso sí, no sé si es que no se inscriben o qué.

**Pipeline**

- Participar era una prueba para validar su cambio de carrera · duda 0.5 · tema «Venir solo o nuevo valió la pena» · "para mí esto era como una prueba, ver si de verdad me la podía con gente que lleva toda la vida en esto"
- Se sintió bien recibido por su equipo joven · sorpresa 0.7 · tema «Venir solo o nuevo valió la pena» · "Pensé que me iban a mirar raro y no, para nada"
- Su experiencia previa en logística es valorada en el proyecto · orgullo 0.8 · tema «Venir solo o nuevo valió la pena» · "por primera vez siento que lo que hice antes sirve para algo acá"
- El cansancio físico y el ruido nocturno fueron difíciles · cansancio 0.7 · tema «Agotamiento, estrés y malestar extremo» · "Dormí como dos horas en un puf y me duele la espalda entera, y el ruido en la noche"
- Desearía mayor participación de personas de su edad · esperanza 0.5 · tema «Venir solo o nuevo valió la pena» · "Ojalá hubiera más gente de mi edad"

**Haiku solo**

- experiencia previa valorada: positivo · fuerte · "por primera vez siento que lo que hice antes sirve para algo acá"
- trato del equipo: positivo · moderada · "me piden opinión todo el rato"
- cansancio físico: negativo · moderada · "Dormí como dos horas en un puf y me duele la espalda entera"
- ruido nocturno: negativo · moderada · "el ruido en la noche, la música, a mí me cuesta concentrarme con eso"
- poca gente mayor: negativo · leve · "Ojalá hubiera más gente de mi edad"
- Emoción: alegria · Propone: nada

## h09

> Ya, eh, no sé bien qué decir la verdad. Ha sido intenso. Teníamos todo armado sobre la API de, de un modelo, no voy a decir cuál, y a las tres de la mañana nos empezó a tirar error de límite, rate limit, y estuvimos como dos horas pensando que era nuestro código. Era el límite nomás. Después nos pasaron créditos de otra cosa, gracias a los de la organización que se movieron rápido, eso sí. Pero igual tuvimos que cambiar medio backend y ahora no sé si funciona igual de bien, o sea funciona pero distinto, las respuestas son más cortas y más tontas, no sé. No sé si eso es bueno o malo pa la demo. A lo mejor nadie se da cuenta. Igual el Nico dice que está mejor así porque es más rápido. No sé po. Veremos en el pitch.

**Pipeline**

- La experiencia en la hackathon ha sido intensa · cansancio 0.5 · tema «Agotamiento, estrés y malestar extremo» · "Ha sido intenso."
- Perdieron dos horas por un límite de uso de la API · frustracion 0.7 · tema «Fallas técnicas e infraestructura molestan» · "estuvimos como dos horas pensando que era nuestro código. Era el límite nomás"
- Agradecen la rápida reacción de la organización con créditos · gratitud 0.6 · tema «Apoyo y buen ambiente fueron clave» · "gracias a los de la organización que se movieron rápido, eso sí"
- Tuvieron que rehacer el backend y las respuestas empeoraron · decepcion 0.5 · tema «Fallas técnicas e infraestructura molestan» · "tuvimos que cambiar medio backend... las respuestas son más cortas y más tontas"
- Incertidumbre sobre cómo resultará la demo en el pitch · duda 0.6 · tema «Agotamiento, estrés y malestar extremo» · "No sé si eso es bueno o malo pa la demo... Veremos en el pitch."

**Haiku solo**

- límite de uso de la API: negativo · moderada · "a las tres de la mañana nos empezó a tirar error de límite, rate limit, y estuvimos como dos horas pensando que era nuestro código"
- créditos de la organización: positivo · moderada · "Después nos pasaron créditos de otra cosa, gracias a los de la organización que se movieron rápido, eso sí"
- calidad de las respuestas tras cambiar backend: negativo · moderada · empeora · "las respuestas son más cortas y más tontas, no sé"
- demo y pitch: neutro · "No sé si eso es bueno o malo pa la demo. A lo mejor nadie se da cuenta."
- Emoción: duda · Propone: nada

## h10

> Ya, oye, espérate que me salgo un poco porque hay mucho ruido. Ya. Ya, a ver, la experiencia. Mira, yo vengo por segunda vez, vine el año pasado también, y te diría que esta vez lo estoy disfrutando mucho más, como que el año pasado vine muy enfocado en ganar y lo pasé mal, estaba todo el rato mirando lo que hacían los otros equipos y comparándome, y este año dije no, vengo a pasarlo bien y a hacer algo que me guste aunque no gane nada. Y ha sido otra cosa, de verdad. Estamos haciendo una cosa medio absurda, un sistema que te dice qué micro tomar según cuánto te quieres demorar y cuánto quieres caminar, pero con datos reales de la red, y la verdad es que técnicamente es súper entretenido porque los datos son un desastre, cachai, hay paraderos que aparecen dos veces con nombres distintos y cosas así. Mi equipo es un amigo del colegio, una niña que conocimos acá que es de Concepción y vino sola en bus el viernes, y un loco que es de Perú y está haciendo un magíster acá. Y nos llevamos increíble, a las cuatro de la mañana estábamos discutiendo si la Alameda era técnicamente una avenida o una calle y no sé, fue de las conversaciones más divertidas que he tenido este año, no tiene ningún sentido pero bueno. La niña de Conce es seca, seca, hizo todo el algoritmo de rutas ella sola casi, nosotros más bien le hacemos la interfaz y la parte de los datos. También hablé con harta gente de otros equipos, me encontré con un compañero de la pega anterior que no veía hace como tres años, nos fuimos a fumar afuera, bueno él fumó yo lo acompañé. Lo que sí, y esto lo digo pa que lo mejoren, las duchas, o sea no hay duchas po, y después de treinta y tantas horas igual se nota, todos andamos medio pasados. No es culpa de nadie supongo pero si se pudiera. Y la comida, el almuerzo de ayer estaba buenísimo, el de hoy medio frío pero bien. El tema de los mentores encuentro que mejoró harto respecto al año pasado, ahora pasan más seguido y son más concretos, el año pasado eran como charlas motivacionales y este año te dicen esto no funciona, cámbialo, que es lo que uno necesita a esta hora. Bueno, eso, no sé si ganemos, la verdad me da un poco lo mismo, yo creo que voy a volver el próximo año igual. Ah, y que alguien le diga al del equipo de la mesa del fondo que deje de poner reguetón a las seis de la mañana, eso, gracias.

**Pipeline**

- Disfruta mucho más esta edición al no enfocarse en ganar · satisfaccion 0.8 · tema «Apoyo y buen ambiente fueron clave» · "esta vez lo estoy disfrutando mucho más, como que el año pasado vine muy enfocado en ganar y lo pasé mal"
- El proyecto de micros es técnicamente entretenido pese a datos desordenados · entusiasmo 0.7 · tema «Proyecto avanza aunque incompleto» · "técnicamente es súper entretenido porque los datos son un desastre"
- Excelente dinámica con un equipo diverso y talentoso · alegria 0.8 · tema «Apoyo y buen ambiente fueron clave» · "nos llevamos increíble... La niña de Conce es seca, seca"
- Falta de duchas se nota tras muchas horas · molestia 0.5 · tema «Comida bien, café y duchas insuficientes» · "no hay duchas po, y después de treinta y tantas horas igual se nota"
- Mentores mejoraron: más frecuentes y con feedback concreto · satisfaccion 0.7 · tema «Apoyo y buen ambiente fueron clave» · "ahora pasan más seguido y son más concretos"

**Haiku solo**

- disfrute de la hackatón: positivo · fuerte · mejora · "esta vez lo estoy disfrutando mucho más"
- presión por ganar: negativo · moderada · mejora · "el año pasado vine muy enfocado en ganar y lo pasé mal, estaba todo el rato mirando lo que hacían los otros equipos y comparándome"
- proyecto técnico y datos: positivo · fuerte · "técnicamente es súper entretenido porque los datos son un desastre"
- equipo de trabajo: positivo · fuerte · "Y nos llevamos increíble"
- duchas: negativo · moderada · "las duchas, o sea no hay duchas po, y después de treinta y tantas horas igual se nota"
- comida: positivo · moderada · "el almuerzo de ayer estaba buenísimo, el de hoy medio frío pero bien"
- mentores: positivo · moderada · mejora · "El tema de los mentores encuentro que mejoró harto respecto al año pasado"
- ruido nocturno: negativo · leve · "que alguien le diga al del equipo de la mesa del fondo que deje de poner reguetón a las seis de la mañana"
- Emoción: alegria · Propone: Habilitar duchas para los participantes

## h11

> Mal, la verdad. Me resfrié el viernes en la noche, hacía un frío terrible en el sector donde nos tocó, al lado de la puerta que la abrían cada dos minutos, y hoy tengo fiebre creo. Aparte soy vegana y avisé en el formulario y las primeras dos comidas no había nada para mí, como pan con palta y ya, después sí apareció algo, unas lentejas, que estaban ricas, pero tuve que andar preguntando. El equipo bien, no tengo nada contra ellos, pero yo no estoy rindiendo nada, me siento culpable. Probablemente me vaya a la casa antes del pitch, no sé, depende de cómo esté en un rato.

**Pipeline**

- Se resfrió por el frío junto a la puerta · molestia 0.7 · tema «Agotamiento, estrés y malestar extremo» · "hacía un frío terrible en el sector donde nos tocó, al lado de la puerta que la abrían cada dos minutos"
- Hoy cree tener fiebre y se siente mal · cansancio 0.7 · tema «Agotamiento, estrés y malestar extremo» · "Mal, la verdad. Me resfrié el viernes en la noche... y hoy tengo fiebre creo"
- Faltó comida vegana pese a avisar en el formulario · frustracion 0.7 · tema «Comida bien, café y duchas insuficientes» · "avisé en el formulario y las primeras dos comidas no había nada para mí, como pan con palta y ya"
- Luego hubo lentejas ricas, pero tuvo que preguntar · decepcion 0.4 · tema «Comida bien, café y duchas insuficientes» · "después sí apareció algo, unas lentejas, que estaban ricas, pero tuve que andar preguntando"
- Se siente culpable por no rendir y quizás se vaya · tristeza 0.7 · tema «Agotamiento, estrés y malestar extremo» · "El equipo bien... pero yo no estoy rindiendo nada, me siento culpable. Probablemente me vaya a la casa antes del pitch"

**Haiku solo**

- salud y resfriado: negativo · fuerte · "Me resfrié el viernes en la noche... hoy tengo fiebre creo."
- frío en el sector: negativo · moderada · "hacía un frío terrible en el sector donde nos tocó, al lado de la puerta que la abrían cada dos minutos"
- comida vegana: mixto · mejora · "las primeras dos comidas no había nada para mí... después sí apareció algo, unas lentejas, que estaban ricas, pero tuve que andar preguntando"
- equipo: positivo · leve · "El equipo bien, no tengo nada contra ellos"
- rendimiento en el hackatón: negativo · fuerte · "yo no estoy rindiendo nada, me siento culpable"
- salir antes del pitch: neutro · "Probablemente me vaya a la casa antes del pitch, no sé, depende de cómo esté en un rato."
- Emoción: frustracion · Propone: nada

## h12

> Hola, eh, bueno, la experiencia buena en general, pero hay algo que me tiene un poco picado y lo voy a decir. Hay equipos que claramente traían el código hecho. O sea, uno pasa por al lado y ves que tienen un producto con login, con dashboard, con pagos integrados, el sábado a mediodía. No sé, a lo mejor son muy rápidos, pero cuesta creerlo, cachai. Y nosotros partimos de cero, de verdad de cero, con un create vite nomás, y obvio que vamos a llegar con algo más simple. Ojalá los jurados revisen los commits o algo, no sé si lo hacen. Fuera de eso, todo bien, el lugar es bonito, la gente de la organización muy atenta, nos ayudaron con un tema de un enchufe que no funcionaba y llegaron al tiro. Y aprendí harto de Convex, que no lo conocía, eso fue lo mejor técnicamente.

**Pipeline**

- Sospecha que algunos equipos traían el código hecho · molestia 0.7 · tema «Sospecha de código previo, revisar commits» · "Hay equipos que claramente traían el código hecho."
- Su equipo partió desde cero y llegará con algo simple · frustracion 0.5 · tema «Sospecha de código previo, revisar commits» · "nosotros partimos de cero, de verdad de cero, con un create vite nomás"
- Pide que los jurados revisen los commits · esperanza 0.5 · tema «Sospecha de código previo, revisar commits» · "Ojalá los jurados revisen los commits o algo, no sé si lo hacen."
- Organización atenta y rápida para resolver problemas · gratitud 0.6 · tema «Apoyo y buen ambiente fueron clave» · "la gente de la organización muy atenta, nos ayudaron con un tema de un enchufe que no funcionaba y llegaron al tiro"
- Aprender Convex fue lo mejor técnicamente · satisfaccion 0.7 · tema «Proyecto avanza aunque incompleto» · "aprendí harto de Convex, que no lo conocía, eso fue lo mejor técnicamente"

**Haiku solo**

- equipos con código previo: negativo · moderada · "Hay equipos que claramente traían el código hecho"
- desventaja de partir de cero: negativo · leve · "nosotros partimos de cero, de verdad de cero, con un create vite nomás"
- lugar del evento: positivo · leve · "el lugar es bonito"
- atención de la organización: positivo · moderada · "la gente de la organización muy atenta, nos ayudaron con un tema de un enchufe que no funcionaba y llegaron al tiro"
- aprendizaje de convex: positivo · moderada · "aprendí harto de Convex, que no lo conocía, eso fue lo mejor técnicamente"
- Emoción: molestia · Propone: Que los jurados revisen los commits para verificar el trabajo realizado durante la hackatón

## h13

> hola ya ehh la experiencia en la plata nos jack ha sido buena o sea súper buena me gustó mucho el tema de los mentores que vinieron de, de startups de verdad y uno de ellos nos ayudó con la parte de de cómo cobrar que no habíamos pensado nada y nos dijo que sin eso no era un producto era un hobby y ahí como que nos cayó la teja. dormimos poco obvio yo dormí debajo de la mesa con el polerón de almohada y amanecí con la cara marcada jaja. la comida bien pizza hartas pizzas demasiadas pizzas quizás, el sushi del sábado eso sí estaba bueno. lo único que no me gustó es que el audio de la charla de apertura no se escuchaba nada atrás entonces no cachamos bien las reglas de entrega y tuvimos que preguntar después. pero eso nada más, recomendaría. ya chao

**Pipeline**

- La experiencia en la hackathon fue muy buena · satisfaccion 0.8 · tema «Apoyo y buen ambiente fueron clave» · "ha sido buena o sea súper buena"
- Mentores de startups reales aportaron mucho, especialmente sobre cómo cobrar · gratitud 0.8 · tema «Apoyo y buen ambiente fueron clave» · "nos dijo que sin eso no era un producto era un hobby y ahí como que nos cayó la teja"
- Durmieron poco y en condiciones incómodas, tomado con humor · cansancio 0.4 · tema «Agotamiento, estrés y malestar extremo» · "yo dormí debajo de la mesa con el polerón de almohada y amanecí con la cara marcada jaja"
- Comida bien, aunque exceso de pizza; el sushi destacó · satisfaccion 0.5 · tema «Comida bien, café y duchas insuficientes» · "hartas pizzas demasiadas pizzas quizás, el sushi del sábado eso sí estaba bueno"
- Mal audio en la apertura impidió entender las reglas de entrega · molestia 0.5 · tema «Fallas técnicas e infraestructura molestan» · "el audio de la charla de apertura no se escuchaba nada atrás entonces no cachamos bien las reglas de entrega"

**Haiku solo**

- mentores de startups: positivo · fuerte · "me gustó mucho el tema de los mentores que vinieron de startups de verdad"
- consejo sobre cobrar: positivo · moderada · "sin eso no era un producto era un hobby"
- descanso y sueño: negativo · moderada · "dormimos poco obvio yo dormí debajo de la mesa con el polerón de almohada"
- comida: mixto · "hartas pizzas demasiadas pizzas quizás, el sushi del sábado eso sí estaba bueno"
- audio de la charla de apertura: negativo · leve · "el audio de la charla de apertura no se escuchaba nada atrás entonces no cachamos bien las reglas de entrega"
- experiencia general: positivo · fuerte · "la experiencia en la plata nos jack ha sido buena o sea súper buena, recomendaría"
- Emoción: satisfaccion · Propone: nada

## h14

> Hola, ya, bueno yo soy de Temuco, me vine en bus el jueves en la noche con dos compañeros de la universidad, y me estoy quedando donde una tía en Maipú, bueno me estaba quedando porque al final no he ido nunca, me he quedado acá las dos noches. Mi mamá me llama cada tres horas preguntando si comí, y sí, he comido más que en la casa jaja. La experiencia ha sido muy distinta a lo que me imaginaba. Allá en Temuco no hay nada de esto, o sea hay cosas pero chicas, y acá ver a tanta gente tan buena junta da como susto y ganas al mismo tiempo. Me siento un poco atrás de los demás, como que todos hablan de herramientas que yo ni conocía, pero también me doy cuenta de que puedo seguirles el ritmo si me esfuerzo. Lo que sí, el pasaje me salió caro y la beca de viaje me enteré tarde que existía, ojalá la difundan más en regiones. Pero no me arrepiento para nada, eso.

**Pipeline**

- La experiencia superó lo que imaginaba, muy distinta · sorpresa 0.6 · tema «Venir solo o nuevo valió la pena» · "La experiencia ha sido muy distinta a lo que me imaginaba."
- En regiones no existen eventos de esta escala · decepcion 0.4 · tema «Venir solo o nuevo valió la pena» · "Allá en Temuco no hay nada de esto, o sea hay cosas pero chicas"
- Ver tanto talento junto genera susto y motivación · entusiasmo 0.7 · tema «Venir solo o nuevo valió la pena» · "ver a tanta gente tan buena junta da como susto y ganas al mismo tiempo"
- Se siente atrás, pero cree poder seguir el ritmo · esperanza 0.6 · tema «Venir solo o nuevo valió la pena» · "Me siento un poco atrás de los demás... pero también me doy cuenta de que puedo seguirles el ritmo si me esfuerzo"
- Pide difundir más la beca de viaje en regiones · frustracion 0.5 · tema «Venir solo o nuevo valió la pena» · "la beca de viaje me enteré tarde que existía, ojalá la difundan más en regiones"

**Haiku solo**

- ambiente de la hackatón: mixto · "ver a tanta gente tan buena junta da como susto y ganas al mismo tiempo"
- nivel técnico propio: negativo · moderada · "Me siento un poco atrás de los demás, como que todos hablan de herramientas que yo ni conocía"
- costo del pasaje: negativo · leve · "el pasaje me salió caro"
- difusión de la beca de viaje: negativo · moderada · "la beca de viaje me enteré tarde que existía, ojalá la difundan más en regiones"
- decisión de participar: positivo · fuerte · "Pero no me arrepiento para nada"
- Emoción: satisfaccion · Propone: Difundir la beca de viaje con más anticipación y más en regiones

## h15

> Ya, mira, hasta ahora bien, supongo. El producto está, está casi listo, lo que me tiene mal es el pitch. Me eligieron a mí para presentar porque dicen que hablo bien, y yo no hablo bien, hablo harto que es distinto. Tenemos tres minutos y en el ensayo me demoré seis. Lo cortamos, lo volví a hacer y me demoré cuatro y medio, y ahí me trabé en la parte de la demo porque se me olvidó qué botón apretar. No sé. El resto del fin de semana ha sido entretenido, el equipo bien, la comida bien, todo bien, pero ahora mismo no puedo pensar en otra cosa que en esos tres minutos. Pregúntame de nuevo mañana a lo mejor te digo otra cosa, o te digo que fue la peor experiencia de mi vida, depende de cómo salga.

**Pipeline**

- El producto está casi listo · satisfaccion 0.4 · tema «Proyecto avanza aunque incompleto» · "El producto está, está casi listo"
- Le angustia tener que presentar el pitch · angustia 0.8 · tema «Agotamiento, estrés y malestar extremo» · "lo que me tiene mal es el pitch"
- No logra ajustar el pitch a los tres minutos · preocupacion 0.7 · tema «Agotamiento, estrés y malestar extremo» · "Tenemos tres minutos y en el ensayo me demoré seis"
- Se trabó en la demo durante el ensayo · frustracion 0.6 · tema «Agotamiento, estrés y malestar extremo» · "me trabé en la parte de la demo porque se me olvidó qué botón apretar"
- El fin de semana, equipo y comida han sido buenos · satisfaccion 0.5 · tema «Comida bien, café y duchas insuficientes» · "El resto del fin de semana ha sido entretenido, el equipo bien, la comida bien"

**Haiku solo**

- producto: positivo · leve · "El producto está, está casi listo"
- pitch: negativo · fuerte · mejora · "lo que me tiene mal es el pitch"
- hablar en público: negativo · moderada · "yo no hablo bien, hablo harto que es distinto"
- equipo: positivo · moderada · "el equipo bien"
- comida: positivo · leve · "la comida bien"
- ambiente del fin de semana: positivo · leve · "El resto del fin de semana ha sido entretenido"
- Emoción: preocupacion · Propone: nada
