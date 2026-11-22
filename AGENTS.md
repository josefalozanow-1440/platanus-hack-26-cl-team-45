# Contexto para agentes

Estamos en las últimas horas de Platanus Hack 26. Lo único que importa es que lo que se muestra en el pitch funcione.

No hay legacy. Todo el código es de este fin de semana, no hay usuarios reales ni datos que proteger y nadie depende de una API antigua. No seas temeroso con los cambios:

- Reescribe, renombra, mueve o borra lo que estorbe. No dejes código muerto "por si acaso".
- Nunca escribas un parche para mantener algo que ya existe funcionando igual que antes. Si algo estorba, cámbialo de raíz y actualiza los llamados en el mismo commit.
- Nada de compatibilidad hacia atrás, flags de transición, shims, alias, deprecaciones ni migraciones que preserven datos. Si la base de datos estorba, se resetea y se vuelve a sembrar.
- No pidas permiso para refactors que te desbloquean. Hazlos y sigue.
- Prefiere lo que se termina esta noche antes que lo elegante.

Lo que sí se cuida, porque romperlo cuesta la demo o el trabajo de otros:

- `main` tiene que quedar funcionando después de cada push.
- Nada de `git push --force`, ni commitear `.env`, tokens o claves. El repo es público.
- No toques los archivos de la entrega: `README.md`, `platanus-hack-project.jsonc`, `project-description.md` y `project-logo.png`.
