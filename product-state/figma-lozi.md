# Figma de lozi-love: flujo D.S. 49 v3 y pantallas del MVP

Parte de [`product-state.md`](../product-state.md). Transcribe el archivo [Proyecto Subsidio](https://www.figma.com/design/72h9M4fZorEGnm3oEnrorh/Proyecto-Subsidio?node-id=3-2) de lozi-love, leído el 2026-11-21 por kaina#62. Léelo cuando diseñes pantallas, escribas el pitch o uses una cifra o un plazo del Figma.

| Campo | Valor |
| --- | --- |
| Archivo | `72h9M4fZorEGnm3oEnrorh` (Proyecto Subsidio) |
| Páginas | `0:1` Flujo D.S. 49 v3 (9 frames) · `7:2` MVP · Pantallas para comprensión · `19:2` MVP v2 |
| Autora | lozi-love (msgs `1573765313189912756`, `1573766038552707163` en #deficit-habitacional) |
| Estado | Propuesta. Es material de lozi-love, no un acuerdo del equipo. Nada de este archivo cambia una `D-` o una `L-` sin confirmación humana. |
| Fecha del Figma | El frame 1 dice «v3 (auditado nov-2026)». Si el Figma cambia, este archivo queda atrás: compara antes de usarlo. |

## Cruces con el estado

Lo que el Figma confirma, contradice o deja abierto frente al resto de `product-state/`. Es la parte que hay que leer antes de construir.

| Tema | Qué dice el Figma | Cruce |
| --- | --- | --- |
| Alcance | El agente coordina «todo el proceso, de los papeles de la familia hasta la entrega», incluidas las gestiones entre actores después del subsidio. Sigue, pero no resuelve, terreno, permisos, obra y pagos (frame 1). | Ya no corta en la selección como decía P-12. Ahora cubre antes y después del subsidio. Después del subsidio calza con D-02 y con la propuesta de Edo. Antes del subsidio choca con D-02 («la postulación individual de documentos queda fuera»). Ver P-12. |
| MVP | Funciones 6 (estado para la familia), 4 (plazos y observaciones), 2 (semáforo del comité) y 1 (checklist de la familia) (frame 8). | Las funciones 1 y 2 se parecen a X-01 (semáforo de documentos y ahorro, descartado por D-02). La 4 y la 6 cubren también el tramo posterior al subsidio. Ver P-12. |
| Nombre | La solución se llama «Copiloto de Carpeta» (frame 7). | P-09 sigue abierta. |
| Principio | «No rediseñamos el sistema. Proponemos una herramienta que se adapta a él.» La EP sigue postulando e ingresando; el SERVIU recibe lo mismo (frame 1). | Calza con D-07, D-10 y X-05. |
| Reglas | Reglamento base como valor por defecto y la resolución del llamado como capa que lo reemplaza (frames 1, 3 y 7). | Calza con D-09. |
| Vistas | El comité ve si cada documento está listo, falta o vence, no su contenido. Cada familia lo autoriza (pantallas F0, C1). | Calza con D-13 y L-06. Agrega el consentimiento por familia y la Ley 21.719 (N- en `normativa.md`). |
| Vigencia del subsidio | 21 meses, +12 si la obra empezó (frame 3, art. 28, 41 y 64). | Coincide con `normativa.md`, que ya responde P-05. A-12 dice que no hay fuente para DS49: quedó atrás. |
| Revisión del SERVIU | Hasta 135 días hábiles (Déficit Cero 2024) (frame 3). | Misma cifra que A-12, que sigue «Por verificar». |
| Puntaje | Frame 5 y función 7 (puntaje del grupo). | Es de la postulación. La función 7 queda en segunda etapa en el mismo Figma. |
| Fechas de las pantallas | Vence el 05-02-2027, quedan 57 días hábiles y último reemplazo el 13-03-2027 (pantallas E1, E2, F3, C2). | No cuadran con un calendario: el 13-03-2027 es sábado y las pantallas mezclan dos «hoy». Ver «Hallazgos al armar el caso base» en [`pruebas-producto.md`](pruebas-producto.md). |

## Frame 1 · El problema (`3:2`)

Título: «Del subsidio a la llave: dónde se traba el D.S. 49 colectivo». Las familias más vulnerables postulan en grupo al Fondo Solidario de Elección de Vivienda (D.S. 49). Entre organizarse y recibir la llave pasan años, y buena parte de ese tiempo no lo mide nadie.

| Cifra | Qué mide | Fuente que cita |
| --- | --- | --- |
| 27,9 meses | Promedio desde el subsidio hasta la entrega en 2019 (24,2 en 2016–2019). Ese año solo el 20,3% se entregó dentro de los 21 meses de vigencia. | Dipres, evaluación EPG FSEV 2020, p. 33–34 |
| 38.923 | Viviendas D.S. 49 con subsidio asignado y sin inicio de obra, primer semestre 2026. | CChC citada por prensa (Poder y Liderazgo, 19-11-2026). El Figma la marca como fuente secundaria. |
| Sin medir | Espera antes de postular: el MINVU limitó la medición a la compra de vivienda usada; en la modalidad colectiva no se registra. | Dipres, seguimiento de compromisos al 30-06-2026 |

- **Principio del proyecto.** No rediseñamos el sistema; proponemos una herramienta que se adapta a él. Trabaja antes de los sistemas del MINVU (Umbral y Gestor Documental). La EP sigue postulando e ingresando la carpeta (arts. 7 y 13). El SERVIU recibe lo mismo de siempre, completo y a tiempo.
- **El agente coordina** todo el proceso, de los papeles de la familia hasta la entrega: la carpeta, las observaciones, la postulación y las gestiones entre actores después del subsidio (reemplazos, ahorro adicional, vigencia y avisos entre la EP, el comité y las familias).
- **El agente sigue, pero no resuelve** terreno, permisos, obra y pagos. Los gestionan sus responsables (EP, constructora, DOM, SERVIU). El agente muestra el avance y avisa a todos. En el flujo van en gris.
- **Reglamento base y resolución del llamado.** Desde 2021 la postulación colectiva se ha hecho sobre todo por llamados especiales (art. 21), cuya resolución puede cambiar requisitos, ahorro, plazos y forma de selección. La herramienta usa el reglamento por defecto y el llamado como capa que lo reemplaza.
- **Fuentes que cita.** D.S. 49 (texto refundido MINVU 23-07-2020, cotejado con BCN; única modificación posterior D.S. 06/2024, solo art. 27), Res. Ex. 1.875/2015 (últ. mod. Res. Ex. 488/2023), Protocolos RSH (Res. Ex. SSS 04/2026), Dipres EPG FSEV 2020 y seguimiento 2026, MINVU Cuadernillo N°6 (2026), Déficit Cero (2024).

## Frame 2 · Actores y la carpeta (`3:38`)

| Actor | Qué hace según el Figma |
| --- | --- |
| Familia | Junta sus papeles (RSH, cédula, declaraciones, ahorro). Responde por lo que declara (arts. 3 i y 61). No interactúa directo con el SERVIU. |
| Comité | Grupo con personalidad jurídica, de 10 a 160 familias. Sus representantes deben ser integrantes y postulantes (art. 7). |
| Entidad patrocinante (EP) | Organiza la demanda, arma el proyecto, postula e ingresa la carpeta (arts. 7 y 13). Usuaria del sistema MINVU; su responsabilidad se fija en el Convenio Marco (art. 52). |
| SERVIU | Evalúa, observa, califica y selecciona. Comunica observaciones y rechazo solo a la EP (art. 13 inc. 3). |

La carpeta cambia de forma: documentos de la familia → ficha de la familia → nómina y expediente del grupo → proyecto en preparación → postulación en el Banco → proyecto calificado → grupo en un llamado → grupo seleccionado → certificado de subsidio.

Dos reglas que condicionan el diseño:

- **Quién responde por qué.** La EP es la usuaria del sistema del MINVU y responde por la veracidad según el Convenio Marco con la SEREMI (art. 52). Cada familia responde por lo que declara (arts. 3 i y 61).
- **Quién se entera de las observaciones.** El SERVIU se las comunica solo a la EP (art. 13 inc. 3). La EP debe informar a las familias (arts. 51 y 53 a i), pero el reglamento no dice cómo ni cuándo.

## Frame 3 · Plazos de la ruta regular (`3:95`)

Reglamento base. En un llamado especial (art. 21) los plazos los fija su resolución (art. 20 inc. 3). El Figma destaca las filas en que, si el plazo se vence, el grupo o la familia pierde algo que no se recupera.

| Plazo | Duración | Si se vence | Fuente |
| --- | --- | --- | --- |
| Proyecto «en preparación» en el sistema | 180 días desde que entra la primera familia (no dice si hábiles o corridos) | Se borran los antecedentes | Art. 12 inc. 3 |
| Evaluación del SERVIU | 30 días hábiles | — | Art. 13 |
| Corrección de observaciones por la EP | Un solo acto, máximo 60 días hábiles | El SERVIU puede rechazar y devolver todo, avisando por escrito a la EP | Art. 13 inc. 3 |
| Reevaluación del SERVIU | 15 días hábiles | — | Art. 13 |
| Segunda ronda (optativa) | Solo si quedan observaciones de familias: 20 días hábiles la EP y 10 el SERVIU | Rechazo obligatorio | Art. 13 inc. 4 y 5 |
| Total máximo de revisión | Hasta 135 días hábiles | — | Déficit Cero 2024 |
| Calificación | Antes de la fecha máxima que fija el llamado | El grupo queda fuera de ese llamado (deducido) | Art. 20 inc. 4 |
| Publicación del llamado | Al menos 14 días corridos antes de la selección | — | Art. 20 |
| Reemplazo de familias | Hasta el día hábil anterior a la fecha máxima de calificación. El reemplazante acredita requisitos y ahorro al ingresar | No se puede reemplazar durante la selección | Arts. 14 inc. 3, 20 inc. 5 y 57 inc. 3 |
| Permanencia en el Banco | Hasta 3 procesos consecutivos, +2 si EP y grupo lo piden juntos y por escrito | Se devuelven los antecedentes y se elimina del Banco | Art. 14 |
| Reclamo por la nómina | 10 días corridos desde la publicación | Solo errores de hecho no imputables al postulante ni a la EP | Arts. 25 y 26 |
| Certificado de subsidio | 15 días hábiles desde la publicación | — | Art. 28 |
| Ahorro adicional | 150 días corridos desde la resolución: 15 UF (tramo 50–60%), 15 UF (60–80%), 30 UF (80–90%) | — | Art. 37 |
| Inicio de obras | 90 días corridos desde la publicación; prorrogable por el Director del SERVIU | — | Arts. 32 y 64 d |
| Vigencia del subsidio | 21 meses; +12 automáticos si la obra empezó; +12 si el proyecto fue eliminado y quedan menos de 12; prórroga del Director | Se pierde | Arts. 28, 41 y 64 |
| Certificado de derechos en comunidad | Emitido como máximo 90 días corridos antes de postular | No se puede postular con él vencido | Art. 3 f |

## Frame 4 · Flujo actual en carriles (`4:2`)

Seis etapas: 0 antes de la EP, 1 organización de la demanda, 2 proyecto y terreno (el agente sigue, no resuelve), 3 Banco y evaluación, 4 llamado y selección, 5 después del subsidio (el agente coordina y sigue). Las insignias R1 a R8 marcan dónde falla el flujo (frame 6).

| Carril | Pasos y fallas |
| --- | --- |
| Familia | RSH al día, firman todos los adultos o validan con ClaveÚnica; 5 días hábiles, 20 con visita; se desiste a los 20+10 días si faltan papeles (R2). Cuenta de ahorro: 1 punto por mes, máximo 40 (R8). Cédula, DJ49-1 (núcleo y no propiedad), DJ49-2 (postulación) y DJ49-3 (mandato de ahorro), arts. 3 y 39 a (R2). Ahorro certificado al último día hábil del mes anterior; la cuenta no se puede girar desde el ingreso, arts. 39–41 (R2). |
| Familia (sigue) | Reuniones con 70% de asistencia y acta con cédula y firma (R4). Aprueba el proyecto y el plan social en asamblea; firman todas. No recibe las observaciones del SERVIU (R1). Su puntaje entra al promedio del grupo (R8). Reclamo en 10 días corridos (R8). Certificado de 21 meses. Ahorro adicional en 150 días: el agente le recuerda. Obra, recepción, escritura y entrega: el agente avisa, no gestiona. |
| Comité | Personalidad jurídica (art. 7). Composición: máximo 30% entre el 40% y el 90% del RSH; 10 a 160 familias (arts. 1 y 7). Renuncias y reemplazos con el reemplazante cumpliendo todo (R5). Representantes firman el contrato de construcción (art. 10). Puede cambiar familias durante la corrección si el proyecto sigue consistente (art. 13 inc. 6, R5). Sin reemplazos en la selección (arts. 14 y 20, R5). Hasta 3 procesos (+2). Reemplazos hasta 20% después (art. 57). Coordina reemplazos, asambleas de obra y asignación de viviendas. |
| Entidad patrocinante | Aún no aparece en la etapa 0 y ese tiempo no se registra (R6). Al menos 2 reuniones; verifica requisitos y sube documentos (Res. 1.875, cuadro 2.5). Diagnóstico participativo y acta, art. 50 (R4). Reloj de 180 días (art. 12). Terreno, factibilidades, anteproyecto o permiso (arts. 10 y 19). Ingresa al Banco (Umbral + Gestor Documental). Corrige todo en un acto, máximo 60 días hábiles (R3). Postula al llamado. Cobra 50% del plan social y 50% de gestión técnica y social al seleccionarse (Res. 1.875, 5.2.1 y 5.2.4). Después: inicio de obras, permisos, recepción, escritura y pagos, que el agente sigue y avisa. |
| SERVIU | Tasa el terreno: si el precio supera la tasación en más de 10%, no evalúa (art. 19). Evalúa en 30 días hábiles, observa en un acto, reevalúa en 15, segunda ronda optativa (R3). Califica definitiva o condicional (art. 15). Seis sistemas y planillas (R7, fuera de alcance). Ordena por puntaje promedio; si la plata no alcanza, queda fuera el grupo completo (arts. 22–23, R8). Empate: núcleo, vulnerabilidad, antigüedad, ahorro, sorteo. Publica la nómina; certificado en 15 días hábiles (arts. 25–28). Vigencia 21 meses (+12): el agente avisa antes; las prórrogas las pide la EP. |

## Frame 5 · Cómo se arma el puntaje (`5:2`)

El puntaje del grupo es el promedio de sus familias. Si la plata del llamado no alcanza para el grupo completo que queda en el corte, queda fuera el grupo entero (art. 23).

| Factor | Puntos | Dato |
| --- | --- | --- |
| a) Núcleo familiar | 50 por integrante de la declaración de núcleo (sin el postulante). +40 por menor de 6 a 18 años; +50 por menor de hasta 5 (edad al 31-12 del año del llamado); +100 por integrante de 60 o más; +40 bombero voluntario; +20 servicio militar; +40 Gendarmería (no se suma con servicio militar). Máximo 600. | DJ49-1 y certificados |
| b) Vulnerabilidad habitacional | Hacinamiento: menos de 2,5 por dormitorio = 0; 2,5 a menos de 5 = 140; 5 o más = 280. Tipo de vivienda 140, agua 30, baño 30. | RSH |
| c) Antigüedad | 80 por postulación sin éxito de cada integrante, máximo 160 por postulante. | Historial MINVU |
| d) Ahorro | 1 por mes de antigüedad de la cuenta (máximo 40). +10 si el saldo medio del semestre previo es al menos 12,5% del saldo acreditado. | Banco |
| e) Condiciones especiales | Discapacidad: 300 por integrante inscrito en el Registro Nacional de la Discapacidad + 50% de a+b+c+d. Prisión política: 600 + 50% de a+b+c+d. Madre o padre solo con hijos de hasta 24 años: 150 (no si el RSH muestra pareja). | Registros, declaraciones y RSH |

