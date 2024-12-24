import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        // Bỏ qua một số cảnh báo nếu cần
        if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return
      }
    }
  }
})
