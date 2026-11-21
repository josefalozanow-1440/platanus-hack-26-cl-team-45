# Handoff a ingeniería

Parte de [`product-state.md`](../product-state.md). Lista de lo que `engineering-state.md` tiene que traducir desde producto.

Lo que [`engineering-state.md`](../engineering-state.md) necesita traducir desde producto:

- Cómo se aplican L-01 a L-09 en el ejecutor, con una prueba por límite.
- Cómo se modelan los conceptos del producto: versiones inmutables, dependencias, revalidación, los cuatro estados de compromiso y las vistas por rol.
- Qué afirmaciones normativas (`A-`) se codifican como reglas y cómo se marca una regla pendiente de validar para que no dispare pagos, permisos ni alertas (L-08).
- La decisión de stack (P-02) y quién es responsable de cada pieza (P-03).
- Cómo se generan las dos conversaciones (técnica y simple) desde el mismo hecho sin perder la incertidumbre (D-16, L-12, L-13).
- Insumos ya propuestos en el canal para ese documento: el modelo de entidades del msg `1573746650609094728` y las condiciones del msg `1573746868121243821`. Una versión es inmutable solo si la cuenta de la aplicación no puede modificarla ni borrarla, y eso se prueba. Una copia derivada (por ejemplo, un grafo para el agente) solo expone hechos autorizados para quien consulta y nunca autoriza una acción; el ejecutor relee estado, permisos y versión en la fuente de verdad.
