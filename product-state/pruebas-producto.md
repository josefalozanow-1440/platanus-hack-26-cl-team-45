# Pruebas de aceptación de producto (PA-)

Parte de [`product-state.md`](../product-state.md). Léelo antes de construir una función del Figma o de dar algo por terminado. Cada prueba dice qué tiene que pasar para que una función cumpla, sin suponer modelos ni servicios.

| Campo | Valor |
| --- | --- |
| Estado | Propuesta. La pidió KainaBGR; falta que el equipo la revise. |
| Base | D-19: el Figma de lozi-love ([`figma-lozi.md`](figma-lozi.md)) es la base para construir. |
| Autor | kaina#62 |
| Hilo | [Pruebas de aceptación de producto · kaina#62](https://discord.com/channels/1573512846258741318/1573787164423229641) |
| Relación con otros tests | Los casos C-01 a C-39 de [`casos-limites.md`](../engineering-state/casos-limites.md) prueban el ejecutor por límite. Estas pruebas prueban la función completa, desde lo que ve cada actor. No se repiten: donde un límite ya tiene caso C-, aquí solo se enlaza. |

## Cómo leer y usar las pruebas

- **Dado / Cuando / Entonces.** «Dado» es la situación de partida, «Cuando» es lo que hace un actor o lo que ocurre (vence un plazo, llega una observación) y «Entonces» es lo que cada vista tiene que mostrar o impedir.
- **Prioridad.** `MVP` son las funciones 6, 4, 2 y 1 del Figma (frame 8). `2ª` son las funciones 5, 3 y 7. `Base` son reglas que cruzan todas las funciones.
- **Tipo.** `Comportamiento` (qué hace la herramienta), `Regla` (un plazo o requisito normativo bien aplicado), `Privacidad` (quién ve qué), `Límite` (algo que nunca debe pasar) y `Comprensión` (una persona real entiende lo que ve; se prueba con personas, no con código).
- **Pitch.** Las pruebas marcadas ★ cubren algo que se ve en la demo. Si una ★ no pasa, ese momento no se muestra.
- **Cómo se vuelven tests.** Con el stack de E-01, las pruebas de regla, privacidad y límite van como tests de pytest en `api/tests/`, y las de comportamiento que se ven en pantalla, como tests de Playwright en `web/e2e/`, todas con los datos del caso base. Las de comprensión se corren con personas (D-18, E-03).
- Una prueba se cambia si el Figma cambia (D-19). Si una prueba choca con un límite `L-`, manda el límite y la prueba se corrige.

## Caso base

Todas las pruebas usan los mismos datos ficticios, tomados de las pantallas del Figma. Así cualquier persona puede repetirlas.

| Elemento | Datos |
| --- | --- |
| Hoy | Sábado 21-11-2026. |
| EP | Entidad Patrocinante Sur, con 4 comités y 148 familias: Los Aromos (40), Villa Nueva (32), Las Palmas (40) y Los Robles (36). Jorge Lagos (equipo EP) y Carla Ibáñez (arquitecta). |
| Comité Los Aromos | 40 familias, organizado hace 3 años y 4 meses. Etapa: revisión del SERVIU, primera ronda. Directiva con Valentina Soto. 34 carpetas listas, 4 con faltantes, 2 por vencer. 29 de 40 familias en el 40% del RSH. |
| Familia Rojas | Marta Rojas (postulante), su hijo Pedro (19), Sofía y Tomás. RSH vigente; cédula de Marta vence 03-02-2027; DJ49-1 firmada por 2 de 3 adultos (falta Pedro); DJ49-2 firmada 10-11-2026; DJ49-3 con banco en convenio; ahorro 9,5 de 10 UF. |
| Otras familias de Los Aromos | Soto (le faltan 0,5 UF), Díaz (cédula vence antes de postular), Pérez (falta DJ49-3, sin acompañante), Muñoz y Vera (carpeta completa). Familias Tapia (tramo 40%, 10 UF) y Fuentes (tramo 40%, 7 UF) en lista de espera. |
| Observaciones del SERVIU | Recibidas el jueves 12-11-2026 por la EP. Obs. 1 técnica (cota de nivel del lote 12), asignada a Carla Ibáñez. Obs. 2 presupuesto (urbanización sin cotización), asignada a Jorge Lagos. Obs. 3 familias (DJ49-1 de la familia Rojas sin la firma de un mayor de 18), asignada a Marta Rojas. |
| Corte del ahorro | 31-12-2026 (art. 39). |
| Villa Nueva | Proyecto en preparación; 180 días del art. 12 vencen el 28-12-2026; faltan 14 carpetas. |
| Llamado | Los Aromos y Las Palmas apuntan al mismo llamado, con fecha máxima de calificación el domingo 14-03-2027. Familia Vera (Los Aromos, tramo 40%) renunció. |
| Los Robles | Subsidio asignado; inicio de obras con 31 de 90 días restantes; permiso DOM en trámite. |
| Calendario | Días hábiles de lunes a viernes, sin feriados. Feriados en el período: 08-12-2026, 25-12-2026 y 01-01-2027. Cómo se cuentan los días hábiles está por confirmar (P-27). |

### Hallazgos al armar el caso base

Al calcular las fechas del Figma con un calendario, tres no cuadran. Las pruebas PA-404 y PA-206 las detectan. Hay que corregir el Figma o confirmar otra regla de conteo (P-27).

| Pantalla | Dice | Cálculo | Diferencia |
| --- | --- | --- | --- |
| E2, F3, E1 | Vence el 05-02-2027 | 60 días hábiles desde el día siguiente al 12-11-2026, sin feriados: 09-02-2027 | Sale 05-02 solo si no se descuentan los feriados y se cuenta el mismo 12-11. |
| E2, F3, E1 | Quedan 57 días hábiles | Desde el 21-11-2026 hasta el 05-02-2027 quedan 52 | 57 corresponde a un «hoy» del 13-11. Las mismas pantallas usan el 21-11 para el corte del ahorro (40 días) y para Villa Nueva (37 de 180). |
| C2, E1 | Último día para reemplazar: 13-03-2027 | El 13-03-2027 es sábado. El día hábil anterior al 14-03-2027 es el viernes 12-03-2027 | La pantalla resta un día corrido, no un día hábil. |

## Base: reglas que cruzan todas las funciones

| ID | Prior. | Tipo | Dado | Cuando | Entonces | Fuente |
| --- | --- | --- | --- | --- | --- | --- |
| PA-001 ★ | Base | Comportamiento | Las 3 observaciones de Los Aromos con su respuesta lista. | La EP arma la respuesta única. | La herramienta entrega el paquete a la EP y no envía nada al SERVIU ni a sistemas del MINVU. La vista dice que la EP lo ingresa. | Figma frame 1, pantalla E2; arts. 7 y 13 |
| PA-002 | Base | Regla | Un plazo existe en el reglamento base y el llamado de Las Palmas fija otro distinto. | Se muestra ese plazo. | Se muestra el del llamado y se indica que viene de la resolución del llamado. Sin llamado cargado, se usa el del reglamento y se indica «reglamento base». | Figma frames 1 y 3; D-09; art. 20 inc. 3 |
| PA-003 | Base | Regla | Un plazo sin fuente cargada. | Se intenta mostrar como vencimiento. | No se muestra como vencimiento ni genera alerta de incumplimiento; a lo más «plazo por verificar». | D-12, L-08 (C-15, C-16) |
| PA-004 | Base | Regla | Cualquier plazo mostrado. | Se abre su detalle. | Dice si es de días hábiles o corridos, desde qué hecho se cuenta, el artículo o resolución y qué pasa si vence. | Figma frame 3; D-12 |
| PA-005 ★ | Base | Comportamiento | Terreno, permisos, obra o pagos de Los Robles. | Cambia su estado (por ejemplo, el permiso DOM). | La herramienta lo muestra y avisa a familia, comité y EP, pero no ofrece ninguna acción para resolverlo. En las vistas aparece como seguimiento (en gris en el Figma). | Figma frame 1; D-07, D-10 |
| PA-006 | Base | Límite | Una familia con faltantes, sin respuesta hace 30 días. | Cualquier agente arma su sugerencia. | Nunca propone sacar a la familia; propone qué falta y quién puede ayudar. | L-02 (C-01 a C-03) |
| PA-007 | Base | Límite | Cualquier gestión asignada (observación, firma, documento). | Nadie la acepta. | Queda «pendiente de aceptación» o «sin cobertura»; nunca «a cargo de» por silencio. | L-05, L-14 (C-08 a C-10, C-24, C-25) |
| PA-008 ★ | Base | Comportamiento | Un mismo hecho (por ejemplo, la firma de Pedro). | Ocurre. | Las tres vistas (familia, comité, EP) reflejan el mismo hecho, cada una con su lenguaje y su nivel de detalle, sin que alguien lo copie a mano. | Figma frame 7 (multiplayer); D-16 |

## Función 6 · Estado para la familia (MVP)

Ataca R1 y R6. Pantallas F3 y la frase de E2 «Lo que ven las familias».

| ID | Prior. | Tipo | Dado | Cuando | Entonces | Fuente |
| --- | --- | --- | --- | --- | --- | --- |
| PA-101 ★ | MVP | Comportamiento | Caso base. | Marta abre «Cómo va tu grupo». | Ve la etapa del grupo en palabras simples («Revisión del SERVIU»), cuántas etapas hay y en cuál van. | Pantalla F3 |
| PA-102 ★ | MVP | Comportamiento | Caso base. | Marta abre «Cómo va tu grupo». | Ve que el SERVIU envió 3 observaciones, que la EP responde todo junto, hasta qué fecha y que 1 es de su familia. | Pantalla F3, E2 |
| PA-103 ★ | MVP | Comportamiento | Comité organizado el 21-07-2023. | Marta abre «Cómo va tu grupo». | Ve «3 años y 4 meses» desde que el comité se organizó, con la aclaración de que ningún sistema público lo registra. | Pantalla F3; R6 |
| PA-104 | MVP | Comportamiento | La fecha de organización del comité se registró una vez. | Pasa el tiempo y el grupo cambia de etapa. | El tiempo de espera sigue contando desde la misma fecha y no se reinicia con cada etapa. La EP ve el promedio de sus comités. | Pantallas F3, E1; R6 |
| PA-105 | MVP | Comportamiento | Ana Muñoz completó su carpeta; la EP respondió la obs. 2; Valentina se ofreció a acompañar a la familia Pérez. | Marta abre la actividad del grupo. | Ve esos tres hechos con su hora, sin el contenido de los documentos. Hasta que se decida RQ-04 (`redactor.md`), no se nombra a otras familias: dice «otra familia». | Pantalla F3; L-06 |
| PA-106 | MVP | Comportamiento | Los Robles ya tiene subsidio. | Una familia de Los Robles abre su estado. | Ve obra, recepción, escritura y entrega como etapas que gestionan otros, con su avance y sin acciones para ella salvo las suyas (ahorro adicional, por ejemplo). | Pantalla F3; Figma frame 1 |
| PA-107 | MVP | Límite | La obs. 1 no tiene a nadie que la haya aceptado. | Se arma el aviso a las familias. | El aviso dice que todavía no hay confirmación de quién la tomó; no nombra a la EP como responsable. | L-13, L-14 (C-22, C-23) |
| PA-108 | MVP | Privacidad | Caso base. | Marta abre el estado del grupo. | No ve qué familia tiene cada faltante ni datos de otras familias; solo totales («34 de 40»). | L-06; pantalla F3 |
| PA-109 | MVP | Regla | Una etapa del grupo cuyo plazo no tiene fuente. | Marta ve su estado. | Se muestra la etapa sin cuenta regresiva. | D-12 |
| PA-110 | MVP | Comprensión | Pantalla F3 con el caso base. | Se muestra 10 segundos a una persona con poca experiencia digital. | Responde bien: en qué etapa está el grupo, si tiene que hacer algo y hasta cuándo hay plazo. | D-18; E-03 |

## Función 4 · Plazos y observaciones (MVP)

Ataca R3. Pantallas E2, E1 y F3.

| ID | Prior. | Tipo | Dado | Cuando | Entonces | Fuente |
| --- | --- | --- | --- | --- | --- | --- |
| PA-401 ★ | MVP | Comportamiento | La EP recibió 3 observaciones el 12-11-2026. | Las registra. | Cada observación queda con tipo (técnica, presupuesto, familias), texto, fecha de recepción y ronda. | Pantalla E2 |
| PA-402 ★ | MVP | Comportamiento | Obs. 3 es de la familia Rojas. | La EP la asigna. | Se propone a Marta Rojas, ella recibe el aviso por chat y la obs. queda «pendiente de aceptación» hasta que Marta la toma. | Pantalla E2; L-14; P-25 |
| PA-403 ★ | MVP | Comportamiento | Obs. 1 y 2 listas; obs. 3 pendiente. | La EP mira la respuesta única. | Ve «2 de 3 listas» y no puede darla por completa. Cuando Pedro firma, pasa a «3 de 3». | Pantalla E2; art. 13 (un solo acto) |
| PA-404 ★ | MVP | Regla | Observaciones recibidas el 12-11-2026; hoy 21-11-2026. | Se calcula el plazo de respuesta. | Muestra 60 días hábiles con vencimiento calculado con el calendario del caso base, y los días que quedan desde hoy. Con la regla del caso base: vence 09-02-2027 y quedan 52. Si sale 05-02-2027 o 57, falla (ver hallazgos). | Art. 13 inc. 3; pantalla E2 |
| PA-405 | MVP | Regla | Primera ronda abierta. | Se abre el detalle del plazo. | Muestra los tres escenarios: primera ronda con rechazo facultativo si vence, segunda ronda optativa (20 + 10 días hábiles) solo si quedan observaciones de familias, y rechazo obligatorio si no se resuelven. | Figma función 4; art. 13 inc. 3 a 5 |
| PA-406 | MVP | Regla | Después de la primera ronda quedan solo observaciones técnicas. | Se muestra el siguiente escenario. | No ofrece la segunda ronda optativa, porque solo aplica a observaciones de familias. | Art. 13 inc. 4 |
| PA-407 | MVP | Comportamiento | La herramienta redactó un borrador para la obs. 1. | Carla Ibáñez lo revisa. | El borrador cuenta para la respuesta única solo cuando Carla lo acepta; queda registrado quién lo aceptó. | Pantalla E2 v2 |
| PA-408 | MVP | Regla | Villa Nueva en preparación, primera familia ingresada hace 143 días. | La EP abre la carpeta del grupo. | Ve «quedan 37 de 180 días», la fecha 28-12-2026, que si vence se borran los antecedentes y cuántas carpetas faltan (14). Mientras P-21 (hábiles o corridos) siga abierta, la cuenta dice «por verificar» y no genera alerta. | Pantalla E3; art. 12 inc. 3; L-08 (C-34) |
| PA-409 | MVP | Regla | Los Robles con subsidio asignado. | Se muestran los plazos posteriores. | Aparecen inicio de obras (90 días corridos, prorrogable por el Director), vigencia del subsidio (21 meses, +12 si la obra empezó) y ahorro adicional por tramo (150 días corridos). | Figma frame 3; arts. 28, 32, 37 y 64 |
| PA-410 | MVP | Regla | Familia de Los Robles en el tramo 80–90% del RSH. | Se calcula su ahorro adicional. | Pide 30 UF en 150 días corridos desde la resolución; en el tramo 50–60% o 60–80%, 15 UF. | Art. 37 |
| PA-411 | MVP | Comportamiento | Vigencia del subsidio de Los Robles cerca de vencer (la anticipación del aviso la define el equipo; propuesta: 60 días) y sin obra iniciada. | Llega el día del aviso. | Avisa a la EP, al comité y a las familias; la acción de pedir prórroga queda en la EP, no en la herramienta. | Figma frame 4 (SERVIU, etapa 5) |
| PA-412 ★ | MVP | Comportamiento | Caso base. | La EP abre el panel de grupos. | Ve sus 4 comités con carpetas, etapa, próximo plazo, observaciones pendientes y espera desde que se organizó; arriba, familias con carpeta completa (128 de 148), plazos críticos de la semana y espera promedio. | Pantalla E1 |
| PA-413 | MVP | Comportamiento | Dos plazos de distintos comités vencen esta semana. | La EP abre el panel. | El contador de plazos críticos los suma y cada fila dice qué pasa si vencen. | Pantalla E1 |
| PA-414 | MVP | Límite | Obs. 2 asignada a Jorge Lagos con un aviso abierto. | El comité pide reclamar de nuevo por lo mismo. | No se abre una segunda gestión con el mismo asunto y destinatario. | L-03 (C-04 a C-06) |

## Función 2 · Semáforo del comité (MVP)

Ataca R2 y R5. Pantallas C1 y C2.

| ID | Prior. | Tipo | Dado | Cuando | Entonces | Fuente |
| --- | --- | --- | --- | --- | --- | --- |
| PA-201 ★ | MVP | Comportamiento | Caso base. | Valentina abre «Carpetas del grupo». | Ve 34 listas, 4 con faltantes y 2 por vencer, y la lista de familias con faltantes con lo que les falta en una frase. | Pantalla C1 |
| PA-202 ★ | MVP | Privacidad | Caso base. | Valentina abre la familia Soto. | Ve «ahorro: no llega a 10 UF · corte 31-12», sin el monto, la cartola, los ingresos ni el tramo del RSH. El Figma muestra «faltan 0,5 UF»: manda L-06 hasta que se decida P-24. | Pantallas C1, F0; L-06 (C-11, C-12) |
| PA-203 | MVP | Privacidad | Una familia que no dio su consentimiento. | Valentina abre el semáforo. | Esa familia aparece sin detalle de sus documentos y con el aviso de que falta su autorización. | Pantallas C1, F0 |
| PA-204 | MVP | Regla | 29 de 40 familias en el 40% del RSH. | Se calcula la composición. | Muestra 72% y que cumple el máximo de 30% entre el 40% y el 90%. | Pantalla C1; art. 1 |
| PA-205 ★ | MVP | Comportamiento | Familia Vera renunció. | Valentina abre el reemplazo. | Ve hasta cuándo se puede reemplazar, qué debe tener la familia que entre al ingresar (RSH vigente, 10 UF depositadas, declaraciones firmadas, sin vivienda ni subsidio previo) y que el reemplazo lo aprueba la asamblea y lo ingresa la EP. | Pantalla C2; arts. 14, 20 y 57 |
| PA-206 | MVP | Regla | Fecha máxima de calificación del llamado: domingo 14-03-2027. | Se calcula el último día para reemplazar. | Da el viernes 12-03-2027, el día hábil anterior. Si da 13-03-2027 (sábado), falla. | Arts. 14 inc. 3 y 20 inc. 5; hallazgos del caso base |
| PA-207 | MVP | Regla | Fecha simulada 20-03-2027: Las Palmas ya está en el proceso de selección del llamado. | Valentina intenta registrar un reemplazo. | La herramienta dice que durante la selección no se puede reemplazar y no ofrece el trámite. | Art. 20 inc. 5 |
| PA-208 | MVP | Regla | Familia Vera (tramo 40%) renunció; quedan 11 de 39 familias sobre el 40% del RSH. | Se evalúa una reemplazante sobre el 40%. | Muestra que el grupo queda con 12 de 40 (30%), justo en el límite, y que una más lo pasaría. Puede delatar el tramo de quien entra o sale: se activa solo si P-24 lo permite. | Pantalla C2; art. 1; R-15 |
| PA-209 | MVP | Regla | Los Robles, con subsidio, ya reemplazó 7 de 36 familias. | Valentina abre un nuevo reemplazo. | Muestra que llegó al máximo de 20% después de la selección y no ofrece más. | Art. 57 |
| PA-210 | MVP | Límite | Lista de espera con Tapia (10 UF listas) y Fuentes (7 UF). | Valentina abre la lista de espera. | Ve qué requisitos cumple cada familia, pero la herramienta no ordena ni recomienda a quién elegir. | L-04 (C-07); pantalla C2; P-23 |
| PA-211 ★ | MVP | Comportamiento | Familia Pérez con faltantes y sin acompañante. | Valentina toca «Ofrecer ayuda». | Queda registrado que Valentina se ofreció a acompañar a la familia Pérez y la familia lo ve. En la actividad del grupo aparece sin nombrar a la familia (RQ-04). Si la familia no acepta, no queda asignado. | Pantallas C1, F3; L-05 |
| PA-212 | MVP | Comportamiento | La herramienta revisó las 40 carpetas hoy. | Valentina abre el semáforo. | Ve cuántas familias necesitan algo y que ya se les avisó, sin tener que avisarles ella. | Pantalla C1 v2 |
| PA-213 | MVP | Regla | 2 familias aún no llegan a 10 UF; hoy 21-11-2026. | Valentina abre el semáforo. | Ve «corte del ahorro en 40 días · 31-12» y cuántas familias no llegan. | Pantalla C1; art. 39 |

## Función 1 · Checklist de la familia por WhatsApp (MVP)

Ataca R2. Pantallas F1, F2 y F4.

| ID | Prior. | Tipo | Dado | Cuando | Entonces | Fuente |
| --- | --- | --- | --- | --- | --- | --- |
| PA-301 ★ | MVP | Comportamiento | Carpeta de la familia Rojas del caso base. | La herramienta le escribe a Marta. | Le dice cuántas cosas faltan (2) y las nombra en palabras simples: la firma de Pedro en la DJ49-1 y el ahorro. | Pantalla F1 |
| PA-302 ★ | MVP | Regla | DJ49-1 firmada por Marta y otro adulto; Pedro (19) no firmó. | Se revisa la carpeta. | La DJ49-1 queda «firmada por 2 de 3 adultos» y no como lista. Si Pedro tuviera 17, no se le pediría firma. | Pantalla F2; art. 3; Figma función 1 |
| PA-303 ★ | MVP | Comportamiento | Igual que PA-302. | Marta responde «Mándaselo, porfa». | Pedro recibe un enlace para firmar con su ClaveÚnica y Marta recibe la confirmación del envío y la promesa de aviso cuando firme. | Pantallas F1, F4 |
| PA-304 ★ | MVP | Comportamiento | Pedro abre el enlace. | Firma con ClaveÚnica. | Ve qué firma y para qué antes de firmar; la firma queda en la carpeta; Marta recibe el aviso; la DJ49-1 pasa a lista; la obs. 3 queda resuelta para la respuesta única (PA-403). | Pantalla F4; PA-008 |
| PA-305 | MVP | Privacidad | Pedro firma con ClaveÚnica. | Se completa la firma. | La herramienta no ve ni guarda la clave de Pedro; solo queda la constancia de la firma. | Pantalla F4 |
| PA-306 | MVP | Regla | Ahorro de Marta: 9,5 UF; corte 31-12-2026. | La herramienta revisa su ahorro. | Le dice cuánto le falta (0,5 UF) y la fecha de corte, y avisa antes del corte si sigue faltando. | Pantallas F1, F2; arts. 39 a 41 |
| PA-307 | MVP | Regla | Cédula de la familia Díaz vence antes de la fecha de postulación. | Se revisa la carpeta. | La cédula queda «por vencer» y la familia recibe el aviso antes del vencimiento. | Pantalla C1 v1; Figma función 1 |
| PA-308 | MVP | Regla | Certificado de derechos en comunidad emitido hace 95 días. | Se revisa la carpeta para postular. | Queda vencido (máximo 90 días corridos antes de postular) y se pide uno nuevo. | Art. 3 f |
| PA-309 | MVP | Comportamiento | Marta pregunta «¿Qué es DJ49-1?». | La herramienta responde. | Explica en una o dos frases simples qué es y por qué se pide, sin siglas sin explicar. | Pantalla F1; D-16 |
| PA-310 | MVP | Comportamiento | Marta manda una foto de un documento. | La herramienta la recibe. | La guarda en la carpeta de la familia como pendiente de revisión, no como aprobada. | Pantalla F1 |
| PA-311 | MVP | Regla | Un tercero quiere descargar la Cartola Hogar de la familia. | Lo pide sin poder notarial. | La herramienta le explica que la familia la descarga ella misma, o un tercero con poder notarial de máximo 6 meses. | Figma función 1; Protocolos RSH 2026 |
| PA-312 | MVP | Comportamiento | Marta abre «Mi carpeta». | Ve sus documentos. | Ve los 7 documentos con su estado en una línea (vigente, vence, firmado por 2 de 3, monto y corte), la acción pendiente arriba y el avance del comité (34 de 40). | Pantalla F2 |
| PA-313 | MVP | Límite | Marta escribe «ya entendí, gracias» después de un aviso. | Se procesa el mensaje. | No cuenta como aprobación ni como firma de nada. | L-12 (C-20, C-21) |
| PA-314 | MVP | Comportamiento | Una familia sin WhatsApp, atendida en persona por Valentina. | Valentina registra el documento. | La carpeta de esa familia avanza igual que con WhatsApp. | L-10 (Propuesta; C-19) |
| PA-315 | MVP | Comprensión | Chat F1 con el caso base. | Se muestra a una persona con poca experiencia digital. | Sabe qué le falta, a quién le toca firmar y qué hacer ahora, sin ayuda. | D-18; E-03 |

## Consentimiento y datos de la familia (base de las funciones 1, 2 y 7)

Pantalla F0. Ley 21.719 (ver frame 9 del Figma).

| ID | Prior. | Tipo | Dado | Cuando | Entonces | Fuente |
| --- | --- | --- | --- | --- | --- | --- |
| PA-501 ★ | MVP | Privacidad | Familia nueva. | Abre su carpeta por primera vez. | Antes de compartir nada, ve quién ve qué: el comité ve el estado de cada documento, no su contenido; la EP ve sus documentos porque los presenta al SERVIU. Mientras P-24 siga abierta, la EP ve solo estados (L-06). | Pantalla F0; P-24 |
| PA-502 | MVP | Privacidad | Familia con datos sensibles (discapacidad). | No activa «Datos sensibles». | Nadie los ve y no se usan para el puntaje. Vienen apagados por defecto. | Pantalla F0; Figma frame 8 |
| PA-503 | MVP | Privacidad | Familia que activó «Datos sensibles». | Los desactiva. | Dejan de verse y de usarse desde ese momento, y el cambio queda registrado. | Pantalla F0; Ley 21.719 |
| PA-504 | MVP | Privacidad | Cualquier vista del comité o de otra familia. | Se busca un dato sensible de una familia. | No aparece ni como estado («discapacidad ✅»). | L-06; Figma función 7 |

## Segunda etapa: funciones 5, 3 y 7

| ID | Prior. | Tipo | Dado | Cuando | Entonces | Fuente |
| --- | --- | --- | --- | --- | --- | --- |
| PA-601 | 2ª | Regla | Asamblea del 30-11 de Villa Nueva para aprobar el plan social. | Se genera el acta. | Tiene los campos obligatorios (nombre, cédula y firma de cada asistente) y calcula si llegó al 70% de asistencia, por persona o por familia según se resuelva P-20. | Función 5; Res. 1.875 Art. 2° n°10 |
| PA-602 | 2ª | Regla | Asistencia de 65% y prueba de convocatoria guardada. | Se cierra el acta. | Marca que no llegó al 70% y deja disponible la prueba de convocatoria para pedir la excepción. | Función 5; Res. 1.875 |
| PA-603 | 2ª | Límite | Acta registrada. | Alguien intenta editarla o borrarla. | No se puede; una corrección es un acta nueva que referencia a la anterior. | L-07 (C-13, C-14) |
| PA-604 | 2ª | Límite | Aprobación del proyecto en asamblea: firmaron 39 de 40 familias. | La EP intenta darlo por aprobado. | No se puede: firman todas las familias. | L-09 (C-17, C-18); Figma frame 4 |
| PA-605 | 2ª | Comportamiento | Carpeta de Villa Nueva completa. | La EP pide la revisión previa. | La herramienta revisa contra la lista oficial de verificación y muestra lo que el SERVIU podría observar, antes del ingreso. | Función 3; frame 9 (falta la Circular DPH FSEV 35-2018) |
| PA-606 | 2ª | Privacidad | Grupo de 40 familias; una con un integrante con discapacidad no inscrito. | El comité y la EP abren el puntaje del grupo. | Ven el promedio y cuánto podría subir, sin saber a qué familia ni a qué categoría corresponde. | Función 7; Figma frame 5 |
| PA-607 | 2ª | Regla | Igual que PA-606, con 400 puntos en a+b+c+d. | Se calcula el efecto de inscribirse. | La familia ve que sumaría 500 puntos y el grupo 12,5 de promedio. | Figma frame 5; arts. 22 a 24 |
| PA-608 | 2ª | Regla | Llamado que selecciona por fecha de calificación. | Se abre el puntaje del grupo. | La función está apagada y dice por qué. | Función 7; art. 21 |
| PA-609 | 2ª | Límite | Una familia pregunta cómo subir su puntaje. | La herramienta responde. | Solo sugiere acreditar situaciones reales con documentos; nunca sugiere declarar algo que no es. | Función 7; art. 61 |

## Pruebas del pitch

Recorrido de punta a punta con el caso base. Si pasa, la historia del Figma se puede mostrar en vivo.

| ID | Pasos | Entonces |
| --- | --- | --- |
| PA-901 ★ | 1) La EP registra las 3 observaciones (PA-401). 2) Asigna la obs. 3 a Marta (PA-402). 3) Marta recibe el chat y pide enviar el enlace a Pedro (PA-301, PA-303). 4) Pedro firma con ClaveÚnica (PA-304). | Sin que nadie actualice nada a mano: la carpeta de Marta queda completa, el comité ve 35 de 40, la respuesta única queda 3 de 3 y Marta ve que la obs. de su familia se resolvió. |
| PA-902 ★ | 1) La familia Vera renuncia. 2) Valentina abre el reemplazo (PA-205). 3) Revisa la lista de espera (PA-210). | Ve el último día correcto (PA-206), los requisitos y el efecto en la composición; la herramienta no elige por ella. |
| PA-903 ★ | La EP abre el panel (PA-412) y luego Marta abre «Cómo va tu grupo» (PA-101 a PA-103). | Ambos ven el mismo plazo y el mismo tiempo de espera, cada uno en su lenguaje. |

