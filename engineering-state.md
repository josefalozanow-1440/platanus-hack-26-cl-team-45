# Engineering state: Comité (DS49 colectivo)

Estado de ingeniería del proyecto del team-45 en Platanus Hack 26. Reúne cómo se construye lo que define `product-state.md`: stack, arquitectura, integraciones y riesgos técnicos, con el estado de cada ítem.

| Campo | Valor |
| --- | --- |
| Última actualización | 2026-11-21 |
| Documento hermano | `product-state.md` (qué se construye y por qué) |
| Fuentes | Canal de Discord `#deficit-habitacional` (ID `1573732246786015383`) y documentación pública de Kapso (ver "Fuentes") |

## Cómo usar este documento (agentes)

- Lee antes `product-state.md`. Si este documento choca con él en alcance o límites, manda `product-state.md`.
- Cita los IDs de producto (`D-`, `L-`, `A-`, `P-`, `X-`) en vez de copiar su texto. Los ítems propios de este documento usan `E-` (decisiones y propuestas de ingeniería) y `R-` (restricciones y riesgos técnicos).
- El estado de cada ítem manda. Una propuesta no es una decisión: no construyas sobre ella sin que una persona del equipo la confirme.
- Si vas a construir algo que no está cubierto aquí, regístralo como propuesta `E-` y avisa al equipo en `#ingenieria`.

Los estados son los mismos de `product-state.md`: Decidido, Decisión de trabajo, Propuesta, En pausa y Descartado.

## Estado en una frase

No hay stack decidido ni código (P-02, D-15). La pieza central es el ejecutor en código que valida contrato, quórum y límites duros antes de cualquier acción (L-01). Kapso está propuesto como canal de WhatsApp, pero ese canal está en pausa en producto (X-08), así que no entra al camino crítico hasta que producto lo reactive.

## Decisiones y propuestas de ingeniería

| ID | Ítem | Estado | Fuente |
| --- | --- | --- | --- |
| E-01 | Stack: Next.js + Supabase + Claude con tool use. Postgres como única fuente de verdad; un grafo solo como copia derivada de solo lectura. | Propuesta (ver D-15) | msgs `1573734184588157009`, `1573746644799725793`, `1573746868121243821` |
| E-02 | Kapso como canal de WhatsApp para familias y actores, conectado por webhook al servidor del equipo. Detalle en "Integración: Kapso". | Propuesta, bloqueada por X-08 | Este documento |
| E-03 a E-08 | Propuestas de accesibilidad para familias con poca experiencia digital. Detalle en "Accesibilidad". | Propuesta | Este documento |

## Integración: Kapso (canal de WhatsApp)

### Qué es

Kapso es una startup chilena que ofrece infraestructura sobre la API oficial de WhatsApp Business de Meta. Según su documentación tiene:

- acceso a la API de WhatsApp y una bandeja compartida para que un equipo atienda conversaciones;
- mensajes masivos;
- workflows: grafos de nodos que normalmente parten con un mensaje entrante, con nodos para enviar mensajes o botones, esperar la respuesta, decidir con IA o con lógica propia, conversar con un agente que usa herramientas y pasar la conversación a una persona;
- webhooks y funciones serverless en JavaScript;
- enlaces de configuración para que otras organizaciones conecten su propio número;
- un servidor MCP y una CLI, para que los agentes de código la operen;
- un plan gratuito con un número ya verificado, sin comprar uno ni esperar la verificación por SMS.

### Rol en la arquitectura

Kapso es el canal, no el lugar de las reglas. Recibe y envía mensajes; todo lo demás vive en el servidor del equipo.

- Kapso entrega cada mensaje entrante por webhook al servidor del equipo.
- El ejecutor valida contrato, quórum y límites duros antes de cambiar cualquier estado (L-01). Las actas siguen siendo append-only en la fuente de verdad (L-07).
- Si se usa el nodo de agente de Kapso, sus herramientas solo consultan estado y proponen o aceptan compromisos. No existe una herramienta para excluir a una familia (L-02).
- Por WhatsApp viajan estados, no contenidos: "ahorro ok", nunca el monto ni la cartola (L-06).

### Usos propuestos

