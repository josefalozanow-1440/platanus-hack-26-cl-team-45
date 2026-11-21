# Plantillas del redactor (propuesta E-11)

Parte de [`engineering-state.md`](../engineering-state.md). Léelo si vas a escribir el redactor, los avisos por WhatsApp o los textos de la vista de familias.

| Campo | Valor |
| --- | --- |
| Estado | **Propuesta**. No depende del stack. |
| Autor | golazo#44 (agente de Golazo) |
| Hilo | [Plantillas del redactor (técnica y simple) · golazo#44](https://discord.com/channels/1573512846258741318/1573775652870422680) |
| Se apoya en | D-07, D-13, D-16, L-06, L-12, L-13, L-14 (Propuesta), E-03, R-08 y el redactor de [`arquitectura.md`](arquitectura.md) |

## Cómo se usan

- Cada evento tiene dos plantillas: la **técnica** para la EP, la arquitecta, la constructora y la dirigencia, y la **simple** para las familias (D-16). Las dos se llenan con los mismos datos del evento.
- Los campos entre llaves (`{documento}`) salen del evento. El texto fijo no se reformula. Si un campo falta, el mensaje no se envía y el evento queda en el registro como error; nunca se rellena con un valor inventado (L-13).
- Quién tomó el paso sale solo de `aceptada_por`. Si está vacío, se usa la variante «sin aceptar», aunque `corresponde_a` tenga valor (L-13, L-14).
- Los mensajes simples no llevan contenido de documentos ni datos de otras familias, solo estados (L-06, R-10).
- Los botones son los únicos que generan acciones. Un texto libre de la familia, como «ok» o «ya entendí», nunca cuenta como aprobación (L-12).

## Plantillas de la demo

Los ejemplos usan el proyecto ficticio Los Quillayes de [`demo-proposal.md`](../demo-proposal.md).

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

Ejemplo simple: «La arquitecta de la EP ya está corrigiendo el plano. Dijo que lo tendrá listo el jueves 26 de noviembre. Ustedes no tienen que hacer nada.»

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
| Antecedente propio | ✅ Sus papeles: al día. / ⚠️ Sus papeles: falta {antecedente_simple}. |

Cierra siempre con: «Si quiere más detalle, responda DETALLE.» El detalle solo muestra lo que su vista permite (D-16, L-06).

### Eventos que no avisan a las familias

`accion_bloqueada` (por ejemplo, el pedido de excluir a una familia, L-02) solo aparece en el registro del ejecutor y en la vista de la dirigencia y la EP. Avisarle a la familia afectada la expondría sin necesidad.

## Glosario simple

Las variantes simples reemplazan estos términos. E-03 rechaza un texto simple que use los de la izquierda.

| Término técnico | En la variante simple |
| --- | --- |
| EP, entidad patrocinante | la entidad que acompaña el proyecto |
| DOM | la municipalidad |
| SERVIU | la oficina regional de vivienda |
| observación | pidió corregir |
| revalidar, por revalidar | (no se menciona a la familia) |
| calificación | (no se menciona a la familia) |
| reingreso | se entregó de nuevo |
| gestión | la tarea, o el nombre concreto («corregir el plano») |
| lámina, cota | el plano |

`{organismo_simple}`, `{rol_simple}`, `{gestion_simple}` y `{hito_simple}` salen de esta tabla o de un nombre simple guardado junto al dato.

## Reglas para E-03

Una prueba automática revisa cada texto simple antes de enviarlo. Lo que tiene que comprobar:

1. Ninguna palabra de la columna izquierda del glosario.
2. Oraciones de 20 palabras o menos.
3. Si el evento es `gestion_propuesta` o `gestion_sin_cobertura`, el texto no nombra a nadie como responsable (C-22 de [`casos-limites.md`](casos-limites.md)).
4. Si el evento es `version_subida`, el texto no contiene «aprobado», «listo» ni «resuelto» (D-07, R-08).
5. El texto no incluye montos, RUT ni nombres de otras familias (L-06).

## Preguntas abiertas

| ID | Pregunta |
| --- | --- |
| RQ-01 | ¿Las familias reciben T-01 y T-02 por separado o en un solo mensaje? Propongo uno solo, para no mandar dos avisos seguidos por el mismo hecho. |
| RQ-02 | T-05 avisa a la dirigencia. ¿Es la dirigencia quien debe preguntar, o la EP? Depende de cómo trabaje el comité real (P-10). |
| RQ-03 | ¿Tutear o usar «usted» con las familias? Las plantillas usan «ustedes» y «usted», que es lo más seguro con adultos mayores; falta validarlo con una familia real (D-18). |
