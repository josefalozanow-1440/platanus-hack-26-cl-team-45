# Juicio cualitativo

Un subagente Opus sin contexto leyó cada corrida sin saber qué condición ni qué modelo era, y comparó lo esperado con lo obtenido sin calcular porcentajes.

| Puesto | Sistema | Veredicto | ¿Lo usaría? | Graves | Menores | Defendibles | Por qué |
|---|---|---|---|---|---|---|---|
| 1 | claude_solo · Claude opus | Excelente | Sí | 0 | 1 | 4 | Cero errores graves y columnas que solo hay que normalizar un poco. |
| 2 | claude_solo · Claude haiku | Excelente | Sí | 0 | 3 | 3 | Cero graves y el extra más útil del grupo (reclamó antes y nada cambió), aunque los nombres de columna varían más. |
| 3 | claude_respuestas_jev · Claude opus | Bueno | Sí | 1 | 12 | 8 | Un solo grave y columnas fijas listas para agregar; sus fallas son intensidades infladas. |
| 4 | claude_solo · Claude sonnet | Bueno | Sí | 1 | 1 | 3 | Casi exacto, pero pierde la mejora de bienestar de la diseñadora y sus columnas son demasiado estrechas para agregar sin retrabajo. |
| 5 | claude_respuestas_jev · Claude haiku | Bueno | No | 2 | 11 | 9 | Columnas sólidas, pero pierde los ascensos de la analista junior y distorsiona el compañerismo del vendedor. |
| 6 | jev_columnas_sabidas (sin Claude) | Aceptable | No | 3 | 16 | 9 | Las conclusiones gruesas aguantan, pero inventa tres temas o lecturas que un informe repetiría. |
| 7 | claude_respuestas_jev · Claude sonnet | Aceptable | No | 5 | 12 | 8 | Tiene extras buenas como la intención de permanencia, pero inventa cinco lecturas que cambian conclusiones. |
| 8 | claude_pregunta_jev · Claude opus | Insuficiente | No | 8 | 17 | 5 | Su grilla genérica deja sin columna desarrollo, mentoría, apoyo de la empresa y herramientas. |
| 9 | claude_pregunta_jev · Claude haiku | Insuficiente | No | 11 | 16 | 2 | No tiene reconocimiento, feedback ni bienestar, y confunde flexibilidad con horas extra. |
| 10 | claude_pregunta_jev · Claude sonnet | Insuficiente | No | 12 | 15 | 5 | Pierde transparencia salarial, desarrollo, mentoría y apoyo familiar, y además inventa lecturas. |

**Conclusión:** Los diez aciertan el riesgo de fuga y si la persona propone mejora, así que la diferencia está en las columnas: los que arman columnas a partir de lo que dice cada persona («claude_solo · Claude opus», «claude_solo · Claude haiku», «claude_solo · Claude sonnet») casi no se equivocan, y los de grilla genérica («claude_pregunta_jev · Claude opus», «claude_pregunta_jev · Claude sonnet», «claude_pregunta_jev · Claude haiku») pierden temas centrales. Para un informe real usaría «claude_solo · Claude opus», o «claude_solo · Claude haiku» por su hallazgo de reclamos sin respuesta, siempre normalizando antes los nombres de columna; si hace falta una grilla fija desde el principio, «claude_respuestas_jev · Claude opus».

## jev_columnas_sabidas (sin Claude)

Las conclusiones gruesas se sostienen, pero inventa feedback_desarrollo positivo fuerte para la vendedora que nunca habla de desarrollo y mentoría negativa para el técnico de soporte. Lee al vendedor de terreno como compañerismo negativo y empeorando cuando él dice explícitamente mitad y mitad. Además, infla intensidades de forma sistemática.

- Columnas: Usa las columnas de referencia fijas, así que agrega bien, pero no distingue temas vecinos: duplica la queja de ascensos en plan_carrera y la de coordinación entre áreas en manejo_conflictos. No propone nada extra.
- Dimensiones nuevas (tendencia, riesgo, emoción, propone): Acierta el riesgo de fuga y si propone mejora en las 15 respuestas. En emoción solo confunde resignación con frustración una vez; la tendencia a veces se contagia de un tema a otro (el empeora del manejo de conflictos termina en compañerismo).

