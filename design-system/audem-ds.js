/* @ds-bundle: {"format":4,"namespace":"Audem","components":[{"name":"Marca"},{"name":"Onda"},{"name":"Boton"},{"name":"Selector"},{"name":"Pastilla"},{"name":"Perilla"},{"name":"Rama"},{"name":"Orbe"},{"name":"Panel"},{"name":"Agente"},{"name":"Escena"}]} */
(function () {
  var R = window.React, h = R.createElement;

  function cx() { var a = []; for (var i = 0; i < arguments.length; i++) if (arguments[i]) a.push(arguments[i]); return a.join(' '); }
  function omit(o, ks) { var r = {}; for (var k in o) if (ks.indexOf(k) < 0) r[k] = o[k]; return r; }
  function f2(n) { return Math.round(n * 100) / 100; }
  var useUid = R.useId ? function () { return 'au' + R.useId().replace(/[^A-Za-z0-9]/g, ''); }
    : function () { var r = R.useRef(null); if (!r.current) r.current = 'au' + Math.random().toString(36).slice(2, 8); return r.current; };

  /* Cifras a la chilena: 1.240 · 4,8 */
  function cifra(n, dec) {
    if (n == null || isNaN(n)) return '';
    return Number(n).toLocaleString('es-CL', { minimumFractionDigits: dec || 0, maximumFractionDigits: dec || 0 });
  }
  /* Margen de error en puntos, 95 % de confianza, peor caso p = 0,5 */
  function margen(voces) { return voces > 0 ? 98 / Math.sqrt(voces) : null; }

  /* ---------- Marca ---------- */
  var ONDAS = ['M6 12C18 6 30 30 48 32', 'M6 22C18 18 30 34 48 32', 'M6 32C18 26 30 38 48 32', 'M6 42C18 46 30 30 48 32', 'M6 52C18 58 30 34 48 32'];
  function Simbolo(p) {
    var a = p.alto || 40;
    return h('svg', { className: 'au-simbolo', width: a, height: a, viewBox: '0 0 64 64', 'aria-hidden': 'true' },
      h('g', { fill: 'none', stroke: 'currentColor', strokeWidth: 3.5, strokeLinecap: 'round' },
        ONDAS.map(function (d, i) { return h('path', { key: i, d: d }); })),
      h('circle', { cx: 55, cy: 32, r: 5, className: 'au-simbolo-punto' }));
  }
  function Marca(p) {
    var t = p.tamano || 48;
    var label = p.segunda ? 'audem ' + p.segunda : 'audem';
    return h('span', { className: cx('au-marca', p.segunda && 'is-apilada', p.className), style: { fontSize: t + 'px' }, role: 'img', 'aria-label': label },
      p.simbolo === false ? null : h(Simbolo, { alto: Math.round(t * (p.segunda ? 1.5 : 0.95)) }),
      h('span', { className: 'au-marca-txt', 'aria-hidden': 'true' },
        h('span', { className: 'au-marca-nombre' }, 'audem'),
        p.segunda ? h('span', { className: 'au-marca-segunda' }, p.segunda) : null));
  }

  /* ---------- Onda ---------- */
  function Onda(p) {
    return h('svg', { className: cx('au-onda', p.className), viewBox: '0 0 1200 80', preserveAspectRatio: 'none', 'aria-hidden': 'true', style: p.alto ? { height: p.alto + 'px' } : null },
      h('path', { d: 'M0 44C140 14 280 4 420 16S720 78 860 76 1100 40 1200 34', fill: 'none', vectorEffect: 'non-scaling-stroke' }));
  }

  /* ---------- Boton ---------- */
  function Boton(p) {
    var v = p.variante || 'primario';
    var rest = omit(p, ['variante', 'className', 'children', 'activo']);
    if (v === 'grabar') {
      return h('button', Object.assign({ type: 'button', 'aria-label': p.activo ? 'Detener' : 'Grabar', 'aria-pressed': !!p.activo }, rest, { className: cx('au-btn-grabar', p.activo && 'is-on', p.className) }),
        h('span', { className: 'au-btn-grabar-icono', 'aria-hidden': 'true' }));
    }
    return h('button', Object.assign({ type: 'button' }, rest, { className: cx('au-btn', 'au-btn--' + v, p.className) }), p.children);
  }

  /* ---------- Selector ---------- */
  function norm(o) { return typeof o === 'string' ? { valor: o, etiqueta: o } : o; }
  function Selector(p) {
    var ops = (p.opciones || []).map(norm);
    var st = R.useState(p.valorInicial != null ? p.valorInicial : (ops[0] && ops[0].valor));
    var val = p.valor != null ? p.valor : st[0];
    var grupo = h('div', { className: 'au-sel', role: 'group', 'aria-label': p.etiqueta || null },
      ops.map(function (o) {
        return h('button', { key: o.valor, type: 'button', className: 'au-sel-op', 'aria-pressed': o.valor === val,
          onClick: function () { st[1](o.valor); if (p.onChange) p.onChange(o.valor); } }, o.etiqueta);
      }));
    if (!p.etiqueta) return h('div', { className: cx('au-campo', p.className) }, grupo);
    return h('div', { className: cx('au-campo', p.className) }, grupo, h('span', { className: 'au-campo-etq', 'aria-hidden': 'true' }, p.etiqueta));
  }

  /* ---------- Pastilla ---------- */
  function Pastilla(p) {
    return h('span', { className: cx('au-pas', 'au-pas--' + (p.tono || 'coral'), p.className) }, p.children);
  }

  /* ---------- Perilla ---------- */
  function punto(c, r, ang) { var a = (ang - 90) * Math.PI / 180; return [f2(c + r * Math.cos(a)), f2(c + r * Math.sin(a))]; }
  function arco(c, r, a0, a1) {
    var p0 = punto(c, r, a0), p1 = punto(c, r, a1);
    return 'M' + p0[0] + ' ' + p0[1] + 'A' + r + ' ' + r + ' 0 ' + (a1 - a0 > 180 ? 1 : 0) + ' 1 ' + p1[0] + ' ' + p1[1];
  }
  function Perilla(p) {
    var s = p.tamano || 64, c = s / 2, r = c - 3;
    var min = p.min || 0, max = p.max == null ? 100 : p.max;
    var v = Math.max(min, Math.min(max, p.valor || 0)), t = (v - min) / (max - min || 1);
    var txt = p.texto != null ? p.texto : cifra(v);
    return h('div', { className: cx('au-peri', p.className), role: 'meter', 'aria-valuemin': min, 'aria-valuemax': max, 'aria-valuenow': v, 'aria-valuetext': txt, 'aria-label': p.etiqueta },
      h('svg', { width: s, height: s, viewBox: '0 0 ' + s + ' ' + s, 'aria-hidden': 'true' },
        h('path', { className: 'au-peri-pista', d: arco(c, r, -135, 135) }),
        t > 0.004 ? h('path', { className: 'au-peri-valor', d: arco(c, r, -135, -135 + 270 * Math.min(t, 0.9999)) }) : null,
        h('text', { className: 'au-peri-num', x: c, y: c, textAnchor: 'middle', dominantBaseline: 'central', fontSize: Math.round(s * 0.26) }, txt)),
      p.etiqueta ? h('span', { className: 'au-peri-etq', 'aria-hidden': 'true' }, p.etiqueta) : null);
  }

  /* ---------- Rama ---------- */
  var TONO = { validada: 'turquesa', provisional: 'neutro', minoritaria: 'lila' };
  function Rama(p) {
    var pct = Math.max(0, Math.min(100, p.porcentaje || 0));
    var m = p.margen != null ? p.margen : margen(p.voces);
    var est = p.estado || 'provisional';
    var lo = Math.max(0, pct - (m || 0)), hi = Math.min(100, pct + (m || 0));
    var desc = cifra(pct) + ' % de acuerdo' + (m != null ? ', margen más o menos ' + cifra(m, 1) + ' puntos' : '');
    return h('div', { className: cx('au-rama', 'is-' + est, p.className) },
      h('div', { className: 'au-rama-fila' },
        h('p', { className: 'au-rama-txt' }, p.texto),
        h(Pastilla, { tono: TONO[est] || 'neutro' }, est)),
      h('div', { className: 'au-rama-barra', role: 'img', 'aria-label': desc },
        m != null ? h('span', { className: 'au-rama-banda', style: { left: lo + '%', width: (hi - lo) + '%' } }) : null,
        h('span', { className: 'au-rama-valor', style: { width: pct + '%' } })),
      h('p', { className: 'au-rama-meta' },
        h('strong', null, cifra(pct) + ' %'), ' de acuerdo',
        p.voces != null ? ' · ' + cifra(p.voces) + ' voces' : '',
        m != null ? ' · ±' + cifra(m, 1) + ' pts' : ''));
  }

  /* ---------- Orbe ---------- */
  function curva(pts) {
    var n = pts.length, d = '';
    for (var i = 0; i < n; i++) {
      var p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
      if (i === 0) d += 'M' + f2(p1[0]) + ' ' + f2(p1[1]);
      d += 'C' + f2(p1[0] + (p2[0] - p0[0]) / 6) + ' ' + f2(p1[1] + (p2[1] - p0[1]) / 6) + ' ' +
        f2(p2[0] - (p3[0] - p1[0]) / 6) + ' ' + f2(p2[1] - (p3[1] - p1[1]) / 6) + ' ' + f2(p2[0]) + ' ' + f2(p2[1]);
    }
    return d + 'Z';
  }
  function Orbe(p) {
    var id = useUid();
    var S = p.tamano || 360, ramas = p.ramas && p.ramas.length ? p.ramas : [{}, {}, {}, {}, {}, {}];
    var n = ramas.length, padX = Math.round(S * 0.42), W = S + padX * 2, H = Math.round(S * 1.12);
    var cx0 = W / 2, cy0 = H / 2, rad = function (a) { return (a - 90) * Math.PI / 180; };
    var nodos = ramas.map(function (r, i) {
      var ang = i * 360 / n, peso = r.peso == null ? 0.5 : Math.max(0, Math.min(1, r.peso));
      var rr = S * 0.21 * (0.8 + 0.75 * peso);
      return { ang: ang, rr: rr, x: cx0 + rr * Math.cos(rad(ang)), y: cy0 + rr * Math.sin(rad(ang)), r: r };
    });
    var pts = [];
    nodos.forEach(function (nd, i) {
      var sig = nodos[(i + 1) % n], am = nd.ang + 180 / n, rm = (nd.rr + sig.rr) / 2 * (i % 2 ? 0.86 : 0.95);
      pts.push([nd.x, nd.y]);
      pts.push([cx0 + rm * Math.cos(rad(am)), cy0 + rm * Math.sin(rad(am))]);
    });
    var d = curva(pts), orig = cx0 + 'px ' + cy0 + 'px', blur = S * 0.055;
    var rLin = S * 0.43, rEtq = S * 0.47, rOrb = S * 0.37;
    var mancha = function (k, x, y, rx, ry) { return h('ellipse', { key: k, className: 'au-orbe-' + k.replace(/[0-9]/g, ''), cx: cx0 + x * S, cy: cy0 + y * S, rx: rx * S, ry: ry * S }); };
    return h('svg', { className: cx('au-orbe', p.animado === false && 'is-quieto', p.className), viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': p.descripcion || ('Mapa de ' + n + ' ramas') },
      h('defs', null,
        h('clipPath', { id: id + 'c' }, h('path', { d: d })),
        h('filter', { id: id + 'b', x: '-50%', y: '-50%', width: '200%', height: '200%' }, h('feGaussianBlur', { stdDeviation: f2(blur) })),
        h('filter', { id: id + 'h', x: '-50%', y: '-50%', width: '200%', height: '200%' }, h('feGaussianBlur', { stdDeviation: f2(S * 0.07) })),
        h('radialGradient', { id: id + 'g', gradientUnits: 'userSpaceOnUse', cx: f2(cx0 - S * 0.03), cy: f2(cy0 - S * 0.02), r: f2(S * 0.33) },
          h('stop', { offset: '0', style: { stopColor: 'var(--turquesa)' } }),
          h('stop', { offset: '0.3', style: { stopColor: 'var(--turquesa)' } }),
          h('stop', { offset: '0.62', style: { stopColor: 'var(--coral)' } }),
          h('stop', { offset: '0.86', style: { stopColor: 'var(--coral)' } }),
          h('stop', { offset: '1', style: { stopColor: 'var(--oro)' } }))),
      h('circle', { className: 'au-orbe-orbita', cx: cx0, cy: cy0, r: rOrb }),
      nodos.map(function (nd, i) {
        var e = [cx0 + rLin * Math.cos(rad(nd.ang)), cy0 + rLin * Math.sin(rad(nd.ang))];
        return h('line', { key: 'l' + i, className: 'au-orbe-radio', x1: f2(cx0 + S * 0.08 * Math.cos(rad(nd.ang))), y1: f2(cy0 + S * 0.08 * Math.sin(rad(nd.ang))), x2: f2(e[0]), y2: f2(e[1]) });
      }),
      h('g', { className: 'au-orbe-respira', style: { transformOrigin: orig } },
        h('path', { className: 'au-orbe-halo', d: d, filter: 'url(#' + id + 'h)', transform: 'translate(' + f2(cx0) + ' ' + f2(cy0) + ') scale(1.14) translate(' + f2(-cx0) + ' ' + f2(-cy0) + ')' }),
        h('g', { clipPath: 'url(#' + id + 'c)' },
          h('rect', { x: 0, y: 0, width: W, height: H, fill: 'url(#' + id + 'g)' }),
          h('g', { className: 'au-orbe-giro', style: { transformOrigin: orig }, filter: 'url(#' + id + 'b)' },
            mancha('coral', -0.13, -0.1, 0.14, 0.09),
            mancha('coral2', 0.14, 0.13, 0.1, 0.07),
            mancha('lila', 0.12, -0.12, 0.07, 0.05),
            mancha('oro', -0.15, 0.12, 0.06, 0.035),
            mancha('brillo', -0.06, -0.15, 0.08, 0.03)))),
      nodos.map(function (nd, i) {
        var r = nd.r, est = r.estado || 'provisional';
        var c = Math.cos(rad(nd.ang)), sn = Math.sin(rad(nd.ang));
        var ex = cx0 + rEtq * c, ey = cy0 + rEtq * sn;
        var anchor = Math.abs(c) < 0.2 ? 'middle' : (c > 0 ? 'start' : 'end');
        var dy = sn < -0.8 ? -14 : (sn > 0.8 ? 6 : -4);
        return h('g', { key: 't' + i },
          h('circle', { className: cx('au-orbe-tirador', 'is-' + est), cx: f2(nd.x), cy: f2(nd.y), r: Math.max(5, S * 0.019) }),
          r.etiqueta ? h('text', { className: 'au-orbe-etq', x: f2(ex), y: f2(ey + dy), textAnchor: anchor },
            r.etiqueta,
            r.detalle ? h('tspan', { className: 'au-orbe-det', x: f2(ex), dy: 15 }, r.detalle) : null) : null);
      }));
  }

  /* ---------- Panel ---------- */
  function Panel(p) {
    return h('section', { className: cx('au-panel', p.hondo && 'is-hondo', p.className) },
      p.titulo ? h('header', { className: 'au-panel-cab' },
        h('h3', { className: 'au-panel-tit' }, p.titulo, p.flecha === false ? null : h('span', { className: 'au-panel-flecha', 'aria-hidden': 'true' }, '→')),
        p.accion ? h(Pastilla, { tono: 'coral' }, p.accion) : null) : null,
      h('div', { className: 'au-panel-cuerpo' }, p.children));
  }

  /* ---------- Agente ---------- */
  var DIAG = { ok: ['turquesa', 'Bien'], alerta: ['coral', 'Revisar'], info: ['neutro', 'Dato'] };
  function MensajeAgente(m) {
    return h('div', { className: 'au-ag-msg' },
      m.texto ? h('p', null, m.texto) : null,
      m.ramas && m.ramas.length ? h('div', { className: 'au-ag-ramas' }, m.ramas.map(function (r, i) { return h(Rama, Object.assign({ key: i }, r)); })) : null,
      m.citas && m.citas.length ? h('div', { className: 'au-ag-citas' }, m.citas.map(function (c, i) {
        return h('figure', { key: i, className: 'au-ag-cita' }, h('blockquote', null, '«' + c.texto + '»'), c.fuente ? h('figcaption', null, c.fuente) : null);
      })) : null,
      m.diagnostico && m.diagnostico.length ? h('div', { className: 'au-ag-diag' }, m.diagnostico.map(function (d, i) {
        var t = DIAG[d.estado] || DIAG.info;
        return h('div', { key: i, className: 'au-ag-diag-fila' },
          h('span', { className: 'au-ag-diag-etq' }, d.etiqueta),
          h('span', { className: 'au-ag-diag-val' }, d.valor),
          h(Pastilla, { tono: t[0] }, t[1]));
      })) : null,
      m.accion ? h(Boton, { variante: 'contorno', className: 'au-ag-accion', onClick: m.accion.onClick }, m.accion.etiqueta) : null,
      m.base ? h('p', { className: 'au-ag-base' }, m.base) : null);
  }
  function Agente(p) {
    var id = useUid();
    var txt = R.useState(''), modo = R.useState(p.modoInicial || 'consultar');
    var lista = R.useRef(null);
    var n = (p.mensajes || []).length;
    R.useEffect(function () { var el = lista.current; if (el) el.scrollTop = el.scrollHeight; }, [n, !!p.pensando]);
    function enviar(t) {
      t = (t || '').trim();
      if (!t || p.pensando) return;
      if (p.onEnviar) p.onEnviar(t, modo[0]);
      txt[1]('');
    }
    var sug = p.sugerencias ? (Array.isArray(p.sugerencias) ? p.sugerencias : (p.sugerencias[modo[0]] || [])) : [];
    return h('aside', { className: cx('au-ag', p.className), 'aria-label': p.titulo || 'Agente de Audem' },
      h('header', { className: 'au-ag-cab' },
        h('div', { className: 'au-ag-id' },
          h('span', { className: 'au-ag-avatar', 'aria-hidden': 'true' }),
          h('div', null,
            h('p', { className: 'au-ag-nombre' }, p.titulo || 'Agente de Audem'),
            h('p', { className: 'au-ag-sub' }, p.subtitulo || 'Responde solo con lo que dijo la gente'))),
        p.onCerrar ? h('button', { type: 'button', className: 'au-ag-cerrar', 'aria-label': 'Cerrar el agente', onClick: p.onCerrar }, '×') : null),
      p.modos === false ? null : h(Selector, { className: 'au-ag-modo', etiqueta: null, valor: modo[0], onChange: modo[1],
        opciones: [{ valor: 'consultar', etiqueta: 'Consultar' }, { valor: 'diagnosticar', etiqueta: 'Diagnosticar' }] }),
      h('div', { className: 'au-ag-lista', ref: lista, role: 'log', 'aria-live': 'polite' },
        n === 0 && !p.pensando ? h('p', { className: 'au-ag-vacio' }, modo[0] === 'diagnosticar'
          ? 'Revisa la calidad de las voces: quién falta, qué audios se entendieron mal, qué rama tiene poco respaldo.'
          : 'Pregunta qué dijo la gente. Te respondo con sus palabras y con cuántas voces lo dicen.') : null,
        (p.mensajes || []).map(function (m, i) {
          return m.de === 'persona' ? h('p', { key: i, className: 'au-ag-yo' }, m.texto) : h(MensajeAgente, Object.assign({ key: i }, m));
        }),
        p.pensando ? h('p', { className: 'au-ag-pensando' }, p.pensando === true ? 'Leyendo las voces…' : p.pensando) : null),
      sug.length && !p.pensando ? h('div', { className: 'au-ag-sug', role: 'group', 'aria-label': 'Preguntas sugeridas' }, sug.map(function (s) {
        return h('button', { key: s, type: 'button', className: 'au-ag-chip', onClick: function () { enviar(s); } }, s);
      })) : null,
      h('form', { className: 'au-ag-form', onSubmit: function (e) { e.preventDefault(); enviar(txt[0]); } },
        h('label', { className: 'au-oculto', htmlFor: id + 'q' }, 'Tu pregunta'),
        h('textarea', { id: id + 'q', rows: 1, value: txt[0],
          placeholder: modo[0] === 'diagnosticar' ? '¿Hay sesgo por edad?' : 'Pregunta sobre lo que dijo la gente',
          onChange: function (e) { txt[1](e.target.value); },
          onKeyDown: function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviar(txt[0]); } } }),
        h('button', { type: 'submit', className: 'au-ag-enviar', 'aria-label': 'Enviar', disabled: !txt[0].trim() || !!p.pensando }, '→')));
  }

  /* ---------- Escena: el Orbe al centro y el agente al lado ---------- */
  function Escena(p) {
    var ab = R.useState(!!p.abierto);
    var msgs = R.useState(p.mensajes || []), pens = R.useState(false);
    function enviar(t, modo) {
      msgs[1](function (prev) { return prev.concat([{ de: 'persona', texto: t }]); });
      if (!p.responder) return;
      pens[1](true);
      Promise.resolve(p.responder(t, modo)).then(function (r) {
        pens[1](false);
        if (r) msgs[1](function (prev) { return prev.concat([Object.assign({ de: 'agente' }, r)]); });
      }, function () {
        pens[1](false);
        msgs[1](function (prev) { return prev.concat([{ de: 'agente', texto: 'No pude leer las voces ahora. Vuelve a preguntar en un momento.' }]); });
      });
    }
    return h('div', { className: cx('au-escena', ab[0] && 'is-abierta', p.className), style: p.alto ? { '--alto-escena': p.alto + 'px' } : null },
      h('div', { className: 'au-escena-grid' },
        h('div', { className: 'au-escena-orbe' },
          h(Orbe, { ramas: p.ramas, tamano: p.tamano, descripcion: p.descripcion, animado: p.animado }),
          ab[0] ? null : h('button', { type: 'button', className: 'au-escena-activar', 'aria-expanded': false, onClick: function () { ab[1](true); } },
            h('span', { className: 'au-ag-avatar', 'aria-hidden': 'true' }), p.etiquetaActivar || 'Pregúntale al mapa')),
        ab[0] ? h(Agente, Object.assign({}, p.agente, { mensajes: msgs[0], pensando: pens[0], onEnviar: enviar, onCerrar: function () { ab[1](false); } })) : null));
  }

  var C = window;
  C.Audem = C.Audem || {};
  Object.assign(C.Audem, { Marca: Marca, Onda: Onda, Boton: Boton, Selector: Selector, Pastilla: Pastilla, Perilla: Perilla, Rama: Rama, Orbe: Orbe, Panel: Panel, Agente: Agente, Escena: Escena, Simbolo: Simbolo, margen: margen, cifra: cifra });
})();
