# Conceptos del producto

Parte de [`product-state.md`](../product-state.md). Léelo si vas a nombrar entidades, estados o textos de interfaz.

Vocabulario que producto usa con un significado fijo. Ingeniería decide cómo modelarlo. Por D-19, los textos de interfaz usan las palabras del Figma («carpeta», «etapa», «observación», «respuesta única»).

| Concepto | Significado |
| --- | --- |
| Proyecto | Un proyecto DS49 colectivo CNT con su grupo de familias, su EP y los demás actores que intervienen. |
| Grupo | El comité: de 10 a 160 familias con personalidad jurídica (art. 7). Es la unidad que avanza, postula y se selecciona; su puntaje es el promedio de sus familias (Figma, frames 2 y 5). |
| Carpeta de la familia | Los papeles de una familia (RSH, cédula, DJ49-1, DJ49-2, DJ49-3, ahorro, certificado de derechos en comunidad) con su estado: listo, falta o vence (Figma, pantalla F2). |
| Carpeta del grupo | El objeto compartido del proceso. Se completa cuando cada familia completa la suya y cambia de forma: nómina y expediente del grupo, proyecto en preparación, postulación, proyecto calificado, grupo seleccionado, certificado de subsidio (D-04; Figma, frame 2). |
| Expediente vivo | Nombre anterior de la carpeta del grupo (D-04). No usarlo en interfaz. En el Figma, «expediente del grupo» es una de las formas que toma la carpeta. |
| Versión | Estado inmutable del expediente sobre el que se da una aprobación (D-05, Propuesta). |
| Dependencia | Relación entre un paso y lo que necesita para empezar y para cerrarse (D-08). En desuso: D-08 quedó reemplazada por las etapas y carriles del Figma. |
| Etapa | Una de las seis etapas del proceso, de la 0 a la 5: antes de la EP, organización de la demanda, proyecto y terreno, Banco y evaluación, llamado y selección, después del subsidio (Figma, frame 4). La familia ve la etapa actual del grupo, por ejemplo «Etapa 3 de 6» (pantalla F3). Ver [`recorrido.md`](recorrido.md). |
| Carril | Los pasos de un actor (familia, comité, EP o SERVIU) dentro del proceso. Los carriles avanzan en paralelo dentro de una etapa (Figma, frame 4). |
| Coordina / sigue | El agente coordina la carpeta, las observaciones, la postulación y las gestiones después del subsidio. Terreno, permisos, obra y pagos solo los sigue y avisa; no los resuelve (D-02; Figma, frame 1). |
| Copiloto | El agente de cada actor: uno para la familia, uno para el comité y uno para la EP, sobre la misma carpeta. El SERVIU no tiene (Figma, frame 7). |
| Semáforo | Estado de cada documento de una familia para el comité: listo, falta o vence, sin mostrar el contenido (función 2; D-13, L-06). |
| Observación | Reparo del SERVIU al proyecto en su evaluación. Se comunica solo a la EP (art. 13 inc. 3). El agente la asigna a quien corresponde (técnica, presupuesto o familias) y le dice a la familia si una es suya (función 4; pantallas E2 y F3). |
| Respuesta única | La corrección de todas las observaciones en un solo acto, como exige el art. 13. Tiene cuenta regresiva en tres escenarios: 60 días hábiles con rechazo facultativo, segunda ronda de 20+10, rechazo obligatorio (función 4). |
| Reemplazo | Entrada de una familia en lugar de otra que renunció. El reemplazante acredita requisitos y ahorro al ingresar; hay plazo hasta el día hábil anterior a la fecha máxima de calificación y un máximo de 20% después del subsidio (arts. 14, 20 y 57; pantalla C2). Lo aprueba la asamblea y lo ingresa la EP. |
| Acompañante | Integrante del grupo que se ofrece a ayudar a otra familia con su carpeta (pantallas F3, C1 y E2). |
| Tiempo de espera del grupo | Tiempo desde que existe el comité hasta hoy, por ejemplo «3 años y 4 meses». Ningún sistema lo registra y la herramienta lo hace (función 6, R6). No es prueba de culpa de nadie (D-12). |
| Reglamento base y llamado | El reglamento D.S. 49 es el valor por defecto; la resolución del llamado lo reemplaza donde corresponda (D-09; Figma, frames 1 y 7). |
| Compromiso o gestión | Un paso concreto con responsable y estado: propuesto, aceptado, cumplido con evidencia o sin cobertura (D-06). |
| Sin cobertura | Nadie aceptó el paso. No implica incumplimiento (D-06, L-05). |
| Evidencia | Lo que permite marcar un compromiso como cumplido. Una consulta enviada no es evidencia de un permiso (D-07). |
| Revalidación | Marca sobre una aprobación cuando cambió un antecedente del que dependía (D-05). |
| Hecho acreditado | Dato verificado de una familia o del proyecto, con vigencia y ámbito de uso (D-11, L-06). |
| Vista por rol | Lo que cada actor puede ver y aportar (D-13, L-06). Cada familia autoriza lo que ve el comité y activa sus datos sensibles (pantalla F0). Incluye el registro de la conversación: técnico o simple según el actor (D-16). |
| Hito | Logro verificable del proyecto (por ejemplo, permiso de edificación otorgado). Se definió para reemplazar la etapa actual (D-17), pero D-17 quedó reemplazada por D-19: el avance se muestra por etapa. |
| Acta | Registro append-only de decisiones del grupo, incluido el disenso (L-07). Lleva nombre, cédula y firma de los asistentes y la cuenta del 70% de asistencia (Res. 1.875; función 5). |
| Plazo | Fecha o duración con fuente y ámbito. Puede ser regla normativa, plazo administrativo o demora observada (D-12). Parte del reglamento base y lo reemplaza la resolución del llamado (D-09; Figma, frame 3). |
