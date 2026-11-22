# Columnas propuestas por los LLM

«→ x» es la columna de referencia con que la emparejó el alineador; «sin pareja» es un tema que no estaba en la referencia.

## ¿Cómo describirías tu relación con tu jefatura directa?

**Referencia:**
- **comunicacion**: Qué tan clara y frecuente es la comunicación con la jefatura
- **reconocimiento**: Si la jefatura reconoce y valora el trabajo bien hecho
- **autonomia**: Cuánta confianza y libertad da la jefatura para decidir, o si microgestiona
- **feedback_desarrollo**: Si la jefatura da retroalimentación y apoya el crecimiento profesional

**claude_respuestas_jev · opus** (una lista por pregunta):
- **comunicacion**: Si la jefatura informa a tiempo prioridades y cambios, responde los mensajes y mantiene instancias regulares de coordinación → comunicacion
- **reconocimiento**: Si la jefatura reconoce y agradece el trabajo bien hecho y el esfuerzo extra → reconocimiento
- **desarrollo_profesional**: Si la jefatura conversa sobre desempeño, aprendizaje y carrera y apoya el crecimiento de la persona → feedback_desarrollo
- **autonomia**: Cuánta libertad y confianza da la jefatura para decidir sin consultar ni ser supervisado de cerca → autonomia

**claude_respuestas_jev · sonnet** (una lista por pregunta):
- **comunicacion_informacion**: Qué tan clara, oportuna y fluida es la comunicación de la jefatura: reuniones periódicas, avisos de cambios, respuesta a los mensajes y definición de prioridades. → comunicacion
- **reconocimiento**: Si la jefatura valora, agradece y reconoce públicamente o en privado el trabajo y los logros de la persona y del equipo. → reconocimiento
- **confianza_autonomia**: Cuánta libertad y confianza da la jefatura para decidir y hacer el trabajo sin supervisión excesiva ni aprobaciones por cosas menores. → autonomia
- **desarrollo_y_feedback**: Si la jefatura conversa sobre el desempeño, da retroalimentación, apoya la formación y ayuda a la persona a crecer profesionalmente. → feedback_desarrollo
- **disponibilidad_cercania**: Qué tan presente, accesible y de buen trato es la jefatura en el día a día. *(sin pareja)*

**claude_respuestas_jev · haiku** (una lista por pregunta):
- **comunicacion_jefatura**: Cómo la jefatura informa cambios, responde mensajes y mantiene reuniones de coordinación. → comunicacion
- **reconocimiento_del_trabajo**: Si la jefatura reconoce y agradece los logros de la persona, en privado o frente a otros. → reconocimiento
- **desarrollo_profesional**: Si la jefatura conversa sobre el crecimiento, el aprendizaje y el plan de carrera de la persona. → feedback_desarrollo
- **autonomia_y_confianza**: Cuánta libertad y confianza da la jefatura para decidir y ejecutar el trabajo sin supervisión constante. → autonomia

**claude_pregunta_jev · opus** (una lista por pregunta):
- **comunicacion**: Qué tan clara, frecuente y abierta es la comunicación con la jefatura. → comunicacion
- **trato_respeto**: Si la jefatura trata a la persona con respeto, cercanía y buena disposición. *(sin pareja)*
- **apoyo**: Si la jefatura ayuda a resolver problemas, saca obstáculos y respalda a la persona. *(sin pareja)*
- **reconocimiento_feedback**: Si la jefatura reconoce el buen trabajo y da retroalimentación útil. → reconocimiento
- **autonomia_confianza**: Cuánta libertad y confianza da la jefatura para decidir y organizar el trabajo. → autonomia
- **liderazgo_organizacion**: Si la jefatura fija prioridades claras, planifica y toma decisiones a tiempo. *(sin pareja)*

**claude_pregunta_jev · sonnet** (una lista por pregunta):
- **confianza_trato**: Calidad del trato y la confianza entre la persona y su jefatura directa *(sin pareja)*
- **comunicacion_claridad**: Claridad de las instrucciones, expectativas y comunicación de la jefatura → comunicacion
- **feedback_reconocimiento**: Retroalimentación recibida y reconocimiento del trabajo por parte de la jefatura → reconocimiento
- **apoyo_disponibilidad**: Apoyo y disponibilidad de la jefatura cuando se la necesita *(sin pareja)*
- **autonomia_microgestion**: Grado de autonomía que da la jefatura frente a control excesivo → autonomia

**claude_pregunta_jev · haiku** (una lista por pregunta):
- **confianza_jefatura**: Confianza y respeto que la persona siente hacia su jefatura directa. *(sin pareja)*
- **comunicacion_retroalimentacion**: Calidad de la comunicación y de la retroalimentación que recibe de su jefatura. → comunicacion
- **apoyo_desbloqueo**: Disponibilidad y apoyo concreto de la jefatura para resolver problemas o desbloquear su trabajo. *(sin pareja)*
- **autonomia_jefatura**: Grado de autonomía que le da su jefatura para decidir cómo hace su trabajo. → autonomia

**claude_solo · opus** (temas libres por respuesta):
- *p1_jefatura_r1*:
  - **comunicacion_jefatura**: Comunicación de la jefatura sobre cambios y prioridades, y respuesta a consultas → comunicacion
  - **reconocimiento**: Reconocimiento de la jefatura por el trabajo bien hecho y el esfuerzo extra → reconocimiento
  - **desarrollo_profesional**: Conversaciones de desempeño y apoyo de la jefatura al desarrollo profesional → feedback_desarrollo
