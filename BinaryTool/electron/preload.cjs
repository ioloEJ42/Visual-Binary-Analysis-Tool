const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  openFileDialog: () => ipcRenderer.invoke('open-file-dialog'),
  generateHashes: (filePath) => ipcRenderer.invoke('generate-hashes', filePath)
})
