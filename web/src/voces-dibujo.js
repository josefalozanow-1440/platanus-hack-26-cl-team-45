// Voces: tópicos en vivo como un blob 3D (Three.js) con un eje por tópico y un punto por persona.
// Vanilla on purpose, like flujo-dibujo.js: React owns the card, this file owns canvas + SVG.
// Three.js comes from cdnjs like qrcode in index.html, so it adds nothing to the bundle or the lockfiles.

const EJES = 6;                                          // the 6 tópicos with most people get an axis
const TONO = { positivo: 'pos', negativo: 'neg', mixto: 'neu', neutro: 'neu' };
const RADIO = { leve: 4, moderada: 5, fuerte: 6.5 };      // dot size = strongest intensity of the person in that tópico
const NS = 'http://www.w3.org/2000/svg';
const el = (tag, attrs = {}) => { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); return n; };

function cargarThree() {
  if (window.THREE) return Promise.resolve(window.THREE);
  return new Promise((ok, mal) => {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    s.onload = () => ok(window.THREE); s.onerror = mal;
    document.head.appendChild(s);
  });
}

// Simplex noise 3D (Ashima Arts / Stefan Gustavson, MIT)
const NOISE = `
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;vec4 j=p-49.*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.-abs(x)-abs(y);vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const VERT = NOISE + `
uniform float uTime; uniform vec3 uDirs[6]; uniform float uVals[6]; uniform float uPulse[6]; uniform float uAmp;
varying vec3 vN; varying float vD; varying vec3 vView;
float disp(vec3 p){
  float d = snoise(p * 1.2 + uTime * 0.08) * uAmp + snoise(p * 2.2 - uTime * 0.1) * uAmp * 0.2;
  for(int i=0;i<6;i++){
    float k = pow(max(dot(p, uDirs[i]), 0.), 5.);
    d += k * (uVals[i] * (0.45 + 0.08 * snoise(p * 2.5 + float(i) + uTime * 0.15)) + uPulse[i] * 0.12);
  }
  return d;
}
vec3 move(vec3 p){ return p * (1. + disp(p)); }
void main(){
  vec3 p = normalize(position);
  vec3 t = normalize(cross(p, abs(p.y) < .99 ? vec3(0,1,0) : vec3(1,0,0)));
  vec3 b = cross(p, t);
  vec3 P = move(p), A = move(normalize(p + t*.01)), B = move(normalize(p + b*.01));
  vN = normalize(normalMatrix * cross(A - P, B - P));
  vD = disp(p);
  vec4 mv = modelViewMatrix * vec4(P, 1.);
  vView = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}`;

// Same palette as comun.css: --neg in the ridges and rim, --pos in the valleys.
const FRAG = `
varying vec3 vN; varying float vD; varying vec3 vView;
void main(){
  vec3 neg = vec3(0.925, 0.329, 0.286), pos = vec3(0.086, 0.659, 0.753), luz = vec3(1.0, 0.97, 0.92);
  float fres = pow(1. - max(dot(vN, vView), 0.), 2.);
  float diff = max(dot(vN, normalize(vec3(-.4,.6,.7))), 0.);
  vec3 col = mix(pos, neg, smoothstep(0.0, 0.35, vD + fres * 0.6));
  col *= 0.65 + 0.45 * diff;
  gl_FragColor = vec4(mix(col, luz, pow(diff, 24.) * 0.6), 1.);
}`;

export function montar({ escenario, svg, onSelect }) {
  let THREE, renderer, camera, scene, blob, uniforms, clock;
  let W, H, cx, cy, R, ultimo = null;
  const ejeDe = new Map();                               // tid → axis index, stable while the tópico stays in the top 6
  const topicoDe = Array(EJES).fill(null);               // axis → tópico
  const puntos = new Map();                              // `${tid}|${respuestaId}` → { el, eje, j, n, nacio, celda }
  const objetivo = Array(EJES).fill(0), pulsoEn = Array(EJES).fill(-99);
  let ampObjetivo = 0.03, primera = true, seleccion = null;
  const reducir = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ahora = () => clock ? clock.getElapsedTime() : 0;

  const anillo = svg.appendChild(el('circle', { class: 'anillo' }));
  const ejes = [], nodos = [], nombres = [], cuentas = [];
  for (let i = 0; i < EJES; i++) {
    ejes.push(svg.appendChild(el('line', { class: 'eje' })));
    nodos.push(svg.appendChild(el('circle', { r: 6, class: 'nodo' })));
    nombres.push(svg.appendChild(el('text', { class: 'nombre' })));
    cuentas.push(svg.appendChild(el('text', { class: 'cuenta num' })));
  }
  const capaPuntos = svg.appendChild(el('g'));
  const angulo = i => -(Math.PI / 2 + i * Math.PI / 3);  // screen angle, y down; axis 0 points up

  function medir() {
    W = innerWidth; H = innerHeight;
    const ancho = W >= 1000;                             // wide: card on the right, blob centered in what is left
    cx = ancho ? (W - 420) / 2 + 16 : W / 2;
    cy = ancho ? H * 0.54 : H * 0.42;
    R = Math.min((ancho ? W - 420 : W) * (ancho || W < 700 ? 0.2 : 0.17), H * 0.22);
    anillo.setAttribute('cx', cx); anillo.setAttribute('cy', cy); anillo.setAttribute('r', R * 0.45);
    if (!renderer) return;
    renderer.setSize(W, H);
    camera.aspect = W / H; camera.updateProjectionMatrix();
    camera.setViewOffset(W, H, W / 2 - cx, H / 2 - cy, W, H);
    blob.scale.setScalar(1.63 * R / H);                  // blob radius ≈ inner ring (1 unit = H / 3.784 px at fov 35, z 6)
  }
  addEventListener('resize', medir); medir();

  function lugar(p) {                                    // arc of dots at the end of the axis, 7 per row
    const fila = Math.floor(p.j / 7), enFila = Math.min(7, p.n - fila * 7), col = p.j % 7;
    const a = angulo(p.eje) + (col - (enFila - 1) / 2) * 0.13, r = R * (1.04 + fila * 0.1);
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
  }

  function seleccionar(clave) {
    seleccion = clave;
    for (const [k, p] of puntos) p.el.classList.toggle('sel', k === clave);
    const p = puntos.get(clave);
    onSelect(p ? { topico: topicoDe[p.eje], celda: p.celda } : null);
  }

  function recibir(d) {
    const tops = d?.topicos?.slice(0, EJES) ?? [];
    const ids = new Set(tops.map(t => t.id));
    for (const [tid, i] of ejeDe) if (!ids.has(tid)) { ejeDe.delete(tid); topicoDe[i] = null; }
    for (const t of tops) {
      if (!ejeDe.has(t.id)) ejeDe.set(t.id, topicoDe.indexOf(null));   // first free axis
      topicoDe[ejeDe.get(t.id)] = t;
    }

    const max = Math.max(1, ...tops.map(t => t.personas));
    const vivos = new Set();
    let nuevo = null;
    tops.forEach(t => {
      const i = ejeDe.get(t.id), antes = objetivo[i];
      objetivo[i] = t.personas / max;
      t.celdas.forEach((c, j) => {
        const clave = `${t.id}|${c.respuestaId}`;
        vivos.add(clave);
        let p = puntos.get(clave);
        if (!p) {
          const e = capaPuntos.appendChild(el('circle', { class: 'punto' }));
          e.addEventListener('click', () => seleccionar(clave));
          p = { el: e, nacio: ahora() + (primera ? j * 0.06 : 0) };
          puntos.set(clave, p);
          if (!primera) { pulsoEn[i] = ahora(); nuevo = clave; }
        }
        const fuerza = Math.max(...c.temas.map(x => RADIO[x.intensidad] ?? 4));
        Object.assign(p, { eje: i, j, n: t.celdas.length, celda: c });
        p.el.setAttribute('r', fuerza);
        p.el.setAttribute('fill', `url(#g-${TONO[c.direccion] ?? 'neu'})`);
      });
      if (!primera && objetivo[i] > antes && pulsoEn[i] < ahora() - 0.1) pulsoEn[i] = ahora();
    });
    for (let i = 0; i < EJES; i++) if (!topicoDe[i]) objetivo[i] = 0;
    for (const [k, p] of puntos) if (!vivos.has(k)) { p.el.remove(); puntos.delete(k); }
    ampObjetivo = 0.03 + Math.min((d?.analizadas ?? 0) / 40, 1) * 0.07;   // more answers = livelier surface
    if (nuevo) seleccionar(nuevo);                                         // the newest person shows in the card
    else if (seleccion && !puntos.has(seleccion)) seleccionar(null);
    if (d) primera = false;
  }

  function cuadro() {
    const t = ahora(), lento = t * (reducir ? 0.2 : 1);
    if (uniforms) {
      uniforms.uTime.value = lento;
      const v = uniforms.uVals.value;
      for (let i = 0; i < EJES; i++) {
        v[i] += (objetivo[i] - v[i]) * 0.04;
        const edad = t - pulsoEn[i];
        uniforms.uPulse.value[i] = reducir ? 0 : Math.exp(-edad * 3) * Math.sin(edad * 14);
      }
      uniforms.uAmp.value += (ampObjetivo - uniforms.uAmp.value) * 0.02;
      blob.rotation.y = Math.sin(lento * 0.08) * 0.1;
    }
    const v = uniforms ? uniforms.uVals.value : objetivo;
    for (let i = 0; i < EJES; i++) {
      const k = topicoDe[i], a = angulo(i), c = Math.cos(a), s = Math.sin(a), r = R * (0.45 + 0.55 * v[i]);
      const vis = k ? '' : 'hidden';
      [ejes[i], nodos[i], nombres[i], cuentas[i]].forEach(n => n.setAttribute('visibility', vis));
      nodos[i].setAttribute('cx', cx + c * r); nodos[i].setAttribute('cy', cy + s * r);
      ejes[i].setAttribute('x1', cx + c * R * 0.45); ejes[i].setAttribute('y1', cy + s * R * 0.45);
      ejes[i].setAttribute('x2', cx + c * R); ejes[i].setAttribute('y2', cy + s * R);
      if (!k) continue;
      const filas = Math.ceil(k.celdas.length / 7), lr = R * (1.04 + (filas - 1) * 0.1) + 22;
      const x = cx + c * lr, y = cy + s * lr + (s < -0.5 ? -20 : s > 0.5 ? 14 : -4);
      const ancla = c > 0.3 ? 'start' : c < -0.3 ? 'end' : 'middle';
      nombres[i].setAttribute('x', x); nombres[i].setAttribute('y', y); nombres[i].setAttribute('text-anchor', ancla);
      const angosto = W < 700, nombre = angosto && k.nombre.length > 16 ? k.nombre.slice(0, 15) + '…' : k.nombre;
      nombres[i].textContent = `${nombre} · ${k.personas}`;
      nombres[i].classList.toggle('on', t - pulsoEn[i] < 1.5);
      cuentas[i].setAttribute('x', x); cuentas[i].setAttribute('y', y + 17); cuentas[i].setAttribute('text-anchor', ancla);
      cuentas[i].textContent = angosto ? '' : `${k.positivo} pos · ${k.neutro + k.mixto} neu · ${k.negativo} neg`;
    }
    for (const p of puntos.values()) {                   // dots fly out of the blob to their place
      const k = reducir ? 1 : Math.max(0, Math.min(1, (t - p.nacio) / 0.9)), e = 1 - Math.pow(1 - k, 3), [tx, ty] = lugar(p);
      p.el.setAttribute('cx', cx + (tx - cx) * e); p.el.setAttribute('cy', cy + (ty - cy) * e);
      p.el.style.opacity = k > 0 ? 1 : 0;
    }
    if (renderer) renderer.render(scene, camera);
    requestAnimationFrame(cuadro);
  }

  cargarThree().then(T => {
    THREE = T; clock = new THREE.Clock();
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    escenario.appendChild(renderer.domElement);
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.z = 6;
    const dirs = [...Array(EJES)].map((_, i) => { const a = Math.PI / 2 + i * Math.PI / 3; return new THREE.Vector3(Math.cos(a), Math.sin(a), 0.35).normalize(); });
    uniforms = { uTime: { value: 0 }, uDirs: { value: dirs }, uVals: { value: Array(EJES).fill(0) }, uPulse: { value: Array(EJES).fill(0) }, uAmp: { value: 0.03 } };
    blob = new THREE.Mesh(new THREE.IcosahedronGeometry(1, 64), new THREE.ShaderMaterial({ uniforms, vertexShader: VERT, fragmentShader: FRAG }));
    scene.add(blob);
    medir();
  }).catch(() => {});                                    // without Three.js the axes and dots still work
  requestAnimationFrame(cuadro);

  return { recibir, deseleccionar: () => seleccionar(null) };
}
