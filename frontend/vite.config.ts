import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    // Polling para detectar cambios dentro de Docker en macOS
    // (se activa desde docker-compose.dev.yml con VITE_USE_POLLING)
    watch: process.env.VITE_USE_POLLING ? { usePolling: true } : undefined,
  },
})
