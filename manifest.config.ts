import { defineManifest } from '@crxjs/vite-plugin';
import pkg from './package.json' with { type: 'json' };

const ikony = {
  16: 'ikony/ikona-16.png',
  32: 'ikony/ikona-32.png',
  48: 'ikony/ikona-48.png',
  128: 'ikony/ikona-128.png',
};

// Surowy obiekt eksportujemy osobno, żeby test mógł sprawdzić uprawnienia.
export const manifest = {
  manifest_version: 3,
  name: 'Miniaturki YouTube',
  description: 'Pobiera Miniaturki filmów YouTube jednym kliknięciem.',
  version: pkg.version,
  icons: ikony,
  action: {
    default_title: 'Otwórz Aplikację Miniaturki YouTube',
    default_icon: ikony,
  },
  background: {
    service_worker: 'src/tlo/service-worker.ts',
    type: 'module',
  },
  content_scripts: [
    {
      matches: ['https://www.youtube.com/*'],
      js: ['src/youtube/content.ts'],
      run_at: 'document_idle',
    },
  ],
  permissions: ['downloads', 'storage'],
  host_permissions: ['https://www.youtube.com/*', 'https://i.ytimg.com/*'],
} as const;

export default defineManifest({
  ...manifest,
  icons: { ...ikony },
  action: { ...manifest.action, default_icon: { ...ikony } },
  permissions: [...manifest.permissions],
  host_permissions: [...manifest.host_permissions],
  content_scripts: manifest.content_scripts.map((skrypt) => ({
    ...skrypt,
    matches: [...skrypt.matches],
    js: [...skrypt.js],
  })),
});
