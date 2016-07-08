// menubar.js
// top menubar icon

const path = require('path');
const db = require('../lib/db');
const switcher = require('../lib/switcher');
const {Tray, Menu} = require('electron').remote;
const iconPath = path.join(__dirname, '../../resources/menubar-alt2.png');

let menubar = null; // prevent GC

module.exports = function() {
  db.getCards().then(cards => {
    let template = [];

    cards.forEach(card => {
      template.push({
        label: `Switch to ${card.nickname}`,
        click() {
          switcher.switchTo(card.address, card.username);
        }
      });
    });

    template = template.concat([
      {
        type: 'separator'
      },
      {
        label: 'Quit',
        selector: 'terminate:'
      }
    ]);

    menubar = new Tray(iconPath);
    menubar.setToolTip('Blue');
    menubar.setContextMenu(Menu.buildFromTemplate(template));
  })
  .done();
};
