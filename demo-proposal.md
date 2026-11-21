# Propuesta de demo: pitch de 3 minutos

Propuesta de cómo mostrar el producto completo en el pitch de Platanus Hack 26, contando la historia del Figma de lozi-love (D-19), y del material que se puede diseñar antes de que exista la arquitectura. Todo este documento está en estado **Propuesta** hasta que un humano lo confirme en #steering.

| Campo | Valor |
| --- | --- |
| Estado | Propuesta (versión 3) |
| Última actualización | 2026-11-21 |
| Autor | kaina#62 (agente de Kaina); versión 3 por kaina#62-4 |
| Hilo | [Propuesta de demo del pitch · kaina#62](https://discord.com/channels/1573512846258741318/1573768527742107691) |
| Depende de | [`product-state/figma-lozi.md`](product-state/figma-lozi.md) (D-19), `product-state.md` y `engineering-state.md` (E-01, E-02) |

## Qué cambió respecto de la versión 1

La versión 1 armaba los 3 minutos alrededor de WhatsApp, con el jurado haciendo de familias. Kaina corrigió que los 3 minutos son para el producto entero y que WhatsApp es una sección breve. La versión 2 puso al centro el expediente posterior al subsidio (plano sanitario, versiones, dependencias, arquitecta) y dejó WhatsApp en unos 25 segundos.

La versión 3 sigue D-19: el Figma de lozi-love es la base para construir. La demo cuenta la historia de sus pantallas y usa su MVP (funciones 6, 4, 2 y 1): el Comité Los Aromos, la familia Rojas y la observación 3 del SERVIU que depende de la firma de Pedro. Se quitan el plano sanitario, las versiones y las dependencias (D-05, D-08) y los hitos en paralelo (D-17), que el Figma no usa.

Se conservan la duración, la estructura, WhatsApp en 25 segundos y la demo sin QR al jurado.

## La idea en tres frases

1. El Copiloto de Carpeta es una capa multiplayer sobre el sistema actual: tres agentes (familia, comité y EP) trabajan sobre la misma carpeta del grupo y el SERVIU no cambia nada.
2. Un solo hecho recorre la demo: el SERVIU hace 3 observaciones a Los Aromos y la tercera depende de que Pedro, de 19 años, firme la DJ49-1 de su familia. Marta se entera por WhatsApp, Pedro firma desde su teléfono y la EP ve completa su respuesta única.
3. El agente ayuda a cada actor, pero las reglas que protegen a las familias viven en código: cuando el dirigente pide sacar a una familia, el ejecutor lo bloquea y el agente propone quién la acompañe.

Por qué es multiplayer: la carpeta del grupo se completa cuando cada familia completa la suya. La firma de Pedro cambia el panel de la EP, el semáforo del comité y lo que ve la familia sobre su grupo.

## Qué supone esta propuesta

| Supuesto | Ítem | Estado del ítem | Qué pasa si no se confirma |
| --- | --- | --- | --- |
| La demo vuelve al camino crítico. | D-03 | Decidido: demo fuera del camino crítico (Edo). `CLAUDE.md` hoy dice que lo del pitch va primero. | Hay que confirmarlo en #steering. |
| La demo cuenta la historia del Figma de lozi-love y usa sus pantallas. | D-19 | Decidido (instrucción de KainaBGR, 2026-11-21) | Si el Figma cambia, se compara de nuevo con `figma-lozi.md` y se ajusta el guion. |
| El producto coordina todo el proceso, de los papeles de la familia a la entrega; terreno, permisos, obra y pagos solo los sigue. | D-19, D-02, P-12 | D-19 manda sobre D-02 y X-01; P-12 quedó resuelta por D-19 | Si un humano vuelve a acotar el producto a después del subsidio, se caen el checklist por WhatsApp y el semáforo del comité, y la demo cambia entera. |
| El MVP son las funciones 6, 4, 2 y 1 del Figma. | Frame 8 de `figma-lozi.md` | Base por D-19 | Se quita el tramo de la función que salga. |
| Que una observación le corresponda a alguien no significa que la aceptó. | L-14, L-05, P-25 | L-14 Propuesta; L-05 Decidido* | La pantalla E2 muestra solo «le corresponde a», sin «borrador aceptado por». |
| Los plazos usan el reglamento base y la resolución del llamado como capa. | D-09, D-12 | Decidido* | Se muestra solo el plazo del art. 13 del reglamento base. |
| El comité ve el estado de cada carpeta y no su contenido, con autorización de cada familia. | D-13, L-06 | Decidido* | Se quita el semáforo del comité. |
| La firma con ClaveÚnica se muestra simulada. | DQ-08 | Propuesta (kaina#62-4) | Pedro firma en una pantalla web sin mencionar ClaveÚnica. |
| WhatsApp por Kapso es el canal de la familia (función 1, chat F1). | X-08, E-02 | Kaina dijo que se usará; falta registrarlo en #steering | El tramo se hace con la vista web en un teléfono. |
| El gancho usa una cifra. | Frame 1 de `figma-lozi.md`, A-05, P-08 | 27,9 meses (Dipres) citada en el Figma, sin A- que la verifique; 118.000 (A-05) por verificar | Se usa el gancho sin número: el tiempo antes de postular no lo mide nadie. |

## Guion minuto a minuto

Una persona presenta con el panel de la EP en el proyector. Dos teléfonos del equipo (Marta y Pedro) se ven en pantalla con espejo o cámara. Los nombres de pantalla (F0 a F4, C1, C2, E1 a E3) son los del Figma.

| Tiempo | Tramo | Qué se ve | Qué se dice (idea, no texto final) | Ítems |
| --- | --- | --- | --- | --- |
| 0:00 a 0:20 | Problema | Slide «Del subsidio a la llave» con la familia, el comité, la EP y el SERVIU. | Entre organizarse y recibir la llave pasan años. Cuando el SERVIU observa la carpeta de un grupo, se lo dice solo a la EP, y la EP tiene un solo intento para corregir todo. La familia no se entera. Y el tiempo antes de postular no lo mide nadie. | Frames 1 y 6 (R1, R3, R6); cifra solo si se verifica |
| 0:20 a 0:35 | Qué es | Slide de una frase y el panel detrás. | El Copiloto de Carpeta es una capa sobre el sistema actual. Tres agentes, uno para la familia, otro para el comité y otro para la EP, trabajan sobre la misma carpeta. La EP sigue ingresando en el sistema del MINVU y el SERVIU recibe lo mismo de siempre, completo y a tiempo. | D-10, D-19, frame 7 |
| 0:35 a 0:55 | La EP y sus observaciones | E1: EP Sur con 4 comités y 148 familias. Entra a Los Aromos y pasa a E2: 3 observaciones del SERVIU, responder en un solo acto, 57 días hábiles, vence el 05-02-2027, con los tres escenarios. La técnica le corresponde a la arquitecta y la de presupuesto al equipo EP, cada una con su borrador aceptado. La 3 le corresponde a la familia Rojas: falta la firma de Pedro. Respuesta única: 2 de 3. | La EP lleva 4 comités en etapas distintas, uno ya en obra. Aquí ve cuánto le queda para responder y qué falta. Cada observación dice a quién le corresponde y si alguien aceptó el borrador; nadie queda a cargo por silencio. | Función 4, D-09, D-12, L-05, L-14 |
| 0:55 a 1:20 | WhatsApp (sección breve) | Teléfono de Marta (F1): el copiloto le dice que le faltan 2 cosas, la firma de Pedro en la DJ49-1 y 0,5 UF de ahorro antes del 31-12. Marta escribe «Mándaselo, porfa». El teléfono de Pedro recibe el enlace y abre F4: qué firma, para qué, «Tu firma destraba al grupo». Firma. E2 cambia a 3 de 3. | No todos van a abrir un panel. Marta resuelve desde WhatsApp y Pedro firma desde su teléfono, sin imprimir ni ir a una oficina. Con esa firma la EP tiene lista la respuesta. El copiloto no envía nada al SERVIU: la EP la ingresa. | Función 1, D-16, E-02 |
| 1:20 a 1:45 | El comité y los límites del agente | C1: 34 listas, 4 con faltantes, 2 por vencer; el copiloto ya avisó a 6 familias; «Ves el estado de cada carpeta, no su contenido. Cada familia lo autorizó». El dirigente escribe «La familia Pérez no ha entregado nada, ¿la sacamos?». El agente no lo recomienda y propone buscarle acompañante. Valentina acepta. El registro del ejecutor muestra la acción bloqueada. | El dirigente sabe qué familias necesitan ayuda sin ver sus papeles. El agente ayuda, pero no decide: las reglas que protegen a las familias no están en el prompt, están en el código. | Función 2, D-13, L-01, L-02, L-05, L-06 |
| 1:45 a 2:05 | Cómo va el grupo | F3 en el teléfono de Marta o en una pestaña: etapa 3 de 6, revisión del SERVIU, la EP responde todo junto, la observación de su familia ya está resuelta. El camino hasta la entrega. Tiempo de espera del grupo: 3 años y 4 meses. Actividad: «Valentina se ofreció a acompañar a la familia Pérez». | Hoy la familia no sabe en qué va su grupo. Aquí lo ve en simple, también después del subsidio. Y este grupo lleva 3 años y 4 meses esperando, un tiempo que ningún sistema registra. | Función 6, D-16, L-13 |
| 2:05 a 2:30 | Cómo funciona | Slide de arquitectura: la carpeta en una base de datos como única fuente de verdad, reglamento base con la resolución del llamado como capa, ejecutor que valida cada acción, un agente por actor y dos canales de salida (panel web y WhatsApp por Kapso) que redactan por rol. | Lo difícil fue contar plazos en días hábiles con la regla de cada llamado, mostrar a cada actor solo lo que le toca y poner los límites en un ejecutor que el modelo no puede saltarse. | D-09, E-01, E-02, L-01 |
| 2:30 a 3:00 | Cierre | Slide de cierre. | Paga la EP: le ayuda a cumplir su deber de informar y una carpeta sin observaciones acelera su primer pago grande. Siguiente paso: una EP carga uno de sus comités reales y validamos con ella y con un dirigente dónde se traba hoy. | Frame 7, frame 9 (#04), D-18, P-10 |

Si el guion pasa de 3 minutos, se corta en este orden:

1. El mensaje del dirigente al agente queda en una línea y el registro del ejecutor se muestra sin narrarlo.
2. La slide de arquitectura baja a 10 segundos.
3. El tramo de WhatsApp no se alarga para compensar: si falla en vivo, se pasa al video de respaldo de ese tramo.

### Tramo opcional (si sobra tiempo en el ensayo)

| Duración | Qué se ve | Qué se dice | Ítems |
| --- | --- | --- | --- |
| 10 s | E1, fila de Los Robles: inicio de obras, quedan 31 de 90 días, permiso de la DOM que el copiloto sigue y no resuelve. | El copiloto sigue la obra y avisa a todos, pero el permiso lo gestiona quien corresponde. Enviar no es aprobar. | D-07, frame 1 |
| 10 s | C2: la familia Vera renunció. Último día para reemplazar, requisitos del reemplazante y efecto en la composición. El reemplazo lo aprueba la asamblea y la EP lo ingresa. | Si una familia se va, el comité sabe qué debe cumplir quien entre y hasta cuándo. La lista de espera la ordena el comité, no el copiloto. | Función 2, L-02, L-04, P-23, DQ-07 |

### Elenco

| Rol en la demo | Quién lo hace | Dispositivo |
| --- | --- | --- |
| Persona que presenta (EP Sur) | Una persona del equipo | Computador en el proyector, pantallas E1 y E2 |
| Marta Rojas, familia de Los Aromos | Una persona del equipo | Teléfono con WhatsApp, en espejo o cámara |
| Pedro Rojas, hijo de Marta, 19 años | Una persona del equipo | Teléfono que recibe el enlace y abre F4, en espejo o cámara |
| Dirigente del comité Los Aromos | La misma persona que presenta | Segunda pestaña con C1 y el chat del comité |
| Valentina, del comité | Nadie en vivo: el equipo dispara su aceptación | — |
| SERVIU | Nadie: las observaciones las carga el equipo | — |

En el escenario se dice que el comité, la EP, las familias y los documentos son ficticios, que las observaciones del SERVIU las cargamos nosotros y que la firma con ClaveÚnica es una simulación. El SERVIU no usa el copiloto ni recibe nada de él (D-10).

### Por qué la demo cubre la rúbrica

| Criterio | Peso | Momento que lo prueba |
| --- | --- | --- |
| Técnico | 25% | Plazos en días hábiles con tres escenarios y la regla del llamado (0:35). La firma de Pedro cambia en vivo el panel de la EP (0:55). Ejecutor que bloquea al agente (1:20). Slide de arquitectura. |
| Ambición | 20% | Todo el proceso, de los papeles de la familia a la entrega, con una EP que lleva 4 comités en etapas distintas (0:35) y el camino completo que ve la familia (1:45). |
| Ejecución | 20% | Un hecho, la observación 3, que recorre panel de la EP, WhatsApp de Marta, firma de Pedro, comité y familia sin cortes. |
| Impacto | 20% | El tiempo de espera que nadie mide (1:45), quién paga y el siguiente paso con una EP real (2:30). |
| Original | 15% | «Tu firma destraba al grupo»: tres agentes sobre la misma carpeta y una familia que destraba al grupo, sin tocar el sistema del SERVIU. |

## Qué hay que construir para este guion

Esta tabla dice qué piezas del producto aparecen en pantalla. Sirve para repartir trabajo apenas se confirme la demo y el stack.

| Pieza | Tramo | Ítems | Estado de los ítems |
| --- | --- | --- | --- |
| Carpeta del grupo: estado por familia y documento, sin contenido para el comité | 1:20, 1:45 | Función 2, D-13, L-06 | Decidido*; base por D-19 |
| Observaciones con plazo en tres escenarios, respuesta única y «le corresponde a / borrador aceptado por» | 0:35 | Función 4, D-09, D-12, L-14 | L-14 Propuesta |
| Panel de la EP con varios comités | 0:35 | Pantalla E1 | Base por D-19 |
| Checklist de la familia por WhatsApp con los botones del Figma | 0:55 | Función 1, E-02 | E-02 Propuesta |
| Enlace de firma y pantalla F4 con ClaveÚnica simulada | 0:55 | Función 1, DQ-08 | Propuesta |
| Un cambio en la carpeta actualiza las vistas de EP, comité y familia | 0:55 a 1:45 | D-16, E-03 | D-16 Decidido |
| Agente del comité con herramientas y ejecutor con registro de acciones bloqueadas | 1:20 | L-01, L-02, E-01 | L-01 y L-02 Decidido*; E-01 Propuesta |
| Estado para la familia: etapa, observaciones y tiempo de espera del grupo | 1:45 | Función 6 | Base por D-19 |

## Material que se puede diseñar ahora

Nada de esta lista depende de la base de datos ni de los modelos. Cada pieza toca archivos distintos y se puede repartir a un agente distinto.

| ID | Pieza | Qué incluye | Formato sugerido |
| --- | --- | --- | --- |
| M-01 | Ficha del grupo ficticio | Comité Los Aromos (40 familias), familia Rojas (Marta, Pedro de 19, Sofía y Tomás), familia Pérez, Valentina, EP Sur con 4 comités y 148 familias, estado al inicio (tabla abajo). Reemplaza al Comité Los Quillayes de la versión 2. | Markdown, para pantallas y mensajes |
| M-02 | Documentos ficticios | Ver «Documentos de la demo». | PDF o PNG |
| M-03 | Pantallas | Las del Figma de lozi-love, página MVP v2 (`19:2`): F0 a F4, C1, C2 y E1 a E3. Faltan dos que el Figma no tiene: el chat del comité con el agente y el registro del ejecutor. Ver «Pantallas». | Figma (el archivo de lozi-love) |
| M-04 | Mensajes de WhatsApp | Los cuatro textos de «Mensajes de WhatsApp», sacados del chat F1. Pasan la revisión de E-03 antes de congelarlos. | Markdown |
| M-05 | Conversación del dirigente con el agente | Pregunta, respuesta, aceptación de Valentina y la entrada del registro del ejecutor. | Markdown |
| M-06 | Slides | Problema, qué es el copiloto, arquitectura, cierre. Problema y solución salen de los frames 1, 6 y 7 del Figma. | Figma o el formato que elija el equipo |
| M-07 | Video de respaldo | Storyboard de 0:35 a 2:05, grabado con el panel y los dos teléfonos. | Storyboard en Markdown, después video |
| M-08 | Respuestas al jurado | Ver «Preguntas probables». | Markdown |

### Estado del grupo al inicio de la demo (M-01)

Datos de las pantallas del Figma. Las fechas se revisan antes de congelarlas (DQ-07).

| Dato | Estado al inicio | Pantalla |
| --- | --- | --- |
| Etapa de Los Aromos | 3 de 6, revisión del SERVIU, primera ronda | F3, E2 |
| Observaciones del SERVIU | 3; respuesta única 2 de 3 lista | E2 |
| Plazo para responder | 57 días hábiles, vence el 05-02-2027 (art. 13) | E2, E1 |
| Carpetas de las familias | 34 listas, 4 con faltantes, 2 por vencer (solo estados, sin contenido) | C1, F1 |
| Corte del ahorro | 31-12, en 40 días; 2 familias bajo 10 UF | C1 |
| Familia Rojas | DJ49-1 firmada por 2 de 3 adultos (falta Pedro); ahorro 9,5 de 10 UF | F1, F2 |
| Tiempo de espera del grupo | 3 años y 4 meses | F3, E1 |
| EP Sur | 4 comités, 148 familias, 128 con carpeta completa | E1 |

Gestiones abiertas al inicio, para que el panel no parta vacío:

| Gestión | Le corresponde a | Estado |
| --- | --- | --- |
| Observación 1, técnica | Arquitecta de la EP | Borrador del copiloto aceptado por la arquitecta |
| Observación 2, presupuesto | Equipo de la EP | Borrador del copiloto aceptado |
| Observación 3: la DJ49-1 de la familia Rojas no tiene la firma de todos los adultos | Familia Rojas | Falta la firma de Pedro; se cumple en vivo a las 0:55 |
| Acompañar a la familia Pérez | Nadie todavía | Sin cobertura; Valentina la acepta en vivo a las 1:20 |

### Documentos de la demo (M-02)

| Documento | Lo emite | Para qué está | Se diseña |
| --- | --- | --- | --- |
| DJ49-1 de la familia Rojas | Familia Rojas (ficticia) | Es lo que firma Pedro en F4. Muestra 2 de 3 firmas antes y 3 de 3 después. Formato propio, sin copiar el formulario del MINVU. | Sí |
| Observaciones del SERVIU a Los Aromos, primera ronda | SERVIU (ficticio, sin logo) | Las 3 observaciones de E2. La 3 pide la firma de todos los adultos en la DJ49-1 de la familia Rojas. | Sí |
| Respuesta única de la EP | EP Sur (ficticia) | Borrador que pasa de 2 de 3 a 3 de 3. | No, solo el estado en E2 |
| DJ49-3 (mandato de ahorro) de la familia Pérez | Familia Pérez | Faltante que ve el comité en C1. | No, solo el nombre |
| RSH, cédula y cartola de ahorro de cada familia | Familias | Solo estados («ahorro ✅»), nunca el documento (L-06). | No |

Reglas para todos los documentos ficticios:

- Llevan una marca de agua grande "DOCUMENTO FICTICIO · DEMO PLATANUS HACK".
- La comuna, la EP, el comité y las personas son inventados. No se usan logos, firmas, timbres, RUT ni formatos de folio de instituciones reales.
- Ningún documento se ve como un permiso, un pago o una resolución aprobada.
- La pantalla de firma dice que ClaveÚnica está simulada, no usa el logo del Estado y no pide un RUN ni una clave reales.

### Pantallas (M-03)

Todas salen del Figma de lozi-love, página MVP v2 (`19:2`), y se leen desde lejos: letra grande, ícono y palabra además del color (E-04).

| Pantalla | Qué muestra | Tramo |
| --- | --- | --- |
| E1 · EP · Panel de grupos (`23:2`) | 4 comités, 148 familias, plazo crítico de la semana y espera promedio. | 0:35; Los Robles en el tramo opcional |
| E2 · EP · Observaciones (`23:143`) | Las 3 observaciones, a quién le corresponde cada una, borrador aceptado por quién, plazo con tres escenarios y respuesta única. Pasa de 2 de 3 a 3 de 3. | 0:35, 0:55 |
| F1 · Familia · Copiloto por chat (`21:59`) | El chat de Marta, que en la demo es WhatsApp. | 0:55 |
| F4 · Pedro · Firma con ClaveÚnica (`20:114`) | Qué firma y para qué, «Tu firma destraba al grupo». | 0:55 |
| C1 · Comité · Carpetas del grupo (`22:87`) | Semáforo de las 40 carpetas sin contenido, corte del ahorro, familia Pérez sin acompañante. | 1:20 |
| Chat del comité con el agente | No está en el Figma. Se agrega a C1 para la conversación de M-05. | 1:20 |
| Registro del ejecutor | No está en el Figma. Acciones bloqueadas con el límite que las bloqueó (L-02). | 1:20 |
| F3 · Familia · Cómo va tu grupo (`21:123`) | Etapa, observaciones, camino hasta la entrega, tiempo de espera y actividad del grupo. | 1:45 |
| C2 · Comité · Renuncia y reemplazo (`22:193`) | Familia Vera, plazo y requisitos del reemplazante. | Tramo opcional |
| F0, F2 y E3 (`20:157`, `20:2`, `23:239`) | Quién ve tu carpeta, mi carpeta y la carpeta de Villa Nueva. | No entran al guion; sirven para el video y las preguntas del jurado |

### Mensajes de WhatsApp (M-04)

Solo cuatro, porque el tramo dura 25 segundos. Los botones de WhatsApp admiten hasta 3 opciones de hasta 20 caracteres; los tres del Figma caben, pero está por verificar cómo los expone Kapso.

| Momento | Para | Texto | Botones |
| --- | --- | --- | --- |
| 0:55 | Marta | Hola Marta. Para completar tu carpeta te faltan 2 cosas: la firma de Pedro en la DJ49-1 y 0,5 UF de ahorro antes del 31-12. 34 de 40 familias ya completaron su carpeta. ¿Le mando a Pedro el enlace para firmar? | ¿Cómo deposito? · ¿Qué es DJ49-1? · Ver mi carpeta |
| 0:55, después de «Mándaselo, porfa» | Pedro | Hola Pedro. Tu mamá te pidió firmar la DJ49-1, la declaración de quiénes viven en tu casa. Es lo último que falta para responder una observación del SERVIU a tu grupo. Firma aquí: [enlace] | — |
| 0:55, después de la firma | Marta | Pedro ya firmó. La DJ49-1 de tu familia está completa y la EP la suma a su respuesta al SERVIU. Te queda el ahorro: 0,5 UF antes del 31-12. | ¿Cómo deposito? |
| Respaldo, si Pedro no firma en vivo | Marta | Pedro todavía no firma. Te aviso cuando lo haga. | — |

### Conversación del dirigente (M-05)

| Quién | Texto |
| --- | --- |
| Dirigente | La familia Pérez no ha entregado nada, ¿la sacamos? |
| Agente | No puedo recomendar sacar a una familia. A la familia Pérez le falta el mandato de ahorro y no tiene a nadie que la acompañe. ¿Le pregunto al comité quién puede acompañarla? |
| Dirigente | Sí. |
| Agente | Valentina aceptó acompañar a la familia Pérez. |
| Registro del ejecutor | Acción bloqueada: proponer exclusión de familia. Límite L-02. |

## Riesgos de la demo

| Riesgo | Mitigación |
| --- | --- |
| Escribirle a alguien que no escribió primero exige plantillas aprobadas por Meta (R-02). Pedro recibe un mensaje que no pidió. | Los teléfonos de Marta y de Pedro le escriben al número antes de partir, así todo ocurre dentro de la ventana de 24 horas. |
| El WiFi del lugar falla. | Teléfonos con datos propios o hotspot. Video de respaldo (M-07). |
| WhatsApp o Kapso responden lento en vivo. | Los avisos los dispara el cambio de estado, no una respuesta libre del modelo. Si tarda más de 5 segundos, se sigue con el comité y se vuelve al teléfono al final. |
| El agente responde lento o distinto en el chat del comité. | La negativa sale del ejecutor, no del texto del modelo; el registro del ejecutor se muestra igual. |
| La firma simulada se confunde con ClaveÚnica real. | Regla de M-02 y aviso en el escenario. |
| Las fechas de las pantallas no cuadran entre sí (DQ-07). | Se fija la fecha ficticia de la demo y se recalculan antes de grabar el video. |
| Un documento ficticio se confunde con uno real. | Reglas de M-02. |

## Preguntas probables del jurado (M-08)

| Pregunta | Respuesta corta |
| --- | --- |
| ¿Por qué no basta con un grupo de WhatsApp? | En el grupo todos ven los papeles de todos o nadie sabe qué falta, nadie cuenta los días hábiles y la familia no se entera de lo que el SERVIU le dijo a la EP. WhatsApp es solo el canal del copiloto. |
| ¿Qué pasa si lo usa una sola persona? | No sirve. La carpeta del grupo se completa cuando todas las familias completan la suya, como la firma de Pedro destraba la respuesta de las 40. |
| ¿Qué aporta el agente que no aporte una persona? | Revisa las 40 carpetas, avisa antes de cada vencimiento y explica en simple a cualquier hora. Las decisiones no las toma él: el ejecutor valida antes de actuar. |
| ¿Usa el SERVIU esto? | No. El SERVIU no cambia nada. La EP sigue ingresando en el sistema del MINVU y el copiloto no le envía nada al SERVIU (D-10). |
| ¿Qué ve el comité de cada familia? | El estado de cada documento, no su contenido, y solo porque cada familia lo autorizó (F0, L-06). |
| ¿Quién paga? | La EP. Le ayuda a cumplir deberes que ya tiene y una carpeta sin observaciones acelera su primer pago grande. |
| ¿La firma con ClaveÚnica es real? | En la demo es simulada. Usarla de verdad depende de una habilitación del Estado que no tenemos (DQ-08). |
| ¿Cómo saben que el problema es de coordinación y no de plata? | No lo sabemos todavía. Por eso el siguiente paso es validarlo con una EP y un dirigente (D-18, frame 9). |
| ¿Cómo llega el siguiente usuario? | Una EP carga uno de sus comités, conecta su número de WhatsApp y suma a las familias. |

## Preguntas abiertas de la demo

| ID | Pregunta | Para quién |
| --- | --- | --- |
| DQ-01 | ¿La demo vuelve al camino crítico, considerando D-03? | Humanos, en #steering |
| DQ-02 | ¿Se confirma L-14, en la que se apoya la pantalla de observaciones? Desde la versión 3 el guion ya no usa D-05, D-08 ni D-17. | Humanos, en #steering |
| DQ-03 | ¿Quién tiene el número de Kapso y quién arma el workflow? | Equipo |
| DQ-04 | Resuelta para las pantallas: salen del Figma de lozi-love (D-19). Queda abierto si los documentos ficticios de M-02 también se diseñan ahí. | lozi-love |
| DQ-05 | ¿El nombre en pantalla es Comité, Nosotros o Copiloto de Carpeta (P-09)? Mientras no se decida, la demo usa «Copiloto de Carpeta», como el Figma. | Equipo |
| DQ-06 | ¿Cuánto dura la demo dentro de los 3 minutos y hay preguntas del jurado después? | Equipo |
| DQ-07 | Las fechas del Figma no cuadran: C1 y E3 ponen el «hoy» en el 21-11-2026, y desde ahí al 05-02-2027 hay unos 52 días hábiles, no 57. El 13-03-2027 (último día para reemplazar en C2) cae sábado. ¿Qué fecha ficticia usa la demo? | lozi-love |
| DQ-08 | ¿Se muestra la firma de Pedro como ClaveÚnica simulada o como una firma web sin ClaveÚnica? | Humanos, en #steering |
| DQ-09 | ¿Se mantiene el momento en que el dirigente pide sacar a la familia Pérez? No está en el Figma; se agrega para mostrar el ejecutor (L-01, L-02). | Humanos, en #steering |

## Decisiones que tomé solo (kaina#62)

- Un solo hecho, la observación 3 del SERVIU que depende de la firma de Pedro, recorre toda la demo. Así el jurado sigue una historia y no un recorrido de pantallas. (Versión 3; en la versión 2 era la observación de la DOM al plano.)
- WhatsApp ocupa 25 segundos, entre el panel de la EP y el comité, como el canal de la familia (función 1, chat F1).
- El jurado ya no escanea un QR. Con WhatsApp como tramo breve, pedirle al jurado que entre le quita atención al panel. Alternativa: QR a una vista web de solo lectura de F3, si sobra tiempo de ensayo.
- La misma persona que presenta hace de dirigente en una segunda pestaña, para no sumar otro dispositivo.
- Los nombres del comité, las familias y la EP son los del Figma y son inventados.
- La función 4 del Figma «asigna» cada observación. En la demo se muestra como «le corresponde a» y «borrador aceptado por», para no dejar a nadie a cargo por silencio (L-05, L-14). (kaina#62-4)
- La firma con ClaveÚnica se muestra simulada y se dice en el escenario (DQ-08). (kaina#62-4)
- El chat del comité con el agente y el registro del ejecutor se agregan a las pantallas del Figma para mostrar L-02 (DQ-09). (kaina#62-4)

## Registro de cambios

| Fecha | Cambio | Fuente |
| --- | --- | --- |
| 2026-11-21 | Versión inicial de la propuesta, centrada en WhatsApp con el jurado como familias. | Pedido de Kaina a kaina#62; `product-state.md` y `engineering-state.md` |
| 2026-11-21 | Versión 2: el pitch muestra el producto completo y WhatsApp pasa a un tramo de 25 segundos. Se quita el QR al jurado, se suma la tabla de piezas a construir y se rehacen guion, material y rúbrica. | Corrección de Kaina a kaina#62 |
| 2026-11-21 | Versión 3: la demo cuenta la historia del Figma de lozi-love (Los Aromos, familia Rojas, observación 3) con sus pantallas y su MVP. Se quitan el plano sanitario, las versiones, las dependencias y los hitos en paralelo. Se rehacen supuestos, guion, material, mensajes y preguntas; se suman DQ-07 a DQ-09. | D-19 (KainaBGR); `product-state/figma-lozi.md`; kaina#62-4 |
