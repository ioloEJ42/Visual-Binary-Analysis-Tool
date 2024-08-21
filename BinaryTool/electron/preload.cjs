const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),
  generateHashes: (filePath) => ipcRenderer.invoke('generate-hashes', filePath),
  getFileInfo: (filePath) => ipcRenderer.invoke('get-file-info', filePath),
  readFile: (filePath) => ipcRenderer.invoke('read-file', filePath)
})
