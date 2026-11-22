// Imperative SVG drawing for the live panel (grid of themes + force-directed network). Mounted by Panel.jsx.
import { esc, tono, plural, NOMBRE_TONO } from './comun.js';

export function montar() {
  const W = 1100, H = 780, PLAY_MS = 1200, N_ULTIMAS = 2;
  const NS = 'http://www.w3.org/2000/svg';
  const $ = id => document.getElementById(id);
  const svg = $('svg'), tip = $('tip');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

  // View state. `cursor` = how many respuestas are shown, in arrival order.
  const st = { datos: null, orden: [], cursor: 0, jugando: false, envivo: false, tonos: new Set(['pos', 'neu', 'neg']), sel: null, vista: 'red' };
  const visto = new Set();
  let apiOk = false;

  // Convex data arrives from the React component. Synthetic data only if no poll exists yet.
  async function recibir(d) {
    if (d) {
      if (!apiOk) { apiOk = true; st.envivo = true; st.jugando = false; $('badge').hidden = true; }
      return cargar(d);
    }
    if (apiOk || st.datos) return; // never flip to mock mid-session
    st.jugando = true; // synthetic session starts playing from zero
    cargar(await (await fetch('mapa-mock.json')).json());
    $('badge').hidden = false;
  }

  function cargar(d) {
    st.datos = d;
    st.orden = [...new Set(d.frases.map(f => f.respuesta_id))];
    if (st.envivo) st.cursor = st.orden.length;
    st.cursor = Math.min(st.cursor, st.orden.length);
    render();
  }

  function avanzar() {
    if (!st.jugando) return;
    st.cursor = Math.min(st.cursor + 1, st.orden.length);
    if (st.cursor === st.orden.length) { st.jugando = false; st.envivo = true; }
    render();
  }

  // Grid layout: each cluster takes the free cell nearest to its backend x/y, so similar themes sit close
  // and nothing overlaps. A partial last row is centered. Circle area is proportional to the number of frases.
  const LABEL_H = 74;
  function layout(grupos) {
    const n = grupos.length, cols = Math.ceil(Math.sqrt(n * W / H)), rows = Math.ceil(n / cols);
    const cw = W / cols, ch = H / rows;
    const rmax = Math.max(40, Math.min(cw / 2 - 14, (ch - LABEL_H) / 2 - 8));
    const maxF = Math.max(12, ...grupos.map(g => g.frases.length)); // floor keeps early clusters small so they visibly grow
    const xs = grupos.map(g => g.x), ys = grupos.map(g => g.y);
    const nx = v => (v - Math.min(...xs)) / ((Math.max(...xs) - Math.min(...xs)) || 1);
    const ny = v => (Math.max(...ys) - v) / ((Math.max(...ys) - Math.min(...ys)) || 1);
    const libres = [];
    for (let r = 0; r < rows; r++) {
      const enFila = r === rows - 1 ? n - cols * (rows - 1) : cols, off = (cols - enFila) * cw / 2;
      for (let c = 0; c < enFila; c++) libres.push({ x: off + (c + 0.5) * cw, y: r * ch + (ch - LABEL_H) / 2 });
    }
    // Fixed order by id keeps cells stable while counts change.
    for (const g of grupos.slice().sort((a, b) => String(a.id).localeCompare(String(b.id)))) {
      const tx = nx(g.x) * W, ty = ny(g.y) * H;
      libres.sort((a, b) => Math.hypot(a.x - tx, a.y - ty) - Math.hypot(b.x - tx, b.y - ty));
      const cell = libres.shift();
      g.r = rmax * Math.sqrt(g.frases.length / maxF); // area ∝ frases, no floor so the encoding stays honest
      g.cx = cell.x; g.cy = cell.y;
    }
    return Math.min(26, 0.78 * rmax / Math.sqrt(maxF)); // dot spacing shared by all clusters
  }

  function lineas(t, max = 22) {
    const out = [''];
    for (const w of t.split(' ')) (out[out.length - 1] + ' ' + w).trim().length > max && out[out.length - 1] ? out.push(w) : out[out.length - 1] = (out[out.length - 1] + ' ' + w).trim();
    return out.length > 2 ? [out[0], out.slice(1).join(' ')] : out;
  }

  function el(tag, attrs, parent) { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); parent && parent.appendChild(n); return n; }
  function mostrarTip(ev, html) { tip.innerHTML = html; tip.style.opacity = 1; tip.style.left = Math.min(ev.clientX + 14, innerWidth - 330) + 'px'; tip.style.top = (ev.clientY + 14) + 'px'; }
  function ocultarTip() { tip.style.opacity = 0; }
  const cita = (f, extra, nueva) => `<blockquote class="cita${nueva ? ' nueva' : ''}"><q>${esc(f.cita || f.texto)}</q><p><i class="tono" style="background:var(--${tono(f.emocion)})"></i>${esc(f.emocion)}${extra ? ' · ' + esc(extra) : ''}</p></blockquote>`;

  function seleccionar(id) { st.sel = st.sel === id ? null : id; render(); }

  function render() {
    const d = st.datos;
    if (!d) return;
    if (d.pregunta) $('pregunta').textContent = d.pregunta;
    const mostradas = new Set(st.orden.slice(0, st.cursor));
    const frases = d.frases.filter(f => mostradas.has(f.respuesta_id));
    const porCluster = new Map(d.clusters.map(c => [c.id, { ...c, frases: [] }]));
    frases.forEach(f => porCluster.get(f.cluster_id)?.frases.push(f));
    const grupos = [...porCluster.values()].filter(g => g.frases.length);
    grupos.forEach(g => {
      g.personas = new Set(g.frases.map(f => f.respuesta_id)).size;
      g.tonos = { pos: 0, neu: 0, neg: 0 }; g.frases.forEach(f => g.tonos[tono(f.emocion)]++);
    });
    if (st.sel && !grupos.some(g => g.id === st.sel)) st.sel = null;
    const esp = layout(grupos);
    const personas = mostradas.size;

    // Controls
    $('total').textContent = personas;
    $('cursor').max = st.orden.length; $('cursor').value = st.cursor;
    $('posicion').textContent = `${st.cursor} de ${plural(st.orden.length, 'respuesta', 'respuestas')}`;
    $('vivo').setAttribute('aria-pressed', st.envivo);
    $('play').setAttribute('aria-label', st.jugando ? 'Pausar' : 'Reproducir');
    $('icono').setAttribute('d', st.jugando ? 'M3 1.5h3v11H3zM8 1.5h3v11H8z' : 'M3 1.5v11l9-5.5z');
    document.querySelectorAll('.filtro button').forEach(b => b.setAttribute('aria-pressed', st.tonos.has(b.dataset.tono)));
    $('metodo').textContent = `n = ${plural(frases.length, 'frase', 'frases')} de ${plural(personas, 'persona', 'personas')} · frases extraídas por LLM de cada audio · temas agrupados por LLM · tono derivado de la emoción detectada`;
    const recientes = new Set(frases.slice(-N_ULTIMAS).map(f => f.id));

    // Map: one <g> per cluster, keyed by id so CSS transitions animate moves instead of redrawing.
    const vivos = new Set();
    for (const g of grupos) {
      vivos.add('g' + g.id);
      let n = svg.querySelector(`[data-k="g${CSS.escape(g.id)}"]`);
      if (!n) {
        n = el('g', { class: 'grupo', 'data-k': 'g' + g.id }, svg);
        el('circle', { class: 'fondo', cx: 0, cy: 0 }, n);
        el('text', { class: 'nombre' }, n); el('text', { class: 'sub' }, n);
        el('g', { class: 'puntos' }, n);
        n.addEventListener('click', () => seleccionar(g.id));
      }
      n.classList.toggle('elegido', st.sel === g.id);
      n.classList.toggle('atenuado', !!st.sel && st.sel !== g.id);
      n.style.transform = `translate(${g.cx}px, ${g.cy}px)`;
      n.querySelector('.fondo').setAttribute('r', g.r);
      const [tn, ts] = n.querySelectorAll('text');
      const ls = lineas(g.nombre);
      tn.innerHTML = ls.map((l, i) => `<tspan x="0" dy="${i ? 23 : 0}">${esc(l)}</tspan>`).join('');
      tn.setAttribute('y', g.r + 27);
      ts.textContent = `${plural(g.personas, 'persona', 'personas')} · ${plural(g.frases.length, 'frase', 'frases')}`;
      ts.setAttribute('y', g.r + 27 + 23 * ls.length);
      const pts = n.querySelector('.puntos');
      g.frases.forEach((f, i) => {
        // Sunflower packing: even spacing inside the circle with no physics.
        const rad = esp * Math.sqrt(i + 0.5), ang = i * 2.39996;
        const x = rad * Math.cos(ang), y = rad * Math.sin(ang), t = tono(f.emocion);
        let p = pts.querySelector(`[data-k="${CSS.escape(f.id)}"]`);
        if (!p) {
          p = el('g', { class: 'punto', 'data-k': f.id }, pts);
          const r = esp * (0.24 + 0.2 * Math.max(0, Math.min(1, f.intensidad ?? 0.5)));
          if (visto.size) p.classList.add('nuevo');
          el('circle', { class: 'hit', r: r + 6 }, p);
          el('circle', { class: 'anillo', r: r + 4 }, p);
          el('circle', { class: 'dato', r, fill: `var(--${t})` }, p);
          p.addEventListener('mousemove', ev => mostrarTip(ev, `<q>${esc(f.cita || f.texto)}</q><span>${esc(f.emocion)} (${NOMBRE_TONO[t]}) · intensidad <span class="num">${(f.intensidad ?? 0).toFixed(2)}</span> · ${esc(g.nombre)}</span>`));
          p.addEventListener('mouseleave', ocultarTip);
          visto.add(f.id);
        }
        p.classList.toggle('reciente', recientes.has(f.id));
        p.classList.toggle('filtrado', !st.tonos.has(t));
        p.style.transform = `translate(${x}px, ${y}px)`;
      });
    }
    svg.querySelectorAll('.grupo').forEach(n => vivos.has(n.dataset.k) || n.remove());
    const ids = new Set(frases.map(f => f.id));
    svg.querySelectorAll('.punto').forEach(p => ids.has(p.dataset.k) || (visto.delete(p.dataset.k), p.remove()));

    $('figura').dataset.vista = st.vista;
    document.querySelectorAll('.vista button').forEach(b => b.setAttribute('aria-pressed', b.dataset.vista === st.vista));
    renderRed(frases, grupos, recientes);

    // Ranking: themes by people, each with its tone split and raw counts. Rows are buttons that select the theme.
    $('temas').innerHTML = grupos.slice().sort((a, b) => b.personas - a.personas).map(g => {
      const tot = g.frases.length;
      const seg = ['pos', 'neu', 'neg'].filter(t => g.tonos[t]).map(t => `<div style="flex-grow:${g.tonos[t]};background:var(--${t})" data-t="${t}" data-n="${g.tonos[t]}" data-tot="${tot}"></div>`).join('');
      return `<button class="tema" data-id="${esc(g.id)}" aria-pressed="${st.sel === g.id}"><span class="fila"><b>${esc(g.nombre)}</b><span class="num">${plural(g.personas, 'persona', 'personas')}</span></span><span class="barra">${seg}</span><span class="conteo num">${g.tonos.pos} pos · ${g.tonos.neu} neu · ${g.tonos.neg} neg</span></button>`;
    }).join('') || '<p class="vacio">Todavía no hay respuestas.</p>';

    // Detail panel: the selected theme's frases, or the latest ones.
    const det = $('detalle');
    det.classList.toggle('abierto', !!st.sel);
    if (st.sel) {
      const g = porCluster.get(st.sel);
      const lista = g.frases.filter(f => st.tonos.has(tono(f.emocion))).reverse();
      det.innerHTML = `<div class="cabeza"><h2>${esc(g.nombre)}</h2><button id="cerrar">Cerrar</button></div><p class="resumen">${esc(g.resumen)}</p>` +
        (lista.map(f => cita(f)).join('') || '<p class="vacio">Ninguna frase con los tonos elegidos.</p>');
      det.dataset.ultima = '';
    } else {
      const ultimas = frases.slice(-N_ULTIMAS).reverse();
      det.innerHTML = '<h2>Lo último que se dijo</h2>' + (ultimas.map((f, i) => cita(f, porCluster.get(f.cluster_id)?.nombre, i === 0 && f.id !== det.dataset.ultima)).join('') || '<p class="vacio">Todavía no hay frases.</p>');
      det.dataset.ultima = ultimas[0]?.id ?? '';
    }
  }

  // Network view. Nodes persist between renders so the simulation continues smoothly as data changes.
  // Themes start at their grid cell from layout() and are pulled back there, which keeps clusters apart and stable.
  const red = $('red');
  red.setAttribute('viewBox', `0 0 ${W} ${H}`);
  const capaAristas = el('g', {}, red), capaNodos = el('g', {}, red), capaTemas = el('g', {}, red); // themes on top so labels stay readable
  const R = { nodos: new Map(), aristas: [], alfa: 0, raf: 0 };
  const QUIETO = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const CARGA = { tema: 3, frase: 1, persona: 0.8 };

  function renderRed(frases, grupos, recientes) {
    const quiero = new Map(), temasPorPersona = new Map(), frasesPorPersona = new Map();
    grupos.forEach(g => quiero.set('t' + g.id, { tipo: 'tema', g }));
    frases.forEach(f => {
      quiero.set('f' + f.id, { tipo: 'frase', f });
      quiero.set('p' + f.respuesta_id, { tipo: 'persona', p: f.respuesta_id });
      if (!temasPorPersona.has(f.respuesta_id)) { temasPorPersona.set(f.respuesta_id, new Set()); frasesPorPersona.set(f.respuesta_id, 0); }
      temasPorPersona.get(f.respuesta_id).add(f.cluster_id);
      frasesPorPersona.set(f.respuesta_id, frasesPorPersona.get(f.respuesta_id) + 1);
    });
    for (const [id, n] of R.nodos) if (!quiero.has(id)) { n.el.remove(); R.nodos.delete(id); }

    const seleccion = new Set();
    if (st.sel) {
      seleccion.add('t' + st.sel);
      frases.filter(f => f.cluster_id === st.sel).forEach(f => { seleccion.add('f' + f.id); seleccion.add('p' + f.respuesta_id); });
    }

    for (const [id, q] of quiero) {
      let n = R.nodos.get(id);
      if (!n) {
        // New nodes appear next to the node they attach to, so they visibly fly out of their theme.
        const ancla = q.tipo === 'tema' ? { x: q.g.cx, y: q.g.cy } : q.tipo === 'frase' ? R.nodos.get('t' + q.f.cluster_id) : R.nodos.get('f' + frases.find(f => f.respuesta_id === q.p).id);
        n = { id, tipo: q.tipo, x: (ancla?.x ?? W / 2) + (Math.random() - 0.5) * 40, y: (ancla?.y ?? H / 2) + (Math.random() - 0.5) * 40, vx: 0, vy: 0 };
        n.el = el('g', { class: `nodo ${q.tipo}` }, q.tipo === 'tema' ? capaTemas : capaNodos);
        if (q.tipo === 'tema') {
          el('circle', { r: 22 }, n.el); el('text', { class: 'cuenta' }, n.el); el('text', { class: 'nombre' }, n.el);
          n.el.addEventListener('click', () => seleccionar(n.q.g.id));
        } else if (q.tipo === 'frase') {
          const r = 4.5 + 5 * Math.max(0, Math.min(1, q.f.intensidad ?? 0.5));
          el('circle', { class: 'anillo', r: r + 4 }, n.el); el('circle', { class: 'dato', r, fill: `var(--${tono(q.f.emocion)})` }, n.el);
          n.el.addEventListener('click', () => seleccionar(q.f.cluster_id));
        } else {
          el('circle', { r: 5 }, n.el);
        }
        n.el.addEventListener('mouseenter', () => enfocar(n));
        n.el.addEventListener('mousemove', ev => mostrarTip(ev, textoNodo(n)));
        n.el.addEventListener('mouseleave', () => { red.classList.remove('foco'); red.querySelectorAll('.vecino').forEach(x => x.classList.remove('vecino')); ocultarTip(); });
        R.nodos.set(id, n); R.alfa = 1;
      }
      n.q = q;
      if (q.tipo === 'tema') {
        if (n.hx !== q.g.cx || n.hy !== q.g.cy) R.alfa = Math.max(R.alfa, 0.5); // grid changed: let the hub glide to its new cell
        n.hx = q.g.cx; n.hy = q.g.cy;
        n.r = 14 + 4 * Math.sqrt(q.g.personas);
        n.el.querySelector('circle').setAttribute('r', n.r);
        n.el.querySelector('.cuenta').textContent = q.g.personas;
        const ls = lineas(q.g.nombre);
        n.el.querySelector('.nombre').innerHTML = ls.map((l, i) => `<tspan x="0" dy="${i ? 19 : 0}">${esc(l)}</tspan>`).join('');
        n.el.querySelector('.nombre').setAttribute('y', n.r + 20);
        n.el.classList.toggle('elegido', st.sel === q.g.id);
      }
      if (q.tipo === 'frase') { n.el.classList.toggle('reciente', recientes.has(q.f.id)); n.el.classList.toggle('filtrado', !st.tonos.has(tono(q.f.emocion))); }
      if (q.tipo === 'persona') { n.temas = temasPorPersona.get(q.p).size; n.frases = frasesPorPersona.get(q.p); n.el.classList.toggle('puente', n.temas > 1); }
      n.el.classList.toggle('atenuado', !!st.sel && !seleccion.has(id));
    }

    capaAristas.innerHTML = '';
    R.aristas = frases.flatMap(f => [['p' + f.respuesta_id, 'f' + f.id, 38, ''], ['f' + f.id, 't' + f.cluster_id, 78, tono(f.emocion)]]).map(([a, b, largo, t]) => {
      const line = el('line', t ? { class: 'ft', stroke: `var(--${t})` } : {}, capaAristas);
      if (st.sel && !(seleccion.has(a) && seleccion.has(b))) line.classList.add('atenuado');
      return { a: R.nodos.get(a), b: R.nodos.get(b), largo, line };
    });

    if (QUIETO) { R.alfa = 1; while (R.alfa > 0.005) simular(); dibujar(); }
    else if (st.vista === 'red' && !R.raf) R.raf = requestAnimationFrame(paso);
    else dibujar();
  }

  function simular() {
    const ns = [...R.nodos.values()], a = R.alfa;
    for (let i = 0; i < ns.length; i++) for (let j = i + 1; j < ns.length; j++) {
      const p = ns[i], q = ns[j], dx = q.x - p.x, dy = q.y - p.y, d2 = dx * dx + dy * dy + 1, d = Math.sqrt(d2);
      if (d > 320) continue;
      const f = 900 * CARGA[p.tipo] * CARGA[q.tipo] / d2 * a;
      p.vx -= dx / d * f; p.vy -= dy / d * f; q.vx += dx / d * f; q.vy += dy / d * f;
    }
    for (const { a: p, b: q, largo } of R.aristas) {
      const dx = q.x - p.x, dy = q.y - p.y, d = Math.hypot(dx, dy) || 1, k = (d - largo) / d * 0.1 * a;
      p.vx += dx * k; p.vy += dy * k; q.vx -= dx * k; q.vy -= dy * k;
    }
    for (const n of ns) {
      // Theme hubs are pinned to their grid cell (eased, not simulated); only frases and people float.
      if (n.tipo === 'tema') { n.x += (n.hx - n.x) * 0.2; n.y += (n.hy - n.y) * 0.2; n.vx = n.vy = 0; continue; }
      n.vx += (W / 2 - n.x) * 0.0008 * a; n.vy += (H / 2 - n.y) * 0.0008 * a;
      n.vx *= 0.6; n.vy *= 0.6;
      n.x = Math.max(16, Math.min(W - 16, n.x + n.vx)); n.y = Math.max(16, Math.min(H - 40, n.y + n.vy));
    }
    R.alfa *= 0.985;
  }

  function dibujar() {
    for (const n of R.nodos.values()) n.el.setAttribute('transform', `translate(${n.x.toFixed(1)} ${n.y.toFixed(1)})`);
    for (const { a, b, line } of R.aristas) { line.setAttribute('x1', a.x); line.setAttribute('y1', a.y); line.setAttribute('x2', b.x); line.setAttribute('y2', b.y); }
  }

  function paso() {
    R.raf = 0;
    if (st.vista !== 'red') return;
    simular(); dibujar();
    if (R.alfa > 0.005) R.raf = requestAnimationFrame(paso);
  }

  // Hover: light up the node's neighbourhood. People and themes reach two steps (their frases and what those connect to).
  function enfocar(n) {
    const junto = m => R.aristas.flatMap(e => e.a === m ? [e.b] : e.b === m ? [e.a] : []);
    const cerca = junto(n), vecinos = new Set([n, ...cerca]);
    if (n.tipo !== 'frase') cerca.forEach(m => junto(m).forEach(x => vecinos.add(x))); // a frase has one person and one theme
    red.classList.add('foco');
    vecinos.forEach(v => v.el.classList.add('vecino'));
    R.aristas.forEach(e => vecinos.has(e.a) && vecinos.has(e.b) && e.line.classList.add('vecino'));
  }

  function textoNodo(n) {
    const q = n.q;
    if (q.tipo === 'tema') return `<b>${esc(q.g.nombre)}</b><br><span>${plural(q.g.personas, 'persona', 'personas')} · ${plural(q.g.frases.length, 'frase', 'frases')} · clic para ver</span>`;
    if (q.tipo === 'frase') return `<q>${esc(q.f.cita || q.f.texto)}</q><span>${esc(q.f.emocion)} (${NOMBRE_TONO[tono(q.f.emocion)]}) · intensidad <span class="num">${(q.f.intensidad ?? 0).toFixed(2)}</span></span>`;
    return `<b>Una persona</b><br><span>${plural(n.frases, 'frase', 'frases')} en ${plural(n.temas, 'tema', 'temas')}${n.temas > 1 ? ' · une temas' : ''}</span>`;
  }

  // Controls
  document.querySelector('.vista').addEventListener('click', e => { const b = e.target.closest('[data-vista]'); if (b) { st.vista = b.dataset.vista; render(); } });
  $('play').addEventListener('click', () => {
    if (!st.jugando && st.cursor >= st.orden.length) st.cursor = 0;
    st.jugando = !st.jugando; st.envivo = false; render();
  });
  $('cursor').addEventListener('input', e => { st.cursor = +e.target.value; st.jugando = false; st.envivo = st.cursor === st.orden.length; render(); });
  $('vivo').addEventListener('click', () => { st.cursor = st.orden.length; st.jugando = false; st.envivo = true; render(); });
  document.querySelector('.filtro').addEventListener('click', e => {
    const b = e.target.closest('[data-tono]'); if (!b) return;
    st.tonos.has(b.dataset.tono) ? st.tonos.delete(b.dataset.tono) : st.tonos.add(b.dataset.tono); render();
  });
  $('temas').addEventListener('click', e => { const b = e.target.closest('.tema'); if (b) seleccionar(st.datos.clusters.find(c => String(c.id) === b.dataset.id)?.id); });
  $('detalle').addEventListener('click', e => { if (e.target.id === 'cerrar') seleccionar(st.sel); });
  $('temas').addEventListener('mousemove', ev => {
    const s = ev.target.closest('[data-t]');
    if (!s) return ocultarTip();
    mostrarTip(ev, `<b class="num">${s.dataset.n} de ${s.dataset.tot}</b> frases con tono ${NOMBRE_TONO[s.dataset.t]}`);
  });
  $('temas').addEventListener('mouseleave', ocultarTip);
  const teclas = e => {
    if (e.target.closest('input, button')) return;
    if (e.key === ' ') { e.preventDefault(); $('play').click(); }
    else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { st.cursor = Math.max(0, Math.min(st.orden.length, st.cursor + (e.key === 'ArrowRight' ? 1 : -1))); st.jugando = false; st.envivo = st.cursor === st.orden.length; render(); }
    else if (e.key === 'Escape' && st.sel) seleccionar(st.sel);
  };
  document.addEventListener('keydown', teclas);

  const reloj = setInterval(avanzar, PLAY_MS);
  return { recibir, desmontar() { clearInterval(reloj); cancelAnimationFrame(R.raf); document.removeEventListener('keydown', teclas); } };
}