- *p1_jefatura_r2*:
  - **reconocimiento**: Reconocimiento público y concreto de los logros del equipo por parte del jefe → reconocimiento
  - **comunicacion_jefatura**: Comunicación de prioridades y cambios mediante chat de equipo y reunión semanal → comunicacion
  - **autonomia_decisiones**: Necesidad de consultar al jefe hasta los descuentos pequeños → autonomia
- *p1_jefatura_r3*:
  - **comunicacion_jefatura**: Rituales de comunicación con la jefatura: daily, one on one y Slack → comunicacion
  - **autonomia_confianza**: Confianza de la jefatura para que uno decida cómo hacer su trabajo sin microgestión → autonomia
  - **desarrollo_profesional**: Apoyo de la jefatura al crecimiento con revisiones de código y conversaciones de desarrollo → feedback_desarrollo

**claude_solo · sonnet** (temas libres por respuesta):
- *p1_jefatura_r1*:
  - **comunicacion_jefatura**: La jefa no avisa cambios, eliminó la reunión semanal y deja en visto los mensajes → comunicacion
  - **reconocimiento_trabajo**: Agradece en público los cierres buenos pero da por hecho el esfuerzo extra → reconocimiento
  - **desarrollo_profesional**: Nunca ha conversado con ella sobre su desarrollo y la evaluación es un formulario vacío → feedback_desarrollo
- *p1_jefatura_r2*:
  - **reconocimiento_jefe**: El jefe reconoce los logros con nombre ante el equipo y el gerente → reconocimiento
  - **comunicacion_jefe**: Mejoró con el chat del equipo y la reunión semanal de quince minutos → comunicacion
  - **autonomia_descuentos**: Debe consultar cada descuento pequeño y se pierde tiempo con el cliente → autonomia
- *p1_jefatura_r3*:
  - **confianza_autonomia**: La jefa confía y deja decidir sin supervisión excesiva → autonomia
  - **desarrollo_one_on_one**: Las one on one pasaron de desarrollo a estado del sprint, aunque el feedback en code review es bueno → feedback_desarrollo

**claude_solo · haiku** (temas libres por respuesta):
- *p1_jefatura_r1*:
  - **comunicacion_jefatura**: Se eliminó la reunión semanal de equipo, se entera tarde de las cosas y la jefa no responde los mensajes. → comunicacion
  - **reconocimiento_desempeno**: La jefa agradece los cierres en la reunión de área, pero el esfuerzo extra no se reconoce. → reconocimiento
  - **desarrollo_profesional**: Nunca ha tenido una conversación sobre su crecimiento y no le respondieron si la empresa apoyaba un diplomado. → feedback_desarrollo
- *p1_jefatura_r2*:
  - **reconocimiento_desempeno**: El jefe reconoce los logros del equipo en público, con correos y celebraciones. → reconocimiento
  - **comunicacion_jefatura**: Al principio la comunicación fallaba; ahora hay un chat de equipo y una conversación semanal. → comunicacion
  - **autonomia_descuentos**: Tiene que consultar al jefe incluso descuentos menores, lo que retrasa cierres con clientes. → autonomia
- *p1_jefatura_r3*:
  - **confianza_autonomia**: La tech lead confía en el equipo y deja decidir cómo resolver los tickets sin supervisarlos. → autonomia
  - **desarrollo_profesional**: Las one on one se volvieron de estado del sprint y ya no hablan de desarrollo, aunque los comentarios en el código sí ayudan. → feedback_desarrollo

## ¿Qué opinas de tu carga de trabajo y del equilibrio con tu vida personal?

**Referencia:**
- **volumen_trabajo**: La cantidad de trabajo asignado y si alcanza el tiempo para hacerlo
- **horarios**: La flexibilidad de horarios, el trabajo remoto y las horas extra
- **bienestar**: El estrés, el cansancio y la salud física o mental de la persona
- **apoyo_empresa**: Las políticas o beneficios de la empresa para conciliar trabajo y vida personal

**claude_respuestas_jev · opus** (una lista por pregunta):
- **volumen_trabajo**: Si la cantidad de trabajo y las metas asignadas se pueden cumplir con la dotación y el tiempo disponibles → volumen_trabajo
- **horarios_flexibilidad**: Horas extra, turnos y fines de semana, y la posibilidad de elegir horario o trabajar desde la casa → horarios
- **salud_bienestar**: Efecto del trabajo en el sueño, el cansancio, el estrés y la salud física de la persona → bienestar
- **apoyo_familia**: Beneficios y permisos de la empresa para la vida familiar, como permisos parentales, sala cuna, días libres o convenios para los hijos → apoyo_empresa

**claude_respuestas_jev · sonnet** (una lista por pregunta):
- **volumen_carga_trabajo**: Cantidad de trabajo, metas y pendientes frente al personal y el tiempo disponibles. → volumen_trabajo
- **horarios_jornada**: Duración de la jornada, horas extra, trabajo en fines de semana y cumplimiento del horario contractual. *(sin pareja)*
- **flexibilidad_teletrabajo**: Posibilidad de elegir horario, trabajar de forma híbrida o remota y ausentarse por imprevistos familiares. → horarios
- **apoyo_vida_familiar**: Beneficios y apoyo de la empresa para la vida familiar: permisos por hijos, paternidad o maternidad, sala cuna, vacaciones escolares, convenios. → apoyo_empresa
- **salud_bienestar**: Efecto del trabajo en la salud física y mental de la persona: sueño, estrés, dolores, energía y tiempo para su vida personal. → bienestar

