const Q = require('q');
const fs = require('fs');
const os = require('os');
const path = require ('path');

module.exports = {
  checkConnection: function(username, address) {
    return Q.fcall(() => {
      return false;
    });
  },

  checkPublicKeyExists: function() {
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
  },

  sendPublicKey: function(username, password, address) {
    return Q.delay(2000).then(() => {
      console.log('sending public key', username, password, address);

      // 1 check for existance of authorized_keys
      // 2 check if ends in new line
      // 3 check if contains exact string
      return false;
    });
  }
};
