'use strict'

import { app, protocol, BrowserWindow, ipcMain, screen, Tray, Menu } from 'electron'

import {
  createProtocol
  /* installVueDevtools */
} from 'vue-cli-plugin-electron-builder/lib'

const searchMusic = require('./migu_api/search')
const song = require('./migu_api/song')
const top = require('./migu_api/top')

const isDevelopment = process.env.NODE_ENV !== 'production'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win
let tray

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }])

function createWindow () {
  // Create the browser window.
  const size = screen.getPrimaryDisplay().workAreaSize
  const width = parseInt(size.height * 1.3)
  const height = parseInt(size.height * 0.8)
  win = new BrowserWindow({
    width: width,
    height: height,
    frame: false,
    transparent: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      experimentalFeatures: true
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null
  })
}

// const winURL = process.env.NODE_ENV === 'development'
//   ? 'http://localhost:8080'
//   : `file://${__dirname}/index.html`

// win.loadURL(winURL)

// let loginWin
// // 创建calendar窗口方法
// function openloginWindow () {
//   loginWin = new BrowserWindow({
//     width: 400,
//     height: 550,
//     parent: win, // win是主窗口
//     webPreferences: {
//       nodeIntegration: true
//     }
//   })
//   loginWin.loadURL(winURL + '#/Login')
//   loginWin.on('closed', () => { loginWin = null })
// }
// ipcMain.on('openloginWindow', e =>
//   openloginWindow()
// )

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
  }
  tray = new Tray('resources/ico/ic_launcher.png')
  const trayContextMenu = Menu.buildFromTemplate([
    {
      label: '打开',
      click: () => {
        win.show()
      }
    }, {
      label: '退出',
      click: () => {
        app.quit()
      }
    }
  ])
  tray.setToolTip('Miguu')
  tray.on('click', () => {
    win.show()
  })
  tray.on('right-click', () => {
    tray.popUpContextMenu(trayContextMenu)
  })

  createWindow()
})

app.commandLine.appendSwitch('wm-window-animations-disabled')

ipcMain.on('close', e =>
  win.hide()
)

ipcMain.on('minimize', e =>
  win.minimize()
)

// 热搜接口
// ipcMain.on('getHotlist', async e => {
//   const hotList = await searchMusic.hotSearch()
//   e.sender.send('sendHotlist', hotList)
// })

ipcMain.on('suggestSearch', async (e, data) => {
  const suggestkey = await searchMusic.suggestSearch(data)
  e.returnValue = suggestkey
})

ipcMain.on('searchmusic', async (e, data) => {
  const songsdata = await searchMusic.searchsongs(data)
  const singerdata = await searchMusic.searchsingers(songsdata.musics[0].artist)
  e.sender.send('singerdata', singerdata)
  e.sender.send('songsdata', songsdata)
})

ipcMain.on('songcid', async (e, data) => {
  const songurl = await song.song(data)
  e.returnValue = songurl
})

ipcMain.on('hotlist', async (e, data) => {
  const toplist = await top.top(data)
  e.returnValue = toplist
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
