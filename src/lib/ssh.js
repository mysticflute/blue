// ssh.js
// executes high-level ssh-related checks and commands

const Q = require('q');
const fs = require('fs');
const os = require('os');
const path = require ('path');
const Session = require ('./session');

const privateKey = path.join(os.homedir(), '.ssh', 'id_rsa');
const publicKey = path.join(os.homedir(), '.ssh', 'id_rsa.pub');

/**
  checks that the ssh connection can be established with key authentication.
  @returns promise(boolean)
*/
exports.checkConnection = function(host, username) {
  let session = new Session();

  // check that the private key exists, then make a ssh connection
  return Q.nfcall(fs.stat, privateKey)
  .then(() => {
    return session.connect(host, username);
  })
  .then(() => {
    session.end();
    return true;
  }).fail(() => {
    return false;
  });
};

/**
  checks that the private/public ssh key pair exists on this machine.
  @returns promise(boolean)
*/
exports.checkKeyExists = function() {
  return Q.all([Q.nfcall(fs.stat, privateKey), Q.nfcall(fs.stat, publicKey)])
  .then(() => {
    return true;
  }, (err) => {
    if (err.code == 'ENOENT') {
      return false;
    } else {
      throw err;
    }
  });
};

/**
  attempts to copy the public ssh key to a remote computer's .authorized_keys,
  if not already present.
  @returns promise
*/
exports.sendPublicKey = function(host, username, password) {
  const session = new Session();
  let publicKeyContent = '';

  // the delay is just for UI effect
  return Q.delay(1500)
  .then(() => {
    // read public key
    return Q.nfcall(fs.readFile, publicKey, 'utf8');
  })
  .then((content) => {
    publicKeyContent = content.trim(); // we don't want the newline at the end
    return session.connect(host, username, password);
  })
  .then(() => {
    return session.cd('~/.ssh');
  })
  .then(() => {
    // check if the authorized_keys file exists
    return session.exec('cat authorized_keys');
  })
  .then(response => {
    if (response.includes('No such file or directory')) {
      // the file doesn't exist. create it, then append public key
      return session.exec('touch authorized_keys', `echo "${publicKeyContent}" >> authorized_keys`);
    } else {
      // the file does exist. first check that it doesn't the key already
      if (!response.includes(publicKeyContent)) {
        // ensure there is a new line then append public key
        if (response.charAt(response.length - 1) != '\n') {
          publicKeyContent = '\n' + publicKeyContent;
        }
        return session.exec(`echo "${publicKeyContent}" >> authorized_keys`);
      }
    }
  })
  .then(() => {
    session.end();
  });
};
