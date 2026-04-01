import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));

console.log(repoRoot);

export default defineConfig({
  plugins: [react()],
  resolve: {

  },
  server: {
    fs: {
      allow: [repoRoot],
    },
  },
});
