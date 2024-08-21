import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-electron-plugin'

export default defineConfig({
  plugins: [
    vue(),
    (electron as any)({
      entry: 'electron/main.cjs'
    })
  ],
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
