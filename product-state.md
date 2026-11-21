# Product state: Comité (DS49 colectivo)

Estado de producto del proyecto del team-45 en Platanus Hack 26. Reúne lo que el equipo ha resuelto, lo que sigue abierto y lo que se descartó, para que personas y agentes entiendan el proyecto desde el lado de producto antes de diseñar o construir.

| Campo | Valor |
| --- | --- |
| Última actualización | 2026-11-21 |
| Fuente principal | Canal de Discord `#deficit-habitacional` (ID `1573732246786015383`) |
| Último mensaje incorporado | `1573766452777979945` (2026-11-21 18:26 UTC) |
| Documento hermano | `engineering-state.md` (lo arma ingeniería) |
| Material de apoyo | [Flujo DS49 en Figma, v3 oficial](https://www.figma.com/design/72h9M4fZorEGnm3oEnrorh/Proyecto-Subsidio?node-id=3-2) de lozi-love (msgs `1573765313189912756`, `1573766038552707163`). Reemplaza al enlace `2D54yZcfnx1LhGU312AvNs`. Su alcance choca con D-02 (P-12). |

## Cómo usar este documento (agentes)

- Lee primero "Estado en una frase", "Decisiones vigentes" y "Límites duros". Con eso basta para no contradecir al producto.
- Cada ítem tiene un ID estable (`D-`, `L-`, `A-`, `P-`, `X-`). Cítalo en specs, issues, commits y en `engineering-state.md` en vez de copiar el texto.
- El estado de cada ítem manda. Una propuesta no es una decisión, y una cifra "por verificar" no se usa en producto ni en pitch.
- Si algo que vas a construir no está cubierto aquí o choca con este documento, no lo resuelvas por tu cuenta. Regístralo como pregunta abierta (`P-`) y avisa al equipo.
- Este documento define qué se construye y por qué. El cómo (stack, arquitectura, tablas, APIs) va en `engineering-state.md`. Si ambos chocan en alcance o límites, manda este.

### Estados

| Estado | Significado |
| --- | --- |
| Decidido | El equipo lo acordó de forma explícita. Se puede construir sobre esto. |
| Decisión de trabajo | Se usa para avanzar, pero falta confirmarlo. Ver la pregunta asociada. |
| Propuesta | Alguien la planteó y nadie la aceptó o rechazó todavía. No construir sobre esto sin confirmar. |
| En pausa | Se aceptó la idea, pero queda fuera del camino crítico por ahora. |
| Descartado | No se hace. Se registra el motivo para no reabrirla sin información nueva. |

### Cómo actualizarlo

1. Lee el canal desde el "Último mensaje incorporado" en adelante (`read_messages` con `after`).
2. Actualiza solo las secciones afectadas. Cambia el estado de un ítem en vez de borrarlo; si se descarta, muévelo a "Descartado o en pausa" con el motivo.
3. Solo una persona del equipo convierte una propuesta en decisión. Un agente puede proponer, pero no da algo por decidido porque nadie lo objetó.
4. Cita la fuente de cada cambio (ID de mensaje de Discord, enlace o documento).
5. Actualiza la tabla de cabecera y agrega una línea en "Registro de cambios".

## Estado en una frase

Comité es una herramienta para seguir un proyecto DS49 colectivo de Construcción en Nuevos Terrenos (CNT) después de que el grupo ya tiene el subsidio: muestra qué bloquea el proyecto, quién aceptó hacerse cargo del siguiente paso y qué evidencia permite avanzar, con una vista distinta para cada actor.

La demo y el pitch están en pausa. El foco ahora es construir la solución y su documentación de respaldo. Hay una propuesta de validar la hipótesis con un caso real antes de sumar más diseño (D-18), pendiente de conseguir el caso y a quien entreviste (P-10).

Hay dos tensiones abiertas. El Figma de lozi-love acota el problema hasta la selección y deja después solo el seguimiento de la familia, lo que choca con D-02 (P-12). Además, varias decisiones marcadas como «Decidido» salen solo de mensajes de agentes y falta que un humano las confirme (P-13); D-05 y D-08 ya volvieron a «Propuesta» por esa razón.

## Problema

**Hecho observado (por verificar en fuente original):** según el informe Vivienda 2035 de H&H Consultores, más de 118.000 subsidios DS49 están vigentes pero "no pagados", es decir, la familia tiene el subsidio y no tiene vivienda (A-05).

**Hipótesis del equipo:** una parte relevante de esa espera viene de la coordinación entre muchos actores que no ven la cadena completa: familias, dirigencia, entidad patrocinante (EP), constructora, SERVIU, DOM, notaría y Conservador, entre otros. Cada actor ve su etapa y nadie ve dónde está detenido el proyecto ni quién tiene el siguiente paso.

**Límite de la evidencia:** "no pagado" no equivale a "proyecto paralizado", y nada de lo revisado prueba que el problema sea de coordinación y no de plata. La frase "no faltó plata, faltó coordinación" no está respaldada y no se usa (A-07).

**Qué debilitaría la hipótesis:** si en un caso real el siguiente paso ya estaba claro para todos y lo que faltaba era financiamiento o una resolución externa, el problema no es de coordinación y otra pantalla no lo resuelve (msg `1573749162300809327`).

### Fallas del diseño actual (hipótesis)

Planteadas en el canal (msg `1573740151665074207`). Sirven para orientar el producto, pero falta contrastarlas con dirigentes y EP.

1. Las etapas avanzan en serie y cada una cierra con un certificado de un solo actor, aunque varias revisiones podrían ocurrir en paralelo.
2. La familia carga con el plazo de vigencia del subsidio, pero no controla ninguna de las etapas que lo consumen.
3. Los mismos datos y documentos se piden varias veces (RSH, cédula, ahorro al postular; permiso y recepción vuelven a juntarse para el pago final).
4. Cada observación devuelve el proyecto completo y reinicia la revisión.
5. Nadie ve la cadena completa. La Contraloría reportó falta de control y seguimiento del SERVIU y la SEREMI en Tarapacá.

## Alcance

| ID | Dentro del alcance | Estado |
| --- | --- | --- |
| D-01 | DS49 colectivo, modalidad Construcción en Nuevos Terrenos (proyectos de 10 a 160 viviendas). | Decisión de trabajo (ver P-01) |
| D-02 | Etapa posterior a la asignación del subsidio: seguir el proyecto hasta la vivienda. La postulación individual de documentos queda fuera. | Decidido |
| D-03 | Construir la solución y su documentación antes que la demo. | Decidido |

Fuera del alcance por ahora: DS01, DS19, DS27, DS52, campamentos, vista regional, WhatsApp, Sindicato (compra o cotización en bloque) y la demo en vivo. Ver "Descartado o en pausa".

## Decisiones vigentes

| ID | Decisión | Estado | Fuente |
| --- | --- | --- | --- |
| D-01 | Alcance DS49 CNT colectivo. Se eligió por la coordinación que exige construir juntos, no porque esté medido que sea el mayor problema colectivo. | Decisión de trabajo | msgs `1573734422664970352`, `1573736649739862150`, `1573737354181742774` |
| D-02 | El producto atiende el tramo entre subsidio asignado y vivienda entregada, no la postulación. | Decidido | msgs `1573733829074620438`, `1573734529821053109` |
| D-03 | La demo sale del camino crítico. Primero solución, documentación y antecedentes. | Decidido | msg `1573734813511327997` (Edo) |
| D-04 | El núcleo es un expediente vivo por proyecto: un solo objeto compartido en vez de formularios por etapa. Cada actor aporta solo en su ámbito; no es editable por todos. | Decidido | msgs `1573740275963138049`, `1573740596001247273` |
| D-05 | Cada aprobación queda ligada a una versión inmutable del expediente. Si cambia un antecedente (por ejemplo, el plano sanitario), las revisiones que dependían de él quedan marcadas para revalidar. No se borra todo ni se conserva el visto bueno de forma automática. | Propuesta (era «Decidido»; el agente de Edo aclaró que su mensaje propone, no registra un acuerdo, msg `1573761896920780811`) | msg `1573740596001247273` |
| D-06 | Los compromisos tienen cuatro estados: propuesto, aceptado, cumplido con evidencia y sin cobertura. "Sin cobertura" significa que nadie aceptó el paso; no significa que un actor incumplió. | Decidido | msgs `1573733969206321203`, `1573734529821053109` |
| D-07 | Una gestión enviada no equivale a un permiso aprobado ni a un pago autorizado. El producto distingue la gestión del resultado. | Decidido | msgs `1573735915774410764`, `1573737856021565452` |
| D-08 | El flujo se modela como dependencias, cada una con requisitos de entrada y evidencia de salida, indicando qué puede avanzar en paralelo y qué espera una respuesta. No se modela como una cadena fija en serie. | Propuesta (era «Decidido»; mismo motivo que D-05, msg `1573761896920780811`) | msg `1573737856021565452` |
| D-09 | No hay pasos universales. SEREMITT, anticipo y otros dependen del proyecto. El orden y las reglas los fijan las bases del llamado vigente; para CNT 2026 manda la Resolución 685/2026, no el título de la ficha web. | Decidido | msgs `1573737856021565452`, `1573740016100970756` |
| D-10 | Comité no reemplaza atribuciones de nadie. La EP ya coordina por mandato; el valor está en hacer visible qué falta y quién tomó el siguiente paso. | Decidido | msg `1573735915774410764` |
| D-11 | Un hecho acreditado (RSH, ahorro, cédula) se reutiliza mientras siga vigente y sirva para ese trámite. No queda válido para siempre. | Decidido | msg `1573740596001247273` |
| D-12 | Los plazos solo se muestran con fuente y ámbito. Se separa regla normativa, plazo administrativo y demora observada. No se trasladan plazos del DS01 al DS49 y los días transcurridos no se usan como prueba de culpa. | Decidido | msgs `1573740016100970756`, `1573740596001247273` |
| D-13 | Cada actor tiene su propia vista. Las familias ven qué cambió y en qué estado está el proyecto, sin acceso a documentos internos. | Decidido | msgs `1573733836875899011`, `1573735032768700649` |
| D-14 | Se usa "entidad patrocinante (EP)" como nombre del rol, no "EGIS". | Decidido | msg `1573737856021565452` |
| D-15 | Stack técnico abierto. Next.js + Supabase + Claude con tool use es una propuesta de Golazo. Hay una segunda propuesta de usar Postgres (Supabase) como única fuente de verdad y dejar fuera una base de grafos (Relate) salvo como copia derivada de solo lectura. El bot de Edo está de acuerdo con partir relacional, pero no da el stack por acordado. | Propuesta | msgs `1573734184588157009`, `1573734529821053109`, `1573746644799725793`, `1573746868121243821` |
| D-16 | La conversación cambia según el actor. Con los actores técnicos es técnica (observación exacta, versión del plano, revisión afectada); con las familias es simple (qué significa para su vivienda y si tienen que hacer algo). Ambas salen del mismo hecho y conservan su incertidumbre. La familia puede pedir el detalle que tiene permitido ver. | Decidido | msgs `1573745189934338091` (Edo), `1573745313192218636` |
| D-17 | El proyecto no tiene una "etapa actual" única. Su avance se describe con hitos que pueden darse al mismo tiempo, en línea con D-08. | Propuesta | msg `1573746868121243821` |
| D-18 | Antes de sumar más diseño, reconstruir una gestión real con la dirigencia y la EP del mismo proyecto: qué faltaba, quién tomó el paso y cómo se enteraron del cambio. Hay una pauta de entrevista y una prueba de comprensión para familias y técnicos. Convive con D-03, que pide construir la solución y reunir antecedentes. | Propuesta | msg `1573749162300809327` |

## Límites duros

Reglas que el producto no puede romper. Se aplican en código (un ejecutor que valida antes de actuar), no en el prompt del agente (L-01). Si una feature las contradice, la feature se cambia.

| ID | Límite | Estado | Fuente |
| --- | --- | --- | --- |
| L-01 | Los límites duros viven en un ejecutor en código que valida contrato, quórum y límites antes de cualquier acción. El agente propone; el ejecutor decide si se puede ejecutar. | Decidido | msgs `1573733591165435961`, `1573734184588157009` |
| L-02 | El agente nunca recomienda ni ejecuta la exclusión de una familia. Solo marca qué falta y propone quién puede ayudar. No tiene herramientas para sacar a alguien. | Decidido | msgs `1573732530895716374`, `1573734184588157009` |
| L-03 | Insistir no sube la prioridad. Se permite una gestión abierta por asunto y destinatario, y el agente no puede reclamar más veces por tener más capacidad. | Decidido | msgs `1573733862423535637`, `1573733969206321203` |
| L-04 | El producto no inventa reglas oficiales de asignación o priorización. | Decidido | msg `1573733969206321203` |
| L-05 | Nadie queda asignado a un compromiso por silencio. Si la persona no acepta o no puede, el compromiso queda "sin cobertura". | Decidido | msg `1573732523970666527` |
| L-06 | Las vistas son parciales. Un actor ve el estado de un hecho ("ahorro ✅", "RSH vigente ✅"), no el contenido (monto, cartola, documento). | Decidido | msgs `1573732523970666527`, `1573733591165435961` |
| L-07 | Las actas y el registro de reclamos son append-only. No se editan ni se borran. | Decidido | msgs `1573733591165435961`, `1573740275963138049` |
| L-08 | Una regla pendiente de validar no habilita pagos, permisos ni alertas de incumplimiento. | Decidido | msg `1573740016100970756` |
| L-09 | Las decisiones que la norma exige por unanimidad (aprobación del proyecto por cada familia, según el llamado 2026) no pueden bajarse a mayoría por configuración. | Decidido como límite; la regla normativa está por verificar (A-03) | msg `1573733591165435961` |
| L-10 | Avanzar no exige usar un agente. Quien participa por WhatsApp o con ayuda presencial tiene las mismas garantías. | Propuesta | msg `1573732530895716374` |
| L-11 | La EP no ve el estado de cada familia antes de que esa familia ingrese al comité, para que no pueda elegir solo a las familias con menos dificultades. | Propuesta (pensada para la etapa de postulación, hoy fuera de alcance) | msg `1573732530895716374` |
| L-12 | Un "ya entendí" de una familia nunca cuenta como aprobación. | Decidido | msg `1573745313192218636` |
| L-13 | Si nadie tomó un paso, el mensaje a la familia lo dice. El agente no inventa un responsable para que el mensaje suene más tranquilo. | Decidido | msg `1573745313192218636` |
| L-14 | Que una gestión le corresponda a un actor no significa que ese actor la aceptó. El producto registra por separado a quién corresponde y quién confirmó que la toma. Sin aceptación, la conversación técnica muestra «pendiente de aceptación» y la familia recibe «todavía no tenemos confirmación de quién tomará esta gestión». El plazo oficial corre según su regla; aceptar o no en la herramienta no cambia las obligaciones de la EP. Precisa D-06, L-05 y L-13. | Propuesta (pedida para la función 4 del Figma) | msgs `1573764559909687448`, `1573765520006848543` |

## Actores

Los roles tienen base normativa (Res. 1875 exenta MINVU, arts. 2 y 4). Los dolores son hipótesis por contrastar en terreno (msgs `1573735909072048160`, `1573735915774410764`).

| Actor | Rol | Dolor (hipótesis) |
| --- | --- | --- |
| Familia | Aporta antecedentes y ahorro, participa y aprueba el proyecto. | Espera sin saber qué falta ni cuánto depende de ella. Carga con el plazo de vigencia del subsidio. |
| Dirigencia del comité | Representa al comité y sostiene acuerdos. | Recibe todas las preguntas, pero no controla permisos ni obra. |
| Entidad patrocinante (EP) | Articula el proyecto técnico, legal y social; tramita y acompaña. Coordina por mandato. | Reunir respuestas y mantener coherentes expedientes, cambios y acuerdos. |
| Profesionales de la EP | Diseñan y subsanan observaciones. | Necesitan trabajar sobre la misma versión del proyecto. |
| Constructora | Ejecuta la obra. | Depende de terreno, permisos, diseño y financiamiento para programar sin rehacer trabajo. |
| SERVIU | Evalúa y califica proyectos, gestiona el subsidio y paga. Tiene a cargo la fiscalización técnica de obras (FTO). | Resolver con antecedentes completos y trazables. La FTO necesita evidencia y correcciones, no un porcentaje de avance en verde. |
| MINVU y SEREMI | MINVU define el programa y los llamados; la SEREMI tiene funciones regionales según el procedimiento. | No identificado en el canal. |
| DOM | Otorga permisos de edificación y recepción municipal. | Necesita un proyecto conforme y respuestas a sus observaciones. |
| Municipio | Puede apoyar a las familias o actuar como EP. No es lo mismo que la DOM. | No identificado en el canal. |
| Otros según el proyecto | Dueño del terreno, sanitarias, distribuidoras, organismos sectoriales, notaría, Conservador de Bienes Raíces. | Reciben antecedentes incompletos o inconsistentes. No todos intervienen en todos los proyectos. |

## Recorrido de un proyecto DS49 colectivo (referencia)

Etapas descritas en el canal (msgs `1573739759484801025`, `1573739766766375013`). Sirven para ubicar actores y documentos, no como flujo del producto (D-08, D-09). El orden cambia según el llamado, y en CNT 2026 se postulan proyectos ya calificados por SERVIU, lo que contradice el orden "grupo primero" (P-04).

| Etapa | Quién llena | Quién aprueba | Cierra con |
| --- | --- | --- | --- |
| 0. Organización del grupo | Familias y comité | Municipio (personalidad jurídica) | Nómina con RSH y ahorro |
| 1. Convenio con la EP | EP | SERVIU | Convenio marco vigente |
| 2. Postulación colectiva | EP, con antecedentes de las familias | SERVIU | Certificado de Postulación Aprobada |
| 3. Diagnóstico social | EP y familias | SERVIU | Plan de Acompañamiento Social |
| 4. Terreno, diseño y presentación | EP, arquitectos, calculistas | SERVIU | Certificado de Proyecto Calificado |
| 5. Permisos | EP | DOM (y SEREMITT si hay estudio vial) | Permiso de edificación |
| 6. Obra | Constructora | SERVIU (FTO, anticipo y pagos) | Estados de pago aprobados |
| 7. Recepción | Constructora | DOM | Certificado de recepción municipal |
| 8. Escritura e inscripción | EP, notaría | Conservador de Bienes Raíces | Escritura inscrita y prohibición de vender |
| 9. Pago final del subsidio | EP | SERVIU | Pago contra cinco documentos de etapas anteriores |
| 10. Entrega y postventa | Constructora y EP | Nadie de forma continua | Declaración jurada de reclamos |

Los plazos que se mencionaron para estas etapas (90 días, 135 días hábiles, unos 6 meses en la DOM) están en A-12 y no se usan como vencimientos automáticos (D-12).

## Conceptos del producto

Vocabulario que producto usa con un significado fijo. Ingeniería decide cómo modelarlo.

| Concepto | Significado |
| --- | --- |
| Proyecto | Un proyecto DS49 CNT con su grupo de familias, su EP y los demás actores que intervienen. |
| Expediente vivo | El objeto compartido del proyecto. Reúne antecedentes, versiones, aprobaciones, compromisos y actas (D-04). |
| Versión | Estado inmutable del expediente sobre el que se da una aprobación (D-05). |
| Dependencia | Relación entre un paso y lo que necesita para empezar (requisitos de entrada) y para cerrarse (evidencia de salida) (D-08). |
| Compromiso o gestión | Un paso concreto con responsable y estado: propuesto, aceptado, cumplido con evidencia o sin cobertura (D-06). |
| Sin cobertura | Nadie aceptó el paso. No implica incumplimiento (D-06, L-05). |
| Evidencia | Lo que permite marcar un compromiso como cumplido. Una consulta enviada no es evidencia de un permiso (D-07). |
| Revalidación | Marca sobre una aprobación cuando cambió un antecedente del que dependía (D-05). |
| Hecho acreditado | Dato verificado de una familia o del proyecto, con vigencia y ámbito de uso (D-11, L-06). |
| Vista por rol | Lo que cada actor puede ver y aportar (D-13, L-06). Incluye el registro de la conversación: técnico o simple según el actor (D-16). |
| Hito | Logro verificable del proyecto (por ejemplo, permiso de edificación otorgado). Varios hitos pueden estar en curso a la vez (D-17). |
| Acta | Registro append-only de decisiones del grupo, incluido el disenso (L-07). |
| Plazo | Fecha o duración con fuente y ámbito. Puede ser regla normativa, plazo administrativo o demora observada (D-12). |

## Afirmaciones normativas y cifras

Antes de usar una afirmación en el producto o en el pitch, revisa su estado. "Con fuente" significa que hay enlace oficial citado en el canal; aun así conviene leer el original antes de codificar una regla.

| ID | Afirmación | Estado | Fuente |
| --- | --- | --- | --- |
| A-01 | DS49 CNT es colectivo, de 10 a 160 viviendas. Pequeño Condominio también es colectivo, de 2 a 9. Sitio Propio y Densificación Predial pueden ser individuales o colectivos. | Con fuente | [Ficha MINVU DS49](https://www.minvu.gob.cl/beneficio/vivienda/subsidio-para-construir-una-vivienda-de-hasta-950-uf-ds49/) |
| A-02 | En proyectos colectivos, al menos 70% del grupo en el tramo 40% del RSH y hasta 30% hasta el tramo 90%. Corrige la idea de que el DS49 es "exclusivamente para el 40%". | Con fuente | Ficha MINVU DS49 |
| A-03 | El llamado 2026 exige que cada familia apruebe el proyecto (unanimidad). | Por verificar en las bases | msg `1573733591165435961` |
| A-04 | Si una familia no completa el ahorro en 180 días, el SERVIU puede designar reemplazantes. Ámbito: el llamado de adquisición de terrenos, no todo el DS49. | Por verificar; no aplicar a CNT sin fuente | msgs `1573733591165435961`, `1573761896920780811` |
| A-05 | Más de 118.000 subsidios DS49 vigentes "no pagados" (31,4% de 376.711 otorgados entre 2010 y 2025). | Por verificar en el informe original | Informe Vivienda 2035, H&H Consultores (2026) |
| A-06 | 131.290 subsidios no convertidos en vivienda entre 2010 y 2025. La suma por programa da unos 249.000; probablemente los no pagados del DS49 no cuentan como fuga. | Conflicto, por verificar | Informe Vivienda 2035, H&H Consultores |
| A-07 | "No faltó plata, faltó coordinación." | No respaldado. No usar. | msg `1573733969206321203` |
| A-08 | En CNT 2026 se postulan proyectos ya calificados por SERVIU, de forma condicional o definitiva. La Resolución 685/2026 gobierna el llamado. | Con fuente | [Llamado CNT 2026](https://www.minvu.gob.cl/postulacion/llamado-en-condiciones-especiales-del-ds49-para-construccion-en-nuevos-terrenos-para-todas-las-regiones-del-pais-2026/) |
| A-09 | Roles de la EP y del resto de actores en DS49. | Con fuente | [Res. 1875 exenta, arts. 2 y 4](https://bcn.cl/3loay) |
| A-10 | Casen 2024: 1.239.815 viviendas necesitan mejoras y 405.552 requerimientos de vivienda nueva. No separa cuánto es colectivo. Otra lectura del canal trata 1.239.815 como hogares en déficit, del que 75,4% sería cualitativo. | Con fuente; interpretación en conflicto | [Centro de Estudios MINVU](https://centrodeestudios.minvu.gob.cl/deficit-habitacional/) |
| A-11 | Ejecución del subtítulo 33 en Valparaíso 24,8% frente a 47,5% en la RM; presupuesto 2026 del SERVIU Valparaíso -18,3%. Mide gasto, no expedientes rechazados. | Por verificar | Informe MACh, cierre mayo 2026 |
| A-12 | Plazos de etapas: diagnóstico social 90 días; observaciones hasta 135 días hábiles (Déficit Cero); unos 6 meses en la DOM (ministro Montes); vigencia DS01 de 21 meses más 18. No hay fuente de vigencia para DS49. | Por verificar; no usar como vencimientos | msgs `1573739759484801025`, `1573740151665074207` |
| A-13 | Cupos DS49 2025 por modalidad (cooperativas 27.660, campamentos 4.919, entre otros) y caída a 20.000 subsidios en 2026. | Por verificar | Programa Regular de Subsidios 2026, CChC |
| A-14 | Ahorro mínimo 10 UF, cobertura de hasta 90% del valor y prohibición de vender por 5 años. | Por verificar | msg `1573736223112171543` |
| A-15 | Más de 680 familias esperando pago en el SERVIU Metropolitano con la mitad del presupuesto sin ejecutar. | Por verificar | CIPER |
| A-16 | DS01: 68.314 renuncias; DS19: 58.210 proyectos renunciados o eliminados. | Por verificar | Informe Vivienda 2035, H&H Consultores |

## Preguntas abiertas

| ID | Pregunta | Qué cambia según la respuesta | Responsable |
| --- | --- | --- | --- |
| P-01 | ¿Se confirma DS49 CNT o se compara antes con DS27 capítulo III (mejoramiento de bienes comunes en condominios, con postulación colectiva)? | Actores, recorrido y vistas del producto. | Sin asignar |
| P-02 | ¿Qué stack usa el equipo? | Todo `engineering-state.md`. | Ingeniería |
| P-03 | ¿Cómo se reparte el trabajo? Golazo propuso cuatro frentes; Edo tomó el contrato, las reglas del ejecutor y la pieza de cambios, dependencias y revalidación. | Ownership de cada parte. | Equipo |
| P-04 | ¿Qué llamado respalda el orden "grupo primero" del recorrido de referencia? | Si el producto parte con grupo ya seleccionado o con proyecto ya calificado. | lozi-love |
| P-05 | ¿Cuál es el plazo de vigencia del subsidio en DS49? | Si el producto puede mostrar un plazo compartido del subsidio. | Sin asignar |
| P-06 | ¿Dónde se paralizó el proyecto y cómo se enteraron? (dirigentes de comités DS49) | Valida o descarta la hipótesis de coordinación. | Sin asignar (ver P-10) |
| P-07 | ¿Qué compromisos de otros actores fallan más seguido? (EP) | Qué dependencias modelar primero. | Sin asignar |
| P-08 | ¿Se confirman las cifras del informe H&H y del informe MACh en su versión original? | Qué cifras se pueden usar en el pitch. | Sin asignar |
| P-09 | ¿El nombre del producto es "Comité" o "Nosotros"? En el canal "Comité" es la idea y "Nosotros" aparece como nombre de la plataforma. El Figma llama a la solución "Copiloto de Carpeta" (msg `1573763992051130528`). | Naming en producto y pitch. | Equipo |
| P-10 | ¿Qué proyecto DS49 real usamos para la entrevista (dirigencia y EP del mismo proyecto) y quién hace las entrevistas? La pauta de entrevista para P-06 y P-07 ya existe, pero no está enlazada en el canal. Faltan el caso, los contactos y quién entrevista (msg `1573761896920780811`). | Si D-18 se puede ejecutar y si la hipótesis de coordinación se sostiene. | Sin asignar |
| P-11 | ¿Se adopta D-18 como paso previo a sumar diseño, o se construye en paralelo a las entrevistas? | Orden de trabajo del equipo. | Equipo |
| P-12 | ¿El Figma propone un alcance nuevo? Su frame «El problema» termina en la selección y deja después solo el seguimiento de la familia. D-02 sigue el proyecto después del subsidio e incluye las gestiones entre actores. El agente de Edo propone mantener esa coordinación posterior y dejar terreno, permisos, obra y pagos fuera de lo que el agente puede resolver, pero no de lo que puede seguir. El Figma también tiene un frame de puntaje del grupo, que es de la postulación (X-01). | Si D-02 se mantiene o se reemplaza, y qué frames del Figma valen como referencia del producto. | lozi-love y Edo (msg `1573766452777979945`) |
| P-13 | ¿Confirma un humano las decisiones que hoy figuran como «Decidido» pero salen solo de mensajes de agentes? Son D-02, D-04 (la parte «no editable por todos»), D-06, D-07, D-09 a D-14, L-01 a L-09, L-12 y L-13. Los únicos mensajes humanos que las respaldan son los de Edo (`1573734422664970352`, `1573734813511327997`, `1573745189934338091`) y lozi-love (`1573740151665074207`, `1573740275963138049`). | Si se puede construir sobre esos ítems o vuelven a «Propuesta», como D-05 y D-08. | Equipo |

## Descartado o en pausa

| ID | Idea | Estado | Motivo |
| --- | --- | --- | --- |
| X-01 | Comité centrado en la postulación: semáforo de documentos por familia, foto del documento ficticio, ahorro. | Descartado | Las fallas más grandes ocurren después de asignado el subsidio (D-02). |
| X-02 | Cubrir DS01, DS19, DS27 y campamentos a la vez. | Descartado | Se prioriza el programa que exige más coordinación (D-01). DS27 sigue como alternativa en P-01. |
| X-03 | Expediente editable por todos los actores. | Descartado | Cada actor aporta en su ámbito y las aprobaciones se ligan a versiones (D-04, D-05). |
| X-04 | Cadena de etapas en serie como flujo del producto. | Descartado | Se modela con dependencias (D-08) y el orden depende del llamado (D-09). |
| X-05 | Prometer que DOM y SERVIU revisen en paralelo o que el agente destraba permisos. | Descartado | El producto coordina trabajo, no cambia atribuciones (D-07, D-10). |
| X-06 | Demo en vivo con QR y voluntarios del público, escena de DS49 paralizado. | En pausa | D-03. |
| X-07 | Sindicato al revés para DS01 (demanda agregada a inmobiliarias). | En pausa | Fuera del alcance actual. |
| X-08 | Vista regional (muchos comités y SERVIU) y canal WhatsApp. | En pausa | Fuera del alcance actual. |
| X-09 | Narrativas "Black Mirror" (exclusión de la familia 7; saturación del SERVIU por agentes). | En pausa (pitch) | Se conservan como origen de L-02 y L-03. |

## Handoff a ingeniería

Lo que `engineering-state.md` necesita traducir desde este documento:

- Cómo se aplican L-01 a L-09 en el ejecutor, con una prueba por límite.
- Cómo se modelan los conceptos del producto: versiones inmutables, dependencias, revalidación, los cuatro estados de compromiso y las vistas por rol.
- Qué afirmaciones normativas (`A-`) se codifican como reglas y cómo se marca una regla pendiente de validar para que no dispare pagos, permisos ni alertas (L-08).
- La decisión de stack (P-02) y quién es responsable de cada pieza (P-03).
- Cómo se generan las dos conversaciones (técnica y simple) desde el mismo hecho sin perder la incertidumbre (D-16, L-12, L-13).
- Insumos ya propuestos en el canal para ese documento: el modelo de entidades del msg `1573746650609094728` y las condiciones del msg `1573746868121243821`. Una versión es inmutable solo si la cuenta de la aplicación no puede modificarla ni borrarla, y eso se prueba. Una copia derivada (por ejemplo, un grafo para el agente) solo expone hechos autorizados para quien consulta y nunca autoriza una acción; el ejecutor relee estado, permisos y versión en la fuente de verdad.

## Registro de cambios

| Fecha | Cambio | Fuente |
| --- | --- | --- |
| 2026-11-21 | Versión inicial a partir del canal `#deficit-habitacional` hasta el msg `1573740596001247273`. | Discord |
| 2026-11-21 | Se agregan la conversación distinta por actor (D-16, L-12, L-13), hitos en vez de etapa actual (D-17), la propuesta de validar con un caso real (D-18, P-10, P-11) y la propuesta de base de datos en D-15 y el handoff. | Discord, msgs `1573745189934338091` a `1573761560420286536` |
| 2026-11-21 | D-05 y D-08 vuelven a «Propuesta». Se agregan L-14 (corresponder no es aceptar), P-12 (alcance del Figma frente a D-02) y P-13 (decisiones sin confirmación humana). A-04 queda acotado al llamado de adquisición de terrenos. Se enlaza el Figma v3 y se actualizan P-09 y P-10. | Discord, msgs `1573761896920780811` a `1573766452777979945` |
