// bluetooth.js
// ssh commands related to bluetooth
const Q = require('Q');
const Session = require('./session');

module.exports.status = function(address, username) {
  let session = new Session();

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
  });
};

module.exports.turnOn = function(address, username) {
  let session = new Session();

  return session.connect(address, username)
  .then(() => {
    return session.exec('~/.blueconfig/blueutil on');
  })
  .then(() => {
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
    session.end();
  });
};