| Uso | Cómo funciona | Ítems de producto |
| --- | --- | --- |
| Consulta de la familia | La familia pregunta "¿en qué va mi proyecto?" y recibe la respuesta en lenguaje simple, solo con lo que su vista permite. Si nadie tomó un paso, la respuesta lo dice. | D-13, D-16, L-13 |
| Aviso de cambios | Cuando un compromiso cambia de estado, las familias reciben qué cambió y si tienen que hacer algo, sin adjuntos internos. | D-13, D-16 |
| Aceptar una gestión | La persona de la EP o de la dirigencia recibe un botón "Acepto / No puedo". Si nadie acepta en el plazo, el compromiso queda "sin cobertura". | D-06, L-05 |
| Registrar evidencia | Quien cumple manda una foto o un documento y el compromiso pasa a "cumplido con evidencia". La evidencia de una consulta enviada no marca un permiso como aprobado. | D-06, D-07 |
| Aprobación del proyecto | Se consulta a cada familia por separado y se guarda el registro. Un "ya entendí" no cuenta como aprobación, y la unanimidad no baja a mayoría por configuración. | L-09, L-12, A-03 |
| Paso a una persona | Si la familia se traba o no maneja la tecnología, la conversación pasa a la dirigencia o a la EP en la bandeja compartida. | L-10 |
| Número por EP | Cada EP conecta su propio número con los enlaces de configuración de Kapso. Que la EP sea quien paga es una inferencia, no un dato. | D-10 |

### Restricciones y riesgos

| ID | Restricción o riesgo | Consecuencia | Estado |
| --- | --- | --- | --- |
| R-01 | Los formularios dentro de WhatsApp (WhatsApp Flows) exigen un portafolio de empresa verificado en Meta. | Usar botones y preguntas simples; no depender de Flows en la hackatón. | Con fuente (docs de Kapso) |
| R-02 | Escribirle a alguien que no ha escrito en las últimas 24 horas requiere plantillas aprobadas por Meta, que cobra por mensaje. | Afecta a los avisos de cambios. Hay que diseñar las plantillas y prever su aprobación. | Por verificar en las docs de Kapso; viene del funcionamiento general de la API de WhatsApp |
| R-03 | Los datos sensibles (RSH, montos de ahorro, cédulas) pasarían por Meta y Kapso. | No enviarlos por WhatsApp; solo estados (L-06). | Decidido por L-06 |
| R-04 | Mensajes masivos o automáticos al SERVIU o a la DOM repetirían el escenario de saturación que el equipo quiere evitar. | Kapso no se usa para escribirles en masa. Una gestión abierta por asunto y destinatario (L-03). | Decidido por L-03 |
| R-05 | No está verificado cómo recibe Kapso imágenes y documentos ni sus límites de tamaño. | Verificar antes de construir el uso "Registrar evidencia". | Por verificar |
| R-06 | Que las familias DS49 usen WhatsApp como canal principal es una hipótesis. | Preguntarlo en las entrevistas de D-18 y P-10. | Por verificar |
| R-07 | El canal WhatsApp está en pausa en producto (X-08). | Nada de esta sección entra al camino crítico hasta que producto lo reactive. | En pausa |

### Primera prueba (cuando producto reactive X-08)

Conectar el número gratuito de Kapso y armar un solo workflow: se propone un compromiso, se ofrece por WhatsApp a una persona, la persona acepta o no, el ejecutor registra el estado y avisa a las familias. Con eso se prueba el ciclo propuesto, aceptado y sin cobertura de punta a punta (D-06, L-05).

### Fuentes

