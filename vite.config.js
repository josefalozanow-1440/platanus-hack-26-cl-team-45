import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// One-page app in web/ with path routes (web/src/main.jsx); the host must rewrite unknown paths to index.html.
export default defineConfig({
  root: 'web',
  plugins: [react()],
  server: { port: 5173, fs: { allow: ['..'] } }, // web/src imports convex/_generated from the repo root
  build: { outDir: '../dist', emptyOutDir: true },
});
