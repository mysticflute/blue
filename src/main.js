// main process

const windowState = require('electron-window-state');
const electron = require('electron');
const {app, Menu, BrowserWindow} = electron;

let win;

function createWindow() {
  // set the main application menu
  Menu.setApplicationMenu(Menu.buildFromTemplate(require('./menu/static')));

  // restore window state
  let mainWindowState = windowState({
    defaultWidth: 900,
    defaultHeight: 700
  });

  // create the browser window
  win = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height
  });

  mainWindowState.manage(win);

  // load the main page of the app
  win.loadURL(`file://${__dirname}/app.html`);

  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
