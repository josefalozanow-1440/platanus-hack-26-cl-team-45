"""All text the copiloto model reads or the family sees from the copiloto. No prompt text lives elsewhere."""

from anthropic.types import ToolParam

from app.models.domain import DocumentKind, Stage

SYSTEM_PROMPT = """\
Eres el Copiloto de Carpeta de Comité. Conversas con una familia que postula en grupo al subsidio \
DS49 (Fondo Solidario de Elección de Vivienda, modalidad colectiva). Tu trabajo es ayudarla a completar \
su carpeta y contarle cómo va su grupo.

Cómo hablas:
- Español de Chile, simple y cercano, de tú. Frases cortas. Sin siglas sin explicar.
- Mensajes breves, como en WhatsApp: dos a cinco líneas. Sin markdown, sin títulos, sin tablas.
- Dices primero lo que la familia tiene que hacer y después el porqué.

Qué haces:
- Usa get_my_carpeta para saber qué le falta a la familia antes de responder sobre su carpeta.
- Usa get_group_progress para contar cómo va el grupo.
- Usa explain_document para explicar un documento. Si la herramienta no tiene la explicación, dilo y \
sugiere preguntarle a la entidad patrocinante (EP). No completes con lo que creas saber.
- Usa request_signature_link cuando la familia pida que le mandes a otro adulto el enlace para firmar. \
Eso deja la solicitud registrada; no confirma que el enlace llegó ni que la persona firmó.

Lo que nunca haces:
- No inventas reglas, plazos, montos ni requisitos oficiales. Solo usas lo que te entregan las herramientas.
- No hablas de los documentos ni de los datos de otras familias. Del grupo solo das cuántas familias completaron.
- No recomiendas sacar a una familia del comité ni sugieres que alguien quede fuera. Si te lo piden, \
explica que eso no lo decides tú y ofrece ver qué le falta a esa familia y quién podría ayudarla.
- No das nada por aprobado. Que la familia diga "ya entendí" o "listo" no aprueba ningún documento ni paso.
- Si nadie ha tomado un paso, lo dices tal cual. No inventas un responsable para que suene más tranquilo.
"""

TOOLS: list[ToolParam] = [
    {
        "name": "get_my_carpeta",
        "description": (
            "Devuelve el estado de cada documento de la carpeta de esta familia: listo, falta o vence (hay "
            "que renovarlo o completarlo pronto), con un detalle corto y los adultos que todavía no firman. "
            "Úsala antes de responder cualquier pregunta sobre qué le falta a la familia."
        ),
        "input_schema": {"type": "object", "properties": {}, "additionalProperties": False},
    },
    {
        "name": "get_group_progress",
        "description": (
            "Devuelve cómo va el grupo: cuántas familias completaron su carpeta, en qué etapa está el comité, "
            "cuál es el próximo paso y quién lo tomó (vacío si nadie lo ha tomado). No incluye datos de otras familias."
        ),
        "input_schema": {"type": "object", "properties": {}, "additionalProperties": False},
    },
    {
        "name": "explain_document",
        "description": (
            "Devuelve la explicación oficial y simple de un documento o trámite de la carpeta, por ejemplo "
            "DJ49-1, DJ49-2, DJ49-3, RSH, cédula o ahorro. Si no hay explicación, responde que no la tiene."
        ),
        "input_schema": {
            "type": "object",
            "properties": {"name": {"type": "string", "description": "Nombre del documento, por ejemplo DJ49-1."}},
            "required": ["name"],
            "additionalProperties": False,
        },
    },
    {
        "name": "request_signature_link",
        "description": (
            "Registra la solicitud de enviarle a un adulto de esta familia el enlace para firmar con ClaveÚnica "
            "lo que le falta. Solo propone el envío: no lo confirma ni marca nada como firmado."
        ),
        "input_schema": {
            "type": "object",
            "properties": {"member": {"type": "string", "description": "Nombre del adulto que debe firmar."}},
            "required": ["member"],
            "additionalProperties": False,
        },
    },
]

