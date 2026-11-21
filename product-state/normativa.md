# Mapa normativo del DS49 colectivo (N-)

Parte de [`product-state.md`](../product-state.md). Léelo cuando necesites saber qué ley, decreto o resolución rige una etapa, un documento o un actor.

Es un resumen de dominio a alto nivel. Golazo lo pidió en #steering (msg `1573780144248721510`). Golazo#44 y sus subagentes lo armaron con búsquedas en internet el 2026-11-21. Ninguna regla de aquí reemplaza una afirmación `A-`: antes de codificar una regla, verifica el artículo en el texto oficial y regístrala en [`afirmaciones.md`](afirmaciones.md). Todo lo marcado «por verificar» no se usa en producto ni en pitch.

Los links a LeyChile marcados con (id?) se armaron sin poder abrir la página; búscalos por número si fallan.

## Mapa rápido

| ID | Norma | Para qué nos sirve | Etapa | Actor principal |
| --- | --- | --- | --- | --- |
| N-01 | DS 49 de 2011, reglamento del Fondo Solidario de Elección de Vivienda | Todo el programa: subsidio, obra, garantías, pagos, reemplazos, sanciones | Todas | SERVIU, EP, constructora, familias |
| N-02 | Res. Ex. 1875 de 2015, asistencia técnica, jurídica y social | Qué hace y cobra la EP; fiscalización de obra (FTO o ITO) | Preparación a escrituración | EP, SERVIU, FTO |
| N-03 | Res. Ex. 685 de 2026, llamado CNT 2026 | Reglas del llamado vigente (D-09): montos, ahorro, cierres | Postulación, selección, financiamiento | MINVU, SERVIU, EP |
| N-04 | Res. Ex. 7712 y 7713 de 2017, cuadro normativo e itemizado técnico | Estándar mínimo de la vivienda y partidas de la obra | Diseño y obra | SERVIU, FTO, EP, constructora |
| N-05 | DS 22 de 2015 MDS, Registro Social de Hogares | Tramo socioeconómico que define subsidio y ahorro | Postulación y reemplazos | SERVIU, familias |
| N-10 | LGUC, DFL 458 de 1975 | Permiso de edificación y recepción definitiva, plazos de la DOM | Permiso, obra, recepción | DOM, EP, constructora |
| N-11 | OGUC, DS 47 de 1992 | Vivienda social y documentos de la recepción | Permiso y recepción | DOM, EP, constructora |
| N-12 | DFL 2 de 1959 | Categoría de vivienda económica | Diseño y permiso | EP, DOM |
| N-13 | Ley 20.958 y DS 30 de 2017 MTT | Impacto vial (IMIV) y aportes | Antes del permiso y recepción | EP, Tránsito, SEREMI MTT |
| N-14 | Ley 21.442 y DS 7 de 2025 | Copropiedad del condominio social | Recepción, entrega y después | Primer administrador, familias |
| N-15 | DFL 382 de 1988 y normas SEC | Factibilidad sanitaria, electricidad y gas | Postulación, permiso, recepción | EP, sanitaria, SEC |
| N-16 | Ley 21.450 | Plan de Emergencia Habitacional | Transversal | MINVU, SERVIU |
| N-17 | Ley 19.300 y DS 40 de 2012 | Si el proyecto entra al SEIA (casi nunca) | Antes del permiso | EP, SEA |
| N-20 | Ley 19.418 | Constitución y asambleas del comité de vivienda | Toda la vida del comité | Familias, directiva |
| N-21 | DFL 5 de 2003, cooperativas | Forma alternativa al comité | Toda la vida del grupo | Familias |
| N-22 | Ley 19.880 | Plazos de respuesta del SERVIU, silencio y recursos | Cualquier trámite ante el Estado | Todos frente al SERVIU |
| N-23 | Ley 20.285 | Pedir información pública | Cualquiera | Todos frente al Estado |
| N-24 | Leyes 19.628 y 21.719 | Datos personales de las familias en Comité | Transversal | Comité como responsable de datos |
| N-25 | Leyes 19.799 y 21.180 | Validez de actas y firmas digitales | Transversal | Familias, EP |
| N-26 | DS 1 de 2015 SEGPRES y Ley 20.422 | Accesibilidad digital | Transversal | Comité |

