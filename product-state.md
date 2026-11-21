# Product state: Comité (DS49 colectivo)

Índice del estado de producto del team-45 en Platanus Hack 26: qué se construye y por qué. Lee este archivo completo y abre solo los archivos de `product-state/` que tu tarea necesita.

| Campo | Valor |
| --- | --- |
| Última actualización | 2026-11-21 |
| Fuente principal | Canal de Discord `#deficit-habitacional` (ID `1573732246786015383`) |
| Último mensaje incorporado | `1573766452777979945` (2026-11-21 18:26 UTC) |
| Documento hermano | [`engineering-state.md`](engineering-state.md): cómo se construye. Si choca con este en alcance o límites, manda este. |
| Propuesta de demo | [`demo-proposal.md`](demo-proposal.md) (Propuesta, v3: cuenta la historia del Figma) |
| Material de apoyo | [Flujo DS49 en Figma, v3 oficial](https://www.figma.com/design/72h9M4fZorEGnm3oEnrorh/Proyecto-Subsidio?node-id=3-2) de lozi-love (msgs `1573765313189912756`, `1573766038552707163`), transcrito en [`figma-lozi.md`](product-state/figma-lozi.md). Es la base para construir (D-19). |

## Estado en una frase

Comité (en el Figma, «Copiloto de Carpeta») es una capa multiplayer sobre el sistema actual del DS49 colectivo: tres agentes (familia, comité y EP) trabajan sobre la misma carpeta, desde los papeles de cada familia hasta la entrega de la vivienda. Terreno, permisos, obra y pagos los sigue y avisa, pero no los resuelve. El SERVIU no cambia nada.

La base para construir es el Figma de lozi-love (D-19, orden de KainaBGR), transcrito en `figma-lozi.md`. El MVP son las funciones 6 (estado para la familia), 4 (plazos y observaciones), 2 (semáforo del comité) y 1 (checklist de la familia por WhatsApp). Las pruebas de aceptación de cada función están en `pruebas-producto.md`.

La demo y el pitch siguen fuera del camino crítico (D-03), con una propuesta de demo v3 alineada al Figma. Hay una propuesta de validar con un caso real (D-18), pendiente de conseguir el caso (P-10).

Tensiones abiertas:

- El Figma choca con algunos límites y lo decide un humano: P-22 y P-23 (L-02 y L-04, exclusión y lista de espera), P-24 (L-06, la EP ve documentos y la composición 70/30 delata tramos), P-25 (L-05 y L-14, asignar observaciones) y P-26 (L-10 y L-11).
- Algunas fechas de las pantallas del Figma no cuadran con un calendario (ver `pruebas-producto.md`), y no está claro si varios plazos son hábiles o corridos (P-20, P-21). Mientras tanto esos plazos no generan alertas (L-08).
- Varias decisiones marcadas «Decidido» salen solo de mensajes de agentes y falta que un humano las confirme (P-13). En la tabla de abajo llevan un asterisco.

## Mapa de archivos

| Archivo | Qué contiene | Léelo cuando |
| --- | --- | --- |
| [`problema.md`](product-state/problema.md) | Problema, hipótesis de coordinación, límite de la evidencia y las cinco fallas del diseño actual. | Necesitas el porqué del producto o vas a escribir el pitch. |
| [`alcance.md`](product-state/alcance.md) | Qué entra y qué queda fuera del alcance. | Vas a proponer algo que podría quedar fuera. |
| [`decisiones.md`](product-state/decisiones.md) | D-01 a D-19, con texto completo y fuente. | Vas a construir sobre una decisión y necesitas su detalle. |
| [`limites.md`](product-state/limites.md) | L-01 a L-14, con texto completo, fuente y su choque con el Figma si lo hay. | Vas a construir una acción del agente, del ejecutor o un mensaje. |
| [`actores.md`](product-state/actores.md) | Roles y dolores de cada actor. | Tu tarea toca vistas, permisos o mensajes por actor. |
| [`recorrido.md`](product-state/recorrido.md) | Etapas de referencia de un proyecto DS49, quién llena, quién aprueba y con qué documento cierra. | Necesitas ubicar un documento o un actor en el proceso. |
| [`conceptos.md`](product-state/conceptos.md) | Vocabulario fijo: expediente vivo, versión, dependencia, compromiso, hito y otros. | Vas a nombrar entidades, estados o textos de interfaz. |
| [`afirmaciones.md`](product-state/afirmaciones.md) | A-01 a A-36: reglas normativas y cifras, con su estado de verificación. A-17 en adelante vienen del Figma. | Vas a usar una regla, un plazo o una cifra. |
| [`normativa.md`](product-state/normativa.md) | N-01 a N-26: leyes, decretos y resoluciones que rigen un DS49 colectivo, de qué tratan y reglas útiles con artículo. | Necesitas saber qué norma rige una etapa, un documento o un plazo. |
| [`figma-lozi.md`](product-state/figma-lozi.md) | Transcripción del Figma de lozi-love: los 9 frames del flujo D.S. 49 v3 (problema, actores, plazos, carriles, puntaje, flechas rojas, solución, MVP, vacíos) y las pantallas del MVP, con sus cruces con el estado. | Diseñas pantallas, escribes el pitch o usas una cifra o un plazo del Figma. |
| [`pruebas-producto.md`](product-state/pruebas-producto.md) | PA-: pruebas de aceptación por función del Figma, con un caso base de datos ficticios, independientes del stack. | Vas a construir una función, darla por terminada o preparar la demo. |
| [`preguntas.md`](product-state/preguntas.md) | P-01 a P-27. P-22 a P-26 son choques del Figma con límites. | Tienes una duda de producto o vas a registrar una pregunta. |
| [`descartado.md`](product-state/descartado.md) | X-01 a X-09, con el motivo. X-01 y X-04 quedaron reabiertos por D-19. | Vas a proponer una idea nueva. |
| [`handoff-ingenieria.md`](product-state/handoff-ingenieria.md) | Lo que ingeniería tiene que traducir desde producto. | Trabajas en `engineering-state.md`. |
| [`registro.md`](product-state/registro.md) | Registro de cambios. | Actualizas este estado. |

## Decisiones y límites en una línea

Resumen para saber qué se puede construir sin abrir otro archivo. El texto que manda está en `decisiones.md` y `limites.md`. Un asterisco marca un ítem «Decidido» sin confirmación humana registrada (P-13).

| ID | En una línea | Estado |
| --- | --- | --- |
| D-01 | Alcance: DS49 colectivo, Construcción en Nuevos Terrenos. | Decisión de trabajo |
| D-02 | El producto coordina todo el proceso, de los papeles de cada familia a la entrega; terreno, permisos, obra y pagos solo los sigue y avisa. | Decidido (D-19) |
| D-03 | La demo sale del camino crítico; primero solución y documentación. | Decidido |
| D-04 | La carpeta del grupo es el objeto compartido; familia, comité y EP aportan cada uno en su ámbito. | Decidido (D-19) |
| D-05 | Cada aprobación queda ligada a una versión inmutable; un cambio marca revalidación. | Propuesta |
| D-06 | Compromisos con cuatro estados: propuesto, aceptado, cumplido con evidencia, sin cobertura. | Decidido* |
| D-07 | Una gestión enviada no es un permiso aprobado ni un pago autorizado. | Decidido* |
| D-08 | Dependencias en vez de cadena: reemplazada por las seis etapas con carriles del Figma. | Descartado (D-19) |
| D-09 | El reglamento DS49 es la base y la resolución del llamado lo reemplaza donde corresponda (Res. 685/2026 para CNT 2026). | Decidido (D-19) |
| D-10 | Comité no reemplaza atribuciones; la EP sigue postulando e ingresando y el SERVIU recibe lo mismo. | Decidido (D-19) |
| D-11 | Un hecho acreditado se reutiliza solo mientras siga vigente y sirva al trámite. | Decidido* |
| D-12 | Plazos solo con fuente y ámbito; los días transcurridos no prueban culpa. | Decidido* |
| D-13 | Vista propia por actor; el comité ve el estado y no el contenido; cada familia autoriza lo que se ve. Lo que ve la EP choca con L-06 (P-24). | Decidido (D-19), salvo la vista de la EP |
| D-14 | El rol se llama "entidad patrocinante (EP)", no EGIS. | Decidido* |
| D-15 | Stack técnico. | Propuesta |
| D-16 | Conversación técnica con profesionales y simple con familias, desde el mismo hecho. | Decidido |
| D-17 | Hitos en vez de etapa actual: reemplazada; la familia ve «Etapa 3 de 6». | Descartado (D-19) |
| D-18 | Validar con un caso real antes de sumar diseño. | Propuesta |
| D-19 | El Figma de lozi-love (`figma-lozi.md`) es la base para construir; si otro documento choca, manda el Figma, salvo los límites L-. | Decidido (Kaina) |
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
| L-11 | La EP no ve a cada familia antes de que ingrese al comité. | Propuesta (la postulación entra al alcance por D-19; ver P-26) |
| L-12 | Un "ya entendí" de una familia nunca cuenta como aprobación. | Decidido* |
| L-13 | Si nadie tomó un paso, el mensaje a la familia lo dice. | Decidido* |
| L-14 | Que una gestión le corresponda a un actor no significa que la aceptó. | Propuesta (función 4 del MVP; ver P-25) |

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