- **Ejemplo ilustrativo.** Grupo de 40 familias. Una familia con 400 puntos en a+b+c+d tiene un integrante con discapacidad no inscrito. Deja de sumar 300 + 200 = 500 y el promedio del grupo baja 12,5 puntos.
- **Lo que no se acredita no se recupera.** Los reclamos solo proceden por errores de hecho no imputables a la familia ni a la EP (art. 26). Un RSH desactualizado también resta.
- En llamados especiales que seleccionan por fecha de calificación (art. 21), el promedio deja de decidir la selección.

## Frame 6 · Flechas rojas (`5:60`)

Fuerza según el Figma: ●●● cifras o norma explícita, ●● documento oficial cualitativo o norma genérica, ● hipótesis por validar.

| # | Flecha | Qué falla | Evidencia que cita | Fuerza |
| --- | --- | --- | --- | --- |
| R1 | SERVIU → EP → familia | Las familias no se enteran de observaciones, estado ni plazos. | Art. 13 (solo a la EP); deber general de informar sin forma ni plazo (arts. 51 y 53); «uno de los principales obstáculos» (Cuadernillo N°6, p. 12); sin instancia para controlar a la EP y «asesores» que cobran (Dipres p. 63 y 117); no se mide calidad desde los beneficiarios (Dipres p. 32 y 63). | ●● |
| R2 | Familia → EP | Papeles incompletos, vencidos o sin firmas. | Firmas de todos los adultos; corte del ahorro (art. 39); certificado de 90 días (art. 3 f); RSH se desiste a los 30 días; barreras de horario, monoparentalidad o discapacidad (Dipres p. 17, 20–21); ClaveÚnica desde 2026 (Protocolos 2026, §V). | ●● |
| R3 | EP → SERVIU | Una sola corrección; el rechazo devuelve todo. | Rechazo facultativo tras la primera ronda y obligatorio tras la segunda (art. 13); hasta 4 evaluaciones (Dipres p. 134); hasta 135 días hábiles (Déficit Cero); sin datos públicos de observados o rechazados. | ●●● norma / ● frecuencia |
| R4 | Comité ↔ EP | Actas, asistencia y firmas de todos. | 70% de asistencia y acta con nombre, cédula y firma (Res. 1.875, Art. 2° n°10); si falta una actividad, ese servicio no se paga (Art. 2° n°6); control «se agota en… listas de chequeo» (Dipres p. 62). | ●●● |
| R5 | Familia ↔ comité | Renuncias y reemplazos. | Reemplazante cumple todo; plazo hasta el día hábil anterior a la calificación; sin reemplazos en la selección; máximo 20% después (arts. 14, 20 y 57). | ●● |
| R6 | Todo el proceso | El tiempo antes de postular no se registra. | Dipres no pudo estimarlo (p. 107–108); el sistema registra desde la creación del proyecto (p. 63); sin medir al 30-06-2026. Déficit Cero: ~11 años, 64% en organización, suelo y proyecto, 73% antes de la obra (rango 8,5–14). | ●●● |
| R7 | Dentro del SERVIU | Seis sistemas y planillas auxiliares. | Información organizada en torno al pago y no a la familia (Dipres p. 63, 64 y 72). Fuera de alcance. | ●●● (fuera de alcance) |
| R8 | Familia → puntaje del grupo | Puntos no acreditados bajan el promedio de todos. | Arts. 22, 23, 24 y 26. Sin datos de magnitud. | ●●● norma / ● magnitud |

