// Shared Convex setup for every Audem page.
import { createRoot } from 'react-dom/client';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import './comun.css';

// Public client URL (not a secret). Override with VITE_CONVEX_URL for the prod deployment.
const cvx = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL ?? 'https://intent-ox-498.convex.cloud');

// `?e=<encuestaId>` picks the poll; without it each page uses the newest one.
export const ENCUESTA = new URLSearchParams(location.search).get('e') || undefined;
export const conEncuesta = () => (ENCUESTA ? { encuestaId: ENCUESTA } : {});
// Convex wraps server errors ("Uncaught Error: msg\n at ..."); show only the message.
export const mensaje = e => (e.message.match(/Error: (.*)/) || [, e.message])[1].split('\n')[0];

export function arrancar(App) {
  createRoot(document.getElementById('root')).render(<ConvexProvider client={cvx}><App /></ConvexProvider>);
}
