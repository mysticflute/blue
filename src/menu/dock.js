const Q = require('Q');
const db = require('../lib/db');
const switcher = require('../lib/switcher');

module.exports = function() {
  let deferred = Q.defer();

  db.getCards()
  .then(cards => {
    let switchSubmenu = [];

    let template = [{
      label: 'Switch',
      submenu: switchSubmenu
    }];

    cards.forEach(card => {
      switchSubmenu.push({
        label: `Switch to ${card.nickname}`,
        click: function() {
          switcher.switchTo(card.address, card.username);
        }
      });
    });

    deferred.resolve(template);
  });

  return deferred.promise;
};