**claude_respuestas_jev · haiku** (una lista por pregunta):
- **carga_de_trabajo**: Volumen de tareas, metas y dotación del equipo frente a lo que se espera hacer. → volumen_trabajo
- **horario_y_flexibilidad**: Horarios de salida, sábados, trabajo presencial o híbrido y libertad para organizar el horario. → horarios
- **salud_y_cansancio**: Efectos de la carga en el sueño, el cuerpo o el ánimo de la persona. → bienestar
- **apoyo_a_la_vida_familiar**: Beneficios para la familia como sala cuna, vacaciones de invierno, permisos o convenios para los hijos. → apoyo_empresa

**claude_pregunta_jev · opus** (una lista por pregunta):
- **volumen_trabajo**: Si la cantidad de tareas es razonable o excesiva para el tiempo disponible. → volumen_trabajo
- **horario_extra**: Si se trabaja fuera del horario, en horas extra o con disponibilidad permanente. *(sin pareja)*
- **flexibilidad**: Si existen opciones de teletrabajo, horario flexible o permisos cuando se necesitan. → horarios
- **vida_personal**: Si el trabajo deja tiempo y energía para la familia, la salud y la vida fuera del trabajo. *(sin pareja)*
- **estres_desgaste**: Nivel de estrés, cansancio o agotamiento que produce el trabajo. → bienestar
- **distribucion_carga**: Si la carga se reparte de forma justa dentro del equipo y hay dotación suficiente. *(sin pareja)*

**claude_pregunta_jev · sonnet** (una lista por pregunta):
- **volumen_trabajo**: Cantidad de tareas y si la carga es manejable o excesiva → volumen_trabajo
- **horarios_horas_extra**: Cumplimiento del horario y frecuencia de horas extra o trabajo fuera de jornada *(sin pareja)*
- **equilibrio_vida_personal**: Espacio para la familia, el descanso y la vida personal fuera del trabajo *(sin pareja)*
- **flexibilidad_teletrabajo**: Flexibilidad de horario, permisos y posibilidad de trabajo remoto → horarios
- **estres_desgaste**: Nivel de estrés, presión y cansancio causado por el trabajo → bienestar

**claude_pregunta_jev · haiku** (una lista por pregunta):
- **volumen_carga**: Cantidad de trabajo y presión por plazos que la persona percibe. → volumen_trabajo
- **horas_extra**: Horas extra, trabajo fuera de horario o disponibilidad fuera de la jornada. → horarios
- **equilibrio_vida_personal**: Balance entre el trabajo y la vida personal, la familia y el descanso. *(sin pareja)*
- **claridad_prioridades**: Claridad sobre las prioridades y cambios de última hora que generan retrabajo. *(sin pareja)*
- **dotacion_recursos**: Falta o suficiencia de personas, herramientas o recursos para cubrir la carga. *(sin pareja)*

**claude_solo · opus** (temas libres por respuesta):
- *p2_carga_r1*:
  - **carga_trabajo**: Volumen de trabajo frente a la dotación del turno → volumen_trabajo
  - **horarios_flexibilidad**: Horas extra, salidas tarde, sábados y falta de flexibilidad horaria → horarios
  - **salud_bienestar**: Efecto del trabajo en el sueño, la salud física y la vida familiar → bienestar
- *p2_carga_r2*:
  - **carga_trabajo**: Cantidad de squads, pantallas por sprint y sesiones de investigación asignadas → volumen_trabajo
  - **horarios_flexibilidad**: Trabajo híbrido y libertad para elegir horario → horarios
  - **salud_bienestar**: Bienestar personal, menos estrés y tiempo para actividades propias → bienestar
  - **beneficios_familia**: Beneficios para la familia como tardes libres, apoyo en vacaciones de invierno y sala cuna → apoyo_empresa
- *p2_carga_r3*:
  - **carga_trabajo**: Meta de llamadas y correos por turno que no alcanza a cumplirse → volumen_trabajo
  - **beneficios_familia**: Apoyo de la empresa a la paternidad y a la vida familiar más allá de la ley → apoyo_empresa

**claude_solo · sonnet** (temas libres por respuesta):
- *p2_carga_r1*:
  - **carga_trabajo_dotacion**: Menos gente y más despachos, pendientes que se acumulan → volumen_trabajo
  - **horarios_extension_jornada**: Sin flexibilidad, salidas tardías y sábados todos → horarios
  - **salud_vida_personal**: Mal sueño, dolor de espalda y sin energía para la familia → bienestar
- *p2_carga_r2*:
  - **flexibilidad_horaria_remota**: Horario elegido e híbrido que permiten estar con los hijos → horarios
  - **apoyo_familia**: Tardes libres para actos y cumpleaños pero nada para vacaciones de invierno ni sala cuna → apoyo_empresa
  - **carga_trabajo**: Pantallas por sprint y sesiones de investigación, descrita sin queja → volumen_trabajo
- *p2_carga_r3*:
  - **metas_carga_llamadas**: Meta de llamadas que no deja tiempo para los correos y falta claridad de prioridad → volumen_trabajo
  - **beneficios_paternidad**: La empresa solo da lo legal para padres, sin convenios ni seguros → apoyo_empresa

