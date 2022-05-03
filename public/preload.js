// all Node.js APIs are available in preload
const { ipcRenderer, contextBridge } = require('electron');

// expose browsers and node version to the main window.
process.once('loaded', () => {
  contextBridge.exposeInMainWorld('electronAPI', {
    getScreenId: (callback) => ipcRenderer.on('SET_SOURCE_ID', callback),
    setSize: (size) => ipcRenderer.send('set-size', size),
  });
});
