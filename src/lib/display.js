// display.js
// display related methods

const exec = require('promised-exec');
const Session = require('./session');

exports.toggleTargetDisplayMode = function(address, username) {
  let session = new Session();

  return session.connect(address, username)
  .then(() => {
    return session.exec('osascript -e \'tell application "System Events" to key code 144 using command down\'');
  })
  .then(() => {
    session.end();
  });
};

exports.toggleOwnTargetDisplayMode = function() {
  return exec('osascript -e \'tell application "System Events" to key code 144 using command down\'');
};
