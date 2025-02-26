import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        howTo: resolve(__dirname, 'how-to.html'),
      },
    },
  },
});
