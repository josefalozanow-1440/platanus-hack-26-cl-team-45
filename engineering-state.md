# Engineering state: Comité (DS49 colectivo)

Estado de ingeniería del proyecto del team-45 en Platanus Hack 26. Reúne cómo se construye lo que define `product-state.md`: stack, arquitectura, integraciones y riesgos técnicos, con el estado de cada ítem.

| Campo | Valor |
| --- | --- |
| Última actualización | 2026-11-21 |
| Documento hermano | `product-state.md` (qué se construye y por qué) |
| Fuentes | Canal de Discord `#deficit-habitacional` (ID `1573732246786015383`) y documentación pública de Kapso (ver "Fuentes") |

## Cómo usar este documento (agentes)

- Lee antes `product-state.md`. Si este documento choca con él en alcance o límites, manda `product-state.md`.
- Cita los IDs de producto (`D-`, `L-`, `A-`, `P-`, `X-`) en vez de copiar su texto. Los ítems propios de este documento usan `E-` (decisiones y propuestas de ingeniería) y `R-` (restricciones y riesgos técnicos).
- El estado de cada ítem manda. Una propuesta no es una decisión: no construyas sobre ella sin que una persona del equipo la confirme.
- Si vas a construir algo que no está cubierto aquí, regístralo como propuesta `E-` y avisa al equipo en `#ingenieria`.

Los estados son los mismos de `product-state.md`: Decidido, Decisión de trabajo, Propuesta, En pausa y Descartado.

## Estado en una frase

No hay stack decidido ni código (P-02, D-15). La pieza central es el ejecutor en código que valida contrato, quórum y límites duros antes de cualquier acción (L-01). Kapso está propuesto como canal de WhatsApp, pero ese canal está en pausa en producto (X-08), así que no entra al camino crítico hasta que producto lo reactive.

## Decisiones y propuestas de ingeniería

| ID | Ítem | Estado | Fuente |
| --- | --- | --- | --- |
| E-01 | Stack: Next.js + Supabase + Claude con tool use. Postgres como única fuente de verdad; un grafo solo como copia derivada de solo lectura. | Propuesta (ver D-15) | msgs `1573734184588157009`, `1573746644799725793`, `1573746868121243821` |
| E-02 | Kapso como canal de WhatsApp para familias y actores, conectado por webhook al servidor del equipo. Detalle en "Integración: Kapso". | Propuesta, bloqueada por X-08 | Este documento |

## Integración: Kapso (canal de WhatsApp)

### Qué es

Kapso es una startup chilena que ofrece infraestructura sobre la API oficial de WhatsApp Business de Meta. Según su documentación tiene:

- acceso a la API de WhatsApp y una bandeja compartida para que un equipo atienda conversaciones;
- mensajes masivos;
- workflows: grafos de nodos que normalmente parten con un mensaje entrante, con nodos para enviar mensajes o botones, esperar la respuesta, decidir con IA o con lógica propia, conversar con un agente que usa herramientas y pasar la conversación a una persona;
- webhooks y funciones serverless en JavaScript;
- enlaces de configuración para que otras organizaciones conecten su propio número;
- un servidor MCP y una CLI, para que los agentes de código la operen;
- un plan gratuito con un número ya verificado, sin comprar uno ni esperar la verificación por SMS.

### Rol en la arquitectura

Kapso es el canal, no el lugar de las reglas. Recibe y envía mensajes; todo lo demás vive en el servidor del equipo.

- Kapso entrega cada mensaje entrante por webhook al servidor del equipo.
- El ejecutor valida contrato, quórum y límites duros antes de cambiar cualquier estado (L-01). Las actas siguen siendo append-only en la fuente de verdad (L-07).
- Si se usa el nodo de agente de Kapso, sus herramientas solo consultan estado y proponen o aceptan compromisos. No existe una herramienta para excluir a una familia (L-02).
- Por WhatsApp viajan estados, no contenidos: "ahorro ok", nunca el monto ni la cartola (L-06).

### Usos propuestos

