# Integración: Kapso (canal de WhatsApp)

Parte de [`engineering-state.md`](../engineering-state.md). Léelo si tu tarea toca WhatsApp, mensajes a familias o actores, o la demo. Incluye las restricciones R-01 a R-07 y R-14.

Alineado con D-19 (Figma, función 1 y pantalla F1): el checklist de la familia va por WhatsApp. El copiloto pide los documentos uno a uno, acepta foto del documento, manda a los otros adultos el enlace para firmar con ClaveÚnica y avisa antes de cada vencimiento y del corte del ahorro. Ajuste de kaina#62-3, 2026-11-21.

## Qué es

Kapso es una startup chilena que ofrece infraestructura sobre la API oficial de WhatsApp Business de Meta. Según su documentación tiene:

- acceso a la API de WhatsApp y una bandeja compartida para que un equipo atienda conversaciones;
- mensajes masivos;
- workflows: grafos de nodos que normalmente parten con un mensaje entrante, con nodos para enviar mensajes o botones, esperar la respuesta, decidir con IA o con lógica propia, conversar con un agente que usa herramientas y pasar la conversación a una persona;
- webhooks y funciones serverless en JavaScript;
- enlaces de configuración para que otras organizaciones conecten su propio número;
- un servidor MCP y una CLI, para que los agentes de código la operen;
- un plan gratuito con un número ya verificado, sin comprar uno ni esperar la verificación por SMS.

## Rol en la arquitectura

Kapso es el canal, no el lugar de las reglas. Recibe y envía mensajes; todo lo demás vive en el servidor del equipo.

- Kapso entrega cada mensaje entrante por webhook al servidor del equipo.
- El ejecutor valida contrato, quórum y límites duros antes de cambiar cualquier estado (L-01). Las actas siguen siendo append-only en la fuente de verdad (L-07).
- Si se usa el nodo de agente de Kapso, sus herramientas solo consultan estado y proponen o aceptan compromisos. No existe una herramienta para excluir a una familia (L-02).
- Por WhatsApp viajan estados, no contenidos: "ahorro ok", nunca el monto ni la cartola (L-06). Alineado con D-19 hay dos excepciones, solo en el chat de la propia familia: su saldo de ahorro (F1) y la foto que ella misma manda (R-14).

## Usos propuestos

| Uso | Cómo funciona | Ítems de producto |
| --- | --- | --- |
| Consulta de la familia | La familia pregunta "¿en qué va mi proyecto?" y recibe la respuesta en lenguaje simple, solo con lo que su vista permite. Si nadie tomó un paso, la respuesta lo dice. | D-13, D-16, L-13 |
| Aviso de cambios | Cuando un compromiso cambia de estado, las familias reciben qué cambió y si tienen que hacer algo, sin adjuntos internos. | D-13, D-16 |
| Aceptar una gestión | La persona de la EP o de la dirigencia recibe un botón "Acepto / No puedo". Si nadie acepta en el plazo, el compromiso queda "sin cobertura". | D-06, L-05 |
| Registrar evidencia | Quien cumple manda una foto o un documento y el compromiso pasa a "cumplido con evidencia". La evidencia de una consulta enviada no marca un permiso como aprobado. | D-06, D-07 |
| Aprobación del proyecto | Se consulta a cada familia por separado y se guarda el registro. Un "ya entendí" no cuenta como aprobación, y la unanimidad no baja a mayoría por configuración. | L-09, L-12, A-03 |
| Paso a una persona | Si la familia se traba o no maneja la tecnología, la conversación pasa a la dirigencia o a la EP en la bandeja compartida. | L-10 |
| Número por EP | Cada EP conecta su propio número con los enlaces de configuración de Kapso. El Figma dice que paga la EP (frame 7). | D-10, D-19 |
| Checklist de la familia | El copiloto le dice a la familia qué le falta, de a un documento, con botones «¿Cómo deposito?», «¿Qué es DJ49-1?» y «Ver mi carpeta». Alineado con D-19 (función 1, F1). | D-19, L-06 |
| Foto del documento | La familia manda la foto; el servidor la descarga apenas llega, la guarda en el bucket privado y el documento queda `recibido`, no `listo` (R-05, R-14). Alineado con D-19 (F1). | D-19, L-06 |
| Pedir la firma de otro adulto | Con «Mándaselo», el copiloto le manda a ese adulto el enlace para firmar con ClaveÚnica. Como ese adulto nunca le escribió al número, hace falta una plantilla aprobada (R-02). Un «ya firmé» escrito no firma nada. Alineado con D-19 (F1, F4). | L-12, D-19 |
| Recordatorios | Aviso antes del vencimiento de un documento (cédula, certificado de comunidad de 90 días) y del corte del ahorro. Salen del reloj de plazos, no de insistir (L-03). Alineado con D-19 (función 1). | L-03, L-08, D-19 |
| Observación de la familia | Cuando la EP asigna una observación a una familia, le llega con botones «Me encargo / No puedo» (T-08 en `redactor.md`). Alineado con D-19 (función 4, E2). | L-05, L-14, D-19 |

