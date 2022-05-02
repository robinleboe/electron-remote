// all Node.js APIs are available in preload
const { contextBridge } = require('electron');

// expose browsers and node version to the main window.
// They'll be accessible at "window.versions".
process.once('loaded', () => {
  contextBridge.exposeInMainWorld('versions', process.versions);
});
