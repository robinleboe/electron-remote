const {
  app,
  BrowserWindow,
  protocol,
  desktopCapturer,
  ipcMain,
  Menu,
} = require('electron');
const path = require('path');
const url = require('url');

let availableScreens;
let mainWindow;

const sendSelectedScreen = (item) => {
  mainWindow.webContents.send('SET_SOURCE_ID', item.id);
};

const createTray = () => {
  const screensMenu = availableScreens.map((item) => {
    return {
      label: item.name,
      click: () => {
        sendSelectedScreen(item);
      },
    };
  });

  const menu = Menu.buildFromTemplate([
    {
      label: app.name,
      submenu: [{ role: 'quit' }],
    },
    {
      label: 'Screens',
      submenu: screensMenu,
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
  ]);

  Menu.setApplicationMenu(menu);
};

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    // enable communication between node and browser
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  ipcMain.on('set-size', (event, size) => {
    const { width, height } = size;
    try {
      mainWindow.setSize(width, height, true);
    } catch (err) {
      console.log(err);
    }
  });

  // set path to the local Create React App build bundle (Production) or localhost
  const appURL = app.isPackaged
    ? url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true,
      })
    : 'http://localhost:3000';

  mainWindow.loadURL(appURL);

  // auto-open DevTools in development
  // if (!app.isPackaged) {
  //   mainWindow.webContents.openDevTools();
  // }

  mainWindow.once('ready-to-show', () => {
    desktopCapturer
      .getSources({
        types: ['window', 'screen'],
      })
      .then((sources) => {
        availableScreens = sources;
        createTray();
      });
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    // re-create window on macOS dock click
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows closed unless macOS (user must quit with menu or Cmd + Q)
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
