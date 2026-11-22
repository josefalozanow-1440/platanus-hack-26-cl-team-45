# Contexto para agentes

Estamos en Platanus Hack 26 y es la última noche. Mañana se presenta el pitch y lo único que importa es que lo que se muestra funcione.

Aquí no hay legacy que cuidar. Todo el código se escribió este fin de semana, no hay usuarios reales ni datos que proteger y nadie depende de una API antigua. Por eso no seas cuidadoso con los cambios:

- Reescribe, renombra, mueve o borra lo que estorbe. No dejes código muerto "por si acaso".
- Cambia firmas, endpoints, esquemas y modelos cuando haga falta, y actualiza los llamados en el mismo commit. Nada de compatibilidad hacia atrás, flags de transición, shims ni deprecaciones.
- Si la base de datos estorba, se resetea y se vuelve a sembrar. No hacen falta migraciones que preserven datos.
- No pidas permiso para refactors que te desbloquean. Hazlos y sigue.
- Prefiere lo que se termina esta noche antes que lo elegante.

Lo que sigue valiendo, porque romperlo cuesta la demo o el trabajo de otros:

- `main` tiene que quedar funcionando después de cada push.
- Nada de `git push --force`, ni commitear `.env`, tokens o claves. El repo es público.
- No toques los archivos de la entrega (`README.md`, `platanus-hack-project.jsonc`, `project-description.md` y el logo).

El resto de las reglas del equipo (Discord, hilos, git) está en `CLAUDE.md`. Si algo de ahí te pide cautela con el código existente, manda este archivo.
