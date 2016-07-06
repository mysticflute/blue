const Q = require('Q');
const db = require('../lib/db');

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
        click: function(item) {
          console.log(item.label);
        }
      });
    });

    deferred.resolve(template);
  });

  return deferred.promise;
};
