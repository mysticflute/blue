// remote.js
// executes remote commands over ssh2

const Q = require('q');
const S = require('string');
const ssh2 = require('ssh2');

/**
  establishes a remote connection using private key authentication.
  @returns promise(connection)
*/
exports.standard = function(host, username) {
  let deferred = Q.defer();

  let config = _config();
  config.host = host;
  config.username = username;
  // config.key =

  _connection(deferred).connect(config);

  return deferred.promise();
};

/**
  establishes a remote connection using a password.
  @returns promise(connection)
*/
exports.privileged = function(host, username, password) {
  let deferred = Q.defer();

  let config = _config();
  config.host = host;
  config.username = username;
  config.password = password;
  config.tryKeyboard = true;

  let connection = _connection(deferred);

  connection.on('keyboard-interactive', (name, inst, instl, prompts, finish) => {
    finish([password]);
  });

  connection.connect(config);

  return deferred.promise;
};

/**
  executes a single remote command.
  you must call result.connection.end() at the end of the promise chain.
  @returns promise(result: {response, connection})
*/
exports.exec = function(connection, command) {
  let deferred = Q.defer();

  connection.exec(command, (err, stream) => {
    let out = '';

    if (err) {
      _log('error received during exec', err);
      deferred.reject(err);
    }

    stream.stderr.on('data', data => {
      _log('error received from stderr during exec', data);
      deferred.reject(new Error('' + data));
    });

    stream.on('data', data => {
      _log('data received from exec', data);
      out += data;
    });

    stream.on('close', () => {
      console.info('exec command finished');
      deferred.resolve({response: out, connection: connection});
    });
  });

  return deferred.promise;
};

/**
  executes a single remote command using sudo.
  you must call result.connection.end() at the end of the promise chain.
  @returns promise(result: {response, connection})
*/
exports.sudo = function(connection, password, command) {

};

// private functions

function _config() {
  return {
    port: 22,
    readyTimeout: 10000,
    agent: process.env.SSH_AUTH_SOCK
  };
}

function _connection(deferred) {
  let connection = new ssh2.Client();

  connection.on('error', err => {
    _log('error received in _connection', err);
    if (S(err.message).contains('All configured authentication methods failed')) {
      deferred.reject(new Error('Could not authenticate the user'));
    } else if (S(err.message).contains('getaddrinfo ENOTFOUND')) {
      deferred.reject(new Error('Could not find host'));
    } else {
      deferred.reject(err);
    }
  });

  connection.on('ready', () => {
    deferred.resolve(connection);
  });

  return connection;
}

function _log(title, details) {
  console.groupCollapsed(title);
  console.log(details.toString());
  console.groupEnd();
}
