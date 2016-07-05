// dynamic.js
// additions to the main application menu, added later in app.html

// const {remote} = require('electron');
const devMode = require('electron-is-dev');

let template = [
];

if (devMode) {
  template.push({
    label: 'Debug',
    submenu: [
      {
        label: 'Remove All Cards',
        click: function(item, focusedWindow) {
          const db = require('../lib/db');
          db.removeAllCards();
          if (focusedWindow) {
            focusedWindow.reload();
          }
        }
      }, {
        label: 'Fill Edit Card',
        accelerator: 'Command+Shift+E',
        click: function(item, focusedWindow) {
          if (focusedWindow) {
            const addr = 'nakiami.local';
            const username = 'nakiami';
            let s = `document.querySelector("paper-input[label=address]").value = "${addr}"`;
            focusedWindow.webContents.executeJavaScript(s);
            s = `document.querySelector("paper-input[label=username]").value = "${username}"`;
            focusedWindow.webContents.executeJavaScript(s);
            s = `document.querySelector("paper-input[label=nickname]").value = "${username}"`;
            focusedWindow.webContents.executeJavaScript(s);
          }
        }
      }
    ]
  });
}

module.exports = template;
