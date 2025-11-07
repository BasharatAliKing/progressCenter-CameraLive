import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Route browser requests to the AQI API via Vite dev server to avoid CORS issues in development
      '/aqi': {
        target: 'https://aqi.neela.nespakprogresscenter.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/aqi/, '/api/aqi'),
      },
    },
  },
});
