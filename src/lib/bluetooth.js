// bluetooth.js
// ssh commands related to bluetooth

const Q = require('q');
const Session = require('./session');

module.exports.status = function(address, username) {
  let session = new Session();
  session.disableLogging();

  return session.connect(address, username)
  .then(() => {
    return session.exec('~/.blueconfig/blueutil status');
  })
  .then(response => {
    session.end();

    let status = response.split(':')[1].trim();
    if (status == 'on') {
      return true;
    } else if (status == 'off') {
      return false;
    } else {
      return Q.reject(new Error('Unknown bluetooth status: '  + response));
    }
  })
  .fail(() => {
    return false;
  });
};

module.exports.turnOn = function(address, username) {
  let session = new Session();

  return session.connect(address, username)
  .then(() => {
    return session.exec('~/.blueconfig/blueutil on');
  })
  .then(() => {
    return session.notify('Bluetooth', 'Bluetooth was turned ON remotely');
  })
  .fin(() => {
    session.end();
  });
};

module.exports.turnOff = function(address, username) {
  let session = new Session();

  return session.connect(address, username)
  .then(() => {
    return session.exec('~/.blueconfig/blueutil off');
  })
  .then(() => {
    return session.notify('Bluetooth', 'Bluetooth was turned OFF remotely');
  })
  .fin(() => {
    session.end();
  });
};
