# Plantillas del redactor (propuesta E-11)

Parte de [`engineering-state.md`](../engineering-state.md). Léelo si vas a escribir el redactor, los avisos por WhatsApp o los textos de la vista de familias.

| Campo | Valor |
| --- | --- |
| Estado | **Propuesta**. No depende del stack. |
| Autor | golazo#44 (agente de Golazo) |
| Hilo | [Plantillas del redactor (técnica y simple) · golazo#44](https://discord.com/channels/1573512846258741318/1573775652870422680) |
| Se apoya en | D-07, D-13, D-16, D-19, L-06, L-12, L-13, L-14 (Propuesta), E-03, R-08 y el redactor de [`arquitectura.md`](arquitectura.md) |
| Ajuste por D-19 | kaina#62-3 (2026-11-21) agregó T-07 a T-13 para los eventos del MVP del Figma, pasó las variantes simples a «tú» como en las pantallas y ajustó el glosario a los textos del Figma. |

## Cómo se usan

- Cada evento tiene dos plantillas: la **técnica** para la EP, la arquitecta, la constructora y la dirigencia, y la **simple** para las familias (D-16). Las dos se llenan con los mismos datos del evento.
- Los campos entre llaves (`{documento}`) salen del evento. El texto fijo no se reformula. Si un campo falta, el mensaje no se envía y el evento queda en el registro como error; nunca se rellena con un valor inventado (L-13).
- Quién tomó el paso sale solo de `aceptada_por`. Si está vacío, se usa la variante «sin aceptar», aunque `corresponde_a` tenga valor (L-13, L-14).
- Los mensajes simples no llevan contenido de documentos ni datos de otras familias, solo estados (L-06, R-10).
- Los botones son los únicos que generan acciones. Un texto libre de la familia, como «ok» o «ya entendí», nunca cuenta como aprobación (L-12).
- Alineado con D-19 (pantallas F0 a F4): las variantes simples tutean («tu familia», «tu firma»), como el Figma. Las fechas van como en las pantallas: 05-02-2027.

## Plantillas de la demo

Los ejemplos usan el proyecto ficticio Los Quillayes de [`demo-proposal.md`](../demo-proposal.md). Con D-19 estas plantillas cubren el tramo de proyecto y obra, que el agente sigue y avisa pero no resuelve (Figma, frame 1). Las del MVP del Figma están más abajo, desde T-07.

### T-01. Entra una observación a un documento

Evento: `observacion_registrada`. Campos: `{organismo}`, `{documento}`, `{version}`, `{resumen_observacion}`, `{aprobaciones_por_revalidar}`, `{aprobaciones_vigentes}`.

| Variante | Plantilla |
| --- | --- |
| Técnica | La {organismo} observó {documento} {version}: {resumen_observacion}. Quedan por revalidar: {aprobaciones_por_revalidar}. Siguen vigentes: {aprobaciones_vigentes}. |
| Simple | La {organismo_simple} pidió corregir un plano del proyecto. No tienen que hacer nada por ahora. Les avisamos cuando haya novedades. |

Ejemplo técnico: «La DOM de Valle Alto observó Plano sanitario v2: falta cota de la cámara de inspección en lámina S-02. Quedan por revalidar: calificación SERVIU. Siguen vigentes: revisión estructural.»

La variante simple no nombra la calificación SERVIU ni dice «por revalidar». Para la familia el hecho es que hay que corregir un plano y que no le toca hacer nada.

### T-02. Se propone una gestión y nadie la acepta todavía

Evento: `gestion_propuesta`. Campos: `{gestion}`, `{corresponde_a}`, `{plazo_aceptacion}`.

| Variante | Plantilla |
| --- | --- |
| Técnica | Nueva gestión: {gestion}. Corresponde a: {corresponde_a}. Pendiente de aceptación hasta el {plazo_aceptacion}. |
| Simple | Hay que corregir el plano. Todavía no tenemos confirmación de quién tomará esta gestión. Les avisamos cuando alguien la tome. |

La variante simple no nombra a `{corresponde_a}`. Decir «la EP lo está viendo» sería inventar un responsable (L-13, L-14).

### T-03. Alguien acepta la gestión

Evento: `gestion_aceptada`. Campos: `{gestion}`, `{aceptada_por}`, `{rol_aceptada_por}`, `{fecha_compromiso}`.

| Variante | Plantilla |
| --- | --- |
| Técnica | {aceptada_por} ({rol_aceptada_por}) aceptó: {gestion}. Compromete entrega para el {fecha_compromiso}. |
| Simple | {rol_simple} ya está corrigiendo el plano. Dijo que lo tendrá listo el {fecha_compromiso_simple}. Ustedes no tienen que hacer nada. |

Ejemplo simple: «La arquitecta de la entidad ya está corrigiendo el plano. Dijo que lo tendrá listo el jueves 26 de noviembre. Ustedes no tienen que hacer nada.»

### T-04. Se reingresa un documento corregido

Evento: `version_subida` con reingreso. Campos: `{documento}`, `{version}`, `{organismo}`.

| Variante | Plantilla |
| --- | --- |
| Técnica | Se subió {documento} {version} y se reingresó a la {organismo}. Sin respuesta todavía. Las aprobaciones por revalidar siguen igual. |
| Simple | El plano corregido ya se entregó a la {organismo_simple}. Todavía no responden. Les avisamos cuando respondan. |

Enviar no es aprobar (D-07, R-08). Ninguna variante usa «aprobado», «listo» ni «resuelto» en este evento.

### T-05. Vence el plazo y nadie aceptó

Evento: `gestion_sin_cobertura`. Campos: `{gestion}`, `{corresponde_a}`, `{dias_sin_aceptar}`.

| Variante | Plantilla |
| --- | --- |
| Técnica | Sin cobertura: {gestion}. Corresponde a {corresponde_a} y nadie la aceptó en {dias_sin_aceptar} días. Aceptar o no en Comité no cambia las obligaciones de la EP. |
| Simple | Nadie ha tomado todavía la corrección del plano. Le avisamos a la dirigencia para que lo pregunte. |

La técnica no dice que alguien incumplió: los días transcurridos no prueban culpa (D-12).

### T-06. La familia pregunta «¿en qué va mi proyecto?»

Consulta, no evento. Se arma con la vista de la familia (D-13): una línea por hito y una por gestión abierta que la afecte.

| Caso | Línea |
| --- | --- |
| Hito cumplido | ✅ {hito_simple}: listo. |
| Hito en curso | ⏳ {hito_simple}: en revisión. |
| Gestión aceptada | 🔧 {gestion_simple}: la está haciendo {rol_simple}. |
| Gestión sin aceptar | ⚠️ {gestion_simple}: todavía nadie la ha tomado. |
| Antecedente propio | ✅ Tus papeles: al día. / ⚠️ Tus papeles: falta {antecedente_simple}. |

Cierra siempre con: «Si quieres más detalle, responde DETALLE.» El detalle solo muestra lo que su vista permite (D-16, L-06).

Alineado con D-19 (pantalla F3), la respuesta parte con la etapa del grupo y el tiempo de espera, y después vienen las líneas de arriba:

| Caso | Línea |
| --- | --- |
| Etapa | Tu grupo está en la etapa {n_etapa} de 6: {etapa_simple}. |
| Observaciones abiertas | El SERVIU envió {n_observaciones} observaciones. {n_de_tu_familia} es de tu familia. |
| Tiempo de espera | Tu grupo lleva {tiempo_espera} desde que se organizó. |
| Etapa que gestionan otros | {etapa_simple}: la gestionan {responsables_simple}. Aquí ves cómo avanza. |

## Plantillas del MVP del Figma

Alineadas con D-19 (Figma, funciones 1, 2, 4 y 6). Los ejemplos usan los datos ficticios de las pantallas: Comité Los Aromos, familia Rojas y Entidad Patrocinante Sur. Donde el Figma tiene un texto, la plantilla lo copia.

### T-07. El SERVIU comunica observaciones (función 4, pantallas E2 y F3)

Evento: `observaciones_registradas`, que crea la EP con lo que el SERVIU le comunicó. Campos: `{comite}`, `{ronda}`, `{n_observaciones}`, `{vence}`, `{dias_habiles}`, `{n_de_tu_familia}`, `{fuente_plazo}`.

| Variante | Plantilla |
| --- | --- |
| Técnica | {comite}: el SERVIU comunicó {n_observaciones} observaciones, ronda {ronda}. Responder en un solo acto hasta el {vence} ({dias_habiles} días hábiles, {fuente_plazo}). Si no se responde, el SERVIU puede rechazar y devolver todo. |
| Simple | El SERVIU envió {n_observaciones} observaciones. La entidad tiene hasta el {vence}. {n_de_tu_familia} es de tu familia. |
| Simple, ninguna es de la familia | El SERVIU envió {n_observaciones} observaciones. La entidad tiene hasta el {vence}. Ninguna es de tu familia: no tienes que hacer nada. |

Ejemplo simple: «El SERVIU envió 3 observaciones. La entidad tiene hasta el 05-02-2027. 1 es de tu familia.» Con 2 o más se usa «son de tu familia».

### T-08. Se asigna una observación (función 4, pantalla E2)

Evento: `observacion_asignada`. Es una gestión `propuesta`: la persona todavía no la acepta (L-14). Campos: `{numero}`, `{tipo}`, `{corresponde_a}`, `{pedido_simple}`, `{vence}`.

| Variante | Plantilla |
| --- | --- |
| Técnica | Observación {numero} ({tipo}) asignada a {corresponde_a}. Pendiente de aceptación. Respuesta única hasta el {vence}. |
| Simple, a la familia asignada | La observación {numero} del SERVIU es de tu familia: {pedido_simple}. La entidad necesita tenerlo antes del {vence}. ¿Te encargas tú? [Me encargo] [No puedo] |
| Simple, al resto de las familias | (no se envía; la línea de T-07 ya dice cuántas son de cada familia) |

Ejemplo simple a Marta: «La observación 3 del SERVIU es de tu familia: falta la firma de Pedro en la DJ49-1. La entidad necesita tenerlo antes del 05-02-2027. ¿Te encargas tú?»

### T-09. Falta la firma de un adulto (función 1, pantallas F1, F4 y C1)

Evento: `firma_pedida`. Campos: `{adulto}`, `{documento}`, `{documento_simple}`, `{familia}`, `{n_firmas}`, `{n_adultos}`, `{n_adultos_faltantes}`, `{enlace}`, `{motivo_simple}`.

| Variante | Plantilla |
| --- | --- |
| Técnica, al comité | {familia}: falta {documento} firmada por {n_adultos_faltantes} adultos. |
| Simple, a la familia | Te faltan firmas en la {documento}: van {n_firmas} de {n_adultos} adultos. Falta la de {adulto}. [Mándaselo] |
| Simple, al adulto | Hola {adulto}. Falta tu firma en la {documento}: {documento_simple}. Puedes firmar con tu ClaveÚnica desde el teléfono, sin imprimir ni ir a una oficina: {enlace}. Nunca vemos ni guardamos tu clave. {motivo_simple} |

Ejemplo técnico (C1): «Familia 7: falta DJ49-1 firmada por 2 adultos.» Ejemplo de `{motivo_simple}` (F4): «Tu firma destraba al grupo: es lo último que falta para responder la observación 3 del SERVIU.» La línea al comité no nombra a los adultos (L-06).

### T-10. Se acerca el corte del ahorro (función 1, pantallas F1 y C1)

Evento: `corte_ahorro_por_vencer`. Campos: `{saldo_uf}`, `{meta_uf}`, `{fecha_corte}`, `{dias}`, `{n_bajo_meta}`.

| Variante | Plantilla |
| --- | --- |
| Técnica, al comité | Corte del ahorro en {dias} días ({fecha_corte}). {n_bajo_meta} familias bajo {meta_uf} UF. |
| Simple, a la familia | Tu ahorro va en {saldo_uf} de {meta_uf} UF. El corte es el {fecha_corte}. [¿Cómo deposito?] |

Ejemplo simple (F1): «Tu ahorro va en 9,5 de 10 UF. El corte es el 31-12.» El saldo solo va en el chat de la propia familia; al comité le llega cuántas familias están bajo la meta, sin montos (L-06).

### T-11. Corre o vence un plazo (función 4, pantallas E1, E2 y E3)

Eventos: `plazo_por_vencer` y `plazo_vencido`. Campos: `{comite}`, `{plazo}`, `{plazo_simple}`, `{vence}`, `{quedan}`, `{consecuencia}`, `{fuente}`, `{capa}`.

| Variante | Plantilla |
| --- | --- |
| Técnica | {comite}: {plazo} vence el {vence} (quedan {quedan}). Si vence: {consecuencia}. Fuente: {fuente}, {capa}. |
| Técnica, regla sin validar | {comite}: {plazo}, plazo por verificar. Fuente: {fuente}. (L-08: no genera alerta) |
| Simple | La entidad tiene hasta el {vence} para {plazo_simple}. Te avisamos si hay algo que hacer. |

Ejemplo técnico (E3): «Villa Nueva: ingresar el proyecto al sistema vence el 28-12-2026 (quedan 37 de 180 días). Si vence: se borran los antecedentes. Fuente: art. 12, reglamento base.» Mientras A-23 no aclare si son días hábiles o corridos, este plazo sale con la variante «por verificar». `{capa}` dice si el plazo viene del reglamento base o de la resolución del llamado (D-09).

### T-12. Una familia renuncia y se abre el reemplazo (función 2, pantalla C2)

Evento: `renuncia_registrada`, que solo pide la propia familia (C-26). Campos: `{familia}`, `{ultimo_dia}`, `{requisitos}`, `{composicion}`.

| Variante | Plantilla |
| --- | --- |
| Técnica, al comité y la EP | {familia} renunció. Último día para reemplazar: {ultimo_dia} (arts. 14 y 20). El reemplazante debe acreditar al ingresar: {requisitos}. Composición: {composicion}. El reemplazo se aprueba en asamblea y la EP lo ingresa. |
| Simple, al resto de las familias | Una familia dejó el comité. El comité puede sumar a otra familia hasta el {ultimo_dia}. Se decide en asamblea. |

Ejemplo técnico (C2): «Familia Vera renunció. Último día para reemplazar: 13-03-2027 (arts. 14 y 20). El reemplazante debe acreditar al ingresar: RSH vigente, 10 UF depositadas, declaraciones firmadas, sin vivienda ni subsidio previo.» La variante simple no nombra a la familia ni dice por qué se fue.

### T-13. El grupo cambia de etapa (función 6, pantallas F3 y E1)

Evento: `etapa_registrada`. Campos: `{comite}`, `{n_etapa}`, `{etapa}`, `{etapa_simple}`, `{registrado_por}`, `{evidencia}`, `{tiempo_espera}`.

| Variante | Plantilla |
| --- | --- |
| Técnica | {comite} pasó a la etapa {n_etapa} de 6: {etapa}. Registró {registrado_por} con {evidencia}. Tiempo desde la organización: {tiempo_espera}. |
| Simple | Tu grupo pasó a la etapa {n_etapa} de 6: {etapa_simple}. Llevan {tiempo_espera} desde que se organizaron. |

Ejemplo simple (F3): «Tu grupo pasó a la etapa 3 de 6: revisión del SERVIU. Llevan 3 años y 4 meses desde que se organizaron.» En las etapas 5 y 6 (obra, escritura y entrega) se agrega: «Las gestionan otros; aquí ves cómo avanzan.»

### Eventos que no avisan a las familias

`accion_bloqueada` (por ejemplo, el pedido de excluir a una familia, L-02) solo aparece en el registro del ejecutor y en la vista de la dirigencia y la EP. Avisarle a la familia afectada la expondría sin necesidad.

## Glosario simple

Las variantes simples reemplazan estos términos. E-03 rechaza un texto simple que use los de la izquierda.

| Término técnico | En la variante simple |
| --- | --- |
| EP, entidad patrocinante | la entidad (alineado con D-19: así lo dicen las pantallas) |
| DOM | la municipalidad |
| SERVIU | se puede usar: las pantallas F3 y F4 lo nombran (D-19) |
| observación | se puede usar con la familia que tiene una (T-07, T-08, D-19); en otros avisos, «pidió corregir» |
| revalidar, por revalidar | (no se menciona a la familia) |
| calificación | (no se menciona a la familia) |
| reingreso | se entregó de nuevo |
| gestión | la tarea, o el nombre concreto («corregir el plano») |
| lámina, cota | el plano |
| DJ49-1, DJ49-2, DJ49-3 | se puede usar si va con su explicación o el botón «¿Qué es DJ49-1?» (F1, D-19) |
| calificación, Banco, art. | (no se menciona a la familia) |

`{organismo_simple}`, `{rol_simple}`, `{gestion_simple}` y `{hito_simple}` salen de esta tabla o de un nombre simple guardado junto al dato.

## Reglas para E-03

Una prueba automática revisa cada texto simple antes de enviarlo. Lo que tiene que comprobar:

1. Ninguna palabra de la columna izquierda del glosario.
2. Oraciones de 20 palabras o menos.
3. Si el evento es `gestion_propuesta` o `gestion_sin_cobertura`, el texto no nombra a nadie como responsable (C-22 de [`casos-limites.md`](casos-limites.md)). En `observacion_asignada` solo se le escribe a la persona asignada, y como pregunta.
4. Si el evento es `version_subida` o `respuesta_ingresada`, el texto no contiene «aprobado», «listo» ni «resuelto» (D-07, R-08).
5. El texto no incluye montos, RUT ni nombres de otras familias (L-06). El único monto permitido es el ahorro de la propia familia, en su chat (T-10).
6. Si la regla del plazo tiene `validada = false`, el texto no da una fecha de vencimiento como segura (L-08).

## Preguntas abiertas

| ID | Pregunta |
| --- | --- |
| RQ-01 | ¿Las familias reciben T-01 y T-02 por separado o en un solo mensaje? Propongo uno solo, para no mandar dos avisos seguidos por el mismo hecho. |
| RQ-02 | T-05 avisa a la dirigencia. ¿Es la dirigencia quien debe preguntar, o la EP? Depende de cómo trabaje el comité real (P-10). |
| RQ-03 | ¿Tutear o usar «usted» con las familias? Las plantillas usaban «usted», que es lo más seguro con adultos mayores. Por D-19 se tutea, como en las pantallas del Figma; falta validarlo con una familia real (D-18). |
| RQ-04 | La pantalla F3 muestra a la familia actividad del grupo con nombres de otras familias («Valentina se ofreció a acompañar a la familia Pérez»). Choca con la regla 5 de E-03. ¿Se muestran nombres o se dice «otra familia»? Mientras un humano no decida, «otra familia». |
