declare module 'vite-electron-plugin' {
  import type { Plugin } from 'vite'
  const electronPlugin: (options: { entry: string }) => Plugin
  export default electronPlugin
}