## Frame 7 · La solución (`5:165`)

«Copiloto de Carpeta: una capa multiplayer sobre el sistema actual.» Tres agentes (familia, comité y EP) trabajan sobre la misma carpeta. El SERVIU no cambia nada. El reglamento base es el valor por defecto y la resolución del llamado lo reemplaza donde corresponda; pesa sobre todo en las funciones 4 y 7.

| Función | Ataca | Qué hace | Regla que respeta |
| --- | --- | --- | --- |
| 1. Checklist de la familia por WhatsApp | R2 | Pide los documentos uno a uno, revisa las firmas de todos los adultos y avisa antes de cada vencimiento y del corte del ahorro. Ofrece a los otros adultos validar con ClaveÚnica. | Art. 3 (incl. letra f) y art. 39 a. Protocolos RSH 2026: la familia descarga su Cartola Hogar; un tercero solo con poder notarial de máximo 6 meses. |
| 2. Semáforo del comité | R2, R5 | «Familia 7: falta DJ49-1 firmada por 2 adultos», sin mostrar contenido. Composición 70/30. Si alguien renuncia: qué debe cumplir el reemplazante y hasta cuándo. | Arts. 1, 14, 20 y 57. Consentimiento por familia. |
| 3. Revisión previa de la carpeta | R3 | Revisa la carpeta contra la lista oficial de verificación antes de que la EP la ingrese. | La EP sigue postulando e ingresando (arts. 7 y 13). |
| 4. Plazos y observaciones | R3 | Asigna cada observación a quien corresponde y arma la respuesta única. Cuenta regresiva en tres escenarios (60 días hábiles con rechazo facultativo; segunda ronda 20+10; rechazo obligatorio). Después del subsidio sigue ahorro adicional, inicio de obras y vigencia. En llamados especiales usa los plazos de su resolución. | Responder en un solo acto (art. 13). |
| 5. Actas y asistencia | R4 | Genera actas con los campos obligatorios, lleva la cuenta del 70% y guarda la prueba de convocatoria. | Res. 1.875, Art. 2° n°10. |
| 6. Estado para la familia | R1, R6 | Traduce en qué etapa está el grupo y cuánto falta, también después del subsidio (obra, recepción, entrega). Registra el tiempo desde que existe el comité. | Ayuda a la EP a cumplir su deber de informar (arts. 51 y 53 a i). |
| 7. Puntaje del grupo | R8 | A cada familia: qué factores puede acreditar con documentos reales. Al comité y la EP: el promedio del grupo y cuánto podría subir, sin decir a qué familia corresponde. Se apaga si el llamado selecciona por fecha de calificación. | Arts. 22–24. Solo situaciones reales: una declaración falsa permite excluir a quien la hizo o exigir restitución (art. 61). |

