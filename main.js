const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');

const appDataPath = app.getPath('appData') || path.join(os.homedir(), 'AppData', 'Roaming');
const userDataDir = path.join(appDataPath, 'ENEM31');
const cacheDir = path.join(userDataDir, 'Cache');
const gpuCacheDir = path.join(userDataDir, 'GPUCache');
const appIconPath = path.join(__dirname, 'assets', 'icon.png');

try {
  fs.mkdirSync(cacheDir, { recursive: true });
  fs.mkdirSync(gpuCacheDir, { recursive: true });
} catch (error) {
  console.warn('Unable to create cache folders:', error.message);
}

app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-gpu-compositing');
app.commandLine.appendSwitch('disable-software-rasterizer');
app.commandLine.appendSwitch('disk-cache-size', '1');
app.commandLine.appendSwitch('disable-application-cache');
app.commandLine.appendSwitch('disable-gpu-shader-disk-cache');
app.commandLine.appendSwitch('disk-cache-dir', cacheDir);
app.commandLine.appendSwitch('media-cache-dir', cacheDir);
app.commandLine.appendSwitch('user-data-dir', userDataDir);

app.disableHardwareAcceleration();
app.setAppUserModelId('com.enem31.app');
app.setPath('userData', userDataDir);
app.setPath('cache', cacheDir);
app.setPath('userCache', gpuCacheDir);

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    autoHideMenuBar: true,
    icon: appIconPath,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      sandbox: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
  mainWindow.setMenuBarVisibility(false);

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error('Failed to load page:', { errorCode, errorDescription, validatedURL });
  });

  mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
    console.log(`[renderer:${level}] ${message} (${sourceId}:${line})`);
  });

  mainWindow.webContents.on('render-process-gone', (event, details) => {
    console.error('Renderer process gone:', details);
  });

  //mainWindow.webContents.openDevTools({ mode: 'detach' });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', () => {
  Menu.setApplicationMenu(null);
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Handle any uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});
