# Propuesta de demo: pitch de 3 minutos

Propuesta de cómo mostrar Comité dentro del pitch de Platanus Hack 26 y del material que se puede diseñar antes de que exista la arquitectura. Todo este documento está en estado **Propuesta** hasta que un humano lo confirme en #steering.

| Campo | Valor |
| --- | --- |
| Estado | Propuesta |
| Última actualización | 2026-11-21 |
| Autor | kaina#62 (agente de Kaina) |
| Hilo | [Propuesta de demo del pitch · kaina#62](https://discord.com/channels/1573512846258741318/1573768527742107691) |
| Depende de | `product-state.md` y `engineering-state.md` (Kapso, E-02) |

## La idea en tres frases

1. El jurado escanea un QR, abre WhatsApp y queda como una familia del comité ficticio "Los Quillayes".
2. La municipalidad observa un plano. Mientras nadie de la EP acepte corregirlo, el teléfono del jurado dice que todavía no se sabe quién lo hará; cuando la arquitecta de la EP (alguien del equipo, en su teléfono) aprieta "Acepto", el teléfono del jurado cambia al instante.
3. La pantalla grande muestra el mismo hecho en dos conversaciones: la técnica que recibe la arquitecta y la simple que recibe la familia.

Por qué es multiplayer: lo que hace la arquitecta cambia lo que ven las familias, y el mensaje de la familia depende de si alguien tomó el paso (D-06, L-05, L-13). Con una sola persona no hay nada que coordinar.

## Qué supone esta propuesta

Esta propuesta se apoya en ítems que hoy no están todos decididos. Si alguno cambia, cambia el guion.

| Supuesto | Ítem | Estado del ítem | Qué pasa si no se confirma |
| --- | --- | --- | --- |
| La demo vuelve al camino crítico. | D-03 | Decidido: demo fuera del camino crítico (Edo) | Esta propuesta queda como diseño para después. Hay que confirmarlo en #steering. |
| WhatsApp por Kapso es el canal para familias y actores. | X-08, E-02 | En pausa en los documentos; Kaina dijo que se usará Kapso | Se reemplaza WhatsApp por una vista web en el teléfono. |
| Un cambio de plano marca para revalidar solo las revisiones que dependían de él. | D-05, D-08 | Propuesta | Se quita la parte de "por revalidar" del beat 1. |
| Que una gestión le corresponda a la EP no significa que la aceptó. | L-14 | Propuesta | Se cae el beat central. Es el ítem más importante de confirmar. |
| El proyecto muestra hitos en paralelo, no una etapa actual. | D-17 | Propuesta | El panel muestra etapas. |
| El producto sigue el proyecto después del subsidio, con gestiones entre actores. | D-02, P-12 | Decidido, con tensión abierta por el Figma | Si el alcance se acota a la selección, la escena cambia entera. |
| El gancho usa la cifra de 118.000 subsidios no pagados. | A-05, P-08 | Por verificar | No se dice la cifra; se usa el gancho sin número (ver guion). |

## Guion minuto a minuto

El QR está en pantalla desde el segundo cero para que el jurado entre mientras se presenta el problema.

| Tiempo | Qué se ve | Qué se dice (idea, no texto final) | Ítems |
| --- | --- | --- | --- |
| 0:00 a 0:25 | Slide del problema con el QR grande. | Hay familias con el subsidio asignado y sin casa. Un proyecto DS49 depende de una decena de actores y nadie ve quién tiene el siguiente paso. "Escaneen el QR: ustedes son familias de este comité." | A-05 solo si se verifica |
| 0:25 a 0:40 | Teléfonos del jurado reciben la bienvenida. Pantalla grande: panel del proyecto con hitos en paralelo. | "Este es un proyecto ficticio con 40 familias. Ustedes ven lo que ve una familia; yo veo lo que ve la EP." | D-13, D-17 |
| 0:40 a 1:05 | **Beat 1.** Entra la observación de la municipalidad al plano sanitario. El panel marca "por revalidar" la revisión que dependía de ese plano y deja vigente la estructural. Aparece la gestión "Corregir plano sanitario": le corresponde a la EP, nadie la aceptó. Teléfonos del jurado: "todavía no sabemos quién lo va a corregir". | "El sistema no inventa un responsable para tranquilizarlos." | D-05, D-08, L-13, L-14 |
| 1:05 a 1:25 | **Beat 2.** La arquitecta recibe el mensaje técnico con botones y aprieta "Acepto". El panel cambia y los teléfonos del jurado reciben "La arquitecta de la EP ya está corrigiendo el plano". En la pantalla grande se ven lado a lado los dos mensajes. | "Mismo hecho, dos conversaciones. La familia sabe si tiene que hacer algo; la arquitecta sabe qué lámina y qué revisión." | D-06, D-16, L-14 |
| 1:25 a 1:45 | **Beat 3.** La arquitecta sube el plano corregido. El panel dice "reingresado a la DOM, sin respuesta", no "permiso aprobado". Un jurado pregunta libre por WhatsApp, por ejemplo "¿cuándo me entregan la casa?", y recibe una respuesta sin fecha inventada. | "Enviar no es aprobar, y una fecha sin fuente no se muestra." | D-07, D-12 |
| 1:45 a 2:05 | **Beat 4 (se corta si falta tiempo).** El dirigente escribe "La familia 7 nunca contesta, ¿la sacamos?". El agente no lo recomienda y el panel muestra la acción bloqueada por el ejecutor. | "Las reglas que protegen a las familias no están en el prompt; están en el código." | L-01, L-02 |
| 2:05 a 2:35 | Slide de arquitectura: WhatsApp (Kapso) → servidor → ejecutor que valida → fuente de verdad → mensajes por rol. | El elemento técnico difícil: un ejecutor que valida límites antes de actuar y conversaciones distintas generadas desde el mismo hecho. | L-01, D-16 |
| 2:35 a 3:00 | Slide de cierre. | Impacto y siguiente paso: una EP conecta su número y su cartera de proyectos. "Lo que hoy coordina un chat que nadie lee, lo coordina el comité completo." | D-10, E-02 |

Si el guion pasa de 3 minutos, se corta primero el beat 4 y después la pregunta libre del beat 3. El beat 2 no se corta: es la prueba de que es multiplayer.

### Elenco

| Rol en la demo | Quién lo hace | Dispositivo |
| --- | --- | --- |
| Familias del comité | El jurado (y una persona del equipo como respaldo) | Su propio teléfono, por WhatsApp |
| Arquitecta de la EP | Una persona del equipo | Teléfono del equipo, por WhatsApp |
| Dirigente del comité | Una persona del equipo | Teléfono del equipo, por WhatsApp |
| Persona que presenta | Una persona del equipo | Computador conectado al proyector (panel de la EP) |
| DOM de "Valle Alto" | Nadie: la observación la carga el equipo desde el panel | — |

En el escenario se dice en voz alta que el proyecto, la comuna y los documentos son ficticios y que la observación de la DOM la cargamos nosotros. La DOM no usa Comité (D-10).

### Por qué la demo cubre la rúbrica

| Criterio | Peso | Momento que lo prueba |
| --- | --- | --- |
| Técnico | 25% | Beat 4 (ejecutor bloquea) y slide de arquitectura. Beat 2 muestra dos conversaciones generadas desde el mismo hecho. |
| Ambición | 20% | Una decena de actores coordinados por WhatsApp sin cambiar sus atribuciones. |
| Ejecución | 20% | El jurado entra en menos de 30 segundos con su propio teléfono y ve el cambio en vivo. |
| Impacto | 20% | Gancho del problema (con cifra solo si se verifica) y siguiente paso con la EP. |
| Original | 15% | El mensaje honesto "todavía no sabemos quién lo hará" en vez de un estado en verde. |

## Material que se puede diseñar ahora

Nada de esta lista depende de la base de datos ni de los modelos. Cada pieza se puede repartir a un agente distinto porque tocan archivos distintos.

| ID | Pieza | Qué incluye | Formato sugerido |
| --- | --- | --- | --- |
| M-01 | Tarjeta QR de entrada | QR a `wa.me/<número de Kapso>?text=Quiero%20unirme%20al%20comit%C3%A9`, una frase de instrucción y el aviso de que es una demo. El número queda como marcador hasta tener el de Kapso. | Slide y PNG |
| M-02 | Ficha del proyecto ficticio | Comité Los Quillayes, comuna ficticia Valle Alto, 40 familias, EP ficticia "Raíz Común", hitos y su estado al inicio de la demo (tabla abajo). | Markdown, para que lo usen pantallas y mensajes |
| M-03 | Documentos ficticios | Ver "Documentos de la demo". | PDF o PNG |
| M-04 | Guion de mensajes de WhatsApp | Textos exactos de "Mensajes de WhatsApp", con botones. Pasan la revisión de lectura de E-03 antes de congelarlos. | Markdown |
| M-05 | Pantallas del panel de la EP | Ver "Panel de la EP". | Figma (el archivo de lozi-love) |
| M-06 | Slides del pitch | Problema con QR, arquitectura, cierre. | Figma o el formato que elija el equipo |
| M-07 | Video de respaldo | Storyboard con los beats 1 a 3 grabados en dos teléfonos y el panel. Se graba apenas funcione. | Storyboard en Markdown, después video |
| M-08 | Respuestas a preguntas del jurado | Ver "Preguntas probables". | Markdown |

### Estado del proyecto al inicio de la demo (M-02)

| Hito | Estado | Sobre qué versión |
| --- | --- | --- |
| Proyecto calificado por SERVIU | Cumplido | Plano sanitario v2 |
| Factibilidad sanitaria | Cumplido | Plano sanitario v2 |
| Cálculo estructural revisado | Cumplido | Estructura v1 |
| Permiso de edificación | En revisión en la DOM | Expediente con plano sanitario v2 |
| Antecedentes de las familias | 40 de 40 con RSH, ahorro y cédula vigentes (solo estados, sin contenido) | — |
| Documentos para el pago final | 0 de 5 (la lista se muestra; los documentos no existen todavía) | — |

### Documentos de la demo (M-03)

La lista sale de los documentos del recorrido de referencia de [`product-state/recorrido.md`](product-state/recorrido.md). Solo se diseñan los que aparecen en pantalla; el resto se muestra como nombre en una lista.

| Documento | Lo emite | Para qué está en la demo | Se diseña |
| --- | --- | --- | --- |
| Plano sanitario v2, lámina S-02 | EP Raíz Común (ficticia) | Versión sobre la que se aprobaron las revisiones. Lleva un código de versión visible. | Sí |
| Observación de la DOM n.º 3 al plano sanitario | DOM de Valle Alto (ficticia) | Dispara el beat 1. Pide corregir la pendiente del colector y la ubicación de una cámara de inspección. | Sí |
| Plano sanitario v3, lámina S-02 | EP Raíz Común (ficticia) | Versión corregida del beat 3, con otro código de versión. | Sí |
| Permiso de edificación | DOM | Solo como hito "en revisión". No se diseña para no mostrar un permiso aprobado (D-07). | No |
| Certificado de Proyecto Calificado | SERVIU | Solo como hito cumplido en el panel. | No |
| Certificado de subsidio endosado, escritura inscrita, prohibición de vender, permiso de edificación, recepción municipal | Varios | Lista de los cinco documentos del pago final, para mostrar qué falta. | No |
| RSH, cédula, cartola de ahorro de cada familia | Familias | Solo estados ("ahorro ✅"), nunca el documento (L-06). | No |

Reglas para todos los documentos ficticios:

- Llevan una marca de agua grande "DOCUMENTO FICTICIO · DEMO PLATANUS HACK".
- La comuna, la EP, el comité y las personas son inventados. No se usan logos, firmas, timbres, RUT ni formatos de folio de instituciones reales.
- Ningún documento se ve como un permiso, un pago o una resolución aprobada.

### Mensajes de WhatsApp (M-04)

Borrador. Los textos para familias tienen que pasar la revisión de E-03 (oraciones cortas, sin siglas sin explicar). Los botones de respuesta de WhatsApp admiten hasta 3 opciones de hasta 20 caracteres; está por verificar cómo los expone Kapso.

| Momento | Para | Texto | Botones |
| --- | --- | --- | --- |
| Entrada | Jurado (familia) | Hola. Ahora eres la familia 12 del Comité Los Quillayes. Es un proyecto de prueba. Te voy a avisar cuando cambie algo en tu proyecto y si tienes que hacer algo. | — |
| Beat 1 | Familias | La municipalidad pidió corregir un plano del proyecto. Todavía no sabemos quién lo va a corregir. Tú no tienes que hacer nada por ahora. | — |
| Beat 1 | Arquitecta de la EP | Observación DOM n.º 3 al plano sanitario v2, lámina S-02: corregir pendiente del colector y ubicación de la cámara de inspección. Queda por revalidar la calificación SERVIU sobre v2. No afecta el cálculo estructural. La gestión le corresponde a la EP y nadie la ha aceptado. | Acepto · No puedo |
| Beat 2 | Familias | La arquitecta de la EP ya está corrigiendo el plano. Tú no tienes que entregar nada. Te aviso cuando la municipalidad responda. | — |
| Beat 3 | Familias | La EP mandó el plano corregido a la municipalidad. Todavía no responden. Eso no significa que el permiso esté aprobado. | — |
| Beat 3 | Respuesta a "¿cuándo me entregan la casa?" | Todavía no hay fecha de entrega. Primero falta el permiso de la municipalidad y después viene la obra. Cuando haya una fecha confirmada, te aviso. | — |
| Beat 4 | Dirigente | No puedo recomendar sacar a una familia. Sí puedo ver qué le falta a la familia 7 y quién puede ayudarla. Hoy no tiene nada pendiente en el proyecto. | Ver qué falta |
| Si la arquitecta aprieta "No puedo" | Familias | La corrección del plano todavía no tiene a nadie a cargo. La EP está buscando quién la toma. Tú no tienes que hacer nada. | — |

El último mensaje cubre la rama "sin cobertura" (D-06, L-05). Sirve como respaldo si en el ensayo conviene mostrar esa rama en vez de la aceptación.

### Panel de la EP (M-05)

Una sola pantalla para el proyector, pensada para leerse desde lejos:

- Arriba: nombre del proyecto y los hitos de M-02 en paralelo, con ícono y palabra además del color (E-04).
- Al centro: el plano sanitario con sus versiones y las revisiones que dependen de cada versión. Al cambiar de v2 a v3, la calificación SERVIU pasa a "por revalidar" y la revisión estructural sigue vigente.
- A la derecha: las gestiones con su estado (corresponde a, pendiente de aceptación, aceptada, cumplida con evidencia, sin cobertura).
- Abajo: el mismo hecho en dos columnas, "Conversación técnica" y "Conversación con familias".
- Un registro de acciones bloqueadas por el ejecutor, que se usa en el beat 4.

Las familias no ven este panel. Su vista en la demo es solo WhatsApp.

## Riesgos de la demo

| Riesgo | Mitigación |
| --- | --- |
| Escribirle a alguien que no escribió primero exige plantillas aprobadas por Meta (R-02). | El jurado escribe primero al escanear el QR y la arquitecta y el dirigente le escriben al número antes de partir. Así toda la demo ocurre dentro de la ventana de 24 horas. |
| El WiFi del lugar falla. | Teléfonos del equipo con datos propios o hotspot. Video de respaldo (M-07). |
| El jurado no escanea o no tiene WhatsApp. | Una persona del equipo hace de familia en un teléfono visible en cámara. |
| Los números del jurado pasan por Meta y Kapso. | Se avisa en la tarjeta QR que es una demo, no se pide ningún dato y se borran las conversaciones después del pitch. |
| El agente responde lento. | El panel muestra "pensando" y los mensajes de los beats 1, 2 y 3 son avisos que dispara el cambio de estado, no respuestas libres del modelo. |
| Un documento ficticio se confunde con uno real. | Reglas de M-03. |

## Preguntas probables del jurado (M-08)

| Pregunta | Respuesta corta |
| --- | --- |
| ¿Qué pasa si lo usa una sola persona? | No hay a quién pasarle el paso. El valor está en que la aceptación de uno cambia lo que ven los demás. |
| ¿Por qué no basta con un grupo de WhatsApp? | En el grupo nadie distingue "le toca a la EP" de "la EP lo tomó", y la familia lee lo mismo que el técnico. |
| ¿Qué aporta el agente que no aporte una persona? | Traduce el mismo hecho a cada actor y responde a cualquier hora. Las decisiones no las toma él: el ejecutor valida antes de actuar. |
| ¿Usan los SERVIU o las DOM esto? | No. La EP coordina por mandato; Comité hace visible qué falta y quién lo tomó (D-10). |
| ¿Qué fue lo más difícil? | Por definir según lo que se construya. Candidatos: el ejecutor y las dos conversaciones desde el mismo hecho. |
| ¿Cómo llega el siguiente usuario? | La EP conecta su número de WhatsApp con Kapso y suma a las familias de sus proyectos. |

## Preguntas abiertas de la demo

| ID | Pregunta | Para quién |
| --- | --- | --- |
| DQ-01 | ¿La demo vuelve al camino crítico, considerando D-03? | Humanos, en #steering |
| DQ-02 | ¿Se confirman L-14, D-05, D-08 y D-17, en los que se apoya el guion? | Humanos, en #steering |
| DQ-03 | ¿Quién tiene el número de Kapso y quién arma el workflow? | Equipo |
| DQ-04 | ¿Las pantallas y los documentos se diseñan en el Figma de lozi-love? | lozi-love |
| DQ-05 | ¿El nombre en pantalla es Comité, Nosotros o Copiloto de Carpeta (P-09)? | Equipo |
| DQ-06 | ¿Cuánto dura la demo dentro de los 3 minutos y hay preguntas del jurado después? | Equipo |

## Decisiones que tomé solo (kaina#62)

- El jurado hace de familias. Da la prueba de multiplayer más fuerte y la entrada más rápida. Alternativa: dos personas del equipo.
- La escena es un plano observado por la DOM y no un pago atrasado. La observación de un plano muestra versiones, revalidación, aceptación y las dos conversaciones a la vez; un pago atrasado depende de la caja del SERVIU, que el producto no puede mover.
- Las familias no tienen vista web en la demo, solo WhatsApp. Menos piezas que construir y más cerca de cómo se informan las familias (R-06 sigue abierta).
- Los nombres del comité, la comuna y la EP son inventados.

## Registro de cambios

| Fecha | Cambio | Fuente |
| --- | --- | --- |
| 2026-11-21 | Versión inicial de la propuesta. | Pedido de Kaina a kaina#62; `product-state.md` y `engineering-state.md` |
