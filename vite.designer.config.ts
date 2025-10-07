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
        designer: resolve(__dirname, 'designer.html')
      }
    }
  },
  server: {
    port: 3001,
    open: '/designer.html'
  }
})