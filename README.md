# Electron Remote Desktop

This app uses [Create React App](https://github.com/facebook/create-react-app) and [Electron](https://www.electronjs.org/) to create a cross=platform remote desktop application.

## Scaffolding

- create a new project with CRA
- install `concurrently wait-on cross-env electron electron-builder electronmon`

## Content Security Policy

This project's CSP will only allow Electron to run CRA's inline scripts created by the build process.

## Scripts

The package.json file defines an additional script to run the CRA development server and start the Electron process in watch mode:

```
"scripts": {
   ...
   "electron:start": "concurrently -k \"cross-env BROWSER=none npm start\" \"wait-on http://localhost:3000 && electronmon .\""
 },
```

- `concurrently -k` invokes scripts in parallel, and kills them all when the process is stopped
- `cross-env BROWSER=none npm start` runs the CRA dev server in watch-mode and disables automatic browser opening
- `wait-on http://localhost:3000 && electronmon .` waits for the CRA dev server and then invokes electronmon . to start Electron in watch-mode
