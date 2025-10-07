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
  base: '/',
  build: {
    rollupOptions: {
      input: {
        designer: resolve(__dirname, 'designer.html')
      }
    }
  },
  server: {
    port: 3000,
    open: 'designer.html',
    host: true
  }
})