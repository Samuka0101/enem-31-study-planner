const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');
const os = require('os');

const appData = process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming');
const storageDir = path.join(appData, 'ENEM31');
const storageFile = path.join(storageDir, 'storage.json');

function ensureStorageFile() {
  try {
    fs.mkdirSync(storageDir, { recursive: true });
    if (!fs.existsSync(storageFile)) {
      fs.writeFileSync(storageFile, JSON.stringify({}, null, 2), 'utf8');
    }
  } catch (error) {
    console.error('Failed to create storage file:', error);
  }
}

function readStorage() {
  ensureStorageFile();
  try {
    const raw = fs.readFileSync(storageFile, 'utf8');
    return JSON.parse(raw || '{}');
  } catch (error) {
    console.warn('Failed to read storage file:', error);
    return {};
  }
}

function writeStorage(data) {
  ensureStorageFile();
  try {
    fs.writeFileSync(storageFile, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Failed to write storage file:', error);
  }
}

contextBridge.exposeInMainWorld('electronAPI', {
  getVersion: () => process.versions.electron,
  getPlatform: () => process.platform
});

contextBridge.exposeInMainWorld('electronStorage', {
  getItem: (key) => {
    const data = readStorage();
    return data[key] === undefined ? null : String(data[key]);
  },
  setItem: (key, value) => {
    const data = readStorage();
    data[key] = String(value);
    writeStorage(data);
  },
  removeItem: (key) => {
    const data = readStorage();
    delete data[key];
    writeStorage(data);
  },
  clear: () => {
    writeStorage({});
  }
});
