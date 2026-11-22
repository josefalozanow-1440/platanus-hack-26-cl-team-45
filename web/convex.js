// Live Convex connection shared by every Audem page. Needs the convex browser bundle loaded first.
// Public client URL (not a secret). Change it here when switching to the prod deployment.
const CONVEX_URL = 'https://intent-ox-498.convex.cloud';
const cvx = new convex.ConvexClient(CONVEX_URL);
const api = convex.anyApi;
// `?e=<encuestaId>` picks the poll; without it each page uses the newest one.
const ENCUESTA = new URLSearchParams(location.search).get('e') || undefined;
const conEncuesta = () => (ENCUESTA ? { encuestaId: ENCUESTA } : {});
// Links between panels keep the selected poll.
addEventListener('DOMContentLoaded', () => document.querySelectorAll('a[data-keep]').forEach(a => { a.href += location.search; }));
