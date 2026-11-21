# Engineering state: Comité (DS49 colectivo)

Índice del estado de ingeniería del team-45 en Platanus Hack 26: cómo se construye lo que define [`product-state.md`](product-state.md). Lee este archivo completo y abre solo los archivos de `engineering-state/` que tu tarea necesita.

| Campo | Valor |
| --- | --- |
| Última actualización | 2026-11-21 |
| Documento hermano | [`product-state.md`](product-state.md): qué se construye y por qué. Si choca con este en alcance o límites, manda `product-state.md`. |
| Fuentes | Canal de Discord `#deficit-habitacional` (ID `1573732246786015383`) y documentación pública de Kapso (ver `kapso.md`) |

## Estado en una frase

El stack está decidido (E-01) y el repo tiene la base en `api/` y `web/`; `scripts/check.sh` corre los mismos checks que CI. Todo se alineó con el Figma de lozi-love, que es la base para construir (D-19): la arquitectura (E-09) ordena la construcción por el MVP del Figma (funciones 6, 4, 2 y 1).

La pieza central sigue siendo el ejecutor en código que valida límites antes de cualquier acción (L-01). Kapso es el canal de WhatsApp de la función 1 (E-02); falta registrarlo en #steering. Las pruebas de aceptación de producto están en [`pruebas-producto.md`](product-state/pruebas-producto.md).

## Mapa de archivos

| Archivo | Qué contiene | Léelo cuando |
| --- | --- | --- |
| [`kapso.md`](engineering-state/kapso.md) | Qué es Kapso, su rol en la arquitectura, usos propuestos, restricciones R-01 a R-07 y R-14, primera prueba y fuentes. | Tu tarea toca WhatsApp, mensajes a familias o actores, o la demo. |
| [`accesibilidad.md`](engineering-state/accesibilidad.md) | Datos sobre familias con poca experiencia digital, propuestas E-03 a E-08 y riesgos R-08 a R-13. | Tu tarea toca la vista o los textos para familias. |
| [`arquitectura.md`](engineering-state/arquitectura.md) | Propuesta E-09: componentes, modelo de datos, ejecutor, flujo de una acción, acciones del MVP del Figma, stack, orden de construcción y R-15. | Vas a escribir código o repartir trabajo. |
| [`casos-limites.md`](engineering-state/casos-limites.md) | Casos de prueba por límite (C-01 a C-39): estado, acción y resultado esperado del ejecutor. | Vas a escribir el ejecutor o sus tests. |
| [`redactor.md`](engineering-state/redactor.md) | Propuesta E-11: plantillas técnica y simple por evento (T-01 a T-13), glosario simple y reglas para E-03. | Vas a escribir el redactor, los avisos por WhatsApp o textos para familias. |
| [`registro.md`](engineering-state/registro.md) | Registro de cambios. | Actualizas este estado. |

## Decisiones y propuestas de ingeniería

| ID | Ítem | Estado | Detalle |
| --- | --- | --- | --- |
| E-01 | Stack: Postgres con SQLAlchemy y Alembic, API REST en FastAPI (`api/`), front en Next.js (`web/`), todo en `docker-compose.yml` y después en Render. Reglas de código en [`docs/reglas-de-codigo.md`](docs/reglas-de-codigo.md). | Decidido (Golazo, 2026-11-21) | Orden de Golazo por terminal |
| E-02 | Kapso como canal de WhatsApp para familias y actores, conectado por webhook al servidor del equipo. Alineado con D-19: es el canal de la función 1 (checklist de la familia, pantalla F1). | Propuesta. Kaina indicó que se usará (2026-11-21); X-08 ya lo da por entrado con D-19; falta confirmarlo en #steering. | `kapso.md` |
| E-03 | Prueba automática de legibilidad de los textos para familias. | Propuesta | `accesibilidad.md` |
| E-04 | Vista de familias accesible y liviana (WCAG 2.2 AA). | Propuesta | `accesibilidad.md` |
| E-05 | Acompañante de la familia, que ve y explica pero no aprueba. | Propuesta | `accesibilidad.md` |
| E-06 | Registro asistido de lo conversado en persona. | Propuesta | `accesibilidad.md` |
| E-07 | Notas de voz de entrada y salida por WhatsApp. | Propuesta | `accesibilidad.md` |
| E-08 | Otros idiomas para familias, solo si las entrevistas lo muestran. | Propuesta | `accesibilidad.md` |
| E-09 | Arquitectura: Postgres como única fuente de verdad (el stack lo fija E-01) y todo cambio de estado como acción que valida el ejecutor. Alineada con D-19: carpeta por familia, firmas, consentimiento, observaciones con respuesta única, plazos con regla y capa, reemplazos y orden de construcción por el MVP del Figma (6, 4, 2, 1). | Propuesta, en revisión de los developers | `arquitectura.md` |
| E-10 | Casos de prueba por límite, independientes del stack. C-26 a C-39 cubren el MVP del Figma y L-11 (D-19). | Propuesta | `casos-limites.md` |
| E-11 | Plantillas fijas del redactor: un mensaje técnico y uno simple por evento, desde los mismos datos. T-07 a T-13 cubren los eventos del MVP del Figma; las simples tutean (D-19). | Propuesta | `redactor.md` |

| Rango | Qué cubre | Archivo |
| --- | --- | --- |
| R-01 a R-07 | Restricciones y riesgos de WhatsApp y Kapso. | `kapso.md` |
| R-08 a R-13 | Riesgos de accesibilidad (R-13: firma con ClaveÚnica). | `accesibilidad.md` |
| R-14 | Foto del documento por WhatsApp. | `kapso.md` |
| R-15 | La composición 70/30 delata el tramo del RSH de quien entra o sale. | `arquitectura.md` |

## Cómo usar el estado (agentes)

- Lee antes el índice de `product-state.md`. Cita los IDs de producto (`D-`, `L-`, `A-`, `P-`, `X-`) en vez de copiar su texto. Los ítems de este estado usan `E-` (decisiones y propuestas de ingeniería) y `R-` (restricciones y riesgos técnicos).
- Los estados son los mismos de `product-state.md`. Una propuesta no es una decisión: no construyas sobre ella sin que una persona del equipo la confirme.
- Si vas a construir algo que no está cubierto aquí, regístralo como propuesta `E-` en el archivo que corresponda, agrega su línea en la tabla de este índice y avisa al equipo en `#ingenieria`. Si el tema no calza en ningún archivo, crea uno nuevo en `engineering-state/` y súmalo al mapa.
- Al actualizar, agrega una línea en `registro.md` y cambia la fecha de la cabecera.

## Pendiente

La lista de lo que ingeniería debe traducir desde producto está en [`handoff-ingenieria.md`](product-state/handoff-ingenieria.md): el ejecutor con una prueba por límite, el modelo de versiones, dependencias y compromisos, las reglas normativas pendientes de validar, el stack y el reparto de trabajo.
