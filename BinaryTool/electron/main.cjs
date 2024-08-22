const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const path = require('path')
const fs = require('fs')
const crypto = require('crypto')
const exifParser = require('exif-parser')

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true
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
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
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

ipcMain.handle('get-file-info', (event, filePath) => {
  const stats = fs.statSync(filePath)
  return {
    name: path.basename(filePath),
    size: stats.size,
    lastModified: stats.mtime.toISOString()
  }
})

ipcMain.handle('read-file', (event, filePath) => {
  return fs.readFileSync(filePath)
})

ipcMain.handle('read-exif-data', async (event, filePath) => {
  try {
    const buffer = fs.readFileSync(filePath)
    const fileType = path.extname(filePath).toLowerCase()

    if (fileType === '.jpg' || fileType === '.jpeg') {
      const parser = exifParser.create(buffer)
      const result = parser.parse()
      return result.tags
    } else {
      return {} // Return empty object for non-JPEG files
    }
  } catch (error) {
    console.error('Error reading EXIF data:', error)
    return {} // Return empty object on error
  }
})
