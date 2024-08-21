export interface ElectronAPI {
  openFileDialog: () => Promise<{ path: string; size: number; lastModified: string } | null>
}

declare global {
  interface Window {
    electron: ElectronAPI
  }
}
