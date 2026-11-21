# Conceptos del producto

Parte de [`product-state.md`](../product-state.md). Léelo si vas a nombrar entidades, estados o textos de interfaz.

Vocabulario que producto usa con un significado fijo. Ingeniería decide cómo modelarlo.

| Concepto | Significado |
| --- | --- |
| Proyecto | Un proyecto DS49 CNT con su grupo de familias, su EP y los demás actores que intervienen. |
| Expediente vivo | El objeto compartido del proyecto. Reúne antecedentes, versiones, aprobaciones, compromisos y actas (D-04). |
| Versión | Estado inmutable del expediente sobre el que se da una aprobación (D-05). |
| Dependencia | Relación entre un paso y lo que necesita para empezar (requisitos de entrada) y para cerrarse (evidencia de salida) (D-08). |
| Compromiso o gestión | Un paso concreto con responsable y estado: propuesto, aceptado, cumplido con evidencia o sin cobertura (D-06). |
| Sin cobertura | Nadie aceptó el paso. No implica incumplimiento (D-06, L-05). |
| Evidencia | Lo que permite marcar un compromiso como cumplido. Una consulta enviada no es evidencia de un permiso (D-07). |
| Revalidación | Marca sobre una aprobación cuando cambió un antecedente del que dependía (D-05). |
| Hecho acreditado | Dato verificado de una familia o del proyecto, con vigencia y ámbito de uso (D-11, L-06). |
| Vista por rol | Lo que cada actor puede ver y aportar (D-13, L-06). Incluye el registro de la conversación: técnico o simple según el actor (D-16). |
| Hito | Logro verificable del proyecto (por ejemplo, permiso de edificación otorgado). Varios hitos pueden estar en curso a la vez (D-17). |
| Acta | Registro append-only de decisiones del grupo, incluido el disenso (L-07). |
| Plazo | Fecha o duración con fuente y ámbito. Puede ser regla normativa, plazo administrativo o demora observada (D-12). |