## Normas del programa

### N-01. DS 49 (V. y U.) de 2011, reglamento del Fondo Solidario de Elección de Vivienda

[Texto MINVU actualizado a julio de 2020](https://www.minvu.gob.cl/wp-content/uploads/2019/05/DS-49_FSEV-texto-DS-105_2014_23jul20.pdf). El DS 105 de 2014 reemplazó el texto, y lo modificaron el DS 22 de 2016 y el [DS 6 de 2024](https://www.bcn.cl/leychile/navegar?i=1202441). Regula todo el programa: quién postula, los subsidios, el ahorro, la obra, las garantías, los pagos y las sanciones. Lo aplica el SERVIU y lo cumplen la EP, la constructora y las familias. Por verificar: cambios posteriores a 2020 que no estén en ese texto.

El Figma dice que lo cotejó con BCN y que la única modificación posterior es el DS 6 de 2024, solo en el art. 27 (D-19, Figma, frame 1); falta confirmarlo (P-18).

- Art. 12: la EP tiene 180 días desde que entra la primera familia a un proyecto en preparación para ingresar los antecedentes; si se pasa, se borran del sistema. El Figma cita el inc. 3 y anota que el artículo no dice si son días hábiles o corridos (D-19, Figma, frames 3 y 9; P-21).
- Art. 14: un cambio que toque el estándar técnico o el cuadro normativo lo aprueban el SERVIU y las familias. Art. 50: el acta del diagnóstico participativo la firma la mayoría de los integrantes. Toca a D-05 y A-03.
- Diferencia con el Figma en el art. 14: el Figma lo cita para la permanencia en el Banco (3 procesos, +2) y para el plazo de reemplazo (inc. 3), no para cambios técnicos. Pueden ser incisos distintos del mismo artículo; no lo verificamos (D-19, Figma, frame 3).
- Diferencia con el Figma en el art. 50: el Figma lo cita para el diagnóstico participativo con acta y, para las reuniones, pide 70% de asistencia según la Res. 1.875 (N-02); aquí dice mayoría de firmas en el acta. Son reglas de instrumentos distintos y no se excluyen; no lo verificamos (D-19, Figma, frame 4).
- Art. 28: el certificado de subsidio dura 21 meses; art. 64: se prorroga 12 meses si ya se iniciaron las obras. Responde P-05. El Figma suma el art. 41, otros +12 si el proyecto fue eliminado y quedan menos de 12, y la prórroga del Director; también dice que el certificado sale en 15 días hábiles desde la publicación (A-17, A-26; D-19, Figma, frame 3).
- Art. 29: el contrato de construcción es tripartito entre el grupo, la EP y la constructora. Art. 30: boleta de fiel cumplimiento del 2,5% del contrato, vigente hasta 30 días después del término de obras, y boleta de buena ejecución del 2,5% por al menos un año tras la recepción.
- Art. 32: las obras se inician dentro de 90 días corridos desde que se publica la resolución que otorga el subsidio; el director del SERVIU puede prorrogarlo (art. 64 d).
- Art. 37: el ahorro adicional tiene 150 días corridos desde la resolución del subsidio. Según el Figma son 15 UF en el tramo 50–60%, 15 UF en 60–80% y 30 UF en 80–90% (A-27; D-19, Figma, frame 3).
- Arts. 69 y 71: los anticipos llegan hasta el total de los subsidios menos un 5%, con dos giros al mes como máximo. El primer giro exige contrato, hipoteca y prohibición a favor del SERVIU y boleta de garantía, y lo girado no puede superar el avance que informa el FTO más las garantías vigentes. Toca a D-07 y L-08.
- Art. 57: se puede reemplazar hasta el 20% de las familias beneficiadas, con carta de renuncia o acta de asamblea; el SEREMI puede autorizar más. El reemplazante debe estar en el mismo tramo de RSH y tener el ahorro listo. Toca a L-02. El Figma agrega el plazo antes de la selección: reemplazos hasta el día hábil anterior a la fecha máxima de calificación y ninguno durante la selección (arts. 14 inc. 3 y 20 inc. 5; A-24).
- Art. 60: la familia habita la vivienda 5 años desde la entrega y no puede venderla, gravarla ni cederla en ese plazo sin autorización escrita del SERVIU (10 años con densificación en altura). Art. 61: una infracción antes de aplicar el subsidio lleva a exclusión o caducidad; después, a devolver todo el subsidio. El Figma lo cita igual para la declaración falsa y lo usa en la función 7 (P-22).
- Otros artículos que cita el Figma (D-19, frames 2 a 4), sin cotejar aquí: art. 3 (documentos de la familia; letra f, certificado de derechos en comunidad de máximo 90 días, A-28; letra i, la familia responde por lo que declara); art. 7 (la EP organiza la demanda, postula e ingresa; los representantes del comité son integrantes y postulantes); art. 10 (los representantes firman el contrato de construcción).
- Más artículos del Figma: art. 13 (plazos de revisión del SERVIU y observaciones solo a la EP, A-18 y A-30; inc. 6, cambio de familias durante la corrección); art. 15 (calificación definitiva o condicional); art. 19 (terreno sobre la tasación en más de 10%, A-35); arts. 20 y 21 (llamados; en uno especial los plazos los fija su resolución, A-26 y A-36); arts. 22 a 26 (puntaje, selección y reclamos, A-34).
- Más artículos del Figma: arts. 39 a 41 (corte y giro del ahorro, A-31); arts. 51 y 53 a i (la EP debe informar a las familias, sin forma ni plazo, A-30); art. 52 (la responsabilidad de la EP se fija en el Convenio Marco con la SEREMI, P-15).

### N-02. Res. Ex. 1875 (V. y U.) de 2015, asistencia técnica, jurídica y social

[PDF MINVU](https://www.minvu.gob.cl/wp-content/uploads/2026/08/Res-Ex-1875-23-MAY-2015-Asistencia-Tecnica.pdf), [LeyChile](https://bcn.cl/3loay). La modificó la Res. 9866 de 2018. Fija qué servicios presta la EP, cuáles el SERVIU y cuáles la constructora, cuánto se paga por cada uno y cómo se fiscaliza la obra. Ya es la fuente de A-09.

Diferencia: el Figma da como última modificación la Res. Ex. 488 de 2023; no verificamos cuál es la vigente (D-19, Figma, frame 1; P-18).

- Art. 3: el SERVIU paga cada servicio de la EP contra el producto acreditado. Por verificar: los montos por tramo, que están en tablas en imagen.
- Art. 4 n°1 y 2: desde el acta de entrega de terreno toda obra tiene fiscalización técnica (FTO, lo que en el equipo llamamos ITO), hecha por el SERVIU directo o contratada.
- Art. 4 n°10: hay regímenes de visitas del FTO, desde residente hasta una vez cada 15 días, y todo queda en el Libro de Obras. El Libro de Obras es una fuente natural de evidencia del avance.
- Lo que cita el Figma (D-19, frames 4, 6 y 7): Art. 2° n°10, reuniones con 70% de asistencia y acta con nombre, cédula y firma (A-29); Art. 2° n°6, si falta una actividad ese servicio no se paga; cuadro 2.5, al menos 2 reuniones en que la EP verifica requisitos y sube documentos; Art. 3° n° 5.2.1 y 5.2.4, la EP cobra 50% del plan social y 50% de la gestión al seleccionarse el grupo (A-33).

### N-03. Res. Ex. 685 de 2026, llamado CNT 2026

[Página del llamado](https://www.minvu.gob.cl/postulacion/llamado-en-condiciones-especiales-del-ds49-para-construccion-en-nuevos-terrenos-para-todas-las-regiones-del-pais-2026/), [PDF](https://www.minvu.gob.cl/wp-content/uploads/2026/05/Res-Ex-685-V.-y-U.-05-05-2026-Llamado-Especial-Nacional-Colectivo-FSEV-CNT-2026.pdf). La modifican las resoluciones 900, 902, 2637 y 1212 de 2026. Es el llamado que manda según D-09. El PDF es escaneado y se leyó con OCR: compara cualquier cifra con el original antes de usarla.

- Resuelvo 3.4: ahorro mínimo de 10 UF para el tramo 40% y 15 UF del 50% al 90%. Por verificar cómo se combina con la tabla del art. 37 del DS49.
- Resuelvo 4.1 y 4.2 e: subsidio base de 550 UF, mayor en ciertas comunas, más un premio de 3,5 UF por cada UF de ahorro sobre el mínimo, con tope de 105 UF. No hay un tope único de subsidio.
- Resuelvo 4.8: anticipos en cuotas de hasta 10% del subsidio de construcción.
- Resuelvo 3.13 y 3.14: la EP no puede ser la constructora, y antes de iniciar obras verifica que la constructora tenga capacidad económica.
- Cierres según la página modificada: 28 de mayo, 1 de septiembre, 8 de octubre y 10 de diciembre de 2026.

### N-04. Res. Ex. 7712 y 7713 de 2017, cuadro normativo e itemizado técnico

[Cuadro normativo](https://www.minvu.gob.cl/wp-content/uploads/2019/05/Res_7712-16062017-Cuadro-Normativo.pdf), [itemizado técnico](https://www.minvu.gob.cl/wp-content/uploads/2019/05/Res_7713-16062017_Itemizado-Tecnico.pdf). Fijan el estándar mínimo de la vivienda (recintos, mobiliario, circulaciones) y las partidas de la obra. Los cumplen la EP y la constructora y los revisan el SERVIU y el FTO. Un cambio que los toque requiere aprobación de las familias (N-01, art. 14). Por verificar: los mínimos concretos y si los reemplazó un anexo técnico más nuevo.

### N-05. DS 22 de 2015 MDS, Registro Social de Hogares

[Referencia SUSESO](https://www.suseso.cl/612/w3-article-40081.html). Fija la calificación socioeconómica por tramos que el DS49 usa para definir subsidio y ahorro (DS49 arts. 34 y 37). El llamado 2026 llega hasta el tramo 90% y A-02 fija la mezcla del grupo. Según la Res. 685 (3.3), una familia que ya estaba en el Sistema de Información Territorial de la Demanda mantiene su tramo hasta 36 meses. Es un dato socioeconómico y por eso sensible según N-24.

El Figma cita además los Protocolos RSH (Res. Ex. SSS 04/2026, §V): el trámite toma 5 días hábiles, 20 con visita, y se desiste a los 20+10 días si faltan papeles; los adultos firman o validan con ClaveÚnica; la familia descarga su Cartola Hogar y un tercero solo la obtiene con poder notarial de máximo 6 meses (A-32; D-19, Figma, frames 4 y 7).

## Urbanismo y construcción

### N-10. Ley General de Urbanismo y Construcciones (LGUC), DFL 458 de 1975

[LeyChile](https://www.bcn.cl/leychile/navegar?idNorma=13560) (id?). Es la ley marco de permisos y recepciones de obras. La Ley 21.718 (D.O. 29-11-2024) acortó plazos; según la Circular DDU 525 esos cambios rigen desde el 30-05-2025. La usan la DOM, la EP o constructora que solicita, el revisor independiente y el SERVIU.

- Art. 118: la DOM tiene 30 días corridos para pronunciarse sobre el permiso de edificación, la mitad si hay informe favorable de revisor independiente, y 10 días tras cada reingreso de observaciones ([DDU 525](https://www.minvu.gob.cl/wp-content/uploads/2025/05/DDU-525-reemplaza-paginas-2-y-8vf.pdf)).
- Arts. 118 a 118 ter: el silencio de la DOM es negativo y no opera solo. Hay que pedir que se dé por rechazada la solicitud y desde ahí corren 30 días para reclamar ante la SEREMI MINVU.
- Art. 144: la recepción definitiva la piden el propietario y el arquitecto, con informe que certifica que la obra calza con el permiso. La DOM tiene 30 días (15 con revisor independiente, [DDU 284](https://www.minvu.gob.cl/wp-content/uploads/2019/06/DDU-284.pdf)). Si las observaciones no se subsanan en 60 días, se rechaza. Art. 145: no se puede habitar antes de la recepción.
- Por verificar: si el informe del ITO es requisito legal de la recepción o solo lo piden algunas DOM.

### N-11. Ordenanza General de Urbanismo y Construcciones (OGUC), DS 47 de 1992

[LeyChile](https://www.bcn.cl/leychile/navegar?idNorma=8201) (id?). Es el reglamento técnico de la LGUC: define vivienda económica y vivienda social y lista los documentos de cada trámite.

- Art. 6.1.2: vivienda económica es la de hasta 140 m²; vivienda social es una económica tasada en no más de 400 UF.
- Art. 6.1.8: conjuntos de viviendas económicas de hasta 4 pisos tienen normas urbanísticas más flexibles (densidad +25%).
- Art. 5.2.6: documentos de la recepción definitiva. Sirven como checklist del hito «recepción»: informe de control de calidad del constructor, certificados de agua potable y alcantarillado, de electricidad y gas (arts. 5.9.2 y 5.9.3), de telecomunicaciones, ensayes de hormigón, acreditación térmica, mitigaciones viales y aportes ejecutados o garantizados, y reposición de pavimentos.
- Por verificar: qué exige el art. 4.1.7 (accesibilidad universal) a las viviendas DS49.

### N-12. DFL 2 de 1959, viviendas económicas

Crea la categoría de vivienda económica que reglamenta el Título 6 de la OGUC. La vivienda DS49 cae ahí (hasta 140 m²). Por verificar: link oficial y qué beneficios tributarios aplican.

### N-13. Ley 20.958 de aportes al espacio público e IMIV

[LeyChile](https://www.bcn.cl/leychile/navegar?idNorma=1095541). Todo proyecto mitiga su impacto vial o hace un aporte. El estudio de impacto vial (IMIV, reglamento DS 30 de 2017 del MTT) se aprueba antes del permiso y su mitigación se acredita en la recepción. Actores: EP, Dirección de Tránsito y SEREMI de Transportes.

- Por verificar (sale de una presentación, no del decreto): la categoría depende del flujo en hora punta. Bajo 20 vehículos por hora el proyecto está exento; el IMIV básico lo revisa la municipalidad en 85 días y el intermedio o mayor la SEREMI en 120.
- No encontramos exención para vivienda social.

### N-14. Ley 21.442 de copropiedad inmobiliaria y su reglamento (DS 7 de 2025 MINVU)

[Ley](https://www.bcn.cl/leychile/navegar?idNorma=1174663), [reglamento](https://www.bcn.cl/leychile/navegar?idNorma=1210089). Regula los condominios. El Título XII trata los condominios de viviendas de interés público y el art. 66 N°2 nombra los financiados con DS49. Toca el tramo desde la recepción hasta la entrega y la vida en el condominio.

- Art. 9: tras la recepción definitiva y antes de que llegue el primer copropietario, se designa un primer administrador, que levanta un acta del estado de los bienes comunes y recibe permiso, planos, manuales y registro de copropietarios. Cuando se vende el 66% de las unidades, convoca una asamblea extraordinaria que decide si mantiene reglamento y administrador.
- Arts. 16 y 17: citación con 5 a 15 días de anticipación (en condominios sociales puede hacerla la secretaría municipal); en la primera sesión se elige un comité de administración de 3 a 5 miembros.
- Art. 70: un condominio social nuevo tiene como máximo 160 viviendas. Art. 73: no paga aranceles de notario ni de conservador, y esos trámites tienen 30 días como máximo.
- El texto leído es de noviembre de 2023; puede haber cambios posteriores.

### N-15. Factibilidad sanitaria, electricidad y gas

Ley General de Servicios Sanitarios, DFL MOP 382 de 1988 (link por verificar). Dentro de su territorio operacional la sanitaria está obligada a dar factibilidad (art. 48). La factibilidad se pide para postular y para el permiso; el certificado de instalaciones va en la recepción (OGUC 5.2.6). Los certificados de electricidad y gas los emite la SEC según OGUC 5.9.2 y 5.9.3.

- Desde la Ley 21.718, sanitarias y eléctricas tienen 10 días para responder los informes que pide la DOM.
- Por verificar: plazo de emisión del certificado de factibilidad, su vigencia y el nombre exacto de cada formulario SEC.

### N-16. Ley 21.450 de integración social y Plan de Emergencia Habitacional

[LeyChile](https://www.bcn.cl/leychile/navegar?idNorma=1176603), explicada en la Circular DDU 466. Obliga al MINVU a armar el Plan de Emergencia Habitacional (art. 11) y a coordinarlo con municipios y gobiernos regionales para acortar plazos (art. 13). Según el Senado, el Congreso aprobó en diciembre de 2025 prorrogarlo hasta 2029; no confirmamos el número de la ley. No encontramos cambios directos al DS49.

### N-17. Evaluación ambiental: Ley 19.300 art. 10 h y DS 40 de 2012 art. 3 h.1.3

[DS 40 refundido](https://www.sea.gob.cl/sites/default/files/imce/archivos/2024/05/30/DS40_Refundido2024_SEA.pdf). Un proyecto de viviendas entra al SEIA solo si está en zona latente o saturada y además ocupa 7 ha o más o tiene 300 viviendas o más. Con el tope de 160 viviendas por condominio, un DS49 típico no entra. Por verificar: si varios condominios en un mismo terreno suman para el umbral.

## Organizaciones, procedimiento y datos

### N-20. Ley 19.418 de juntas de vecinos y organizaciones comunitarias

[LeyChile](https://www.bcn.cl/leychile/navegar?idNorma=70040) (texto refundido en el DS 58 de 1997, Interior). El comité de vivienda es una organización comunitaria funcional y se rige por esta ley. MINVU pide para el DS49 colectivo el certificado de personalidad jurídica, el registro de socios y el acta constitutiva (Circular DPH-FSEV 35-2018). Toca a las familias, la directiva y la EP.

- Arts. 7, 8 y 46: se funda en asamblea ante ministro de fe, con al menos 15 socios en zona urbana (10 en rural); con el depósito del acta en la secretaría municipal, dentro de 30 días, obtiene personalidad jurídica.
- Arts. 16 y 17: el quórum de las asambleas lo fijan los estatutos y los acuerdos se toman por mayoría de los presentes. La extraordinaria la cita el presidente o el 25% de los socios, con 5 días hábiles de anticipación, y solo se votan las materias citadas.
- Art. 18: solo en asamblea extraordinaria se votan la reforma de estatutos, la compra, venta o gravamen de inmuebles, las cuotas extraordinarias, la exclusión de socios (en votación secreta), las elecciones y la disolución. Toca a L-02 y L-09.
- Art. 19: la directiva tiene al menos presidente, secretario y tesorero, y dura 3 años.
- Texto leído: versión de septiembre de 2022.

### N-21. Ley General de Cooperativas, DFL 5 de 2003

[LeyChile](https://www.leychile.cl/leychile/navegar?idNorma=221322). Otra forma de organizarse: las cooperativas de vivienda abiertas o cerradas también pueden postular al DS49. Es un caso secundario para el producto. La cerrada se forma para un solo proyecto (art. 74); la abierta necesita 200 socios y 6.000 UF de patrimonio (art. 84). Por verificar: el artículo del DS49 que las admite.

### N-22. Ley 19.880 de bases de los procedimientos administrativos

[LeyChile](https://www.bcn.cl/leychile/navegar?idNorma=210676). Fija cómo y en qué plazos responden SERVIU y MINVU a un trámite y qué recursos hay contra sus decisiones. Es la base legal de que un actor pida saber en qué va su trámite.

- Art. 17 a: cualquier interesado puede conocer en cualquier momento el estado de su trámite y pedir copia del expediente.
- Arts. 24, 25 y 27: informes en 10 días, decisión en 20 días, días hábiles, y un procedimiento no dura más de 6 meses.
- Arts. 64 y 65: si vence el plazo, el interesado denuncia el atraso y a los 5 días la solicitud se da por aceptada, salvo que afecte el patrimonio fiscal, caso en que el silencio es rechazo. Un pago de subsidio cae probablemente en este segundo caso. Toca a D-07 y D-12.
- Art. 59: reposición y recurso jerárquico en 5 días.
- Los permisos y recepciones de la DOM tienen plazos propios en la LGUC (N-10).

### N-23. Ley 20.285 de acceso a la información pública

[LeyChile](https://www.bcn.cl/leychile/navegar?idNorma=276363). Cualquiera puede pedir información a SERVIU, MINVU o la municipalidad; no obliga al comité ni a la EP. El órgano responde en 20 días hábiles, prorrogables una vez por 10 (art. 14); si no responde, se reclama al Consejo para la Transparencia en 15 días (art. 24).

### N-24. Ley 19.628 de protección de la vida privada y Ley 21.719 de protección de datos personales

[Ley 19.628](https://www.bcn.cl/leychile/navegar?idNorma=141599) (id?), [Ley 21.719](https://www.bcn.cl/leychile/navegar?idNorma=1209272) (id?). Rigen los datos de las familias que guarda Comité.

- Hoy (19.628, art. 4): sin ley que lo autorice, hace falta consentimiento expreso y por escrito, informando para qué se usan los datos, y se puede revocar.
- Ley 21.719: se publicó el 13-12-2024 y entra en vigencia el 1-12-2026. Por verificar: el Congreso despachó el 17-11-2026 una postergación al 15-10-2027 que aún no salía en el Diario Oficial. El Figma da el mismo dato con el Boletín 18.623-07 (D-19, Figma, frame 9; P-17).
- Ley 21.719, art. 2 g: la situación socioeconómica pasa a ser dato sensible. Es justo lo que guardamos (RSH, ingresos, ahorro).
- El Figma marca como datos sensibles la discapacidad y la prisión política (factores de puntaje) y pide que la familia los active ella misma; el comité ve el estado de cada documento y no su contenido, con autorización de cada familia (D-19, Figma, frame 8 y pantallas F0 y C1).
- Arts. 12 y 16: un dato sensible exige consentimiento expreso (escrito, verbal o por medio tecnológico), libre, informado y específico por finalidad, y el responsable tiene que poder probarlo. Para el producto: casilla explícita con fecha, texto aceptado y canal, en web o WhatsApp. Las multas llegan a 20.000 UTM.

### N-25. Ley 19.799 de documentos y firma electrónica, y Ley 21.180 de transformación digital del Estado

[Ley 19.799](https://www.bcn.cl/leychile/navegar?idNorma=196640), [Ley 21.180](https://www.bcn.cl/leychile/navegar?idNorma=1138479) (id?).

- Arts. 3 a 5 (19.799): un acto con firma electrónica simple vale como uno en papel, salvo que la ley exija solemnidad o comparecer en persona. Un instrumento público exige firma avanzada.
- Para el producto: un acta o aprobación digital vale con firma simple, pero no reemplaza el acta constitutiva ante ministro de fe (N-20) ni copias que MINVU pida legalizadas (inferencia, por verificar).
- Ley 21.180: el Estado lleva expediente electrónico y notifica al Domicilio Digital Único; se implementa por etapas hasta el 31-12-2027.

### N-26. DS 1 de 2015 SEGPRES (accesibilidad web del Estado) y Ley 20.422

El DS 1 obliga solo a los órganos del Estado a tener sitios accesibles según pautas internacionales; la guía de 2022 apunta a WCAG 2.1. No obliga a una herramienta privada, salvo que un SERVIU o municipio la adopte como propia. La Ley 20.422 ([LeyChile](https://www.bcn.cl/leychile/navegar?idNorma=1010903), id?) es el marco general de accesibilidad universal. E-04 ya apunta a WCAG 2.2 AA, que cubre ambas.

## Cruces con el estado de producto

Lo que esta investigación aporta a ítems abiertos. Nada de esto cambia el estado de un ítem: lo cambia una persona del equipo. Desde D-19, si esta sección choca con el Figma de lozi-love, manda el Figma; las diferencias que no pudimos verificar quedan anotadas en cada norma.

- A-03 (unanimidad): la página del llamado dice «el proyecto debe estar aprobado por todas las familias que integran el Comité», pero no encontramos esa frase en el texto de la Res. 685. El DS49 pide aprobación de las familias para cambios (art. 14) y mayoría para el acta del diagnóstico (art. 50). Sigue por verificar si «todas» exige la firma de cada familia.
- A-04 (180 días): el plazo de 180 días del DS49 (art. 12) no es de ahorro ni de reemplazo; es el plazo de la EP para ingresar antecedentes. El ahorro adicional tiene 150 días (art. 37) y los reemplazos se rigen por el art. 57.
- A-14 (ahorro, cobertura, venta): ahorro mínimo de 10 y 15 UF según tramo (Res. 685, 3.4) y prohibición de vender por 5 años (DS49 art. 60). No encontramos la «cobertura de hasta 90%».
- P-05 (vigencia del subsidio): 21 meses, prorrogables 12 si ya se iniciaron las obras (DS49 arts. 28 y 64). El Figma da lo mismo y suma el art. 41 (A-17); P-05 queda resuelta.
- D-05 (versiones y revalidación): el art. 14 del DS49 da base legal a que un cambio técnico pida nueva aprobación de las familias.
- D-07 y L-08 (gestión no es pago): el anticipo depende del avance informado por el FTO y de garantías vigentes (DS49 arts. 69 y 71), y el silencio del Estado ante un pago probablemente cuenta como rechazo (Ley 19.880, art. 65).
- L-02 (exclusión de familias): la exclusión de un socio del comité solo se vota en asamblea extraordinaria y en votación secreta (Ley 19.418, art. 18), y el reemplazo en el subsidio lo resuelve el SERVIU (DS49 art. 57). Comité solo puede mostrar el estado.
- Datos de las familias: la situación socioeconómica pasa a ser dato sensible con la Ley 21.719. Hace falta diseñar el consentimiento explícito y registrado desde el primer prototipo.
- Plazos (D-12): los plazos con fuente para mostrar son los de la DOM (LGUC arts. 118 y 144), el SERVIU (Ley 19.880 arts. 24 y 27), el inicio de obras (DS49 art. 32) y la vigencia del subsidio (DS49 art. 28). El Figma agrega los de la revisión del SERVIU (DS49 art. 13: 30, 60, 15, 20 y 10 días hábiles), que son reglas propias del DS49 y mandan sobre los generales de la Ley 19.880 para ese trámite (A-18; D-19, Figma, frame 3).
