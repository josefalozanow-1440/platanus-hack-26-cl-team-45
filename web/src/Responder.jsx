import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { arrancar, mensaje, SLUG } from './convex.jsx';
import './responder.css';

const MAX_S = 180;
const ESTADO = { transcribiendo: 'transcribiendo…', procesando: 'procesando…', listo: 'en el mapa', error: 'no se pudo procesar' };
// Anonymous participant id, kept in this browser only.
const YO = (() => { try { return (localStorage.audem_id ||= crypto.randomUUID()); } catch { return crypto.randomUUID(); } })();

function Responder() {
  const encuesta = useQuery(api.encuestas.actual, { slug: SLUG });
  const mias = useQuery(api.encuestas.mias, encuesta ? { encuestaId: encuesta._id, participante: YO } : 'skip') ?? [];
  const urlSubida = useMutation(api.encuestas.urlSubida);
  const responderAudio = useMutation(api.encuestas.responderAudio);
  const responder = useMutation(api.encuestas.responder);

  const [texto, setTexto] = useState('');
  const [estado, setEstado] = useState('');
  const [grabando, setGrabando] = useState(false);
  const [segundos, setSegundos] = useState(0);
  const [ocupado, setOcupado] = useState(false);
  const rec = useRef(null);

  const abierta = !!encuesta?.abierta;
  const puedeGrabar = abierta && !!navigator.mediaDevices?.getUserMedia;

  // Record in the browser, upload to Convex storage; the server transcribes it (OpenRouter Whisper).
  async function grabar() {
    let stream;
    try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); }
    catch { setEstado('Sin permiso de micrófono.'); return; }
    const trozos = [], r = new MediaRecorder(stream);
    r.ondataavailable = e => e.data.size && trozos.push(e.data);
    r.onstop = () => { stream.getTracks().forEach(t => t.stop()); enviarAudio(new Blob(trozos, { type: r.mimeType })); };
    r.start();
    rec.current = r; setSegundos(0); setEstado(''); setGrabando(true);
  }
  const parar = () => { setGrabando(false); rec.current?.state === 'recording' && rec.current.stop(); };

  useEffect(() => {
    if (!grabando) return;
    const t0 = Date.now(), id = setInterval(() => setSegundos(Math.floor((Date.now() - t0) / 1000)), 500);
    return () => clearInterval(id);
  }, [grabando]);
  useEffect(() => { if (grabando && segundos >= MAX_S) parar(); }, [grabando, segundos]);

  async function enviarAudio(blob) {
    if (blob.size < 2000) { setEstado('La grabación quedó vacía, intenta de nuevo.'); return; }
    setOcupado(true); setEstado('Subiendo audio…');
    try {
      const r = await fetch(await urlSubida(), { method: 'POST', headers: { 'Content-Type': blob.type }, body: blob });
      if (!r.ok) throw new Error('Error: No se pudo subir el audio');
      const { storageId } = await r.json();
      await responderAudio({ encuestaId: encuesta._id, participante: YO, audioId: storageId });
      setEstado('¡Gracias! Mira la pantalla.');
    } catch (e) { setEstado(mensaje(e)); }
    setOcupado(false);
  }

  async function enviarTexto() {
    setOcupado(true); setEstado('Enviando…');
    try { await responder({ encuestaId: encuesta._id, participante: YO, texto }); setTexto(''); setEstado('¡Gracias! Mira la pantalla.'); }
    catch (e) { setEstado(mensaje(e)); }
    setOcupado(false);
  }

  return (
    <main>
      <span className="marca">Respuesta anónima</span>
      <h1>{encuesta === undefined ? 'Cargando pregunta…' : encuesta ? encuesta.pregunta : 'No existe esta encuesta'}</h1>
      <button id="mic" aria-pressed={grabando} disabled={!puedeGrabar || (!grabando && ocupado)} onClick={grabando ? parar : grabar}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></svg>
        <span>{grabando ? `Enviar · ${Math.floor(segundos / 60)}:${String(segundos % 60).padStart(2, '0')}` : 'Hablar'}</span>
      </button>
      <p className="nota">Toca para hablar y otra vez para enviar · máx. 3 min</p>
      <textarea value={texto} onChange={e => setTexto(e.target.value)} placeholder="O escribe tu respuesta" aria-label="Tu respuesta" />
      <div className="fila">
        <button id="enviar" disabled={!abierta || grabando || ocupado || texto.trim().length < 3} onClick={enviarTexto}>Enviar respuesta</button>
        <p id="estado" role="status">{encuesta && !encuesta.abierta ? 'Esta encuesta ya cerró.' : estado}</p>
      </div>
      <ul aria-label="Tus respuestas">
        {mias.map(r => (
          <li key={r._id}><b>{ESTADO[r.estado]}</b> · {r.texto ? r.texto.slice(0, 140) + (r.texto.length > 140 ? '…' : '') : 'audio'}</li>
        ))}
      </ul>
    </main>
  );
}

arrancar(Responder);