# Fixed glossary for explain_document (L-04: only explanations someone wrote and checked).
# Keys are lowercase aliases; several aliases may share one text.
_DJ49_1 = (
    "La DJ49-1 es la declaración jurada de tu núcleo familiar: dice quiénes viven contigo y que no tienen "
    "una vivienda propia. La tienen que firmar todos los adultos del hogar, o validar con ClaveÚnica."
)
_DJ49_2 = "La DJ49-2 es la declaración jurada de postulación: con ella confirmas que postulas con tu comité."
_DJ49_3 = (
    "La DJ49-3 es el mandato de ahorro: autoriza que se use el ahorro de tu cuenta para la vivienda. "
    "Se firma con un banco en convenio."
)
_RSH = (
    "El RSH es el Registro Social de Hogares. Tiene que estar al día. Puedes descargar tu Cartola Hogar en "
    "registrosocial.gob.cl con tu ClaveÚnica."
)
_SAVINGS = (
    "El ahorro se deposita en tu cuenta de ahorro para la vivienda, en el banco donde la abriste. "
    "Cuenta el saldo certificado al último día hábil del mes anterior, y desde que la carpeta se ingresa "
    "la cuenta no se puede girar. Si tienes dudas del monto o de la fecha, pregúntale a tu EP."
)
_ID_CARD = "Se pide la cédula de identidad vigente de los adultos. Si vence pronto, conviene renovarla antes."

GLOSSARY: dict[str, str] = {
    "dj49-1": _DJ49_1,
    "dj49-2": _DJ49_2,
    "dj49-3": _DJ49_3,
    "rsh": _RSH,
    "registro social de hogares": _RSH,
    "cartola hogar": _RSH,
    "ahorro": _SAVINGS,
    "deposito": _SAVINGS,
    "depósito": _SAVINGS,
    "cédula": _ID_CARD,
    "cedula": _ID_CARD,
}

UNKNOWN_DOCUMENT = (
    "No tengo una explicación revisada de ese documento. Para no decirte algo equivocado, pregúntale a tu EP."
)
UNKNOWN_FAMILY = "No encuentro la carpeta de esta familia."
UNKNOWN_MEMBER = "{member} no aparece como adulto de esta familia con una firma pendiente."
SIGNATURE_LINK_PROPOSED = (
    "Quedó registrada la solicitud de enviarle a {member} el enlace para firmar con ClaveÚnica. "
    "Todavía no está enviado ni firmado."
)
TOOL_NOT_ALLOWED = "Esa herramienta no existe para el copiloto."
NOBODY_TOOK_STEP = "nadie lo ha tomado todavía"
NO_GROUP_PROGRESS = "Todavía no hay información del avance del grupo."

# Scripted fallback, used when there is no ANTHROPIC_API_KEY or the model fails.
FALLBACK_GREETING = "Hola, {name}."
FALLBACK_MISSING_HEADER = "Tienes {count} cosas pendientes en tu carpeta:"
FALLBACK_MISSING_ONE = "Tienes 1 cosa pendiente en tu carpeta:"
FALLBACK_MISSING_ITEM = "- {name}: {detail}"
FALLBACK_PENDING_SIGNERS = " (falta la firma de {names})"
FALLBACK_COMPLETE = "Tu carpeta está completa por ahora."
FALLBACK_GROUP = "{complete} de {total} familias ya completaron su carpeta."
FALLBACK_NEXT_DEADLINE = "Próximo plazo del grupo: {deadline}."
FALLBACK_PENDING_STEP = "Pendiente de tu familia: {step} Responsable: {owner}."
NEXT_DEADLINE = "{title}, vence el {due_on:%d-%m-%Y}"

QUICK_REPLY_DEPOSIT = "¿Cómo deposito?"
QUICK_REPLY_WHAT_IS = "¿Qué es {name}?"
QUICK_REPLY_SEE_CARPETA = "Ver mi carpeta"

DOCUMENT_LABELS: dict[DocumentKind, str] = {
    DocumentKind.RSH: "RSH",
    DocumentKind.CEDULA: "Cédula",
    DocumentKind.DJ49_1: "DJ49-1",
    DocumentKind.DJ49_2: "DJ49-2",
    DocumentKind.DJ49_3: "DJ49-3",
    DocumentKind.AHORRO: "Ahorro",
    DocumentKind.COMUNIDAD: "Certificado de derechos en comunidad",
}

# Stage names from F3 «El camino del grupo».
STAGE_LABELS: dict[Stage, str] = {
    Stage.ORGANIZACION: "Organización y carpetas",
    Stage.PROYECTO: "Proyecto y terreno",
    Stage.REVISION_SERVIU: "Revisión del SERVIU",
    Stage.CALIFICADO: "Llamado y selección",
    Stage.SUBSIDIO_ASIGNADO: "Obra y recepción",
    Stage.ENTREGA: "Escritura y entrega",
}
