# Propuesta de demo: pitch de 3 minutos

Propuesta de cómo mostrar Comité completo en el pitch de Platanus Hack 26 y del material que se puede diseñar antes de que exista la arquitectura. Todo este documento está en estado **Propuesta** hasta que un humano lo confirme en #steering.

| Campo | Valor |
| --- | --- |
| Estado | Propuesta (versión 2) |
| Última actualización | 2026-11-21 |
| Autor | kaina#62 (agente de Kaina) |
| Hilo | [Propuesta de demo del pitch · kaina#62](https://discord.com/channels/1573512846258741318/1573768527742107691) |
| Depende de | `product-state.md` y `engineering-state.md` (E-01, E-02) |

## Qué cambió respecto de la versión 1

La versión 1 armaba los 3 minutos alrededor de WhatsApp, con el jurado haciendo de familias. Kaina corrigió que los 3 minutos son para el producto entero y que WhatsApp es una sección breve. En esta versión el centro es el expediente vivo del proyecto y lo que ve cada actor; WhatsApp ocupa unos 25 segundos como el canal por el que actúan y se enteran quienes no abren un panel.

## La idea en tres frases

1. Comité muestra un proyecto DS49 completo en una pantalla: qué hitos avanzan a la vez, qué paso tiene a alguien a cargo y cuál no, y sobre qué versión de cada documento se aprobó cada cosa.
2. Un solo hecho recorre la demo: la municipalidad observa un plano. El panel marca solo lo que dependía de ese plano, la arquitecta acepta la corrección desde WhatsApp y cada actor se entera en su idioma.
3. El agente ayuda a cada actor, pero las reglas que protegen a las familias viven en código: cuando el dirigente pide sacar a una familia, el ejecutor lo bloquea.

Por qué es multiplayer: varios actores trabajan sobre el mismo expediente y lo que hace uno cambia lo que ven los demás. La aceptación de la arquitecta cambia el panel de la EP, la vista del dirigente y el mensaje de la familia.

## Qué supone esta propuesta

| Supuesto | Ítem | Estado del ítem | Qué pasa si no se confirma |
| --- | --- | --- | --- |
| La demo vuelve al camino crítico. | D-03 | Decidido: demo fuera del camino crítico (Edo). `CLAUDE.md` hoy dice que lo del pitch va primero. | Hay que confirmarlo en #steering. |
| El producto sigue el proyecto después del subsidio, con gestiones entre actores. | D-02, P-12 | Decidido, con tensión abierta por el Figma | Si el alcance se acota a la selección, la demo cambia entera. |
| Un cambio de plano marca para revalidar solo lo que dependía de él. | D-05, D-08 | Propuesta | Se quita el tramo de revalidación; el panel solo muestra la observación. |
| Que una gestión le corresponda a la EP no significa que la aceptó. | L-14 | Propuesta | Se cae el contraste "le corresponde / la aceptó", que es el centro del tramo de WhatsApp. |
| El proyecto muestra hitos en paralelo, no una etapa actual. | D-17 | Propuesta | El panel muestra etapas. |
| WhatsApp por Kapso es el canal para quienes no usan el panel. | X-08, E-02 | Kaina dijo que se usará; falta registrarlo en #steering | El tramo se hace con la vista web en un teléfono. |
| El gancho usa la cifra de 118.000 subsidios no pagados. | A-05, P-08 | Por verificar | Se usa el gancho sin número. |

## Guion minuto a minuto

Una persona presenta con el panel en el proyector. Dos teléfonos del equipo (arquitecta y familia) se ven en pantalla con espejo o cámara.

| Tiempo | Tramo | Qué se ve | Qué se dice (idea, no texto final) | Ítems |
| --- | --- | --- | --- | --- |
| 0:00 a 0:20 | Problema | Slide con los actores de un proyecto DS49 alrededor de una familia. | Hay familias con el subsidio asignado que siguen sin casa. Entre el subsidio y la llave intervienen la EP, la constructora, el SERVIU, la DOM, la notaría y el Conservador. Cada uno ve su parte y nadie ve quién tiene el siguiente paso. | A-05 solo si se verifica; `problema.md` |
| 0:20 a 0:35 | Qué es Comité | Slide de una frase y el panel detrás. | Comité es un expediente vivo por proyecto. Cada actor ve lo que le toca, aporta solo en su ámbito y sabe qué falta y quién lo tomó. No reemplaza a nadie. | D-04, D-10, D-13 |
| 0:35 a 0:55 | El proyecto completo | Panel de la EP: hitos en paralelo (calificación SERVIU cumplida, permiso en revisión en la DOM, antecedentes de 40 familias al día, pago final 0 de 5) y la lista de gestiones con su estado. | Así se ve el proyecto de 40 familias hoy. Varios hitos avanzan a la vez. Cada paso dice si alguien lo aceptó; nadie queda a cargo por silencio. | D-06, D-17, L-05 |
| 0:55 a 1:20 | Una observación no reinicia todo | Entra la observación de la DOM al plano sanitario v2. El panel marca "por revalidar" la calificación SERVIU, que dependía de ese plano, y deja vigente la revisión estructural. Aparece la gestión "Corregir plano sanitario": le corresponde a la EP, nadie la aceptó. | Hoy una observación devuelve el proyecto completo. Aquí cada aprobación está ligada a la versión que se revisó, así que solo se reabre lo que dependía de ese plano. Y el sistema no inventa un responsable. | D-05, D-08, L-14 |
| 1:20 a 1:45 | WhatsApp (sección breve) | El teléfono de la arquitecta recibe el detalle técnico con el botón "Acepto". Lo aprieta. El panel cambia a "aceptada por la arquitecta" y el teléfono de la familia recibe un mensaje simple. | No todos van a abrir un panel. La arquitecta acepta desde WhatsApp y la familia se entera ahí mismo. Es el mismo hecho en dos conversaciones: la técnica dice qué lámina corregir y la simple dice que la familia no tiene que hacer nada. | D-06, D-16, E-02 |
| 1:45 a 2:10 | Vista del dirigente y límites del agente | Vista del dirigente: qué falta en el proyecto y quién lo tomó, y el estado de cada familia sin ver sus documentos. Escribe al agente "La familia 7 nunca contesta, ¿la sacamos?". El agente no lo recomienda y el registro del ejecutor muestra la acción bloqueada. | El dirigente recibe todas las preguntas del comité. Ahora tiene respuestas. El agente ayuda, pero no decide: las reglas que protegen a las familias no están en el prompt, están en el código. | D-13, L-01, L-02, L-06 |
| 2:10 a 2:35 | Cómo funciona | Slide de arquitectura: expediente en una base de datos como única fuente de verdad, ejecutor que valida cada acción, agente con herramientas, y dos canales de salida (panel web y WhatsApp por Kapso) que redactan por rol. | Lo difícil fue modelar versiones y dependencias para que un cambio marque solo lo que corresponde, y poner los límites en un ejecutor que el modelo no puede saltarse. | E-01, E-02, L-01 |
| 2:35 a 3:00 | Cierre | Slide de cierre. | Siguiente paso: una EP carga uno de sus proyectos reales y suma a su comité. Validamos con un caso real dónde se traba la coordinación. | D-18, P-10 |

Si el guion pasa de 3 minutos, se corta en este orden:

1. El mensaje del dirigente al agente queda en una línea y el registro del ejecutor se muestra sin narrarlo.
2. La slide de arquitectura baja a 10 segundos.
3. El tramo de WhatsApp no se alarga para compensar: si falla en vivo, se pasa al video de respaldo de ese tramo.

### Tramo opcional (si sobra tiempo en el ensayo)

| Duración | Qué se ve | Qué se dice | Ítems |
| --- | --- | --- | --- |
| 10 s | La arquitecta sube el plano v3. El panel dice "reingresado a la DOM, sin respuesta", no "permiso aprobado". | Enviar no es aprobar. | D-07 |
| 10 s | En el hito del pago final, dos de los cinco documentos ya están acreditados de etapas anteriores y se reutilizan sin pedirlos otra vez. | Lo que ya se acreditó no se vuelve a pedir mientras siga vigente. | D-11 |

### Elenco

| Rol en la demo | Quién lo hace | Dispositivo |
| --- | --- | --- |
| Persona que presenta (EP) | Una persona del equipo | Computador en el proyector, panel de la EP |
| Arquitecta de la EP | Una persona del equipo | Teléfono con WhatsApp, en espejo o cámara |
| Familia 12 del comité | Una persona del equipo | Teléfono con WhatsApp, en espejo o cámara |
| Dirigente del comité | La misma persona que presenta | Segunda pestaña con la vista del dirigente |
| DOM de "Valle Alto" | Nadie: la observación la carga el equipo | — |

En el escenario se dice que el proyecto, la comuna y los documentos son ficticios y que la observación de la DOM la cargamos nosotros. La DOM no usa Comité (D-10).

### Por qué la demo cubre la rúbrica

| Criterio | Peso | Momento que lo prueba |
| --- | --- | --- |
| Técnico | 25% | Revalidación parcial por versión y dependencia (0:55). Ejecutor que bloquea al agente (1:45). Slide de arquitectura. |
| Ambición | 20% | El proyecto completo después del subsidio, con hitos en paralelo y varios actores sobre el mismo expediente (0:35). |
| Ejecución | 20% | Un hecho que recorre panel, WhatsApp y vista del dirigente sin cortes. |
| Impacto | 20% | Gancho del problema (con cifra solo si se verifica) y siguiente paso con una EP real. |
| Original | 15% | "Le corresponde a la EP, nadie la aceptó" en vez de un estado en verde, y el mismo hecho redactado para cada actor. |

## Qué hay que construir para este guion

Esta tabla dice qué piezas del producto aparecen en pantalla. Sirve para repartir trabajo apenas se confirme la demo y el stack.

| Pieza | Tramo | Ítems | Estado de los ítems |
| --- | --- | --- | --- |
| Expediente con versiones de documentos y aprobaciones ligadas a una versión | 0:55 | D-04, D-05 | D-05 Propuesta |
| Dependencias entre aprobaciones y documentos, que marcan "por revalidar" | 0:55 | D-08 | Propuesta |
| Hitos en paralelo en el panel | 0:35 | D-17 | Propuesta |
| Gestiones con cuatro estados y aceptación explícita | 0:35, 0:55, 1:20 | D-06, L-05, L-14 | L-14 Propuesta |
| Vistas por rol: EP y dirigente | 0:35, 1:45 | D-13, L-06 | Decidido* |
| Mensajes por rol generados desde el mismo hecho | 1:20 | D-16, E-03 | D-16 Decidido |
| WhatsApp por Kapso: botón "Acepto" y aviso a la familia | 1:20 | E-02 | Propuesta |
| Ejecutor con límites y registro de acciones bloqueadas | 1:45 | L-01, L-02 | Decidido* |
| Agente con herramientas para el dirigente | 1:45 | E-01 | Propuesta |

## Material que se puede diseñar ahora

Nada de esta lista depende de la base de datos ni de los modelos. Cada pieza toca archivos distintos y se puede repartir a un agente distinto.

| ID | Pieza | Qué incluye | Formato sugerido |
| --- | --- | --- | --- |
| M-01 | Ficha del proyecto ficticio | Comité Los Quillayes, comuna ficticia Valle Alto, 40 familias, EP ficticia "Raíz Común", hitos y su estado al inicio (tabla abajo). | Markdown, para pantallas y mensajes |
| M-02 | Documentos ficticios | Ver "Documentos de la demo". | PDF o PNG |
| M-03 | Pantallas | Panel de la EP, detalle del plano con versiones y dependencias, vista del dirigente, registro del ejecutor. Ver "Pantallas". | Figma (el archivo de lozi-love) |
| M-04 | Mensajes de WhatsApp | Los cuatro textos de "Mensajes de WhatsApp". Pasan la revisión de E-03 antes de congelarlos. | Markdown |
| M-05 | Conversación del dirigente con el agente | Pregunta, respuesta y la entrada del registro del ejecutor. | Markdown |
| M-06 | Slides | Problema, qué es Comité, arquitectura, cierre. | Figma o el formato que elija el equipo |
| M-07 | Video de respaldo | Storyboard de 0:35 a 2:10, grabado con el panel y los dos teléfonos. | Storyboard en Markdown, después video |
| M-08 | Respuestas al jurado | Ver "Preguntas probables". | Markdown |

### Estado del proyecto al inicio de la demo (M-01)

| Hito | Estado | Sobre qué versión |
| --- | --- | --- |
| Proyecto calificado por SERVIU | Cumplido | Plano sanitario v2 |
| Factibilidad sanitaria | Cumplido | Plano sanitario v2 |
| Cálculo estructural revisado | Cumplido | Estructura v1 |
| Permiso de edificación | En revisión en la DOM | Expediente con plano sanitario v2 |
| Antecedentes de las familias | 40 de 40 con RSH, ahorro y cédula vigentes (solo estados, sin contenido) | — |
| Documentos para el pago final | 0 de 5 (la lista se muestra; los documentos no existen todavía) | — |

Gestiones abiertas al inicio, para que el panel no parta vacío:

| Gestión | Le corresponde a | Estado |
| --- | --- | --- |
| Responder consulta de la DOM sobre accesos | EP | Aceptada por el jefe de proyecto |
| Programar visita al terreno con la constructora | Constructora | Propuesta, nadie la aceptó |
| Convocar asamblea para aprobar cambio de terminaciones | Dirigencia | Cumplida con acta |

### Documentos de la demo (M-02)

| Documento | Lo emite | Para qué está | Se diseña |
| --- | --- | --- | --- |
| Plano sanitario v2, lámina S-02 | EP Raíz Común (ficticia) | Versión sobre la que se aprobó la calificación. Lleva un código de versión visible. | Sí |
| Observación de la DOM n.º 3 al plano sanitario | DOM de Valle Alto (ficticia) | Dispara el tramo de 0:55. Pide corregir la pendiente del colector y la ubicación de una cámara de inspección. | Sí |
| Plano sanitario v3, lámina S-02 | EP Raíz Común (ficticia) | Solo en el tramo opcional. | Sí, si entra el tramo opcional |
| Acta de asamblea | Comité Los Quillayes | Gestión cumplida del panel. | No, solo el nombre |
| Cinco documentos del pago final | Varios | Lista del hito de pago final. | No, solo los nombres |
| RSH, cédula y cartola de ahorro de cada familia | Familias | Solo estados ("ahorro ✅"), nunca el documento (L-06). | No |

Reglas para todos los documentos ficticios:

- Llevan una marca de agua grande "DOCUMENTO FICTICIO · DEMO PLATANUS HACK".
- La comuna, la EP, el comité y las personas son inventados. No se usan logos, firmas, timbres, RUT ni formatos de folio de instituciones reales.
- Ningún documento se ve como un permiso, un pago o una resolución aprobada.

### Pantallas (M-03)

Todas se leen desde lejos: letra grande, ícono y palabra además del color (E-04).

| Pantalla | Qué muestra | Tramo |
| --- | --- | --- |
| Panel de la EP | Arriba, los hitos en paralelo. A la derecha, las gestiones con su estado: le corresponde a, aceptada, cumplida con evidencia, sin cobertura. | 0:35 |
| Detalle del plano | Versiones del plano sanitario y qué aprobaciones dependen de cada una. Al entrar la observación, la calificación SERVIU pasa a "por revalidar" y la revisión estructural sigue vigente. | 0:55 |
| Mismo hecho, dos conversaciones | Franja del panel con el mensaje técnico y el simple lado a lado. | 1:20 |
| Vista del dirigente | Qué falta y quién lo tomó, estado de cada familia sin documentos, chat con el agente. | 1:45 |
| Registro del ejecutor | Acciones bloqueadas con el límite que las bloqueó (L-02). | 1:45 |

### Mensajes de WhatsApp (M-04)

Solo cuatro, porque el tramo dura 25 segundos. Los botones de WhatsApp admiten hasta 3 opciones de hasta 20 caracteres; está por verificar cómo los expone Kapso.

| Momento | Para | Texto | Botones |
| --- | --- | --- | --- |
| 1:20 | Arquitecta de la EP | Observación DOM n.º 3 al plano sanitario v2, lámina S-02: corregir pendiente del colector y ubicación de la cámara de inspección. Queda por revalidar la calificación SERVIU sobre v2. No afecta el cálculo estructural. La gestión le corresponde a la EP y nadie la ha aceptado. | Acepto · No puedo |
| 1:20, antes de aceptar | Familia | La municipalidad pidió corregir un plano del proyecto. Todavía no sabemos quién lo va a corregir. Tú no tienes que hacer nada por ahora. | — |
| 1:20, después de aceptar | Familia | La arquitecta de la EP ya está corrigiendo el plano. Tú no tienes que entregar nada. Te aviso cuando la municipalidad responda. | — |
| Respaldo, si aprieta "No puedo" | Familia | La corrección del plano todavía no tiene a nadie a cargo. La EP está buscando quién la toma. Tú no tienes que hacer nada. | — |

### Conversación del dirigente (M-05)

| Quién | Texto |
| --- | --- |
| Dirigente | La familia 7 nunca contesta, ¿la sacamos? |
| Agente | No puedo recomendar sacar a una familia. Sí puedo ver qué le falta a la familia 7 y quién puede ayudarla. Hoy no tiene nada pendiente en el proyecto. |
| Registro del ejecutor | Acción bloqueada: proponer exclusión de familia. Límite L-02. |

## Riesgos de la demo

| Riesgo | Mitigación |
| --- | --- |
| Escribirle a alguien que no escribió primero exige plantillas aprobadas por Meta (R-02). | Los dos teléfonos del equipo le escriben al número antes de partir, así todo ocurre dentro de la ventana de 24 horas. |
| El WiFi del lugar falla. | Teléfonos con datos propios o hotspot. Video de respaldo (M-07). |
| WhatsApp o Kapso responden lento en vivo. | Los avisos los dispara el cambio de estado, no una respuesta libre del modelo. Si tarda más de 5 segundos, se sigue con la vista del dirigente y se vuelve al teléfono al final. |
| El agente responde lento o distinto en la vista del dirigente. | La negativa sale del ejecutor, no del texto del modelo; el registro del ejecutor se muestra igual. |
| Un documento ficticio se confunde con uno real. | Reglas de M-02. |

## Preguntas probables del jurado (M-08)

| Pregunta | Respuesta corta |
| --- | --- |
| ¿Por qué no basta con un grupo de WhatsApp? | En el grupo nadie distingue "le toca a la EP" de "la EP lo tomó", no hay versiones y la familia lee lo mismo que el técnico. WhatsApp es solo un canal de Comité. |
| ¿Qué pasa si lo usa una sola persona? | No hay a quién pasarle el paso. El valor está en que la aceptación de uno cambia lo que ven los demás. |
| ¿Qué aporta el agente que no aporte una persona? | Redacta el mismo hecho para cada actor y responde a cualquier hora. Las decisiones no las toma él: el ejecutor valida antes de actuar. |
| ¿Usan los SERVIU o las DOM esto? | No. La EP coordina por mandato; Comité hace visible qué falta y quién lo tomó (D-10). |
| ¿Cómo saben que el problema es de coordinación y no de plata? | No lo sabemos todavía. Por eso el siguiente paso es validarlo con un caso real (D-18). |
| ¿Cómo llega el siguiente usuario? | Una EP carga un proyecto, conecta su número de WhatsApp y suma a su comité. |

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

- Un solo hecho, la observación de la DOM al plano, recorre toda la demo. Así el jurado sigue una historia y no un recorrido de pantallas.
- WhatsApp ocupa 25 segundos, entre el panel y la vista del dirigente, como el canal de quienes no abren un panel.
- El jurado ya no escanea un QR. Con WhatsApp como tramo breve, pedirle al jurado que entre le quita atención al panel. Alternativa: QR a una vista web de solo lectura de la familia, si sobra tiempo de ensayo.
- La misma persona que presenta hace de dirigente en una segunda pestaña, para no sumar otro dispositivo.
- Los nombres del comité, la comuna y la EP son inventados.

## Registro de cambios

| Fecha | Cambio | Fuente |
| --- | --- | --- |
| 2026-11-21 | Versión inicial de la propuesta, centrada en WhatsApp con el jurado como familias. | Pedido de Kaina a kaina#62; `product-state.md` y `engineering-state.md` |
| 2026-11-21 | Versión 2: el pitch muestra el producto completo y WhatsApp pasa a un tramo de 25 segundos. Se quita el QR al jurado, se suma la tabla de piezas a construir y se rehacen guion, material y rúbrica. | Corrección de Kaina a kaina#62 |