## claude_solo · Claude opus

No tiene ninguna diferencia grave: cada dirección, tema mencionado u omitido y riesgo de fuga calza con lo que dice la gente. Su lectura de transparencia en el jefe de proyectos (bandas negativas leves y la matriz aparte) es tan buena como la esperada, y el único desvío es una mentoría informal leída como moderada.

- Columnas: Crea columnas por respuesta pero con nombres bastante estables (comunicacion_jefatura, carga_trabajo, beneficios_familia, nivel_sueldo), y omite las que no aplican en vez de inventarlas. Sus extras, criterios_aumentos y reuniones_coordinacion, separan bien cosas que la referencia mezcla, aunque hay que normalizar algún nombre (transparencia_aumentos y transparencia_bandas) antes de agregar.
- Dimensiones nuevas (tendencia, riesgo, emoción, propone): Acierta el riesgo de fuga y si propone mejora en las 15 respuestas. Usa no_dice para la tendencia cuando la persona no la declara, y la única diferencia en emoción (resignación por frustración en la contadora) es defendible.

## claude_respuestas_jev · Claude opus

Es el más fiel de los que usan columnas fijas: solo inventa un feedback_desarrollo positivo para la vendedora. El resto son intensidades infladas (sueldo fuerte para quien dice nada dramático) y el manejo de conflictos atribuido al ingeniero de operaciones, que no cambian ninguna conclusión.

- Columnas: Columnas estables en las 15 respuestas y muy cercanas a la referencia, lo que lo hace el más cómodo para agregar en un informe. Igual que otros, duplica coordinación entre áreas como conflicto y ascensos como plan de carrera.
- Dimensiones nuevas (tendencia, riesgo, emoción, propone): Acierta el riesgo de fuga y si propone mejora en las 15 respuestas. La tendencia está bien salvo cuando arrastra el empeora de un tema a otro (comunicación de la tech lead); en emoción solo confunde resignación con frustración una vez.

## claude_pregunta_jev · Claude opus

Al no tener columnas para desarrollo profesional, mentoría, apoyo de la empresa ni herramientas, pierde justo los temas centrales de varias respuestas: la contadora que lleva cuatro años sin conversación de desarrollo, el papá del call center sin apoyo de la empresa y la analista cuyo mentor es lo que más destaca. Además, inventa horarios negativos para el call center y pierde la comparación con el mercado del operario.

- Columnas: Usa una grilla fija con extras genéricos de manual (trato_respeto, liderazgo_organizacion, inclusion_pertenencia, bonos_incentivos) que no salen de lo que dice la gente, mientras deja sin columna temas que sí aparecen. Están mal elegidas: anchas donde no hacía falta y ausentes donde había material.
- Dimensiones nuevas (tendencia, riesgo, emoción, propone): Acierta el riesgo de fuga y si propone mejora en las 15 respuestas. Acierta las emociones salvo un cruce resignación-frustración defendible, pero los extras no aportan dimensiones nuevas útiles.

## claude_solo · Claude sonnet

Tiene casi todo exacto; su error grave es no registrar la mejora de bienestar de la diseñadora (adiós dolores de cabeza, volvió al yoga), que es parte de su mensaje. Lo demás es la comunicación neutra de la tech lead omitida, sin consecuencias.

- Columnas: Las columnas son por respuesta y demasiado estrechas o inconsistentes para agregar (autonomia_descuentos, apoyo_coordinadora, metas_carga_llamadas, beneficios_paternidad, comunicacion_jefe y comunicacion_jefatura). Las extras de reuniones separan bien la reunión del resto de las herramientas, pero para un informe habría que normalizar todo a mano.
- Dimensiones nuevas (tendencia, riesgo, emoción, propone): Acierta el riesgo de fuga y si propone mejora en las 15 respuestas. Usa no_dice con criterio en la tendencia y la única diferencia de emoción (resignación en la contadora) es defendible.

## claude_respuestas_jev · Claude sonnet

Inventa más de la cuenta: carga de trabajo positiva fuerte y mejorando para la diseñadora (lo que mejoró fue la flexibilidad), horarios negativos para el call center, comparación con el mercado para la ingeniera que solo se compara con un colega y feedback positivo para la vendedora. También distorsiona el compañerismo del vendedor de terreno.

