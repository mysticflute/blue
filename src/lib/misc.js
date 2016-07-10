// misc.js other random actions

const Session = require('./session');

exports.shutdown = function(address, username) {
  let session = new Session();

  return session.connect(address, username)
  .then(() => {
    // try a friendly shutdown
    return session.exec('osascript -e \'tell app "loginwindow" to «event aevtrsdn»\'');
  })
  .then(() => {
    return session.notify('Shutdown', 'Shutdown initiated by a remote command');
  })
  .then(() => {
    session.end();
  });
};
