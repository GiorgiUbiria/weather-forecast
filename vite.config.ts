import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";
import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa';

const manifestForPlugin: Partial<VitePWAOptions> = {
  registerType: 'prompt',
  includeAssets: ['main-logo.ico', 'favicon.ico'],
  manifest: {
    name: 'Weather Forecast Application',
    short_name: 'Weather Report',
    description: 'Find out what weather is like in different parts of Georgia',
    icons: [
      {
        src: 'main-logo.ico',
        sizes: '64x64 32x32 24x24 16x16',
        type: 'image/x-icon',
      },
      {
        src: 'main-logo192.png',
        type: 'image/png',
        sizes: '192x192',
      },
      {
        src: 'main-logo512.png',
        type: 'image/png',
        sizes: '512x512',
      },
      {
        src: 'main-logo192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    start_url: '.',
    display: 'standalone',
    theme_color: '#000000',
    background_color: '#ffffff',
    orientation: 'portrait',
    scope: '/',
    lang: 'en',
    categories: ['weather'],
    prefer_related_applications: false,
    related_applications: [],
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svgr(), react(), VitePWA(manifestForPlugin)],
});
