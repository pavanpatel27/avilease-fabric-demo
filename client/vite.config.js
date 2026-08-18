import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repo = process.env.GITHUB_REPOSITORY?.split('/')[1];
const pagesBase = process.env.GITHUB_PAGES === 'true' && repo ? `/${repo}/` : '/';

export default defineConfig({
  plugins: [react()],
  base: pagesBase,
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
});
