import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    })
  ],
  root: '.',
  build: {
    rollupOptions: {
      input: {
        designer: resolve(__dirname, 'designer.html')
      },
      output: {
        manualChunks: {
          // Separate vendor chunks for better caching
          'react-vendor': ['react', 'react-dom'],
          // Designer-specific chunks
          'designer-components': [
            './src/designer/components/Header',
            './src/designer/components/Sidebar',
            './src/designer/components/PropertyPanel',
          ],
          'designer-hooks': [
            './src/designer/hooks/useThemeManager',
            './src/designer/hooks/useApiClient',
          ],
        }
      }
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
      }
    }
  },
  server: {
    port: 3002,
    open: '/designer.html'
  }
});
