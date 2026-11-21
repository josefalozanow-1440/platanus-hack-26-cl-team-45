# Problema

Parte de [`product-state.md`](../product-state.md). Léelo para entender el problema, la hipótesis de coordinación y qué la debilitaría.

**Hecho observado (por verificar en fuente original):** según el informe Vivienda 2035 de H&H Consultores, más de 118.000 subsidios DS49 están vigentes pero "no pagados", es decir, la familia tiene el subsidio y no tiene vivienda (A-05).

**Hipótesis del equipo:** una parte relevante de esa espera viene de la coordinación entre muchos actores que no ven la cadena completa: familias, dirigencia, entidad patrocinante (EP), constructora, SERVIU, DOM, notaría y Conservador, entre otros. Cada actor ve su etapa y nadie ve dónde está detenido el proyecto ni quién tiene el siguiente paso.

**Límite de la evidencia:** "no pagado" no equivale a "proyecto paralizado", y nada de lo revisado prueba que el problema sea de coordinación y no de plata. La frase "no faltó plata, faltó coordinación" no está respaldada y no se usa (A-07).

**Qué debilitaría la hipótesis:** si en un caso real el siguiente paso ya estaba claro para todos y lo que faltaba era financiamiento o una resolución externa, el problema no es de coordinación y otra pantalla no lo resuelve (msg `1573749162300809327`).

## Fallas del diseño actual (hipótesis)

Planteadas en el canal (msg `1573740151665074207`). Sirven para orientar el producto, pero falta contrastarlas con dirigentes y EP.

1. Las etapas avanzan en serie y cada una cierra con un certificado de un solo actor, aunque varias revisiones podrían ocurrir en paralelo.
2. La familia carga con el plazo de vigencia del subsidio, pero no controla ninguna de las etapas que lo consumen.
3. Los mismos datos y documentos se piden varias veces (RSH, cédula, ahorro al postular; permiso y recepción vuelven a juntarse para el pago final).
4. Cada observación devuelve el proyecto completo y reinicia la revisión.
5. Nadie ve la cadena completa. La Contraloría reportó falta de control y seguimiento del SERVIU y la SEREMI en Tarapacá.
