// network.js
// gets network related information from remote machines

const ping = require('ping');
const Session = require('./session');

exports.ping = function(address) {
  let config = { timeout: 10, min_reply: 2 };

  return ping.promise.probe(address, config)
  .then(response => {
    let ip = response.alive ? (response.output.match(/from ([0-9.]+)/i))[1] : null;
    return { success: response.alive, ip: ip };
  });
};

exports.toggleWifi = function(address, username) {
  let session = new Session();

  return session.connect(address, username)
  .then(() => {
    return session.exec(
      'networksetup -setairportpower airport off; networksetup -setairportpower airport on'
    );
  })
  .then(() => {
    session.end();
  });
};
