// Shared Convex setup for every Audem page.
import { createRoot } from 'react-dom/client';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import './comun.css';

// Always the prod deployment (public client URL, not a secret); VITE_CONVEX_URL overrides it.
const cvx = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL ?? 'https://proper-hippopotamus-200.convex.cloud');

// The poll is the first path segment: /<slug>, /<slug>/panel, /<slug>/flujo. '' on / and /admin.
const seg = location.pathname.split('/')[1] || '';
export const SLUG = seg === 'admin' ? '' : seg;
// Convex wraps server errors ("Uncaught Error: msg\n at ..."); show only the message.
export const mensaje = e => (e.message.match(/Error: (.*)/) || [, e.message])[1].split('\n')[0];

export function arrancar(App) {
  createRoot(document.getElementById('root')).render(<ConvexProvider client={cvx}><App /></ConvexProvider>);
}
