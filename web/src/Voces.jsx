import { Component, memo, useEffect, useRef, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { arrancar, SLUG } from './convex.jsx';
import { NOMBRE_TONO, tono, plural } from './comun.js';
import { montar } from './voces-dibujo.js';
import './voces.css';

const TONO_DIR = { positivo: 'pos', negativo: 'neg', mixto: 'neu', neutro: 'neu' };
const TENDENCIA = { mejora: 'dice que mejoró', empeora: 'dice que empeoró', igual: 'dice que sigue igual' };

function Voces() {
  const d = useQuery(api.encuestas.topicos, { slug: SLUG });
  const [sel, setSel] = useState(null);
  const dibujo = useRef(null);
  useEffect(() => {
    dibujo.current = montar({ escenario: document.getElementById('escenario'), svg: document.getElementById('voces'), onSelect: setSel });
  }, []);
  useEffect(() => { if (d !== undefined) dibujo.current.recibir(d); }, [d]);

  const ks = d?.topicos ?? [];
  return (
    <>
      <Lienzo />
      <header>
        <h1>{d === null ? 'No existe esta encuesta' : d?.pregunta ?? 'Audem'}</h1>
        <nav>
          <a className="boton" href={`/${SLUG}/panel`}>Ver mapa</a>
          <a className="boton" href={`/${SLUG}/flujo`}>Ver flujo</a>
        </nav>
      </header>
      <aside id="tarjeta" aria-live="polite">
        {d && !ks.length && <p className="vacio">Aún no hay tópicos. Aparecen unos 10 s después de las primeras respuestas.</p>}
        {sel && <Persona {...sel} cerrar={() => dibujo.current.deseleccionar()} />}
        {d?.propuestas?.length > 0 && (
          <div className="bloque">
            <h2>Propuestas <span className="num">{d.propuestas.length}</span></h2>
            <ul className="propuestas">{d.propuestas.slice().reverse().map(p => <li key={p.respuestaId}>{p.texto}</li>)}</ul>
          </div>
        )}
        {d?.emociones?.length > 0 && (
          <div className="bloque">
            <h2>Emoción que domina</h2>
            <ul className="emociones">
              {d.emociones.map(e => <li key={e.emocion}><i className="tono" style={{ background: `var(--${tono(e.emocion)})` }}></i>{e.emocion} <span className="num">{e.n}</span></li>)}
            </ul>
          </div>
        )}
      </aside>
      <footer>
        <span className="clave"><svg width="30" height="14" aria-hidden="true"><circle cx="4" cy="7" r="3.5" fill="var(--muted)" /><circle cx="21" cy="7" r="6.5" fill="var(--muted)" /></svg>punto = una persona en un tópico, tamaño = intensidad</span>
        {['pos', 'neu', 'neg'].map(t => <span key={t} className="clave"><i className="tono" style={{ background: `var(--${t})` }}></i>{t === 'neu' ? 'neutro o mixto' : NOMBRE_TONO[t]}</span>)}
        <span className="clave">el blob crece hacia el tópico con más personas</span>
        {d && <span className="metodo">Casos: {plural(d.analizadas, 'respuesta analizada', 'respuestas analizadas')} · {plural(ks.length, 'tópico', 'tópicos')}{ks.length > 6 ? ', se muestran los 6 con más personas' : ''} · tópicos normalizados por Claude a partir de los temas de cada respuesta</span>}
      </footer>
    </>
  );
}

function Persona({ topico, celda, cerrar }) {
  const t = TONO_DIR[celda.direccion] ?? 'neu';
  return (
    <div className="bloque persona">
      <h2><i className="tono" style={{ background: `var(--${t})` }}></i>{topico.nombre} · {celda.direccion}{TENDENCIA[celda.tendencia] ? ` · ${TENDENCIA[celda.tendencia]}` : ''}</h2>
      {celda.temas.map((x, i) => <q key={i}>{x.cita}</q>)}
      <p className="cuenta num">En este tópico: {plural(topico.personas, 'persona', 'personas')} · {topico.positivo} pos · {topico.neutro + topico.mixto} neu · {topico.negativo} neg</p>
      <button onClick={cerrar}>Cerrar</button>
    </div>
  );
}

// Static skeleton rendered once; voces-dibujo.js owns the canvas and the SVG contents.
const Lienzo = memo(() => (
  <>
    <div id="escenario"></div>
    <svg id="voces" role="img" aria-label="Tópicos en vivo: un eje por tópico, un punto por persona coloreado por su postura. Toca un punto para leer su cita."></svg>
  </>
));

// useQuery throws if the Convex deployment lacks encuestas.topicos (backend not pushed yet): say so instead of a blank page.
class SinQuery extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (!this.state.error) return this.props.children;
    return <header><h1>Tópicos no disponibles</h1><p className="vacio">El backend de Convex todavía no tiene la query de tópicos. Despliega con <code>npx convex dev</code> o <code>npx convex deploy</code> y recarga.</p></header>;
  }
}

arrancar(() => <SinQuery><Voces /></SinQuery>);