**claude_solo · haiku** (temas libres por respuesta):
- *p2_carga_r1*:
  - **carga_trabajo**: Turno con menos personas (de catorce a once) y más despachos, sin reponer a quienes se fueron. → volumen_trabajo
  - **horarios_jornada**: Sale tarde casi todos los días y los sábados trabaja casi todos, aunque el contrato dice otra cosa. → horarios
  - **impacto_vida_personal**: El cansancio le afecta el sueño, la espalda y la familia; antes jugaba con su hijo. → bienestar
  - **respuesta_a_reclamos**: Ya planteó estos problemas al jefe de operaciones en otras encuestas y nada cambió. *(sin pareja)*
- *p2_carga_r2*:
  - **carga_trabajo**: Dos escuadras, entre cuatro y seis pantallas o flujos por sprint y dos sesiones de investigación al mes. → volumen_trabajo
  - **flexibilidad_horario**: Pasó de presencial a híbrido y ahora elige su horario; puede trabajar desde casa si un hijo se enferma. → horarios
  - **bienestar_personal**: Antes tenía dolor de cabeza y dormía mal; ahora está más tranquila y volvió a hacer yoga. → bienestar
  - **beneficios_familia**: La tarde libre por cumpleaños y actos escolares es buena, pero no hay nada para vacaciones de invierno y la sala cuna es solo lo legal. → apoyo_empresa
- *p2_carga_r3*:
  - **carga_trabajo**: Meta de 45 llamadas por turno más correos; la bandeja siempre se llena y no alcanza el tiempo para ambos. → volumen_trabajo
  - **beneficios_familia**: No hay días extra para papás, convenio de jardín ni seguro complementario, y el bono de escolaridad es chico. → apoyo_empresa

## ¿Cómo ha sido tu experiencia con la remuneración y los beneficios?

**Referencia:**
- **sueldo**: El monto del sueldo y si alcanza para vivir
- **beneficios**: Los beneficios no monetarios o complementarios: seguro, aguinaldos, días libres, convenios
- **transparencia**: Qué tan claros son los criterios para aumentos y bandas salariales
- **comparacion_mercado**: Cómo se compara la remuneración con lo que pagan otras empresas

**claude_respuestas_jev · opus** (una lista por pregunta):
- **nivel_sueldo**: Si el sueldo alcanza para vivir según el costo de vida de la persona → sueldo
- **beneficios**: Calidad de los beneficios no salariales, como seguro de salud, aguinaldos, días libres, casino o convenios → beneficios
- **transparencia_aumentos**: Si se entiende cómo se deciden los aumentos, con criterios, evaluaciones y bandas salariales conocidas → transparencia
- **comparacion_mercado**: Cómo se compara el sueldo con lo que pagan otras empresas por cargos parecidos → comparacion_mercado

**claude_respuestas_jev · sonnet** (una lista por pregunta):
- **nivel_sueldo**: Si el sueldo alcanza para vivir y qué tan adecuado es para el cargo y el costo de la vida. → sueldo
- **comparacion_mercado**: Cómo se compara el sueldo con lo que pagan otras empresas, o con colegas de cargo similar. → comparacion_mercado
- **transparencia_aumentos**: Qué tan claros y justos son los criterios de reajustes, aumentos, evaluaciones y bandas salariales. → transparencia
- **beneficios_economicos**: Aguinaldos, bonos, cajas, días libres, convenios y otros beneficios no salariales. → beneficios
- **salud_y_casino**: Cobertura del seguro de salud complementario y calidad de la alimentación o colación. *(sin pareja)*

**claude_respuestas_jev · haiku** (una lista por pregunta):
- **nivel_del_sueldo**: Si el sueldo alcanza para vivir y cómo ha cambiado con el tiempo. → sueldo
- **beneficios**: Seguro de salud, aguinaldos, días libres, convenios, caja de navidad, casino y colación. → beneficios
- **transparencia_de_aumentos**: Cómo se deciden los aumentos, si hay bandas salariales y si los criterios son claros y justos. → transparencia
- **competitividad_salarial**: Cómo se compara el sueldo y los beneficios con lo que se paga en otras empresas. → comparacion_mercado

**claude_pregunta_jev · opus** (una lista por pregunta):
- **sueldo_nivel**: Si el sueldo es adecuado para el cargo, las responsabilidades y lo que paga el mercado. → sueldo
- **equidad_interna**: Si la remuneración es justa comparada con la de colegas en cargos similares. *(sin pareja)*
- **reajustes_aumentos**: Si los reajustes y aumentos llegan a tiempo y siguen el costo de la vida. *(sin pareja)*
- **bonos_incentivos**: Si los bonos e incentivos por desempeño o metas son claros y alcanzables. *(sin pareja)*
- **beneficios**: Valor y utilidad de los beneficios como seguro de salud, aguinaldos, convenios o días libres. → beneficios
- **transparencia_pago**: Si los criterios de pago y beneficios se explican con claridad y se cumplen sin errores. → transparencia

**claude_pregunta_jev · sonnet** (una lista por pregunta):
- **sueldo_nivel**: Si el sueldo es adecuado para el cargo, las funciones y el mercado → sueldo
- **equidad_interna**: Justicia de los sueldos al compararlos con los de otros compañeros *(sin pareja)*
- **bonos_reajustes**: Bonos, reajustes y aumentos de sueldo *(sin pareja)*
- **beneficios_salud_seguros**: Beneficios de salud, seguros y apoyo económico *(sin pareja)*
- **beneficios_otros**: Otros beneficios como días libres, alimentación, convenios y actividades → beneficios