- [Kapso, introducción](https://docs.kapso.ai/docs/introduction.md)
- [Kapso, workflows](https://docs.kapso.ai/docs/workflows/introduction.md)
- [Kapso, WhatsApp Flows](https://docs.kapso.ai/docs/whatsapp/flows/overview.md)
- [Kapso, agentes de IA en WhatsApp](https://kapso.ai/whatsapp-ai-agent)
- [Kapso, preguntas frecuentes de precios](https://docs.kapso.ai/docs/whatsapp/pricing-faq)

## Accesibilidad

Las familias DS49 son el actor con menos experiencia digital del proyecto, y para ellas es la vista simple de D-16. Si no entienden lo que ven, el producto no les sirve aunque el ejecutor funcione. Esta sección reúne lo que dicen los datos y lo que ingeniería puede aportar.

### Qué dicen los datos

| Hecho | Qué implica para ingeniería | Fuente |
| --- | --- | --- |
| El 53% de los adultos de 16 a 65 años está en el nivel 1 o inferior de comprensión lectora (promedio OCDE: 26%). Bajo el nivel 1 se entienden, como máximo, oraciones simples. | Los textos para familias tienen que poder leerse en ese nivel. No basta con que el agente "escriba simple": hay que medirlo. | [OCDE, PIAAC 2023, nota de Chile](https://www.oecd.org/es/publications/2024/12/survey-of-adults-skills-2023-country-notes_df7b4a60/chile_043083fb.html) |
| El 69,5% de los hogares sin internet está encabezado por mayores de 60 años. En el quintil más bajo, el 36,3% de los hogares sin internet dice que no sabe usarlo y el 20,6% menciona el costo. | Hay familias que no van a usar la herramienta por su cuenta. Se necesita que alguien de confianza pueda acompañarlas, y que la vista funcione con pocos datos móviles. | [País Digital con Casen 2013-2022, vía Chócale](https://chocale.cl/2024/05/hogares-de-adultos-mayores-encabezan-la-desconexion-digital-en-chile/) |
| Más del 90% de los hogares con internet se conecta por teléfono móvil. | La vista de familias se diseña primero para teléfonos de gama baja, no para computador. | Casen, citada en [El Mostrador](https://www.elmostrador.cl/agenda-pais/agenda-digital/2025/09/24/brecha-digital-en-chile-el-desafio-de-los-adultos-mayores-en-la-era-tecnologica/) (fuente secundaria) |
| WhatsApp es la plataforma más usada por el 89,7% de los usuarios de internet en Chile. | Refuerza a Kapso (E-02) como canal, pero no cubre a quienes no usan internet (R-06 sigue abierta). | [DataReportal, Digital 2026: Chile](https://datareportal.com/reports/digital-2026-chile?rq=chile) |
| El 17,6% de los adultos tiene alguna discapacidad; entre los mayores de 60 años, el 32,6%. | La vista de familias tiene que funcionar con lector de pantalla, letra grande y sin depender solo del color. | [SENADIS, III Estudio Nacional de la Discapacidad 2022](https://senadis.gob.cl/descarga/i/7415) |
| Cerca del 39% de las familias en campamentos sería migrante (TECHO, catastro 2024-2025; la nota no deja claro a qué levantamiento corresponde la cifra). | Puede haber familias que no leen bien en español. Cuántas hay en proyectos DS49 CNT no está medido. | [24horas](https://www.24horas.cl/data/campamentos-en-chile-han-aumentado-en-un-10-84-mil-son-ninos-ninas) |
| La norma técnica de sitios web del Estado (Decreto 1 de 2015) exige nivel AA, basada en WCAG 2.0. Comité no es un órgano del Estado, así que no le aplica, pero sirve de referencia. | Usar WCAG 2.2 AA como meta para la vista de familias. | [BCN, Decreto 1 de 2015](https://www.bcn.cl/leychile/navegar?i=1078308) |
| La Red de Lenguaje Claro Chile (Contraloría, Poder Judicial, Consejo para la Transparencia, entre otros) es voluntaria. No encontré una norma que obligue a escribir en lenguaje claro. | Sus guías sirven como criterio para las pruebas de textos (E-03). | [Senado, guía de lenguaje claro](https://cdn.senado.cl/portal-senado-produccion/s3fs-public/2025-09/guia-de-lenguaje-claro-para-el-ambito-legislativo.pdf) |
| Kapso recibe mensajes de audio desde WhatsApp. El enlace para descargar el archivo vale 4 minutos. | Las notas de voz son viables como entrada, pero hay que descargar el audio apenas llega. | [Kapso, eventos de mensajes](https://docs.kapso.ai/docs/platform/webhooks/message-events), [Kapso, URL de media](https://docs.kapso.ai/api/meta/whatsapp/media/get-media-url.md) |

### Propuestas de ingeniería

Ordenadas por costo y valor para la hackatón. Ninguna cambia el alcance ni los límites de producto; si alguna lo hace, manda `product-state.md`.

| ID | Propuesta | Cómo se construye | Ítems de producto | Costo estimado |
| --- | --- | --- | --- | --- |
| E-03 | Prueba automática de los textos para familias. | Cada mensaje simple que genera el agente pasa por una revisión en código antes de mostrarse: largo máximo de oración, palabras de un glosario prohibido sin explicar (EP, DOM, SERVIU, FTO, "calificado") y un índice de legibilidad en español (por ejemplo, Fernández-Huerta o INFLESZ). Si falla, el agente reescribe. Se agrega a las pruebas del proyecto con casos fijos, incluido uno donde nadie tomó el paso. | D-16, L-13 | 2 horas |
| E-04 | Vista de familias accesible y liviana. | Meta WCAG 2.2 AA: contraste, letra de 18 px o más, el estado siempre con ícono y palabra además del color, botones grandes, funciona con lector de pantalla. Presupuesto de peso por página para teléfonos de gama baja y datos prepago. Revisión automática con axe o Lighthouse en cada despliegue. | D-13, L-06 | 2 a 3 horas |
| E-05 | Acompañante de la familia. | La familia puede nombrar a una persona de confianza (un hijo, una vecina, la dirigencia) que ve su vista y le explica. El acompañamiento queda registrado, se puede revocar y nunca permite aprobar ni aceptar en nombre de la familia. Es multiplayer: el producto mejora cuando alguien acompaña. | L-09, L-10, L-12 | 3 horas |
| E-06 | Registro asistido. | Cuando la EP o la dirigencia conversa en persona con una familia, puede registrar lo conversado en el expediente, marcado como "registrado por X en presencia de la familia". El registro es append-only y no cuenta como aprobación. | L-07, L-10, L-12 | 2 horas |
| E-07 | Notas de voz de entrada y salida. | La familia manda una nota de voz por WhatsApp; el servidor la descarga al tiro, la transcribe con un servicio de voz a texto y la trata como cualquier pregunta. La respuesta puede volver como audio con texto a voz. Claude no transcribe audio, así que se necesita otro servicio. Depende de que producto reactive WhatsApp (X-08). | D-16, L-10 | 3 a 4 horas |
| E-08 | Otros idiomas para familias. | Los textos para familias se generan en el idioma que elija la familia, con la misma prueba de E-03. Solo si las entrevistas muestran familias que no leen bien en español. | D-16 | 2 horas, después de validar |

### Riesgos de accesibilidad

| ID | Riesgo | Mitigación | Estado |
| --- | --- | --- | --- |
| R-08 | Simplificar el texto puede borrar la incertidumbre ("se envió la consulta" pasa a leerse como "está aprobado"). | E-03 incluye casos de prueba que verifican que el texto simple conserva si algo es una gestión o un resultado (D-07, D-16). | Por construir |
| R-09 | Un acompañante puede presionar o decidir por la familia. | El acompañante solo ve y explica. La aprobación y la aceptación las hace la familia, y el ejecutor lo valida (L-09, L-12). | Por construir |
| R-10 | En un teléfono compartido, otra persona del hogar puede ver los avisos. | Los avisos no llevan datos sensibles, solo estados (L-06). La situación socioeconómica es dato sensible en la Ley 21.719 (art. 2, letra g). | Por verificar con el tema de datos personales |
| R-11 | La transcripción de voz puede equivocarse, y la grabación de voz es un dato personal. | Mostrar a la familia lo que se entendió antes de actuar. No guardar el audio original; definir si se guarda la transcripción. | Por verificar |
| R-12 | Que las familias necesiten acompañante, audio u otro idioma son hipótesis. | Agregarlo a la pauta de entrevistas de D-18: cómo se informan hoy, quién les ayuda a leer, qué teléfono usan. | Por verificar |

## Pendiente para este documento

La lista de lo que ingeniería debe traducir desde producto está en "Handoff a ingeniería" de `product-state.md`: el ejecutor con una prueba por límite, el modelo de versiones, dependencias y compromisos, las reglas normativas pendientes de validar, el stack y el reparto de trabajo.

## Registro de cambios

| Fecha | Cambio | Fuente |
| --- | --- | --- |
| 2026-11-21 | Versión inicial: estado del stack (E-01) y propuesta de Kapso como canal de WhatsApp (E-02, R-01 a R-07). | Discord `#deficit-habitacional` y docs de Kapso |
| 2026-11-21 | Se agrega la sección de accesibilidad: datos de contexto, propuestas E-03 a E-08 y riesgos R-08 a R-12. | OCDE, SENADIS, Casen, DataReportal, BCN, Red de Lenguaje Claro y docs de Kapso |
