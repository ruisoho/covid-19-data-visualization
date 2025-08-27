import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for React libraries
          vendor: ['react', 'react-dom'],
          // Three.js 3D engine
          three: ['three'],
          // Globe visualization library
          globe: ['react-globe.gl'],
          // Chart libraries chunk
          charts: ['chart.js', 'react-chartjs-2'],
          // HTTP libraries chunk
          http: ['axios']
        }
      }
    },
    // Increase chunk size warning limit to 2000kb for 3D libraries
    chunkSizeWarningLimit: 2000
  }
})