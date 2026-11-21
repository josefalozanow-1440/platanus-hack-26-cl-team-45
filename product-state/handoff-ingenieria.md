# Handoff a ingeniería

Parte de [`product-state.md`](../product-state.md). Lista de lo que `engineering-state.md` tiene que traducir desde producto.

Desde D-19 la base es el Figma de lozi-love ([`figma-lozi.md`](figma-lozi.md)): «Copiloto de Carpeta», tres agentes (familia, comité y EP) sobre la misma carpeta, con el reglamento DS49 como regla por defecto y la resolución del llamado como capa que lo reemplaza. Lo que [`engineering-state.md`](../engineering-state.md) traduce ahora parte de las cuatro funciones del MVP, en este orden (Figma, frame 8).

## Primero: funciones del MVP

- **Función 6, estado para la familia (pantalla F3).** Traduce en qué etapa va el grupo y cuánto falta, en seis pasos: organización y carpetas, proyecto y terreno, revisión del SERVIU, llamado y selección, obra y recepción, escritura y entrega. Terreno, obra y entrega los gestionan otros: se muestra su avance, sin resolverlos. Registra el tiempo desde que existe el comité (A-21). Reglas: D-12, D-16, L-12, L-13, A-17, A-30.
- **Función 4, plazos y observaciones (E1 y E2).** Modelo de plazo con fuente, tipo de día (hábil o corrido) y capa del llamado sobre el reglamento (D-09, P-19). Cuenta regresiva de la revisión del SERVIU en sus tres escenarios (A-18). Después del subsidio: ahorro adicional, inicio de obras y vigencia (A-17, A-27). Cada observación separa a quién corresponde de quién la aceptó (L-05, L-14, P-25). No envía nada al SERVIU (D-07).
- **Función 4, plazos ambiguos.** Un plazo con regla pendiente (180 días del art. 12, P-21) no dispara alertas de incumplimiento (L-08). El ejecutor tiene que poder marcar la regla como pendiente y probarlo.
- **Función 2, semáforo del comité (pantallas C1, C2 y E3).** Estado por familia y documento sin mostrar contenido (L-06, P-24), con autorización de cada familia (N-24, P-17). Composición 70/30 del grupo (A-02). Renuncia y reemplazo con su plazo y requisitos (A-24), sin recomendar ni ejecutar exclusiones ni inventar el orden de una lista de espera (L-02, L-04, P-23).
- **Función 1, checklist de la familia por WhatsApp (pantallas F0, F1, F2 y F4).** Pide los documentos uno a uno (RSH, cédula, DJ49-1, DJ49-2, DJ49-3, ahorro, certificado de derechos en comunidad), revisa la firma de todos los adultos, ofrece ClaveÚnica y avisa antes de cada vencimiento y del corte del ahorro (A-28, A-31, A-32). Lista oficial pendiente (P-15). Falta definir el camino de quien no usa el agente (L-10, P-26).
- **Las cuatro funciones comparten la carpeta.** Un mismo hecho (un documento, una firma, una observación) alimenta la vista de la familia, la del comité y la de la EP, cada una con lo que puede ver (D-04, D-13, D-16).
- **Segunda etapa, no se traduce ahora:** funciones 5 (actas y asistencia), 3 (revisión previa de la carpeta) y 7 (puntaje del grupo). La 7 depende del tipo de llamado y de datos sensibles (P-19, P-22).

## Además

- Cómo se aplican L-01 a L-09, L-12 y L-13 en el ejecutor, con una prueba por límite. Los choques del Figma con un límite (P-22 a P-26) no se resuelven en código: el límite manda hasta que un humano decida.
- Cómo se modelan los conceptos del producto: versiones inmutables, dependencias, revalidación, los cuatro estados de compromiso y las vistas por rol.
- Qué afirmaciones normativas (`A-`) se codifican como reglas y cómo se marca una regla pendiente de validar para que no dispare pagos, permisos ni alertas (L-08). Las A-17 a A-36 salen del Figma.
- La decisión de stack (P-02) y quién es responsable de cada pieza (P-03).
- Cómo se generan las dos conversaciones (técnica y simple) desde el mismo hecho sin perder la incertidumbre (D-16, L-12, L-13).
- Insumos ya propuestos en el canal para ese documento: el modelo de entidades del msg `1573746650609094728` y las condiciones del msg `1573746868121243821`. Una versión es inmutable solo si la cuenta de la aplicación no puede modificarla ni borrarla, y eso se prueba. Una copia derivada (por ejemplo, un grafo para el agente) solo expone hechos autorizados para quien consulta y nunca autoriza una acción; el ejecutor relee estado, permisos y versión en la fuente de verdad.