## Restricciones y riesgos

| ID | Restricción o riesgo | Consecuencia | Estado |
| --- | --- | --- | --- |
| R-01 | Los formularios dentro de WhatsApp (WhatsApp Flows) exigen un portafolio de empresa verificado en Meta. | Usar botones y preguntas simples; no depender de Flows en la hackatón. | Con fuente (docs de Kapso) |
| R-02 | Escribirle a alguien que no ha escrito en las últimas 24 horas requiere plantillas aprobadas por Meta, que cobra por mensaje. | Afecta a los avisos de cambios y, con D-19, a los recordatorios de vencimiento, al corte del ahorro y al enlace de firma para un adulto que nunca escribió. Hay que diseñar las plantillas y prever su aprobación. | Por verificar en las docs de Kapso; viene del funcionamiento general de la API de WhatsApp |
| R-03 | Los datos sensibles (RSH, montos de ahorro, cédulas) pasarían por Meta y Kapso. | No enviarlos por WhatsApp; solo estados (L-06). Con D-19 el Figma pone dos excepciones en el chat de la propia familia: su saldo (F1) y la foto que ella manda (R-14). Comité nunca envía documentos hacia afuera. | Decidido por L-06; las excepciones de D-19 esperan confirmación humana |
| R-04 | Mensajes masivos o automáticos al SERVIU o a la DOM repetirían el escenario de saturación que el equipo quiere evitar. | Kapso no se usa para escribirles en masa. Una gestión abierta por asunto y destinatario (L-03). | Decidido por L-03 |
| R-05 | No está verificado cómo recibe Kapso imágenes y documentos ni sus límites de tamaño. | Verificar antes de construir "Registrar evidencia" y "Foto del documento". Con D-19 está en el camino del MVP (función 1). | Por verificar |
| R-06 | Que las familias DS49 usen WhatsApp como canal principal es una hipótesis. | Preguntarlo en las entrevistas de D-18 y P-10. | Por verificar |
| R-07 | El canal WhatsApp está en pausa en producto (X-08). | Nada de este archivo entra al camino crítico hasta que producto lo reactive. | Resuelto por D-19: X-08 ya dice que WhatsApp entra como canal de la función 1. La vista regional sigue en pausa. |
| R-14 | La foto de un documento que manda la familia (cédula, cartola, RSH) pasa por Meta y Kapso, puede verla otra persona en un teléfono compartido (R-10) y es dato sensible con la Ley 21.719 (N-24). | Pedir el consentimiento de F0 antes de la primera foto. Descargarla apenas llega y no reenviarla nunca. Ofrecer también subirla desde la web. El copiloto puede leerla, pero el documento solo queda `listo` cuando lo revisa la EP. | Por verificar con el tema de datos personales |

## Primera prueba

Conectar el número gratuito de Kapso y armar un solo workflow: se propone un compromiso, se ofrece por WhatsApp a una persona, la persona acepta o no, el ejecutor registra el estado y avisa a las familias. Con eso se prueba el ciclo propuesto, aceptado y sin cobertura de punta a punta (D-06, L-05).

Alineado con D-19, la prueba que importa para el pitch es la de F1: Marta pregunta qué le falta, el copiloto responde las 2 cosas, Marta aprieta «Mándaselo», Pedro recibe el enlace y firma en F4 (ClaveÚnica simulada), y el semáforo del comité (C1) cambia en vivo. Usa el mismo ejecutor y sirve también para medir R-02 y R-05.

## Fuentes

- [Kapso, introducción](https://docs.kapso.ai/docs/introduction.md)
- [Kapso, workflows](https://docs.kapso.ai/docs/workflows/introduction.md)
- [Kapso, WhatsApp Flows](https://docs.kapso.ai/docs/whatsapp/flows/overview.md)
- [Kapso, agentes de IA en WhatsApp](https://kapso.ai/whatsapp-ai-agent)
- [Kapso, preguntas frecuentes de precios](https://docs.kapso.ai/docs/whatsapp/pricing-faq)
