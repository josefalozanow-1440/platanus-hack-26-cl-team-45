# Product state: Comité (DS49 colectivo)

Índice del estado de producto del team-45 en Platanus Hack 26: qué se construye y por qué. Lee este archivo completo y abre solo los archivos de `product-state/` que tu tarea necesita.

| Campo | Valor |
| --- | --- |
| Última actualización | 2026-11-21 |
| Fuente principal | Canal de Discord `#deficit-habitacional` (ID `1573732246786015383`) |
| Último mensaje incorporado | `1573766452777979945` (2026-11-21 18:26 UTC) |
| Documento hermano | [`engineering-state.md`](engineering-state.md): cómo se construye. Si choca con este en alcance o límites, manda este. |
| Propuesta de demo | [`demo-proposal.md`](demo-proposal.md) (Propuesta; se apoya en L-14, D-05, D-08 y D-17) |
| Material de apoyo | [Flujo DS49 en Figma, v3 oficial](https://www.figma.com/design/72h9M4fZorEGnm3oEnrorh/Proyecto-Subsidio?node-id=3-2) de lozi-love (msgs `1573765313189912756`, `1573766038552707163`). Su alcance choca con D-02 (P-12). |

## Estado en una frase

Comité es una herramienta para seguir un proyecto DS49 colectivo de Construcción en Nuevos Terrenos (CNT) después de que el grupo ya tiene el subsidio: muestra qué bloquea el proyecto, quién aceptó hacerse cargo del siguiente paso y qué evidencia permite avanzar, con una vista distinta para cada actor.

La demo y el pitch están en pausa (D-03), aunque ya hay una propuesta de demo pendiente de confirmar en #steering. El foco es construir la solución y su documentación. Hay una propuesta de validar la hipótesis con un caso real antes de sumar más diseño (D-18), pendiente de conseguir el caso y a quien entreviste (P-10).

Tensiones abiertas:

- El Figma de lozi-love acota el problema hasta la selección y deja después solo el seguimiento de la familia, lo que choca con D-02 (P-12).
- Varias decisiones marcadas «Decidido» salen solo de mensajes de agentes y falta que un humano las confirme (P-13). En la tabla de abajo llevan un asterisco.

## Mapa de archivos

| Archivo | Qué contiene | Léelo cuando |
| --- | --- | --- |
| [`problema.md`](product-state/problema.md) | Problema, hipótesis de coordinación, límite de la evidencia y las cinco fallas del diseño actual. | Necesitas el porqué del producto o vas a escribir el pitch. |
| [`alcance.md`](product-state/alcance.md) | Qué entra y qué queda fuera del alcance. | Vas a proponer algo que podría quedar fuera. |
| [`decisiones.md`](product-state/decisiones.md) | D-01 a D-18, con texto completo y fuente. | Vas a construir sobre una decisión y necesitas su detalle. |
| [`limites.md`](product-state/limites.md) | L-01 a L-14, con texto completo y fuente. | Vas a construir una acción del agente, del ejecutor o un mensaje. |
| [`actores.md`](product-state/actores.md) | Roles y dolores de cada actor. | Tu tarea toca vistas, permisos o mensajes por actor. |
| [`recorrido.md`](product-state/recorrido.md) | Etapas de referencia de un proyecto DS49, quién llena, quién aprueba y con qué documento cierra. | Necesitas ubicar un documento o un actor en el proceso. |
| [`conceptos.md`](product-state/conceptos.md) | Vocabulario fijo: expediente vivo, versión, dependencia, compromiso, hito y otros. | Vas a nombrar entidades, estados o textos de interfaz. |
| [`afirmaciones.md`](product-state/afirmaciones.md) | A-01 a A-16: reglas normativas y cifras, con su estado de verificación. | Vas a usar una regla, un plazo o una cifra. |
| [`preguntas.md`](product-state/preguntas.md) | P-01 a P-13. | Tienes una duda de producto o vas a registrar una pregunta. |
| [`descartado.md`](product-state/descartado.md) | X-01 a X-09, con el motivo. | Vas a proponer una idea nueva. |
| [`handoff-ingenieria.md`](product-state/handoff-ingenieria.md) | Lo que ingeniería tiene que traducir desde producto. | Trabajas en `engineering-state.md`. |
| [`registro.md`](product-state/registro.md) | Registro de cambios. | Actualizas este estado. |

## Decisiones y límites en una línea

Resumen para saber qué se puede construir sin abrir otro archivo. El texto que manda está en `decisiones.md` y `limites.md`. Un asterisco marca un ítem «Decidido» sin confirmación humana registrada (P-13).

| ID | En una línea | Estado |
| --- | --- | --- |
| D-01 | Alcance: DS49 colectivo, Construcción en Nuevos Terrenos. | Decisión de trabajo |
| D-02 | El producto atiende el tramo entre subsidio asignado y vivienda entregada. | Decidido* |
| D-03 | La demo sale del camino crítico; primero solución y documentación. | Decidido |
| D-04 | Un expediente vivo por proyecto; cada actor aporta solo en su ámbito. | Decidido* |
| D-05 | Cada aprobación queda ligada a una versión inmutable; un cambio marca revalidación. | Propuesta |
| D-06 | Compromisos con cuatro estados: propuesto, aceptado, cumplido con evidencia, sin cobertura. | Decidido* |
| D-07 | Una gestión enviada no es un permiso aprobado ni un pago autorizado. | Decidido* |
| D-08 | El flujo se modela como dependencias, no como cadena en serie. | Propuesta |
| D-09 | No hay pasos universales; manda el llamado vigente (Res. 685/2026 para CNT 2026). | Decidido* |
| D-10 | Comité no reemplaza atribuciones; hace visible qué falta y quién lo tomó. | Decidido* |
| D-11 | Un hecho acreditado se reutiliza solo mientras siga vigente y sirva al trámite. | Decidido* |
| D-12 | Plazos solo con fuente y ámbito; los días transcurridos no prueban culpa. | Decidido* |
| D-13 | Vista propia por actor; las familias no ven documentos internos. | Decidido* |
| D-14 | El rol se llama "entidad patrocinante (EP)", no EGIS. | Decidido* |
| D-15 | Stack técnico. | Propuesta |
| D-16 | Conversación técnica con profesionales y simple con familias, desde el mismo hecho. | Decidido |
| D-17 | Hitos que coexisten en vez de una etapa actual. | Propuesta |
| D-18 | Validar con un caso real antes de sumar diseño. | Propuesta |
| L-01 | Los límites viven en un ejecutor en código, no en el prompt. | Decidido* |
| L-02 | El agente nunca recomienda ni ejecuta la exclusión de una familia. | Decidido* |
| L-03 | Insistir no sube la prioridad; una gestión abierta por asunto y destinatario. | Decidido* |
| L-04 | No inventar reglas oficiales de asignación o priorización. | Decidido* |
| L-05 | Nadie queda asignado por silencio; sin aceptación queda "sin cobertura". | Decidido* |
| L-06 | Vistas parciales: se ve el estado de un hecho, no su contenido. | Decidido* |
| L-07 | Actas y reclamos son append-only. | Decidido* |
| L-08 | Una regla pendiente de validar no habilita pagos, permisos ni alertas. | Decidido* |
| L-09 | La unanimidad que exige la norma no baja a mayoría por configuración. | Decidido* como límite; regla por verificar (A-03) |
| L-10 | Avanzar no exige usar un agente. | Propuesta |
| L-11 | La EP no ve a cada familia antes de que ingrese al comité. | Propuesta (etapa de postulación, fuera de alcance) |
| L-12 | Un "ya entendí" de una familia nunca cuenta como aprobación. | Decidido* |
| L-13 | Si nadie tomó un paso, el mensaje a la familia lo dice. | Decidido* |
| L-14 | Que una gestión le corresponda a un actor no significa que la aceptó. | Propuesta |

## Cómo usar el estado (agentes)

- Cita los IDs (`D-`, `L-`, `A-`, `P-`, `X-`) en specs, commits y en `engineering-state.md` en vez de copiar el texto. Los IDs no cambian aunque un ítem cambie de archivo.
- El estado de cada ítem manda. Una propuesta no es una decisión, y una cifra "por verificar" no se usa en producto ni en pitch.
- Si lo que vas a construir no está cubierto o choca con este estado, no lo resuelvas por tu cuenta: regístralo como pregunta en `preguntas.md` y avisa al equipo.

| Estado | Significado |
| --- | --- |
| Decidido | El equipo lo acordó de forma explícita. Se puede construir sobre esto. |
| Decisión de trabajo | Se usa para avanzar, pero falta confirmarlo. Ver la pregunta asociada. |
| Propuesta | Alguien la planteó y nadie la aceptó o rechazó todavía. No construir sobre esto sin confirmar. |
| En pausa | Se aceptó la idea, pero queda fuera del camino crítico por ahora. |
| Descartado | No se hace. Se registra el motivo para no reabrirla sin información nueva. |

## Cómo actualizarlo

1. Lee el canal desde el "Último mensaje incorporado" en adelante (`read_messages` con `after`).
2. Edita solo el archivo de la sección afectada. Cambia el estado de un ítem en vez de borrarlo; si se descarta, muévelo a `descartado.md` con el motivo.
3. Si cambias el estado o el sentido de un `D-` o un `L-`, actualiza también su línea en la tabla de este índice.
4. Solo una persona del equipo convierte una propuesta en decisión. Un agente puede proponer, pero no da algo por decidido porque nadie lo objetó.
5. Cita la fuente de cada cambio (ID de mensaje de Discord, enlace o documento).
6. Actualiza la cabecera de este índice y agrega una línea en `registro.md`.
