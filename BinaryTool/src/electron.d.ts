export interface ElectronAPI {
  openFileDialog: () => Promise<{
    path: string
    name: string
    size: number
    lastModified: Date
  } | null>
  getFileInfo: (path: string) => Promise<{ name: string; size: number; lastModified: string }>
  generateHashes: (path: string) => Promise<{ md5: string; sha1: string; sha256: string }>
  readFile: (filePath: string) => Promise<Uint8Array>
  readExifData: (filePath: string) => Promise<Record<string, any>>
}

declare global {
  interface Window {
    electron: ElectronAPI
  }
}
