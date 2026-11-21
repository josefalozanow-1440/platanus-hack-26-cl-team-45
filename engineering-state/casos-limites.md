# Casos de prueba de los límites

Parte de [`engineering-state.md`](../engineering-state.md). Léelo cuando escribas el ejecutor o sus tests.

| Campo | Valor |
| --- | --- |
| Estado | **Propuesta**. Sirve con cualquier stack: cada fila pasa a ser un test cuando se decida E-09. |
| Autor | golazo#44 (agente de Golazo) |
| Hilo | [Casos de prueba de los límites · golazo#44](https://discord.com/channels/1573512846258741318/1573775090670370828) |
| Cubre | El pedido del [handoff](../product-state/handoff-ingenieria.md) de «una prueba por límite», con los límites de [`limites.md`](../product-state/limites.md) |

## Cómo leer la tabla

- **Estado**: lo mínimo que tiene que existir antes de la acción.
- **Acción**: quién la pide y por qué canal (panel, WhatsApp o agente).
- **Resultado**: `pasa` o `bloqueada (L-xx)`. Una acción bloqueada queda registrada con el límite que la frenó; nunca se pierde en silencio.
- Los nombres de acciones son los de la propuesta E-09 ([`arquitectura.md`](arquitectura.md)). Si cambian, se renombran aquí; el caso sigue igual.
- Las filas de un límite en estado «Propuesta» llevan la marca *(P)*. Se prueban solo si un humano confirma ese límite.

## Casos

| Caso | Límite | Estado | Acción | Resultado |
| --- | --- | --- | --- | --- |
| C-01 | L-02 | Familia 7 sin respuesta hace 30 días. | El agente pide `excluir_familia(7)`. | bloqueada (L-02): la acción no existe en la lista blanca. |
| C-02 | L-02 | Igual que C-01. | El agente pide `cambiar_estado_familia(7, "retirada")`. | bloqueada (L-02): ninguna acción saca a una familia, aunque tenga otro nombre. |
| C-03 | L-02 | Igual que C-01. | El agente pide `proponer_gestion("Contactar a la familia 7", corresponde_a: dirigente)`. | pasa: marcar qué falta y quién puede ayudar está permitido. |
| C-04 | L-03 | Gestión abierta «Corregir plano sanitario» para la EP. | El dirigente pide una segunda gestión con el mismo asunto y destinatario. | bloqueada (L-03). |
| C-05 | L-03 | Igual que C-04. | El agente pide la misma gestión otra vez, desde otra conversación. | bloqueada (L-03): el agente no gana prioridad por insistir. |
| C-06 | L-03 | La gestión de C-04 quedó `cumplida`. | Se abre una gestión nueva con el mismo asunto y destinatario. | pasa: ya no hay una abierta. |
| C-07 | L-04 | Proyecto con 40 familias. | El agente pide `priorizar_familias` o `ordenar_por_puntaje`. | bloqueada (L-04): no hay acciones de asignación ni de priorización. |
| C-08 | L-05 | Gestión `propuesta` para la arquitecta, con plazo de aceptación vencido y sin respuesta. | Corre el vencimiento. | La gestión pasa a `sin_cobertura`, no a `aceptada`. |
| C-09 | L-05 | Gestión `propuesta` para la arquitecta. | La arquitecta aprieta «No puedo». | La gestión pasa a `sin_cobertura`. |
| C-10 | L-05 | Igual que C-09. | El dirigente pide `aceptar_gestion` a nombre de la arquitecta. | bloqueada (L-05): solo la persona destinataria acepta. |
| C-11 | L-06 | Familia 12 con ahorro acreditado. | El dirigente pide la vista de la familia 12. | pasa, y la respuesta trae «ahorro ✅» sin monto ni cartola. |
| C-12 | L-06 | Igual que C-11. | El agente del dirigente pregunta «¿cuánto ahorró la familia 12?». | La herramienta `ver_estado` no devuelve el monto: el agente no tiene de dónde sacarlo. |
| C-13 | L-07 | Acta del 10 de noviembre registrada. | Cualquier actor pide editarla o borrarla. | bloqueada (L-07). Con el rol de la app, un `UPDATE` o `DELETE` directo en la base también falla. |
| C-14 | L-07 | Igual que C-13. | El dirigente agrega una corrección al acta. | pasa, como acta nueva que referencia a la anterior. |
| C-15 | L-08 | Regla del plazo de respuesta de la DOM con `validada = false`. | Vence ese plazo. | No se genera alerta de incumplimiento ni se bloquea un pago. A lo más se muestra «plazo por verificar». |
| C-16 | L-08 | La misma regla con `validada = true`. | Vence el plazo. | Se genera la alerta. |
| C-17 | L-09 | 39 de 40 familias aprobaron el proyecto. | La EP pide `marcar_proyecto_aprobado`. | bloqueada (L-09). |
| C-18 | L-09 | Igual que C-17. | La EP intenta configurar el quórum en mayoría. | bloqueada (L-09): no existe esa configuración. |
| C-19 | L-10 *(P)* | Gestión `propuesta` para la arquitecta. | La arquitecta la acepta desde el panel, desde WhatsApp y desde el agente (tres corridas). | Las tres terminan en el mismo estado y el mismo evento: el canal no cambia las reglas. |
| C-20 | L-12 | Familia 12 con la aprobación del proyecto pendiente. | La familia escribe «ya entendí, gracias» por WhatsApp. | No se genera `aprobar`. La aprobación sigue pendiente. |
| C-21 | L-12 | Igual que C-20. | La familia aprieta el botón «Apruebo el proyecto». | pasa: genera `aprobar` de la familia 12. |
| C-22 | L-13 | Gestión «Corregir plano sanitario» con `aceptada_por` vacío. | El redactor arma el aviso a las familias. | El mensaje dice que todavía no se sabe quién tomó el paso. No nombra a la EP ni a nadie. |
| C-23 | L-13 | La arquitecta aceptó la gestión. | El redactor arma el aviso. | El mensaje nombra a la arquitecta, tomada de `aceptada_por`. |
| C-24 | L-14 *(P)* | Gestión con `corresponde_a = EP` y sin aceptación. | La EP abre el panel. | Muestra «pendiente de aceptación», no «a cargo de la EP». |
| C-25 | L-14 *(P)* | Igual que C-24. | Se crea la gestión. | `aceptada_por` queda vacío; tenerlo igual a `corresponde_a` es un error del caso. |

## Lo que queda fuera

- L-01 no tiene caso propio: es el ejecutor completo. Se prueba con que todos los casos de arriba pasen por él y con que el agente no tenga ninguna herramienta que escriba en la base sin pasar por el ejecutor.
- L-11 queda fuera porque es de la etapa de postulación, que no está en el alcance (D-02).
- Los casos de revalidación (D-05, D-08) no están aquí porque no son límites. Van en los tests del modelo de versiones cuando se confirmen esas propuestas.

## Decisiones que tomé solo (golazo#44)

- Escribo los casos como tabla y no como código, para no adelantarme a la decisión de stack (AQ-01).
- Agrego casos que deben pasar (C-03, C-06, C-14, C-16, C-21, C-23) junto a los que se bloquean, para que un ejecutor que bloquea todo no pase los tests.
- C-14 supone que corregir un acta se hace con un acta nueva que referencia a la anterior. No está escrito en producto; lo dejo como pregunta en el hilo.
