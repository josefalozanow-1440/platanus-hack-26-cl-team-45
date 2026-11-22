// Shared helpers for every Audem page (tone rules: DESIGN.md).
// Closed emotion → tone list, shared with the extraction prompt (DESIGN.md). Anything else is neutral.
export const POS = ['alegria','entusiasmo','gratitud','orgullo','alivio','esperanza','satisfaccion','confianza'];
export const NEG = ['frustracion','cansancio','enojo','rabia','preocupacion','decepcion','tristeza','miedo','molestia','angustia'];
export const tono = e => { const k = (e || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); return POS.includes(k) ? 'pos' : NEG.includes(k) ? 'neg' : 'neu'; };
export const NOMBRE_TONO = { pos: 'positivo', neu: 'neutro', neg: 'negativo' };
export const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
export const plural = (n, s, p) => `${n} ${n === 1 ? s : p}`;
