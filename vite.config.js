import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Keep React and router in one core vendor chunk
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router')) {
            return 'vendor-react';
          }
          // Group heavy PDF manipulation libraries
          if (id.includes('node_modules/pdf-lib') || id.includes('node_modules/jspdf')) {
            return 'vendor-pdf';
          }
          // Group heavy image/OCR processing libraries
          if (id.includes('node_modules/tesseract.js') || id.includes('node_modules/@imgly/background-removal') || id.includes('node_modules/browser-image-compression')) {
            return 'vendor-processing';
          }
          // Group UI and animation libraries
          if (id.includes('node_modules/framer-motion') || id.includes('node_modules/lucide-react')) {
            return 'vendor-ui';
          }
          // Fallback for other node_modules
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  }
});