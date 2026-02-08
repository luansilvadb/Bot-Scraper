import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000, // Adjust warning threshold to 1000KB
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor chunks
          'fluent-ui': ['@fluentui/react-components', '@fluentui/react-icons'],
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'query': ['@tanstack/react-query', '@tanstack/react-virtual'],
        }
      }
    }
  }
})
