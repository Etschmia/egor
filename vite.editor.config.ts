import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react({
    babel: {
      plugins: [['babel-plugin-react-compiler']],
    },
  })],
  build: {
    rollupOptions: {
      input: {
        editor: 'editor.html'
      }
    }
  },
  server: {
    port: 3000
  }
})
