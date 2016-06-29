const ping = require('ping');

module.exports = {
  ping: function(address) {
    const config =  { timeout: 10, min_reply: 3 };
    return ping.promise.probe(address, config).then(response => {
      let ip = response.alive ? (response.output.match(/from ([0-9.]+)/i))[1] : null;
      return { success: response.alive, ip: ip };
    });
  }
};
