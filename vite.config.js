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
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
      onwarn(warning, warn) {
        // Bỏ qua một số cảnh báo nếu cần
        if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return
      }
    }
  },
  server: {
    host: true
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
})
