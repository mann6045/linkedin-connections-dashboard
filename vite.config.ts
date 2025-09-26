// vite.config.ts

import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  build: {
    rollupOptions: {
      // Define the entry points for your extension
      input: {
        popup: 'public/popup.html',
        background: 'src/background/main.ts',
      },
      // Configure the output
      output: {
        // Use predictable file names without hashes
        entryFileNames: `[name].js`,
        chunkFileNames: `chunks/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
  },
});