| Uso | Cómo funciona | Ítems de producto |
| --- | --- | --- |
| Consulta de la familia | La familia pregunta "¿en qué va mi proyecto?" y recibe la respuesta en lenguaje simple, solo con lo que su vista permite. Si nadie tomó un paso, la respuesta lo dice. | D-13, D-16, L-13 |
| Aviso de cambios | Cuando un compromiso cambia de estado, las familias reciben qué cambió y si tienen que hacer algo, sin adjuntos internos. | D-13, D-16 |
| Aceptar una gestión | La persona de la EP o de la dirigencia recibe un botón "Acepto / No puedo". Si nadie acepta en el plazo, el compromiso queda "sin cobertura". | D-06, L-05 |
| Registrar evidencia | Quien cumple manda una foto o un documento y el compromiso pasa a "cumplido con evidencia". La evidencia de una consulta enviada no marca un permiso como aprobado. | D-06, D-07 |
| Aprobación del proyecto | Se consulta a cada familia por separado y se guarda el registro. Un "ya entendí" no cuenta como aprobación, y la unanimidad no baja a mayoría por configuración. | L-09, L-12, A-03 |
| Paso a una persona | Si la familia se traba o no maneja la tecnología, la conversación pasa a la dirigencia o a la EP en la bandeja compartida. | L-10 |
| Número por EP | Cada EP conecta su propio número con los enlaces de configuración de Kapso. Que la EP sea quien paga es una inferencia, no un dato. | D-10 |

### Restricciones y riesgos

| ID | Restricción o riesgo | Consecuencia | Estado |
| --- | --- | --- | --- |
| R-01 | Los formularios dentro de WhatsApp (WhatsApp Flows) exigen un portafolio de empresa verificado en Meta. | Usar botones y preguntas simples; no depender de Flows en la hackatón. | Con fuente (docs de Kapso) |
| R-02 | Escribirle a alguien que no ha escrito en las últimas 24 horas requiere plantillas aprobadas por Meta, que cobra por mensaje. | Afecta a los avisos de cambios. Hay que diseñar las plantillas y prever su aprobación. | Por verificar en las docs de Kapso; viene del funcionamiento general de la API de WhatsApp |
| R-03 | Los datos sensibles (RSH, montos de ahorro, cédulas) pasarían por Meta y Kapso. | No enviarlos por WhatsApp; solo estados (L-06). | Decidido por L-06 |
| R-04 | Mensajes masivos o automáticos al SERVIU o a la DOM repetirían el escenario de saturación que el equipo quiere evitar. | Kapso no se usa para escribirles en masa. Una gestión abierta por asunto y destinatario (L-03). | Decidido por L-03 |
| R-05 | No está verificado cómo recibe Kapso imágenes y documentos ni sus límites de tamaño. | Verificar antes de construir el uso "Registrar evidencia". | Por verificar |
| R-06 | Que las familias DS49 usen WhatsApp como canal principal es una hipótesis. | Preguntarlo en las entrevistas de D-18 y P-10. | Por verificar |
| R-07 | El canal WhatsApp está en pausa en producto (X-08). | Nada de esta sección entra al camino crítico hasta que producto lo reactive. | En pausa |

### Primera prueba (cuando producto reactive X-08)

Conectar el número gratuito de Kapso y armar un solo workflow: se propone un compromiso, se ofrece por WhatsApp a una persona, la persona acepta o no, el ejecutor registra el estado y avisa a las familias. Con eso se prueba el ciclo propuesto, aceptado y sin cobertura de punta a punta (D-06, L-05).

### Fuentes

- [Kapso, introducción](https://docs.kapso.ai/docs/introduction.md)
- [Kapso, workflows](https://docs.kapso.ai/docs/workflows/introduction.md)
- [Kapso, WhatsApp Flows](https://docs.kapso.ai/docs/whatsapp/flows/overview.md)
- [Kapso, agentes de IA en WhatsApp](https://kapso.ai/whatsapp-ai-agent)
- [Kapso, preguntas frecuentes de precios](https://docs.kapso.ai/docs/whatsapp/pricing-faq)

## Pendiente para este documento

La lista de lo que ingeniería debe traducir desde producto está en "Handoff a ingeniería" de `product-state.md`: el ejecutor con una prueba por límite, el modelo de versiones, dependencias y compromisos, las reglas normativas pendientes de validar, el stack y el reparto de trabajo.

## Registro de cambios

| Fecha | Cambio | Fuente |
| --- | --- | --- |
| 2026-11-21 | Versión inicial: estado del stack (E-01) y propuesta de Kapso como canal de WhatsApp (E-02, R-01 a R-07). | Discord `#deficit-habitacional` y docs de Kapso |
