import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // GlobeView (Three.js + react-globe.gl) is lazy-loaded — suppress size warning
    chunkSizeWarningLimit: 3000,
  },
})
