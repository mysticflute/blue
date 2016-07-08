// context.js
// right-click menu

const isDev = require('electron-is-dev');
const {remote} = require('electron');
const {Menu} = remote;

const separator = [{ type: 'separator' }];

const defaults = function(e) {
  let template = [];

  if (isDev) {
    template.push({
      label: 'Inspect Element',
      click(item, win) {
        win.inspectElement(e.x, e.y);
      }
    });
  }

  return template;
};

exports.showWithDefaults = function(e, extras) {
  e.preventDefault();
  e.stopPropagation();
  let template = extras.concat(separator).concat(defaults(e));
  let menu = Menu.buildFromTemplate(template);
  menu.popup(remote.getCurrentWindow());
};

exports.showDefaults = function(e) {
  e.preventDefault();
  e.stopPropagation();
  let menu = Menu.buildFromTemplate(defaults(e));
  menu.popup(remote.getCurrentWindow());
};
