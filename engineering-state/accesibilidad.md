# Accesibilidad

Parte de [`engineering-state.md`](../engineering-state.md). Léelo si tu tarea toca la vista o los textos para familias. Incluye las propuestas E-03 a E-08 y los riesgos R-08 a R-12.

Las familias DS49 son el actor con menos experiencia digital del proyecto, y para ellas es la vista simple de D-16. Si no entienden lo que ven, el producto no les sirve aunque el ejecutor funcione. Esta sección reúne lo que dicen los datos y lo que ingeniería puede aportar.

## Qué dicen los datos

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

## Propuestas de ingeniería

Ordenadas por costo y valor para la hackatón. Ninguna cambia el alcance ni los límites de producto; si alguna lo hace, manda `product-state.md`.

| ID | Propuesta | Cómo se construye | Ítems de producto | Costo estimado |
| --- | --- | --- | --- | --- |
| E-03 | Prueba automática de los textos para familias. | Cada mensaje simple que genera el agente pasa por una revisión en código antes de mostrarse: largo máximo de oración, palabras de un glosario prohibido sin explicar (EP, DOM, SERVIU, FTO, "calificado") y un índice de legibilidad en español (por ejemplo, Fernández-Huerta o INFLESZ). Si falla, el agente reescribe. Se agrega a las pruebas del proyecto con casos fijos, incluido uno donde nadie tomó el paso. | D-16, L-13 | 2 horas |
| E-04 | Vista de familias accesible y liviana. | Meta WCAG 2.2 AA: contraste, letra de 18 px o más, el estado siempre con ícono y palabra además del color, botones grandes, funciona con lector de pantalla. Presupuesto de peso por página para teléfonos de gama baja y datos prepago. Revisión automática con axe o Lighthouse en cada despliegue. | D-13, L-06 | 2 a 3 horas |
| E-05 | Acompañante de la familia. | La familia puede nombrar a una persona de confianza (un hijo, una vecina, la dirigencia) que ve su vista y le explica. El acompañamiento queda registrado, se puede revocar y nunca permite aprobar ni aceptar en nombre de la familia. Es multiplayer: el producto mejora cuando alguien acompaña. | L-09, L-10, L-12 | 3 horas |
| E-06 | Registro asistido. | Cuando la EP o la dirigencia conversa en persona con una familia, puede registrar lo conversado en el expediente, marcado como "registrado por X en presencia de la familia". El registro es append-only y no cuenta como aprobación. | L-07, L-10, L-12 | 2 horas |
| E-07 | Notas de voz de entrada y salida. | La familia manda una nota de voz por WhatsApp; el servidor la descarga al tiro, la transcribe con un servicio de voz a texto y la trata como cualquier pregunta. La respuesta puede volver como audio con texto a voz. Claude no transcribe audio, así que se necesita otro servicio. Depende de que producto reactive WhatsApp (X-08). | D-16, L-10 | 3 a 4 horas |
| E-08 | Otros idiomas para familias. | Los textos para familias se generan en el idioma que elija la familia, con la misma prueba de E-03. Solo si las entrevistas muestran familias que no leen bien en español. | D-16 | 2 horas, después de validar |

## Riesgos de accesibilidad

| ID | Riesgo | Mitigación | Estado |
| --- | --- | --- | --- |
| R-08 | Simplificar el texto puede borrar la incertidumbre ("se envió la consulta" pasa a leerse como "está aprobado"). | E-03 incluye casos de prueba que verifican que el texto simple conserva si algo es una gestión o un resultado (D-07, D-16). | Por construir |
| R-09 | Un acompañante puede presionar o decidir por la familia. | El acompañante solo ve y explica. La aprobación y la aceptación las hace la familia, y el ejecutor lo valida (L-09, L-12). | Por construir |
| R-10 | En un teléfono compartido, otra persona del hogar puede ver los avisos. | Los avisos no llevan datos sensibles, solo estados (L-06). La situación socioeconómica es dato sensible en la Ley 21.719 (art. 2, letra g). | Por verificar con el tema de datos personales |
| R-11 | La transcripción de voz puede equivocarse, y la grabación de voz es un dato personal. | Mostrar a la familia lo que se entendió antes de actuar. No guardar el audio original; definir si se guarda la transcripción. | Por verificar |
| R-12 | Que las familias necesiten acompañante, audio u otro idioma son hipótesis. | Agregarlo a la pauta de entrevistas de D-18: cómo se informan hoy, quién les ayuda a leer, qué teléfono usan. | Por verificar |
