// logger.js
// handles logging to console

const devMode = require('electron-is-dev');

module.exports = class Logger {
  constructor() {
    this.loggingEnabled = true;
  }

  disableLogging() {
    this.loggingEnabled = false;
  }

  log(title, ...values) {
    this._log(console.log, title, values);
  }

  warn(title, ...values) {
    this._log(console.warn, title, values);
  }

  info(title, ...values) {
    this._log(console.info, title, values);
  }

  debug(title, ...values) {
    if (devMode) {
      this.log(title, values);
    }
  }

  _log(out, title, values) {
    if (this.loggingEnabled) {
      if (values.length > 0) {
        if (out != console.log && values.length == 1 && typeof values[0] == 'string') {
          out.call(console, title, values[0]);
        } else {
          console.groupCollapsed(title);
          values.forEach(val => {
            out.call(console, typeof val == 'object' ? val : '' + val);
          });
          console.groupEnd();
        }
      } else {
        out.call(console, title);
      }
    }
  }
};
