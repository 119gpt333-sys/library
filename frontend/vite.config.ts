import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: '0.0.0.0',
    allowedHosts: ['*'],
  },
  build: {
    rollupOptions: {
      external: [/@trpc\/server/],
      output: {
        globals: {
          '@trpc/server': 'tRPCServer',
        },
      },
    },
  },
  resolve: {
    alias: {
      '@trpc/server': '@trpc/server',
    },
  },
  ssr: {
    noExternal: [],
  },
})
