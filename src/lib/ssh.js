// ssh.js
// executes high-level ssh-related checks and commands

const Q = require('q');
const fs = require('fs');
const os = require('os');
const path = require ('path');
const remote = require ('./remote');

/**
  checks that the ssh connection can be established with key authentication.
  @return promise(boolean)
*/
exports.checkConnection = function(host, username) {
  return Q.fcall(() => {
    return false;
  });
};

/**
  checks that the public ssh key exists on this machine.
  @return promise(boolean)
*/
exports.checkPublicKeyExists = function() {
  const rsa = path.join(os.homedir(), '.ssh', 'id_rsa.pub');

  let deferred = Q.defer();

  fs.stat(rsa, err => {
    if (err === null) {
      deferred.resolve(true);
    } else if (err.code === 'ENOENT') {
      deferred.resolve(false);
    } else {
      deferred.reject(new Error(err));
    }
  });

  return deferred.promise;
};

/**
  attempts to copy the public ssh key to a remote computer's .authorized_keys,
  if not already present.
  @return promise
*/
exports.sendPublicKey = function(host, username, password) {
  return Q.delay(1500) // the delay is just for UI effect
  .then(() => {
    return remote.privileged(host, username, password);
  })
  .then(connection => {
    return remote.exec(connection, 'ls');
  })
  .then(result => {
    result.connection.end();
  });
};

// 1 check for existance of authorized_keys
// 2 check if ends in new line
// 3 check if contains exact string
