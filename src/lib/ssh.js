const Q = require('q');
const fs = require('fs');
const os = require('os');
const path = require ('path');

module.exports = {
  checkConnection: function(username, address) {
    return Q.fcall(() => {
      console.log('ssh', username, address);
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
  }
};
