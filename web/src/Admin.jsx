import { useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { arrancar, mensaje } from './convex.jsx';
import { plural } from './comun.js';
import './admin.css';

const guardar = (k, v) => { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch {} };
const leer = k => { try { return localStorage.getItem(k); } catch { return null; } };
const urlDe = (pag, id) => new URL(`${pag}?e=${id}`, location.href).href;
const fallo = e => alert(mensaje(e));

function Admin() {
  const [clave, setClave] = useState(leer('audem_admin') || '');
  const ok = useQuery(api.encuestas.esAdmin, clave ? { clave } : 'skip');
  if (!clave || ok === false) return <Login error={ok === false} entrar={k => { guardar('audem_admin', k); setClave(k); }} />;
  if (ok === undefined) return null;
  return <Tablero clave={clave} salir={() => { guardar('audem_admin', null); setClave(''); }} />;
}

function Login({ error, entrar }) {
  const [k, setK] = useState('');
  return (
    <section id="login">
      <h2>Admin de Audem</h2>
      <form onSubmit={e => { e.preventDefault(); entrar(k); }}>
        <input type="password" placeholder="Clave de admin" autoComplete="current-password" required value={k} onChange={e => setK(e.target.value)} />
        <button className="primario">Entrar</button>
      </form>
      <p id="error" role="alert">{error ? 'Clave incorrecta.' : ''}</p>
    </section>
  );
}

function Tablero({ clave, salir }) {
  const encuestas = useQuery(api.encuestas.listar) ?? [];
  const crear = useMutation(api.encuestas.crear);
  const [sel, setSel] = useState(leer('audem_sel'));
  const [pregunta, setPregunta] = useState('');
  const elegir = id => { setSel(id); guardar('audem_sel', id); };
  const e = encuestas.find(x => x._id === sel);

  return (
    <div id="app">
      <header>
        <h1>Audem · admin</h1>
        <button onClick={salir}>Salir</button>
      </header>
      <main>
        <aside>
          <section>
            <h2>Nueva encuesta</h2>
            <form onSubmit={async ev => {
              ev.preventDefault();
              try { elegir(await crear({ clave, pregunta })); setPregunta(''); } catch (err) { fallo(err); }
            }}>
              <input placeholder="¿Qué le quieres preguntar al grupo?" required maxLength={300} value={pregunta} onChange={ev => setPregunta(ev.target.value)} />
              <button className="primario">Crear</button>
            </form>
          </section>
          <section style={{ marginTop: 'var(--s4)' }}>
            <h2>Encuestas</h2>
            <ul>
              {encuestas.map(x => (
                <li key={x._id}>
                  <button className="enc" aria-current={x._id === sel} onClick={() => elegir(x._id)}>
                    <span>{x.pregunta}</span>
                    <span className="meta">{x.abierta ? 'abierta' : 'cerrada'} · {plural(x.personas, 'persona', 'personas')} · {plural(x.respuestas, 'respuesta', 'respuestas')}</span>
                  </button>
                </li>
              ))}
              {!encuestas.length && <li className="meta">Todavía no hay encuestas.</li>}
            </ul>
          </section>
        </aside>
        <section id="detalle">{e ? <Detalle key={e._id} e={e} clave={clave} /> : <p className="meta">Crea o elige una encuesta.</p>}</section>
      </main>
    </div>
  );
}

function Detalle({ e, clave }) {
  const respuestas = useQuery(api.encuestas.respuestas, { encuestaId: e._id }) ?? [];
  const abrirCerrar = useMutation(api.encuestas.abrirCerrar);
  const reprocesar = useMutation(api.encuestas.reprocesar);
  const borrar = useMutation(api.encuestas.borrarRespuesta);
  const [copiado, setCopiado] = useState(false);
  const qr = useRef(null);
  const link = urlDe('responder.html', e._id);
  // QRCode is the qrcodejs global loaded in admin.html.
  useEffect(() => { qr.current.innerHTML = ''; new window.QRCode(qr.current, { text: link, width: 180, height: 180 }); }, [link]);

  const ESTADO = { transcribiendo: 'transcribiendo…', procesando: 'procesando…', listo: 'procesada', error: 'error al procesar' };
  return (
    <>
      <h2>{e.pregunta}</h2>
      <div className="acciones">
        <button onClick={() => abrirCerrar({ clave, encuestaId: e._id, abierta: !e.abierta }).catch(fallo)}>{e.abierta ? 'Cerrar encuesta' : 'Reabrir encuesta'}</button>
        <a className="boton" href={urlDe('index.html', e._id)} target="_blank">Panel en vivo</a>
        <a className="boton" href={urlDe('flujo.html', e._id)} target="_blank">Flujo</a>
        <a className="boton" href={link} target="_blank">Responder</a>
      </div>
      <div className="qr">
        <div id="qr" ref={qr}></div>
        <div>
          <p className="meta">Link para responder con el micrófono</p>
          <p id="link">{link}</p>
          <button onClick={() => navigator.clipboard.writeText(link).then(() => setCopiado(true))}>{copiado ? 'Copiado' : 'Copiar link'}</button>
        </div>
      </div>
      <h2>Respuestas en vivo</h2>
      <ul>
        {respuestas.map(r => (
          <li key={r._id} className="resp">
            {r.audioUrl && <audio controls preload="none" src={r.audioUrl}></audio>}
            {r.texto && <p>{r.texto}</p>}
            <div className="fila">
              <span className={`meta estado-${r.estado}`}>{ESTADO[r.estado]} · {new Date(r._creationTime).toLocaleTimeString('es-CL')}</span>
              <button onClick={() => reprocesar({ clave, respuestaId: r._id }).catch(fallo)}>Reprocesar</button>
              <button onClick={() => borrar({ clave, respuestaId: r._id }).catch(fallo)}>Borrar</button>
            </div>
          </li>
        ))}
        {!respuestas.length && <li className="meta">Aún no llegan respuestas.</li>}
      </ul>
    </>
  );
}

arrancar(Admin);
