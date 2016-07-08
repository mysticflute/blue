// setup.js
// handles setup of remote computers

const Q = require('q');
const path = require('path');
const Session = require('./session');

/* sets up config folder and transfers blueutil script */
exports.initialSetup = function(host, username) {
  let session = new Session();

  return session.connect(host, username)
  .then(() => {
    return session.cd('~');
  })
  .then(() => {
    return session.exec('mkdir -p .blueconfig');
  })
  .then(() => {
    const blueutil = path.resolve(__dirname, '../../resources/blueutil');
    const dest = `/Users/${username}/.blueconfig/blueutil`;
    return session.put(blueutil, dest);
  })
  .then(() => {
    return session.exec('chmod +x .blueconfig/blueutil');
  })
  .then(() => {
    return session.exec('.blueconfig/blueutil status');
  })
  .then(response => {
    if (!response.includes('Status')) {
      return Q.reject('unable to confirm blueutil script is working');
    }
    session.end();
  });
};
