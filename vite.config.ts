import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),

      // fix loading all icon chunks in dev mode
      // https://github.com/tabler/tabler-icons/issues/1233
      '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: [
            'react',
            'react-dom',
            'react-router-dom',
            '@tanstack/react-query',
            'axios',
            'zustand',
          ],
          ui: [
            '@/components/ui/button',
            '@/components/ui/form',
            '@/components/ui/input',
            '@/components/ui/select',
            '@/components/ui/switch',
            '@/components/ui/label',
            '@radix-ui/react-dialog',
            '@radix-ui/react-select',
          ],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
})