**claude_pregunta_jev · haiku** (una lista por pregunta):
- **sueldo_base**: Opinión sobre el monto del sueldo o sobre sus reajustes. → sueldo
- **bonos_incentivos**: Bonos, incentivos variables o metas que definen parte de la remuneración. *(sin pareja)*
- **beneficios**: Beneficios no salariales como seguros, salud, días libres o convenios. → beneficios
- **equidad_mercado**: Percepción de equidad frente a colegas o frente al mercado laboral. → comparacion_mercado
- **transparencia_criterios**: Claridad sobre los criterios y el proceso con que se definen los reajustes. → transparencia

**claude_solo · opus** (temas libres por respuesta):
- *p3_remuneracion_r1*:
  - **nivel_sueldo**: Sueldo en relación con el cargo y el costo de vida → sueldo
  - **beneficios**: Seguro de salud, días libres, aguinaldos y convenio de gimnasio → beneficios
  - **transparencia_aumentos**: Claridad sobre cómo se deciden los aumentos y las bandas salariales → transparencia
- *p3_remuneracion_r2*:
  - **nivel_sueldo**: Sueldo suficiente para vivir y ahorrar → sueldo
  - **criterios_aumentos**: Matriz de evaluación que define los porcentajes de aumento *(sin pareja)*
  - **transparencia_bandas**: Desconocimiento de las bandas salariales y sus techos → transparencia
  - **competitividad_externa**: Sueldo comparado con lo que paga el mercado → comparacion_mercado
- *p3_remuneracion_r3*:
  - **nivel_sueldo**: Sueldo frente al costo de vida → sueldo
  - **beneficios**: Aguinaldo, caja de navidad, seguro de salud y casino → beneficios
  - **competitividad_externa**: Sueldo comparado con otras plantas y empresas del rubro → comparacion_mercado

**claude_solo · sonnet** (temas libres por respuesta):
- *p3_remuneracion_r1*:
  - **nivel_sueldo**: Sueldo algo bajo, alcanza justo → sueldo
  - **beneficios**: Seguro de salud, semana libre, aguinaldos y gimnasio muy buenos → beneficios
  - **transparencia_aumentos**: Nadie explica los criterios de los aumentos y hay desigualdad entre pares → transparencia
- *p3_remuneracion_r2*:
  - **nivel_sueldo**: Sueldo que ha subido y hoy alcanza bien → sueldo
  - **criterio_aumentos**: Hay matriz de evaluación, pero las bandas no se conocen → transparencia
  - **competitividad_mercado**: Sueldos similares o algo sobre el mercado → comparacion_mercado
- *p3_remuneracion_r3*:
  - **nivel_sueldo**: El sueldo no alcanza por el alza del costo de vida → sueldo
  - **beneficios**: Aguinaldo y caja de navidad buenos, seguro de salud y casino malos → beneficios
  - **competitividad_mercado**: Pagan mucho menos que otras plantas del rubro → comparacion_mercado

**claude_solo · haiku** (temas libres por respuesta):
- *p3_remuneracion_r1*:
  - **sueldo_base**: El sueldo es bajo para lo que hace y alcanza justo a fin de mes; así ha sido desde que entró. → sueldo
  - **beneficios**: Seguro complementario muy bueno, semana libre entre navidad y año nuevo, aguinaldos y convenio con gimnasio. → beneficios
  - **transparencia_aumentos**: Nadie explica cómo se deciden los aumentos ni por qué a un compañero le subieron el doble; antes había una conversación en marzo. → transparencia
- *p3_remuneracion_r2*:
  - **sueldo_base**: El sueldo ha subido con los años y el cambio de cargo; ahora le alcanza y puede ahorrar. → sueldo
  - **criterios_aumentos**: Hay una matriz de evaluación que reemplazó el trato a dedo, pero nadie conoce las bandas salariales. → transparencia
  - **competitividad_salarial**: Comparado con consultoras, están bien o un poco arriba. → comparacion_mercado
- *p3_remuneracion_r3*:
  - **sueldo_base**: El sueldo no alcanza: antes pagaba arriendo y comida, ahora pide prestado a mitad de mes. → sueldo
  - **brecha_salarial_externa**: Otras plantas pagan unos doscientos mil pesos más por el mismo trabajo y mejores horas extra. → comparacion_mercado
  - **beneficios**: El aguinaldo y la caja de navidad son buenos, pero el seguro cubre poco y la colación es mala. → beneficios
  - **reclamos_sin_respuesta**: Ha reclamado al supervisor y al sindicato durante diez años sin que nada cambie. *(sin pareja)*

## ¿Qué tan claras ves tus oportunidades de crecer dentro de la empresa?

**Referencia:**
- **capacitacion**: Los cursos, capacitaciones y oportunidades de aprender que ofrece la empresa
- **ascensos**: Las oportunidades de ascenso y si los criterios para ascender son justos
- **plan_carrera**: Qué tan clara es la ruta de carrera y los pasos para avanzar
- **mentoria**: Si hay personas que guían, enseñan o acompañan el desarrollo