- **Por qué es multiplayer.** La carpeta del grupo se completa cuando todas las familias completan la suya, y el puntaje es el promedio de todas. Con una sola familia la herramienta no sirve.
- **Quién paga: la EP.** Le ayuda a cumplir deberes que ya tiene (informar, arts. 51 y 53; actas válidas, Res. 1.875). Una carpeta sin observaciones acelera la calificación y su primer pago grande depende de la selección (Res. 1.875, Art. 3° n° 5.2.1 y 5.2.4).

## Frame 8 · Evaluación y MVP (`5:258`)

Escala de 1 a 3 (3 es lo mejor; en riesgo de datos, 3 es riesgo bajo).

| Función | Impacto | Factibilidad | Encaje con la norma | Riesgo de datos | Multiplayer | Total |
| --- | --- | --- | --- | --- | --- | --- |
| 6. Estado para la familia | 3 | 3 | 3 | 3 | 2 | 14 · MVP |
| 4. Plazos y observaciones | 3 | 2 | 3 | 3 | 2 | 13 · MVP |
| 2. Semáforo del comité | 2 | 3 | 3 | 2 | 3 | 13 · MVP |
| 5. Actas y asistencia | 2 | 3 | 3 | 2 | 3 | 13 |
| 1. Checklist de la familia | 2 | 3 | 3 | 2 | 2 | 12 · MVP |
| 3. Revisión previa | 3 | 2 | 3 | 3 | 1 | 12 |
| 7. Puntaje del grupo | 2 | 2 | 3 | 1 | 3 | 11 |

