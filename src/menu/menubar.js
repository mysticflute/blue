const path = require('path');
const db = require('../lib/db');
const {Tray, Menu} = require('electron').remote;
const iconPath = path.join(__dirname, '../../resources/menubar-alt2.png');

module.exports = function() {
  db.getCards().then(cards => {
    let template = [];

    cards.forEach(card => {
      template.push({
        label: `Switch to ${card.nickname}`,
        click() {
          console.log(card.nickname);
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

    let menubar = new Tray(iconPath);
    menubar.setToolTip('Blue');
    menubar.setContextMenu(Menu.buildFromTemplate(template));
  })
  .done();
};