**claude_respuestas_jev · opus** (una lista por pregunta):
- **capacitacion**: Cursos, presupuesto de capacitación, diplomados y otras instancias formales para aprender → capacitacion
- **mentoria**: Apoyo de un mentor o de compañeros con más experiencia que enseñan en el día a día → mentoria
- **claridad_carrera**: Si están claros los niveles de cargo y los requisitos para pasar de uno a otro → plan_carrera
- **ascensos**: Si los ascensos y vacantes se dan de forma justa, se concursan internamente y favorecen a la gente de adentro → ascensos

**claude_respuestas_jev · sonnet** (una lista por pregunta):
- **ascensos_y_vacantes**: Cómo se llenan los cargos superiores: concursos internos, contratación externa, rapidez de ascensos y justicia del proceso. → ascensos
- **claridad_carrera**: Si la persona sabe qué se necesita para subir de nivel: requisitos, niveles, métricas y rutas de carrera escritas. → plan_carrera
- **capacitacion_formacion**: Acceso a cursos, presupuesto de capacitación, plataformas, diplomados y actividades de aprendizaje. → capacitacion
- **mentoria_aprendizaje_equipo**: Apoyo de mentores, jefaturas y compañeros para aprender en el día a día. → mentoria
- **intencion_de_permanencia**: Si la persona dice que seguirá en la empresa o que está buscando otras opciones por falta de crecimiento. *(sin pareja)*

**claude_respuestas_jev · haiku** (una lista por pregunta):
- **capacitacion_y_mentoria**: Cursos, presupuesto de formación, mentores y espacios de aprendizaje disponibles. → capacitacion
- **ascensos_y_vacantes**: Cómo se asignan los cargos nuevos: si se concursan internamente o se traen personas de afuera. → ascensos
- **criterios_de_crecimiento**: Si existe claridad sobre qué se necesita para pasar de un nivel o cargo a otro. → plan_carrera

**claude_pregunta_jev · opus** (una lista por pregunta):
- **ascensos**: Si existen y son alcanzables las posibilidades de subir de cargo o cambiar de área. → ascensos
- **capacitacion**: Acceso a cursos, formación y oportunidades para aprender nuevas habilidades. → capacitacion
- **claridad_carrera**: Si están claros los criterios, requisitos y la ruta para crecer en la empresa. → plan_carrera
- **evaluacion_desempeno**: Si la evaluación de desempeño es justa y sirve para decidir el desarrollo de la persona. *(sin pareja)*
- **equidad_oportunidades**: Si las oportunidades se reparten por mérito o dependen de favoritismos y contactos. *(sin pareja)*
- **desafios_rol**: Si el cargo actual ofrece desafíos y responsabilidades nuevas o la persona siente estancamiento. *(sin pareja)*

**claude_pregunta_jev · sonnet** (una lista por pregunta):
- **claridad_plan_carrera**: Si la persona sabe qué camino de carrera o ascenso existe para ella → plan_carrera
- **oportunidades_ascenso**: Disponibilidad real de ascensos, cargos nuevos o movilidad interna → ascensos
- **capacitacion_desarrollo**: Acceso a capacitaciones, cursos y aprendizaje → capacitacion
- **criterios_meritocracia**: Transparencia y justicia de los criterios para promover a las personas *(sin pareja)*
- **apoyo_jefatura_crecimiento**: Respaldo de la jefatura y la empresa al desarrollo profesional *(sin pareja)*

**claude_pregunta_jev · haiku** (una lista por pregunta):
- **ruta_carrera**: Claridad de los pasos siguientes o de la ruta de carrera en su trayectoria. → plan_carrera
- **capacitacion_formal**: Acceso a cursos, certificaciones o formación formal. → capacitacion
- **aprendizaje_en_el_trabajo**: Aprendizaje informal como proyectos desafiantes, mentoría o rotaciones. → mentoria
- **promociones**: Posibilidades reales de ascender o cambiar de cargo dentro de la empresa. → ascensos
- **evaluacion_desempeno**: Proceso de evaluación de desempeño y su relación con las oportunidades de crecer. *(sin pareja)*

**claude_solo · opus** (temas libres por respuesta):
- *p4_crecimiento_r1*:
  - **capacitacion**: Presupuesto de capacitación, cursos y almuerzos de aprendizaje → capacitacion
  - **mentoria**: Apoyo informal de la coordinadora digital para resolver dudas → mentoria
  - **ascensos**: Cargos que se asignan sin concurso interno ni aviso al equipo → ascensos
- *p4_crecimiento_r2*:
  - **ascensos**: Promoción interna frente a contratar de afuera para cargos de jefatura → ascensos
  - **claridad_carrera**: Requisitos escritos y claros para subir de nivel o cambiar de cargo → plan_carrera
- *p4_crecimiento_r3*:
  - **mentoria**: Mentor asignado y disposición del equipo para enseñar → mentoria
  - **claridad_carrera**: Esquema de niveles y expectativas para cada cargo → plan_carrera
  - **capacitacion**: Plataforma de cursos y fondo para diplomados → capacitacion
  - **ascensos**: Ascensos rápidos para algunos, frenados por cupo de presupuesto para otros → ascensos

**claude_solo · sonnet** (temas libres por respuesta):
- *p4_crecimiento_r1*:
  - **capacitacion_aprendizaje**: Presupuesto de capacitación, cursos y almuerzos de aprendizaje → capacitacion
  - **transparencia_ascensos**: Los cargos se asignan sin concurso a conocidos del gerente → ascensos
  - **apoyo_coordinadora**: La coordinadora ayuda informalmente con dudas → mentoria
