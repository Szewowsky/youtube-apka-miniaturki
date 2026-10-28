import { crx } from '@crxjs/vite-plugin';
import { defineConfig } from 'vite';
import manifest from './manifest.config.ts';
import { ADRES_APLIKACJI } from './src/adresy.ts';

export default defineConfig({
  plugins: [crx({ manifest })],
  build: {
    // Aplikacja nie jest wpisana w manifest (brak default_popup), więc dodajemy ją ręcznie.
    rolldownOptions: {
      input: { aplikacja: ADRES_APLIKACJI },
    },
  },
});
