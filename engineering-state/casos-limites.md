# Casos de prueba de los límites

Parte de [`engineering-state.md`](../engineering-state.md). Léelo cuando escribas el ejecutor o sus tests.

| Campo | Valor |
| --- | --- |
| Estado | **Propuesta**. Sirve con cualquier stack: cada fila pasa a ser un test cuando se decida E-09. |
| Autor | golazo#44 (agente de Golazo) |
| Hilo | [Casos de prueba de los límites · golazo#44](https://discord.com/channels/1573512846258741318/1573775090670370828) |
| Cubre | El pedido del [handoff](../product-state/handoff-ingenieria.md) de «una prueba por límite», con los límites de [`limites.md`](../product-state/limites.md) |
| Ajuste por D-19 | kaina#62-3 (2026-11-21) agregó C-26 a C-39 para el MVP del Figma (funciones 6, 4, 2 y 1) y volvió a incluir L-11, porque la postulación entró al alcance. Los casos C-01 a C-25 no dependían del tramo posterior al subsidio y siguen igual. |

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

### Casos del MVP del Figma

Alineados con D-19 (Figma, funciones 1, 2, 4 y 6). Usan los datos ficticios de las pantallas: Comité Los Aromos, familia Rojas y EP Sur. Las acciones están en «Acciones del MVP del Figma» de [`arquitectura.md`](arquitectura.md).

| Caso | Límite | Estado | Acción | Resultado |
| --- | --- | --- | --- | --- |
| C-26 | L-02 | Familia Vera activa en Los Aromos. | Un adulto de la familia Vera confirma `registrar_renuncia`. | pasa: la familia queda `renunciada` y se abre el plazo de reemplazo con su regla (pantalla C2). |
| C-27 | L-02 | Familia 7 sin responder hace 30 días. | El dirigente o el agente pide `registrar_renuncia(7)`. | bloqueada (L-02): solo la propia familia renuncia; si no, es una exclusión con otro nombre. |
| C-28 | L-04 | Familia Vera renunció y hay 3 candidatos en la lista de espera. | El agente pide ordenar la lista por quién cumple más requisitos o por puntaje. | bloqueada (L-04). Mostrar qué debe cumplir el reemplazante y hasta cuándo sí pasa. |
| C-29 | L-03 | Gestión abierta «Firmar DJ49-1» para Pedro. | Marta escribe «Mándaselo, porfa» por segunda vez. | No se abre otra gestión: se reenvía el mismo enlace dentro de la gestión abierta. |
| C-30 | L-05, L-14 *(P)* | Observación 3 del SERVIU, tipo familia. | La EP la asigna a Marta Rojas con `asignar_observacion`. | La gestión queda `propuesta`, con `corresponde_a = Marta` y `aceptada_por` vacío hasta que Marta apriete «Me encargo». |
| C-31 | L-06 | Familia 7 autorizó que el comité vea su carpeta; le falta una firma en la DJ49-1. | El dirigente abre el semáforo (C1). | pasa, y muestra «Familia 7: falta DJ49-1 firmada por 2 adultos», sin nombres de los adultos ni el documento. |
| C-32 | L-06 | Familia 7 revocó el consentimiento. | El dirigente abre el semáforo. | La fila de la familia 7 dice «sin autorización». El total del comité («34 de 40») sigue contando su carpeta. |
| C-33 | L-06 | Familia Rojas con 9,5 de 10 UF. | El dirigente pregunta al agente cuánto lleva ahorrado la familia Rojas. | El agente solo puede decir «bajo 10 UF». Marta, en su propio chat, sí ve 9,5 de 10 UF (F1). |
| C-34 | L-08 | Regla de los 180 días del art. 12 con `validada = false` (no dice si son hábiles o corridos). | Quedan 37 días según la cuenta en días corridos. | La pantalla E3 muestra el plazo como «por verificar» y no genera alerta de incumplimiento. |
| C-35 | L-08 | Regla de los 60 días hábiles del art. 13 con `validada = true`. | Faltan 5 días hábiles y la respuesta única va 2 de 3. | Se genera el aviso a la EP con los tres escenarios. |
| C-36 | L-11 *(P)* | Candidato en la lista de espera de Los Aromos, sin ingresar al comité. | La EP pide la matriz familia × documento de Los Aromos (E3). | El candidato no aparece en la matriz. |
| C-37 | L-11 *(P)* | Familia Rojas ingresó al comité y autorizó a la EP. | La EP pide la misma matriz. | pasa: la familia Rojas aparece con el estado de cada documento. |
| C-38 | L-12 | Falta la firma de Pedro en la DJ49-1. | Pedro escribe «ya firmé» por WhatsApp. | No se genera `firmar_documento`. La DJ49-1 sigue en «2 de 3 adultos». |
| C-39 | L-12 | Igual que C-38. | Pedro confirma en la pantalla F4 después de entrar con ClaveÚnica. | pasa: se registra su firma y la DJ49-1 queda completa. |

## Lo que queda fuera

- L-01 no tiene caso propio: es el ejecutor completo. Se prueba con que todos los casos de arriba pasen por él y con que el agente no tenga ninguna herramienta que escriba en la base sin pasar por el ejecutor.
- L-11 ya no queda fuera: D-19 amplió D-02 a todo el proceso y la EP ve la carpeta de cada familia (E3). Sus casos son C-36 y C-37, marcados *(P)* porque L-11 sigue en Propuesta.
- Los casos de revalidación (D-05, D-08) no están aquí porque no son límites. Van en los tests del modelo de versiones cuando se confirmen esas propuestas.
- Que la EP vea el contenido de los documentos (pantalla F0) no tiene caso: choca con L-06 tal como está escrito y espera la decisión de un humano.
- Que ingresar la respuesta en el sistema del MINVU no cierre las observaciones (D-07) tampoco es un límite; va en los tests de la función 4.

## Decisiones que tomé solo (golazo#44)

- Escribo los casos como tabla y no como código, para no adelantarme a la decisión de stack (AQ-01).
- Agrego casos que deben pasar (C-03, C-06, C-14, C-16, C-21, C-23) junto a los que se bloquean, para que un ejecutor que bloquea todo no pase los tests.
- C-14 supone que corregir un acta se hace con un acta nueva que referencia a la anterior. No está escrito en producto; lo dejo como pregunta en el hilo.
- (kaina#62-3) C-27 trata la renuncia pedida por otro como exclusión (L-02). No está escrito en producto; es la lectura más segura de C2.
- (kaina#62-3) C-32 sigue contando la carpeta de una familia que revocó el consentimiento en el total del comité. Si el total también debe excluirla, se cambia el caso.