- *p4_crecimiento_r2*:
  - **ascensos_internos**: Las jefaturas se llenan con gente de afuera, antes subían los de adentro → ascensos
  - **claridad_requisitos_carrera**: Nadie sabe qué hace falta para subir de nivel y las jefaturas dan respuestas distintas → plan_carrera
- *p4_crecimiento_r3*:
  - **mentoria**: Mentor dedicado que enseña y apoya al equipo → mentoria
  - **claridad_ruta_carrera**: El esquema de niveles que le mostró la jefa aclaró hacia dónde ir → plan_carrera
  - **capacitacion**: Plataforma de cursos y fondo anual de diplomados → capacitacion
  - **ascensos**: Ascensos rápidos para algunos pero otros esperan por falta de presupuesto → ascensos

**claude_solo · haiku** (temas libres por respuesta):
- *p4_crecimiento_r1*:
  - **capacitacion**: Hay presupuesto de capacitación por persona, cursos certificados, almuerzos de aprendizaje y ayuda de la coordinadora. → capacitacion
  - **ascensos_transparencia**: Los cargos se pasan a alguien sin concurso y el equipo se entera por el correo de bienvenida; ya es la costumbre. → ascensos
- *p4_crecimiento_r2*:
  - **oportunidades_ascenso**: Lleva siete años en el mismo cargo; antes subía gente de soporte y ahora las jefaturas llegan de afuera. → ascensos
  - **criterios_promocion**: No hay requisitos escritos para pasar de nivel y cada jefe le dice algo distinto. → plan_carrera
- *p4_crecimiento_r3*:
  - **mentoria**: El mentor revisa los modelos línea por línea y se queda después de hora para ayudar. → mentoria
  - **claridad_niveles_carrera**: Al inicio no sabía hacia dónde podía crecer; en la evaluación de seis meses le mostraron los niveles junior, analista y senior. → plan_carrera
  - **capacitacion**: Hay una plataforma con cursos de Excel avanzado y Power BI, y un fondo anual para diplomados. → capacitacion
  - **ascensos**: Dos juniors subieron en menos de dos años, pero a una compañera la dejaron esperando por falta de presupuesto. → ascensos

## ¿Cómo es el ambiente con tu equipo y la colaboración con otras áreas?

**Referencia:**
- **companerismo**: La relación y el buen trato entre compañeros del mismo equipo
- **colaboracion_areas**: Qué tan fácil es trabajar y coordinarse con otras áreas
- **manejo_conflictos**: Cómo se manejan los conflictos: si se conversan y resuelven, o se evitan y escalan
- **herramientas**: Las herramientas y reuniones que se usan para coordinarse: software, canales, rituales

**claude_respuestas_jev · opus** (una lista por pregunta):
- **ambiente_equipo**: Compañerismo, confianza y disposición a ayudarse dentro del propio equipo → companerismo
- **colaboracion_areas**: Coordinación y rapidez de respuesta con otras áreas de la empresa → colaboracion_areas
- **manejo_conflictos**: Si los roces y conflictos se conversan y se resuelven o quedan sin tratar → manejo_conflictos
- **herramientas_coordinacion**: Herramientas y reuniones que se usan para coordinarse y compartir información → herramientas

**claude_respuestas_jev · sonnet** (una lista por pregunta):
- **companerismo_equipo**: Ambiente, apoyo mutuo y confianza dentro del equipo directo de la persona. → companerismo
- **colaboracion_otras_areas**: Qué tan fácil o difícil es trabajar con otras áreas: respuesta, coordinación y aviso oportuno. → colaboracion_areas
- **manejo_conflictos**: Cómo se enfrentan y resuelven los roces o peleas entre personas o áreas, y quién se hace cargo. → manejo_conflictos
- **competencia_interna**: Presencia de rivalidad o competencia entre compañeros que afecta la colaboración. *(sin pareja)*
- **herramientas_y_reuniones**: Utilidad de las herramientas de trabajo compartidas y de las reuniones de coordinación para colaborar. → herramientas

**claude_respuestas_jev · haiku** (una lista por pregunta):
- **ambiente_del_equipo**: Qué tan bien se lleva el equipo propio, su apoyo mutuo y su cohesión. → companerismo
- **colaboracion_entre_areas**: Qué tan fácil o difícil es coordinar trabajo con otras áreas y qué tan rápido responden. → colaboracion_areas
- **manejo_de_conflictos**: Cómo se resuelven las peleas o roces entre personas, o si quedan sin resolver. → manejo_conflictos
- **herramientas_y_reuniones**: Sistemas, planillas, aplicaciones y reuniones que se usan para coordinar el trabajo. → herramientas

**claude_pregunta_jev · opus** (una lista por pregunta):
- **relaciones_equipo**: Calidad del trato, la confianza y la buena onda entre compañeros del equipo. → companerismo
- **colaboracion_equipo**: Si dentro del equipo se ayudan y trabajan juntos para sacar las tareas. *(sin pareja)*
- **coordinacion_areas**: Si la colaboración y la coordinación con otras áreas fluye o se traba. → colaboracion_areas
- **comunicacion**: Si la información circula clara y a tiempo dentro del equipo y entre áreas. *(sin pareja)*
- **conflictos**: Presencia de roces, conflictos, malos tratos o competencia entre personas o áreas. → manejo_conflictos
- **inclusion_pertenencia**: Si la persona se siente integrada, valorada y parte del equipo. *(sin pareja)*

