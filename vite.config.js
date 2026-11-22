import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Multi-page app: each HTML file in web/ is its own entry, so URLs (and QR links with ?e=) stay the same.
export default defineConfig({
  root: 'web',
  plugins: [react()],
  server: { port: 5173, fs: { allow: ['..'] } }, // web/src imports convex/_generated from the repo root
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: { input: Object.fromEntries(['index', 'flujo', 'admin', 'responder'].map(p => [p, `web/${p}.html`])) },
  },
});
