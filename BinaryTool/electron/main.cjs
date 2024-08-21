const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs')
const crypto = require('crypto')

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs')
    }
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.handle('open-file-dialog', async () => {
  const result = await dialog.showOpenDialog({ properties: ['openFile'] })
  if (!result.canceled) {
    const filePath = result.filePaths[0]
    const stats = fs.statSync(filePath)
    return {
      path: filePath,
      size: stats.size,
      lastModified: stats.mtime
    }
  }
  return null
})

ipcMain.handle('generate-hashes', async (event, filePath) => {
  const fileBuffer = fs.readFileSync(filePath)
  const md5 = crypto.createHash('md5').update(fileBuffer).digest('hex')
  const sha1 = crypto.createHash('sha1').update(fileBuffer).digest('hex')
  const sha256 = crypto.createHash('sha256').update(fileBuffer).digest('hex')
  return { md5, sha1, sha256 }
})
