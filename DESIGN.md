# DESIGN.md: estándar de visualización de Audem

Toda pantalla o gráfico de Audem sigue esto. Si algo nuevo no calza, se cambia este archivo primero.

## Dirección
**Instrumento de medición.** La pantalla se lee como una figura de paper: superficies neutras, un solo canal de color con significado, cada codificación tiene su clave y cada número tiene su n. Nada decorativo.

## Tipografía
- IBM Plex Sans para texto y títulos, IBM Plex Mono para números, n y notas de método (Google Fonts). No hay más familias.
- Escala modular 1.2 con base 16 px: 13 · 16 · 19 · 23 · 28 · 33 · 40 (`--t-1` … `--t5`). Nada bajo 13 px.
- Títulos de sección en minúscula normal (sentence case), nunca en mayúsculas.
- Números en mono con `tabular-nums`.

## Color
- **Tono** (positivo/neutro/negativo) es el único canal de color con datos. La emoción concreta va en texto, nunca en color.
  - Claro: pos `#2a78d6`, neu `#898781`, neg `#e34948`. Oscuro: pos `#3987e5`, neu `#b5b4ad`, neg `#e66767`.
  - Validados para daltonismo con el validador de dataviz (todos los pares, en ambos modos). El neutro gris es a propósito.
- El tono se deriva de la emoción con una lista cerrada (ver `POS`/`NEG` en `web/index.html`). Lo que no está en la lista cuenta como neutro.
- Neutros: tinta casi negra y fondo blanco roto, nunca #000 ni #fff puros. Modo oscuro diseñado aparte, con elevación por pasos de luminosidad y sin sombras.
- El color nunca va solo: siempre lo acompaña una etiqueta, una leyenda o un conteo.

## Codificaciones (siempre con clave visible)
| Marca | Canal | Significa |
|---|---|---|
| Punto | color | tono de la frase |
| Punto | tamaño (radio) | intensidad 0–1 |
| Círculo de tema | área | número de frases del tema |
| Anillo de tinta | presencia | una de las 2 frases más recientes (las mismas del panel «Lo último») |
| Nodo tema (vista Red) | número dentro | personas del tema; el nodo queda fijo en su celda de la grilla |
| Nodo persona (vista Red) | relleno | hueco = habló de un tema; lleno = une 2 o más temas |
| Línea (vista Red) | color | persona→frase en gris; frase→tema con el tono de la frase |
| Cinta (vista Flujo) | color · grosor | respuesta→frase en gris; frase→concepto con el tono y grosor por intensidad; concepto→tema en gris con grosor = n.º de frases |
| Píldora de concepto (vista Flujo) | tamaño de letra | n.º de frases que lo mencionan |
| Burbuja de tema (vista Flujo) | área · anillos | área = % de personas; un anillo concéntrico por persona (el centro queda más oscuro) |

- Porcentajes solo sobre el total de personas (como una encuesta), siempre con «Casos: n» al pie. Dentro de un tema se muestran conteos (`1 pos · 0 neu · 5 neg`): con n chico los porcentajes engañan.
- Personas ≠ frases. Una persona aporta 1 a 5 frases. Cada número dice cuál de las dos cuenta.
- Debajo de cada figura va una nota de método con el n total y cómo se agrupó.
- Datos sintéticos rotulados siempre con la etiqueta «Datos sintéticos».

## Dos vistas, mismos datos
- **Panel en vivo** (`web/index.html`): para la pantalla grande. Controlable con línea de tiempo, filtro de tono y detalle por tema. Dos vistas: **Red** (personas → frases → temas, con física; por defecto) y **Temas** (grilla de círculos, la más fácil de leer).
- **Flujo** (`web/flujo.html`): el camino completo en 4 columnas, respuestas → frases → conceptos → temas, con cintas curvas. Pasar el cursor por cualquier nodo ilumina todo lo que comparte frases con él. Los temas van ordenados por personas; el resto se ordena por baricentro para que las cintas se crucen poco.
- Los tokens y las reglas de tono son compartidos (`web/comun.css`, `web/comun.js`). Ninguna vista define sus propios colores.

## Layout y espaciado
- Base de 4 px: 4 · 8 · 12 · 16 · 24 · 32 · 48. Estrecho dentro de un grupo, amplio entre grupos.
- Contenedores con borde fino **o** con elevación, nunca las dos cosas a la vez. Radio de 12 px o menos. Sin bordes laterales de acento.
- En pantallas angostas el layout se apila; nunca se aplasta.

## Movimiento
- Solo `transform` y `opacity`, de 300 ms o menos, con ease-out. Nada pulsa ni se repite. Se respeta `prefers-reduced-motion`.
- Lo nuevo se marca con un estado estático (el anillo), no con una animación.
