import { memo, useEffect, useRef } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { arrancar, SLUG } from './convex.jsx';
import { NOMBRE_TONO } from './comun.js';
import { montar } from './flujo-dibujo.js';
import './flujo.css';

function Flujo() {
  const d = useQuery(api.encuestas.mapa, { slug: SLUG });
  const dibujo = useRef(null);
  useEffect(() => { dibujo.current = montar(); }, []);
  useEffect(() => { if (d !== undefined) dibujo.current.recibir(d); }, [d]);
  return <Lienzo />;
}

// Static skeleton rendered once; flujo-dibujo.js owns the SVG contents.
const Lienzo = memo(() => (
  <>
    <header>
      <h1 id="pregunta">Audem</h1>
      <nav><a className="boton" href={`/${SLUG}/panel`}>Ver panel</a></nav>
    </header>
    <main>
      <section>
        <figure>
          <svg id="flujo" role="img" aria-label="Flujo: cada respuesta se divide en frases, cada frase se une a sus conceptos y cada concepto a los temas donde aparece. Pasa el cursor por cualquier nodo para seguir su camino."></svg>
          <figcaption>
            <span className="clave"><svg width="30" height="14" aria-hidden="true"><circle cx="4" cy="7" r="3.5" fill="var(--muted)" /><circle cx="21" cy="7" r="7" fill="var(--muted)" /></svg>frase: color = tono, tamaño = intensidad</span>
            {['pos', 'neu', 'neg'].map(t => <span key={t} className="clave"><i className="tono" style={{ background: `var(--${t})` }}></i>{NOMBRE_TONO[t]}</span>)}
            <span className="clave">grosor concepto → tema = n.º de frases</span>
            <span className="clave">tema: área = % de personas, un anillo por persona</span>
            <span className="clave">pasa el cursor para seguir un camino</span>
            <span className="metodo" id="metodo"></span>
          </figcaption>
        </figure>
      </section>
    </main>
    <div id="tip" role="tooltip"></div>
  </>
));

arrancar(Flujo);
