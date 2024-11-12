// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  build: {
    outDir: 'dist',
  },
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'http:localhost:8080',
        changeOrigin: true,
        secure: false
      }
    }
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: 'ExerciseLog App',
        short_name: 'ExerciseLogApp',
        description: '',
        theme_color: '#1976d2',
        icons: [
          {
            src: 'pwa-192x192.png', 
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
});
