# Engineering state: Comité (DS49 colectivo)

Índice del estado de ingeniería del team-45 en Platanus Hack 26: cómo se construye lo que define [`product-state.md`](product-state.md). Lee este archivo completo y abre solo los archivos de `engineering-state/` que tu tarea necesita.

| Campo | Valor |
| --- | --- |
| Última actualización | 2026-11-21 |
| Documento hermano | [`product-state.md`](product-state.md): qué se construye y por qué. Si choca con este en alcance o límites, manda `product-state.md`. |
| Fuentes | Canal de Discord `#deficit-habitacional` (ID `1573732246786015383`) y documentación pública de Kapso (ver `kapso.md`) |

## Estado en una frase

No hay stack decidido ni código (P-02, D-15). La pieza central es el ejecutor en código que valida contrato, quórum y límites duros antes de cualquier acción (L-01). Kapso es el canal de WhatsApp: Kaina indicó que se usará, pero falta registrarlo en #steering (E-02, X-08).

## Mapa de archivos

| Archivo | Qué contiene | Léelo cuando |
| --- | --- | --- |
| [`kapso.md`](engineering-state/kapso.md) | Qué es Kapso, su rol en la arquitectura, usos propuestos, restricciones R-01 a R-07, primera prueba y fuentes. | Tu tarea toca WhatsApp, mensajes a familias o actores, o la demo. |
| [`accesibilidad.md`](engineering-state/accesibilidad.md) | Datos sobre familias con poca experiencia digital, propuestas E-03 a E-08 y riesgos R-08 a R-12. | Tu tarea toca la vista o los textos para familias. |
| [`registro.md`](engineering-state/registro.md) | Registro de cambios. | Actualizas este estado. |

## Decisiones y propuestas de ingeniería

| ID | Ítem | Estado | Detalle |
| --- | --- | --- | --- |
| E-01 | Stack: Next.js + Supabase + Claude con tool use. Postgres como única fuente de verdad; un grafo solo como copia derivada de solo lectura. | Propuesta (ver D-15) | msgs `1573734184588157009`, `1573746644799725793`, `1573746868121243821` |
| E-02 | Kapso como canal de WhatsApp para familias y actores, conectado por webhook al servidor del equipo. | Propuesta. Kaina indicó que se usará (2026-11-21); falta confirmarlo en #steering. La demo propuesta lo usa ([`demo-proposal.md`](demo-proposal.md)). | `kapso.md` |
| E-03 | Prueba automática de legibilidad de los textos para familias. | Propuesta | `accesibilidad.md` |
| E-04 | Vista de familias accesible y liviana (WCAG 2.2 AA). | Propuesta | `accesibilidad.md` |
| E-05 | Acompañante de la familia, que ve y explica pero no aprueba. | Propuesta | `accesibilidad.md` |
| E-06 | Registro asistido de lo conversado en persona. | Propuesta | `accesibilidad.md` |
| E-07 | Notas de voz de entrada y salida por WhatsApp. | Propuesta | `accesibilidad.md` |
| E-08 | Otros idiomas para familias, solo si las entrevistas lo muestran. | Propuesta | `accesibilidad.md` |

| Rango | Qué cubre | Archivo |
| --- | --- | --- |
| R-01 a R-07 | Restricciones y riesgos de WhatsApp y Kapso. | `kapso.md` |
| R-08 a R-12 | Riesgos de accesibilidad. | `accesibilidad.md` |

## Cómo usar el estado (agentes)

- Lee antes el índice de `product-state.md`. Cita los IDs de producto (`D-`, `L-`, `A-`, `P-`, `X-`) en vez de copiar su texto. Los ítems de este estado usan `E-` (decisiones y propuestas de ingeniería) y `R-` (restricciones y riesgos técnicos).
- Los estados son los mismos de `product-state.md`. Una propuesta no es una decisión: no construyas sobre ella sin que una persona del equipo la confirme.
- Si vas a construir algo que no está cubierto aquí, regístralo como propuesta `E-` en el archivo que corresponda, agrega su línea en la tabla de este índice y avisa al equipo en `#ingenieria`. Si el tema no calza en ningún archivo, crea uno nuevo en `engineering-state/` y súmalo al mapa.
- Al actualizar, agrega una línea en `registro.md` y cambia la fecha de la cabecera.

## Pendiente

La lista de lo que ingeniería debe traducir desde producto está en [`handoff-ingenieria.md`](product-state/handoff-ingenieria.md): el ejecutor con una prueba por límite, el modelo de versiones, dependencias y compromisos, las reglas normativas pendientes de validar, el stack y el reparto de trabajo.
