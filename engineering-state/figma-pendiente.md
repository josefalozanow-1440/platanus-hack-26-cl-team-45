# Figma MVP v2: qué está implementado y qué falta

Lista para retomar el trabajo después de implementar la página «MVP v2» del [Figma](https://www.figma.com/design/72h9M4fZorEGnm3oEnrorh/Proyecto-Subsidio?node-id=19-2) (orden de Golazo por terminal, 2026-11-21). Las capturas de cada frame están en [`docs/figma/`](../docs/figma/). Para comparar una pantalla con su captura: `cd web && node shot.mjs <ruta> <ancho> <salida.png>`.

## Pantallas

«Con API» lee datos reales del backend. «Cascarón» se ve como el Figma, pero sus datos están fijos en un `data.ts` y sus botones no guardan nada.

| Frame | Ruta | Estado |
| --- | --- | --- |
| F0 · Quién ve tu carpeta | `/familia/privacidad` | Con API |
| F1 · Folio por chat | `/familia/chat` | Con API |
| F2 · Mi carpeta | `/familia/carpeta` | Con API |
| F3 · Cómo va tu grupo | `/familia/grupo` | Con API |
| F4 · Firma con ClaveÚnica | `/familia/firma` | Con API |
| F5 · Firma lista | `/familia/firma/lista` | Cascarón |
| F6 · Cambió el llamado | `/familia/llamado` | Cascarón |
| B1 · Te toca | `/familia/te-toca` | Cascarón |
| I1 · Invitar a firmar | `/familia/invitar` | Cascarón |
| I2 · Pedro abre la invitación | `/familia/invitacion` | Cascarón |
| A1 · Asamblea | `/comite/asamblea` | Cascarón |
| C1 · Carpetas del grupo | `/comite/carpetas` | Con API |
| C1b · Después de la firma | `/comite/carpetas/despues` | Cascarón |
| C2 · Renuncia y reemplazo | `/comite/reemplazo` | Con API |
| C3 · Folio de la directiva | `/comite/folio` | Cascarón |
| E1 · Panel de grupos | `/ep/panel` | Con API |
| E2 · Observaciones | `/ep/observaciones` | Con API |
| E2b · Observaciones después de la firma | `/ep/observaciones/despues` | Cascarón |
| E3 · Carpeta del grupo | `/ep/carpeta/villa-nueva` | Con API |
| E4 · Carpetas del grupo + Folio | `/ep/carpetas` | Cascarón |
| E5 · Folio leyó el llamado | `/autogestionado/llamado` | Cascarón |
| E5b · Reglas aplicadas | `/autogestionado/llamado/aplicadas` | Cascarón |

El frame «Componentes v2» es el design system: vive en `web/src/components/ui.tsx`, `folio.tsx` y `sidebar.tsx`, con los tokens en `web/src/app/globals.css`.

## Falta en todo el producto

- WhatsApp no envía nada. «Enviar por WhatsApp» y «Enviar por SMS» (I1), «Recordar» (C1, E3, E4) y «Sí, recuérdales» (C3) no llaman a Kapso. Se pivotea después (orden de Golazo).
- ClaveÚnica es simulada: F4 marca la firma en la base, sin pasar por el sitio de ClaveÚnica.
- La invitación (I1, I2) no existe en el backend: no hay enlace con vencimiento, ni QR real, ni estado «abrió el enlace».
- Las asambleas y los votos (A1, B1) no existen en el backend: no hay quórum, cierre ni acta.
- Las menciones y la bandeja «Te toca» (B1) no existen en el backend.
- El llamado especial (F6, E5, E5b) no existe en el backend: Folio no lee resoluciones ni recalcula plazos. Res. Ex. 1.150 es un dato del Figma sin verificar; no usarlo en el pitch como cifra real sin revisarlo (ver `product-state/afirmaciones.md`).
- Los estados «después de la firma» (C1b, E2b, F5) son rutas con datos fijos. Falta que C1, E2 y F5 lleguen a ese estado solos cuando Pedro firma en F4.
- El chat de Folio para la directiva (C3) y para la EP (E4) no conversa: es una conversación fija.
- En la barra lateral de la EP y del comité autogestionado, «Actas y asistencia», «Plazos», «Grupo», «Carpetas» y «Asambleas» no tienen pantalla en el Figma ni en la app.
- Responsive: ninguna pantalla se desborda a 390 ni a 1440 px, pero en escritorio las pantallas de familia y comité siguen en una sola columna centrada (con barra lateral). Falta decidir si alguna merece dos columnas. El Figma no trae diseño de escritorio para ellas ni de celular para las de la EP.
- La barra lateral de familia y comité en escritorio no está en el Figma: es decisión de golazo#44 para que no se vea «celular dentro del computador» (orden de Golazo).
- No hay login ni roles: la home deja entrar a cualquier pantalla.
- El comité autogestionado (Las Araucarias, familia Gómez) no está en el seed.
- `product-state/figma-lozi.md` transcribe solo los 10 frames antiguos. Falta transcribir los 12 nuevos y cruzarlos con los límites `L-`.
- Sigue pendiente lo de la sección «Pendiente» de `engineering-state.md` (ejecutor de límites, L-08, fechas que no cuadran, ítems en «Propuesta»).

## Falta por pantalla

Lo que reportó cada subagente al implementar su pantalla (golazo#44-1 a golazo#44-6).

- A1: toda la pantalla usa datos fijos (asamblea/data.ts); la API no tiene asambleas ni votos
- A1: «Confirmar mi voto» solo muestra «Tu voto quedó registrado: <opción>» en estado local; no guarda nada y los resultados y la participación no cambian
- A1: el mensaje de confirmación no existe en el Figma; lo puse sobre la tarjeta de Participación
- A1: «Ver planos de la opción B» es un botón sin acción
- A1: los radios son los nativos con accent-color, el círculo se ve algo distinto al del Figma (ahí el seleccionado es un punto relleno)
- A1: ninguna pantalla enlaza todavía a /comite/asamblea
- B1: toda la pantalla es dato fijo (te-toca/data.ts)
- B1: las pestañas «Te toca / Menciones / Todo» no filtran nada
- B1: «Votar» enlaza a /comite/asamblea, que no existe en mi grupo; depende de que otro agente la cree
- B1: «Cómo depositar» lleva a /familia/chat (decisión mía, el Figma no dice a dónde va)
- B1: «Sí, el jueves» y «Otro día» son botones sin acción
- B1: FamilyNav marca «Te toca» como pide el brief; en el Figma aparece marcada «Carpeta»
- C1: saqué la tarjeta «Composición del grupo» (art. 1) porque no está en el Figma; el dato sigue llegando de la API y ya no se muestra en ninguna pantalla del comité
- C1: el orden y los colores de las carpetas con faltantes dependen del orden de la API (Pérez, Rojas, Herrera, Castro; Rojas sale verde). En el Figma el orden es Pérez, Herrera, Castro, Rojas y Rojas va en rojo
- C1: los textos de faltantes vienen de la API y difieren del Figma («Falta el mandato de ahorro (DJ49-3)», «Falta el RSH vigente» en vez de «Falta RSH actualizado»)
- C1: las tarjetas de carpeta no se montan tanto una sobre otra como en el Figma (eso lo define FolderCard compartido)
- C1b: cascarón con datos fijos en carpetas/despues/data.ts; no lee la API ni refleja la firma real de Pedro
- C1b: «Acompañar yo» y «Recordar» son botones sin acción
- C1b: el NowBanner compartido pone la etiqueta «Ahora · Pedro Rojas firmó» al lado del texto; en el Figma va arriba, en una línea propia
- C1b: nada enlaza todavía a /comite/carpetas/despues desde otra pantalla
- C2: el detalle de la lista de espera dice «ahorro incompleto» o «ahorro listo» y no «ahorro 7 UF» como el Figma, porque L-06 prohíbe mostrar el monto y el e2e lo verifica
- C2: el efecto en la composición sale «29%: dentro del límite del 30%» según la API; el Figma dice «30%: justo en el límite»
- C2: «Carta de renuncia recibida» muestra la fecha de la API (19-11-2026); el Figma dice «hoy», que solo aparece si la renuncia es del día
- C2: el botón «Proponer a Familia Tapia en asamblea» sigue llamando a la API como antes y no navega a la asamblea
- C3: cascarón con conversación fija en folio/data.ts; el campo «Pregúntale al Folio» y «Enviar» no envían nada
- C3: «Sí, recuérdales» y «Lo hago yo» son botones sin acción
- C3: «Redacta el acta de la asamblea» enlaza a /comite/asamblea (carpeta de otro agente; no revisé que la ruta cargue) y «¿Qué pasa si alguien renuncia?» enlaza a /comite/reemplazo
- C3: «Faltan 113 días» y las fechas son texto fijo, no se calculan
- C3: los íconos de CheckItem compartido son cuadrados y en el Figma son redondos
- C3: nada enlaza todavía a /comite/folio desde otra pantalla
- E1: la espera promedio sale «3a 10m» (la API da 46 meses) y el Figma dice «3a 4m»
- E1: Los Aromos muestra dos plazos (observaciones y corte del ahorro) porque la API manda los dos; el Figma muestra solo el de observaciones
- E1: los plazos salen con un formato único («52 de 58 días hábiles · vence 05-02-2027»); el Figma redacta cada fila distinto («57 días hábiles», «calificación antes del 14-03-2027», «Inicio de obras: quedan 31 de 90 días» más la nota del permiso DOM)
- E1: bajo las carpetas sale «4 con faltantes · 2 por vencer» y «12 con faltantes · 2 por vencer» según la API; el Figma dice «2 por vencer el 31-12» y «14 con faltantes»
- E1: en el plazo crítico de Villa Nueva sale la nota de la API («Si el proyecto no se ingresa antes del 28-12-2026...») y no «Proyecto en preparación (art. 12): si se vence, se borra»
- E1: el pie dice «Folio los sigue» en vez de «el copiloto los sigue» del Figma, por el cambio de nombre
- E2: la API da 52 días hábiles de 58; el Figma dice 57 de 60
- E2: «Preparar respuesta única» es un botón sin acción
- E2: «Editar» y «Descartar» del borrador son botones sin acción; «Aceptar» sí llama a la API
- E2: las fuentes del borrador («art. 3 h D.S. 49» y «art. 13») son dato fijo, la API no las entrega
- E2: «En este expediente ahora» (Carla Ibáñez, Jorge Lagos, Valentina Soto) es dato fijo, la API no tiene presencia
- E2: el título dentro de la FolioCard repite la descripción de la observación; el Figma trae un título corto («Familia Rojas: falta firma de un integrante mayor de 18») que la API no entrega
- E2: la nota de la observación 3 sale en un solo párrafo; en el Figma la última oración («Valentina (comité) se ofreció...») va en verde en otra línea. La vista ya acepta un campo `follow_up` para eso, pero la API no lo manda
- E2: la API dice «Arquitecta» y el borrador aceptado sale con el texto de la API; el Figma dice «Arquitecto»
- E2: el mensaje a las familias de la API no trae la última frase del Figma («1 es de tu familia.»)
- E2: las etiquetas de los tres escenarios salen del color del tono (Callout) y en monoespaciada; en el Figma son grises
- E2: el texto bajo los botones dice «Folio arma el paquete» en vez de «El copiloto arma el paquete»
- E2b: cascarón con datos fijos en despues/data.ts, no lee la API ni cambia cuando Pedro firma de verdad
- E2b: «Descargar respuesta» baja la respuesta real de Los Aromos desde la API (hoy con 2 de 3), no la de los datos fijos
- E2b: «Preparar respuesta única» es un botón sin acción
- E2b: nada enlaza a /ep/observaciones/despues todavía; se entra por la URL
- E3: el subtítulo dice «organización» (etapa de la API); el Figma dice «proyecto en preparación»
- E3: la tabla muestra las 32 familias en el orden de la API; el Figma muestra 7 en orden alfabético
- E3: la próxima asamblea sale «28-11-2026 · Asamblea: aprobación del plan social. Asistencia mínima: 70% con acta firmada.» según la API; el Figma dice «Sábado 30-11 · ... (Res. 1.875)»
- E3: el enlace «Carpetas» de la Sidebar apunta a /ep/carpetas (otro grupo); /ep/carpeta/villa-nueva se abre desde el panel
- E4: toda la pantalla usa datos fijos (ep/carpetas/data.ts): grupo Los Aromos, 6 familias, conteos de los chips y la conversación con Folio. No lee de la API.
- E4: «Recordar a las 6» es un botón sin acción.
- E4: el buscador y los chips (Todas, Falta, Por vencer, Listas) no filtran.
- E4: las tarjetas de familia no llevan a ninguna parte y la selección de Familia Rojas es fija.
- E4: las pestañas Info y Actividad, las sugerencias («Recordar a las 3 con faltantes», «Redactar acta de la asamblea», «¿Qué dice el art. 13?») y «Enviar» no hacen nada.
- E4: Bubble compartido es blanco y no se ve sobre el panel blanco; lo teñí desde folio-panel.tsx con un selector de Tailwind. Falta una variante en components/folio.tsx.
- E4: la nota «34 de 40 listas» sale en el tono aviso de FolioFooter; en el Figma es tinta oscura.
- E4: el panel de Folio llega al borde con márgenes negativos sobre el padding del <main> de ep/layout.tsx; si cambia ese padding hay que ajustar la página.
- E4: el ítem Carpetas de la Sidebar de EP ya apunta a /ep/carpetas con match /ep/carpeta (no lo toqué).
- E5: las 9 reglas, el resumen y la página escaneada son datos fijos (autogestionado/llamado/data.ts). La página escaneada es un dibujo con divs.
- E5: «Aceptar», «Editar» y «Revisar después» son botones sin acción.
- E5: «Aplicar 9 reglas a las 38 familias» solo navega a E5b, no aplica nada.
- E5: en la Sidebar, Grupo, Carpetas, Asambleas y Plazos van sin href porque no tienen pantalla.
- E5b: el camino del grupo, lo que hizo Folio y a quién le cambia algo son datos fijos (aplicadas/data.ts).
- E5b: «Ir a las carpetas» es un botón sin acción porque no existe pantalla de carpetas del comité autogestionado.
- E5b: se puede entrar directo a la ruta sin pasar por E5; no hay estado de reglas aplicadas.
- F0: en el ancho de 390 px el detalle «Tú decides qué ve cada uno» se parte en dos líneas dentro de FolderCard (en el Figma cabe en una); habría que ajustar el componente compartido
- F1: el botón «Foto» no hace nada; el texto se envía con Enter porque el Figma no tiene botón «Enviar»
- F1: el chat parte sin «Mándaselo, porfa» ni la tarjeta «Plazo»; aparecen al apretar «Enviar enlace a Pedro» (comportamiento que ya tenía). El Figma muestra la conversación completa
- F1: «Enviar enlace a Pedro» sigue sin enviar nada de verdad, solo agrega los mensajes al chat
- F1: el informe lista los 7 documentos de la API y el Figma muestra 5; el texto queda «Núcleo familiar: falta firma» (Figma: «falta firma de Pedro») y «Ahorro mínimo 10 UF: faltan 0,5 UF» (Figma: «Ahorro: faltan 0,5 UF»)
- F1: las caras AM, VS y JL de la franja «34 de 40 familias» son dato fijo (GROUP_FACES en grupo/people.tsx); la API no entrega qué familias completaron
- F1: la respuesta a un mensaje escrito sigue fija («Lo reviso y te respondo por aquí en un rato.»)
- F2: los chips (Todos, Falta, Vence, Listos) muestran los conteos de la API pero no filtran la lista
- F2: los cuadritos de «Tu comité» tienen colores fijos en el front; la API no entrega el estado de las otras carpetas
- F2: el avatar de la dirigente sale «V» y no «VS» porque la API manda solo el nombre de pila en companion_name
- F2: la API todavía llama «Copiloto» al agente en others_access; el front lo muestra como «F» (Folio) comparando por ese nombre, así que si la API lo renombra hay que actualizar ACCESS_COLORS en carpeta/page.tsx
- F2: se muestran los 7 documentos de la API (el Figma tiene 6); el séptimo, COM, y DJ2 y DJ3 van con insignia neutra
- F2: en la captura de página completa la barra de navegación (sticky, de familia/ui.tsx) queda encima de la lista; en el teléfono va pegada abajo como en el Figma
- F2: «Enviar enlace a Pedro» apunta a /familia/invitar, que es de otro grupo; no revisé esa pantalla
- F3: la API todavía llama «Copiloto» al agente en la actividad; el front lo cambia a «Folio» y le pone la marca F y «· agente del grupo». Falta renombrarlo en la API
- F3: el color de las iniciales de la actividad es un mapa fijo en el front (AM verde, VS amarillo, el resto azul); la API no entrega tono por actor
- F3: una actividad de la API viene con hora futura y sale «dentro de 148 min»; parece un problema de zona horaria en occurred_at (sin Z). No lo toqué porque es de api/
- F3: los días hábiles salen de la API (hoy 52) y el Figma muestra 57
- F3: no actualicé familia-grupo.spec.ts porque ningún texto que revisa cambió
- F4: sigue sin integración con ClaveÚnica; el botón registra la firma directo en la API y después navega a /familia/firma/lista
- F4: «Ahora no» sigue yendo a / (el Figma no define destino)
- F4: si Pedro ya firmó, /familia/firma muestra el estado anterior («Listo, ya firmaste» con «Deshacer firma (demo)»), que no está en el Figma; lo dejé para poder repetir la demo
- F4: no probé el clic de firmar de punta a punta, para no dejar la firma hecha en los datos que usan los otros specs
- F5: toda la pantalla usa datos fijos de data.ts (nombre, hora 10:41, avance 6 / 7, los tres cambios); no lee la API ni comprueba que la firma exista
- F5: el detalle «Solo falta completar el ahorro» también se parte en dos líneas dentro de FolderCard
- F5: el check del círculo verde es el carácter ✓ y no el ícono del Figma
- F6: toda la pantalla es dato fijo (llamado/data.ts), Familia Gómez del comité Las Araucarias
- F6: «Cómo completar mi ahorro» lleva a /familia/chat (decisión mía), y ese chat es el de la familia Rojas, no el de la familia Gómez
- F6: FamilyNav marca «Carpeta» igual que el Figma, y sus enlaces llevan a las pantallas de la familia Rojas
- F6: la cita la dejé como «Res. 1.150 · resuelvo 12.2»; en la captura la palabra se lee poco, conviene confirmarla contra el Figma
- I1: toda la pantalla usa datos fijos (invitar/data.ts); la API no tiene invitaciones
- I1: el QR es un dibujo decorativo (matriz seudoaleatoria fija con las tres esquinas), no es un QR válido ni se puede escanear, y su patrón no es idéntico al del Figma
- I1: «Enviar por WhatsApp» no envía nada
- I1: «Enviar por SMS» no envía nada
- I1: «Copiar» no copia el enlace
- I1: el enlace folio.cl/i/rojas-7K2 es texto fijo y no abre nada
- I1: el estado de la invitación es fijo (solo «Enlace creado» marcado)
- I1: ninguna pantalla enlaza todavía a /familia/invitar ni desde ahí a /familia/invitacion
- I2: toda la pantalla usa datos fijos (invitacion/data.ts), incluido el avance 5 / 7
- I2: el campo «¿Cómo te llamas?» se puede editar pero el nombre no se guarda ni se pasa a /familia/firma
- I2: el borde del campo de nombre es siempre azul (en el Figma parece ser el estado con foco)
- General: el prefijo «Comité » de los nombres se quita en el front con un replace en cada pantalla, porque la API lo manda y el Figma no lo muestra
- E5 y E5b: el subtítulo «Comité Las Araucarias · autogestionado» se corta en dos líneas en la Sidebar compartida; en el Figma va en una y se sale del ancho.
- E5 y E5b: no hay botón de escritorio en components/ui.tsx (BUTTON es de ancho completo); dejé ACTION en autogestionado/ui.tsx y las clases en línea en E4. Conviene subirlo a ui.tsx.
- General: en las capturas de página completa FamilyNav (sticky) queda encima del contenido; es del componente compartido y en el teléfono se ve bien al hacer scroll