**claude_pregunta_jev · sonnet** (una lista por pregunta):
- **clima_companerismo**: Ambiente, relación personal y compañerismo dentro del equipo → companerismo
- **colaboracion_equipo**: Trabajo conjunto, ayuda mutua y coordinación dentro del equipo *(sin pareja)*
- **colaboracion_otras_areas**: Coordinación y colaboración con otras áreas de la empresa → colaboracion_areas
- **conflictos_tensiones**: Conflictos, tensiones o problemas de convivencia → manejo_conflictos
- **comunicacion_interna**: Flujo de información y comunicación entre personas y áreas *(sin pareja)*

**claude_pregunta_jev · haiku** (una lista por pregunta):
- **ambiente_equipo**: Clima y convivencia dentro del equipo directo. → companerismo
- **colaboracion_equipo**: Trabajo colaborativo y apoyo mutuo entre compañeros del mismo equipo. *(sin pareja)*
- **colaboracion_otras_areas**: Coordinación y colaboración con personas de otras áreas de la empresa. → colaboracion_areas
- **conflictos_tensiones**: Conflictos, tensiones o malos tratos entre personas del equipo o con otras áreas. → manejo_conflictos

**claude_solo · opus** (temas libres por respuesta):
- *p5_equipo_r1*:
  - **ambiente_equipo**: Relación y apoyo mutuo dentro del equipo → companerismo
  - **colaboracion_areas**: Coordinación con mantenimiento y compras → colaboracion_areas
  - **herramientas**: Información dispersa entre SAP, planillas, correo y WhatsApp → herramientas
  - **reuniones_coordinacion**: Reunión semanal de coordinación larga y sin compromisos *(sin pareja)*
- *p5_equipo_r2*:
  - **ambiente_equipo**: Unión y apoyo mutuo dentro del equipo → companerismo
  - **colaboracion_areas**: Colaboración con otras áreas, fluida con finanzas y lenta con operaciones → colaboracion_areas
  - **manejo_conflictos**: Tendencia a dejar pasar los roces sin conversarlos → manejo_conflictos
- *p5_equipo_r3*:
  - **ambiente_equipo**: Equipo dividido entre compañeros colaboradores y un grupo competitivo → companerismo
  - **manejo_conflictos**: Falta de intervención de la jefatura cuando hay peleas entre vendedores → manejo_conflictos
  - **herramientas**: Aplicación móvil para visitas y pedidos y reunión de lunes más ordenada → herramientas

**claude_solo · sonnet** (temas libres por respuesta):
- *p5_equipo_r1*:
  - **clima_equipo**: Equipo unido que se ayuda sin que se lo pidan → companerismo
  - **colaboracion_entre_areas**: Mantenimiento y compras no avisan y causan paradas de línea → colaboracion_areas
  - **herramientas_informacion**: Información dispersa entre SAP, planillas, correos y WhatsApp → herramientas
  - **reunion_coordinacion**: Reunión semanal larga sin compromisos *(sin pareja)*
- *p5_equipo_r2*:
  - **clima_equipo**: Equipo más unido, se cubren y se apoyan → companerismo
  - **colaboracion_entre_areas**: Finanzas responde rápido, operaciones demora → colaboracion_areas
  - **manejo_conflictos**: Los roces se dejan pasar sin conversarlos → manejo_conflictos
- *p5_equipo_r3*:
  - **clima_equipo**: Equipo mitad buena onda y mitad competitivo → companerismo
  - **resolucion_conflictos**: El jefe nuevo no resuelve peleas y el ambiente se deteriora → manejo_conflictos
  - **herramientas_trabajo**: App móvil con visitas, pedidos y mapa de clientes → herramientas
  - **reunion_lunes**: Reunión de lunes más corta y ordenada *(sin pareja)*

**claude_solo · haiku** (temas libres por respuesta):
- *p5_equipo_r1*:
  - **equipo_interno**: El equipo de seis se apoya sin que se lo pidan; cubrieron la planificación de un compañero que tuvo una hija. → companerismo
  - **colaboracion_otras_areas**: Con mantenimiento y compras todo pasa por solicitud formal; un repuesto atrasado paró una línea medio día sin aviso. → colaboracion_areas
  - **herramientas_informacion**: La información está repartida entre SAP, planillas, correos y WhatsApp, y no se sabe cuál está actualizada. → herramientas
  - **reunion_coordinacion**: La reunión semanal de coordinación dura una hora y media y nadie se compromete a nada. *(sin pareja)*
- *p5_equipo_r2*:
  - **equipo_interno**: El equipo de RRHH se ha unido en los últimos años y se cubre cuando alguien tiene un problema. → companerismo
  - **colaboracion_otras_areas**: Con finanzas trabajan bien, pero con operaciones pedir datos toma una semana o más, y eso siempre ha sido así. → colaboracion_areas
  - **manejo_de_roces**: Cuando hay roces se dejan pasar sin conversarlos, y eso se nota después en el trato. → manejo_conflictos
- *p5_equipo_r3*:
  - **ambiente_equipo**: Hay compañeros muy buena onda, pero un grupo competitivo que se queda con los clientes; siempre ha sido así. → companerismo
  - **resolucion_conflictos**: El jefe anterior sentaba a las partes; con el nuevo nadie se hace cargo y dos vendedores no se hablan desde hace un mes. → manejo_conflictos
  - **herramientas_y_reuniones**: La app del celular para visitas, pedidos y mapa, y la reunión del lunes más corta y con números en pantalla. → herramientas

