// session.js
// executes remote commands over ssh2

const Q = require('q');
const ssh2 = require('ssh2');
const isDevMode = require('electron-is-dev');

module.exports = class Session {
  constructor() {
    this.loggingEnabled = true;
    this.connection = null;
    this.replay = [];
  }

  _log(title, ...values) {
    if (this.loggingEnabled) {
      console.groupCollapsed(title);
      values.forEach(val => console.log(val.toString()));
      console.groupEnd();
    }
  }

  /**
   * turns off logging to console for this session.
   */
  disableLogging() {
    this.loggingEnabled = false;
  }

  /**
   * establishes a new connection.
   *
   * call #end after executing all of your commands.
   * if a password is not provided, private key auth is used.
   *
   * @param  {string} host - the host address
   * @param  {string} username - the username
   * @param  {string} [password] - optional password
   * @returns {Promise<void>} - a promise
   */
  connect(host, username, password) {
    if (this.connection) {
      return Q.reject('already connected!');
    }

    this.connection = new ssh2.Client();

    let deferred = Q.defer();

    const config = {
      host: host,
      username: username,
      port: 22,
      readyTimeout: 10000,
      agent: process.env.SSH_AUTH_SOCK
    };

    if (password) {
      config.password = password;
      config.tryKeyboard = true;

      this.connection.on('keyboard-interactive', (name, inst, instl, prompts, finish) => {
        finish([password]);
      });
    } else {
      //config.privateKey = fs.readFileSync(path.join(os.homedir(), '.ssh', 'id_rsa'));
    }

    this.connection.on('error', err => {
      this._log('error received in _connection', err);
      if (err.message.includes('All configured authentication methods failed')) {
        deferred.reject(new Error('Could not authenticate'));
      } else if (err.message.includes('getaddrinfo ENOTFOUND')) {
        deferred.reject(new Error('Could not find host'));
      } else {
        deferred.reject(err);
      }
    });

    this.connection.on('ready', () => {
      deferred.resolve();
    });

    this.connection.connect(config);

    return deferred.promise;
  }

  /**
   * changes directories, preseving it into subsequent commands (where applicable).
   *
   * @param  {string} dir - the path
   * @returns {Promise<void>} A promise
   */
  cd(dir) {
    let deferred = Q.defer();
    let command = `cd ${dir}`;

    this.exec(command)
    .then(response => {
      if (response.includes('No such file or directory')) {
        deferred.reject(response);
      } else {
        this.replay.push(command);
        deferred.resolve();
      }
    }, error => {
      deferred.reject(error);
    });

    return deferred.promise;
  }

  /**
   * executes one or more commands, joined with &&.
   *
   * @param  {string} ...commands - commands to execute
   * @returns {Promise<string>} - a promise containing the server response
   */
  exec(...commands) {
    if (!this.connection) {
      return Q.reject('not connected!');
    }

    let deferred = Q.defer();

    let modified = this.replay.concat(commands).reduce((previous, current) => {
      return previous + ' && ' + current;
    });

    this.connection.exec(modified, (err, stream) => {
      let out = '';

      if (err) {
        this._log('error received during exec', err);
        deferred.reject(err);
      }

      stream.stderr.on('data', data => {
        this._log('data received from stderr during exec', data);
        out += data;
      });

      stream.on('data', data => {
        this._log('data received during exec', data);
        out += data;
      });

      stream.on('close', () => {
        if (isDevMode) {
          this._log('exec successfully completed', modified);
        } else {
          console.log('exec successfully completed');
        }
        deferred.resolve(out);
      });
    });

    return deferred.promise;
  }

  /**
   * copies a file from the local machine to the remote machine.
   *
   * @param  {String} absLocalPath - the absolute path of the local file
   * @param  {type} absRemotePath - the absolute path of the destination
   * @returns {Promise<void>} - A promise
   */
  put(absLocalPath, absRemotePath) {
    if (!this.connection) {
      return Q.reject('not connected!');
    }

    let deferred = Q.defer();

    this.connection.sftp((err, sftp) => {
      if (err) {
        this._log('error getting sftp connection', err);
        deferred.reject('could not sftp');
      }

      sftp.fastPut(absLocalPath, absRemotePath, (err) => {
        if (err) {
          this._log('could not send file', err);
          return deferred.reject(err);
        }
        return deferred.resolve();
      });
    });

    return deferred.promise;
  }

  /**
   * ends the current session.
   */
  end() {
    if (this.connection) {
      this.connection.end();
      this.connection = null;
      this.paths = [];
    }
  }
};