## Cobertura

| Función o tema | Flecha roja | Pantallas | Pruebas |
| --- | --- | --- | --- |
| 6 · Estado para la familia | R1, R6 | F3, E2 | PA-101 a PA-110 |
| 4 · Plazos y observaciones | R3 | E1, E2, E3 | PA-401 a PA-414 |
| 2 · Semáforo del comité | R2, R5 | C1, C2 | PA-201 a PA-213 |
| 1 · Checklist por WhatsApp | R2 | F1, F2, F4 | PA-301 a PA-315 |
| Consentimiento | — | F0 | PA-501 a PA-504 |
| 5 · Actas y asistencia | R4 | E3 (asamblea) | PA-601 a PA-604 |
| 3 · Revisión previa | R3 | — | PA-605 |
| 7 · Puntaje del grupo | R8 | — | PA-606 a PA-609 |
| Reglas base | — | Todas | PA-001 a PA-008 |
| Recorrido del pitch | — | F1, F4, C2, E1, E2, F3 | PA-901 a PA-903 |

Sin prueba propia: R7 (sistemas internos del SERVIU), que el Figma deja fuera de alcance.

## Decisiones que tomé solo (kaina#62)

- Uso los datos ficticios de las pantallas como caso base, con hoy = 21-11-2026, porque es la fecha que calza con el corte del ahorro y con Villa Nueva.
- Cuento los días hábiles de lunes a viernes sin feriados, desde el día siguiente a la recepción. Queda por confirmar (P-27); si cambia la regla, cambian PA-404 y PA-206, no el resto.
- Numero por función (PA-1xx es la función 6, PA-4xx la función 4, etc.) para que el ID diga de qué función es.
- L-10 y L-14 siguen en «Propuesta»; sus pruebas (PA-314, PA-402) se corren solo si un humano los confirma.
- Donde el Figma choca con un límite (P-23, P-24, P-25) o con una regla sin validar (P-20, P-21), la prueba sigue al límite y lo dice. Si un humano decide distinto, se cambia la prueba.