- **MVP: funciones 6, 4, 2 y 1.** La 6 va primero porque es la única fuente del tiempo de espera colectivo y ayuda a la EP con un deber que ya tiene. La 4 ataca la corrección en un solo acto; la 2 y la 1 construyen la carpeta compartida.
- **Segunda etapa: funciones 5, 3 y 7.** La 7 es la más multiplayer, pero depende del tipo de llamado y maneja datos sensibles (discapacidad, prisión política) que exigen consentimiento por familia.
- Notas del Figma: la factibilidad de la 4 depende de leer la resolución de cada llamado; el impacto de la 7 vale solo en llamados que seleccionan por puntaje.

## Frame 9 · Vacíos y próximos pasos (`5:394`)

| # | Tema | Qué falta |
| --- | --- | --- |
| 01 | Cifras públicas | No hay datos de proyectos observados, reingresados o rechazados, ni de subsidios caducados. Pedir por Ley de Transparencia el informe semestral regional de tiempos de evaluación (compromiso Dipres N°10). |
| 02 | Documentos faltantes | La lista oficial de verificación (Circular DPH FSEV 35-2018) y su vigencia; el Convenio Marco tipo EP–SEREMI (art. 52). |
| 03 | Puntos perdidos | Cuántos puntos pierden hoy los grupos por factores no acreditados. Validar con una EP. |
| 04 | Validar con personas | Con una EP: cuánto tiempo pierde y qué observaciones se repiten. Con un dirigente: cómo se entera hoy de lo que pasa. Coincide con P-06, P-07 y P-10. |
| 05 | Datos personales | Ley 21.719: vigencia 1-12-2026; postergación al 15-10-2027 despachada el 17-11-2026 (Boletín 18.623-07), pendiente de promulgación. Discapacidad y prisión política son datos sensibles. |
| 06 | Norma vigente | Confirmar en BCN que no hay modificaciones 2025–2026 al D.S. 49 ni a la Res. 1.875 después de marzo de 2026. |
| 07 | Llamado concreto | Leer la resolución del llamado al que postulará el grupo (art. 21). |
| 08 | Ambigüedades | Si el 70% de asistencia se cuenta por persona o por familia; si los 180 días del art. 12 son hábiles o corridos. |

