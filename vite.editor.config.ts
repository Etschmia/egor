import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react({
    babel: {
      plugins: [['babel-plugin-react-compiler']],
    },
  })],
  root: '.',
  build: {
    rollupOptions: {
      input: {
        editor: resolve(__dirname, 'editor.html')
      }
    }
  },
  server: {
    port: 3000,
    open: '/editor.html'
  }
})