- Columnas: Columnas fijas razonables y bien nombradas. La extra intencion_de_permanencia es valiosa para un informe de fuga, y competencia_interna recoge bien al grupito competitivo del vendedor. Separar horarios_jornada de flexibilidad_teletrabajo también tiene sentido.
- Dimensiones nuevas (tendencia, riesgo, emoción, propone): Acierta el riesgo de fuga y si propone mejora en las 15 respuestas. Las emociones calzan salvo un cruce defendible, pero la tendencia se contagia entre temas (comunicación de la tech lead empeorando).

## claude_pregunta_jev · Claude sonnet

Es el peor: sin columna de transparencia pierde la queja principal de la ingeniera de datos y la mejora que cuenta el jefe de proyectos; sin feedback, mentoría ni apoyo de la empresa pierde lo central de la contadora, la analista junior, la diseñadora y el papá del call center. Encima inventa reconocimiento mixto y empeorando para la tech lead y distorsiona el compañerismo del vendedor.

- Columnas: Grilla fija con extras genéricas (confianza_trato, apoyo_disponibilidad, equidad_interna, comunicacion_interna) que se pisan con las columnas base y dejan huecos donde la gente sí habló. Las columnas no capturan lo que dice la gente.
- Dimensiones nuevas (tendencia, riesgo, emoción, propone): Acierta el riesgo de fuga y si propone mejora en las 15 respuestas. Las emociones están casi todas bien, pero nada de eso compensa los temas perdidos.

## claude_solo · Claude haiku

Sin errores graves: las direcciones, los temas presentes y el riesgo de fuga calzan con las transcripciones. Lo único discutible es leer como negativo el desarrollo de la tech lead (ella también destaca los buenos code reviews) y omitir la ayuda informal de la coordinadora a la asistente de marketing.

- Columnas: Columnas por respuesta con nombres solo a medias estables (oportunidades_ascenso y ascensos_transparencia, equipo_interno y ambiente_equipo), así que habría que normalizar. Sus extras son el mejor hallazgo de los diez: respuesta_a_reclamos y reclamos_sin_respuesta marcan a quienes ya reclamaron sin resultado, que es justo la señal que anticipa la fuga.
- Dimensiones nuevas (tendencia, riesgo, emoción, propone): Acierta el riesgo de fuga y si propone mejora en las 15 respuestas. La tendencia queda en no_dice cuando no se declara y acierta todas las emociones.

## claude_respuestas_jev · Claude haiku

Lee bien casi todo, incluida la comunicación de la tech lead como positiva moderada y estable, que es defendible. Sus dos errores graves son omitir los ascensos de la analista junior (los comenta con sentimientos encontrados) y leer al vendedor de terreno como compañerismo negativo y empeorando.

- Columnas: Columnas fijas y bien nombradas que agregan sin problema. Fusionar capacitacion_y_mentoria esconde al mentor de la analista junior, que era lo que más destacaba; ahí la columna queda demasiado ancha.
- Dimensiones nuevas (tendencia, riesgo, emoción, propone): Acierta el riesgo de fuga y si propone mejora en las 15 respuestas. En emoción solo confunde resignación con frustración una vez; infla intensidades y a veces pone tendencia (empeora) donde la persona no la declara.

## claude_pregunta_jev · Claude haiku

Le faltan columnas básicas: no tiene reconocimiento (pierde el elogio central de la vendedora), feedback ni bienestar, y como su columna de horarios es solo horas_extra, se le escapa la flexibilidad de la diseñadora, que es su tema principal. También inventa comparación con el mercado para la ingeniera de datos y distorsiona el compañerismo del vendedor.

- Columnas: Mezcla comunicación con retroalimentación en una sola columna y suma extras de manual (confianza_jefatura, claridad_prioridades, bonos_incentivos) que no salen de las respuestas. evaluacion_desempeno y dotacion_recursos sí tienen sentido, pero no compensan los huecos.
- Dimensiones nuevas (tendencia, riesgo, emoción, propone): Acierta el riesgo de fuga y si propone mejora en las 15 respuestas. Acierta las emociones, pero pone tendencia de más (sueldo y mercado empeorando sin que nadie lo diga).