## Pantallas del MVP (páginas `7:2` y `19:2`)

Dos versiones de las mismas pantallas, con datos ficticios: Comité Los Aromos (40 familias), familia Rojas (Marta, su hijo Pedro de 19 años, Sofía y Tomás) y Entidad Patrocinante Sur con 4 comités y 148 familias. La v2 es la más nueva; abajo se describe la v2 y se anota lo que la v1 tiene distinto.

| Pantalla | Nodo v2 (v1) | Qué muestra |
| --- | --- | --- |
| F0 · Familia · Quién ve tu carpeta | `20:157` (`7:20`) | El comité ve si cada documento está listo, falta o vence, no el contenido. La EP ve los documentos porque los presenta al SERVIU. Datos sensibles (discapacidad y otros) solo si la familia los activa, porque suman puntaje. Ley 21.719; se puede cambiar cuando quiera. La v1 lo plantea como consentimiento inicial y lista lo que el comité no ve (ingresos, tramo RSH, cartola). |
| F1 · Familia · Copiloto por chat | `21:59` (`7:48`) | Chat del copiloto con Marta: le faltan 2 cosas. La firma de Pedro en la DJ49-1 («Mándaselo, porfa» → el copiloto le envía el enlace para firmar con ClaveÚnica) y el ahorro (9,5 de 10 UF, corte 31-12). Botones «¿Cómo deposito?», «¿Qué es DJ49-1?», «Ver mi carpeta». «34 de 40 familias ya completaron su carpeta.» Acepta foto del documento. |
| F2 · Familia · Mi carpeta | `20:2` (`7:80`) | Acción pendiente: falta la firma de Pedro. Siete documentos con estado: RSH vigente, cédula (vence 03-02-2027), DJ49-1 firmada por 2 de 3 adultos, DJ49-2 firmada, DJ49-3 con banco en convenio, ahorro 9,5 de 10 UF; la v1 suma el certificado de derechos en comunidad. Avance del comité: 34 de 40. |
| F3 · Familia · Cómo va tu grupo | `21:123` (`7:142`) | Etapa 3 de 6, revisión del SERVIU: 3 observaciones, la EP responde todo junto, 57 días hábiles, 1 observación es de su familia. Camino: organización y carpetas, proyecto y terreno, revisión del SERVIU, llamado y selección, obra y recepción, escritura y entrega (las dos últimas las gestionan otros; aquí se ve su avance). Tiempo de espera del grupo: 3 años y 4 meses, que ningún sistema registra. Actividad del grupo, incluida «Valentina se ofreció a acompañar a la familia Pérez». |
| F4 · Pedro · Firma con ClaveÚnica | `20:114` (solo v2) | Qué va a firmar (DJ49-1) y para qué, explicado en simple. Firma con ClaveÚnica sin imprimir ni ir a una oficina; «nunca vemos ni guardamos tu clave». «Tu firma destraba al grupo»: es lo último que falta para responder la observación 3 del SERVIU. |
| C1 · Comité · Carpetas del grupo | `22:87` (`8:17`) | 34 listas, 4 con faltantes, 2 por vencer. El copiloto revisó las 40 carpetas y ya avisó a 6 familias. Corte del ahorro en 40 días; 2 familias bajo 10 UF. Familia Pérez sin acompañante y sin mandato de ahorro. «Ves el estado de cada carpeta, no su contenido. Cada familia lo autorizó.» La v1 muestra la composición 70/30 y la lista de familias con su faltante. |
| C2 · Comité · Renuncia y reemplazo | `22:193` (`8:90`) | Familia Vera renunció. Último día para reemplazar: 13-03-2027 (arts. 14 y 20). Requisitos del reemplazante al ingresar: RSH vigente, 10 UF depositadas, declaraciones firmadas, sin vivienda ni subsidio previo. Efecto en la composición: queda justo en el 30%. Lista de espera. El reemplazo se aprueba en asamblea y la EP lo ingresa. |
| E1 · EP · Panel de grupos | `23:2` (`9:32`) | 128 de 148 familias con carpeta completa, 1 plazo crítico esta semana, 3 de 4 observaciones resueltas, espera promedio 3 años y 4 meses. Tabla por comité: Los Aromos (responder observaciones, vence 05-02-2027), Villa Nueva (proyecto en preparación, art. 12), Las Palmas (calificación antes del 14-03-2027), Los Robles (inicio de obras, quedan 31 de 90 días; permiso DOM que el agente sigue y no resuelve). |
| E2 · EP · Observaciones | `23:143` (`9:138`) | Observaciones del SERVIU de Los Aromos, primera ronda. Responder en un solo acto: 57 días hábiles, vence 05-02-2027, con los tres escenarios (art. 13). Cada observación asignada: técnica a la arquitecta, presupuesto al equipo EP, familias a Marta Rojas, con recordatorio por chat y Valentina como acompañante. Respuesta única 2 de 3 lista; «tu equipo lo ingresa en el sistema del MINVU: no enviamos nada al SERVIU». Muestra lo que ven las familias. La v2 agrega «Borrador del Copiloto aceptado por…» en cada observación. |
| E3 · EP · Carpeta del grupo | `23:239` (`9:227`) | Villa Nueva, proyecto en preparación: quedan 37 de 180 días; si no se ingresa antes del 28-12-2026 se borran los antecedentes (art. 12); faltan 14 carpetas. Matriz familia × documento (RSH, cédula, DJ49-1, DJ49-2, DJ49-3, ahorro, comunidad). Composición 72% en el 40% del RSH. Próxima asamblea con 70% de asistencia y acta (Res. 1.875). |
