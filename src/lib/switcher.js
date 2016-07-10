// switcher.js
// tries to safely handle switching bluetooth enablement to other devices

const Q = require('q');
const path = require('path');
const exec = require('promised-exec');

const db = require('./db');
const network = require('./network');
const bluetooth = require('./bluetooth');
const display = require('./display');

const blueutil = path.join(__dirname, '../../resources/blueutil');

const Logger = require('./logger');
let logger = new Logger();

exports.switchTo = function(address, username, toggleTargetDisplayMode) {
  // get ready, this is a wild ride.

  let toTurnOff = [];
  let toSkip = [];
  let iMac = null;

  // ok first, make sure we can reach the address
  return network.ping(address)
  .then(result => {
    if (!result.success) {
      return Q.reject(`could not find ${address}!`);
    } else {
      // ok, next we need to get all of the other computers
      return db.getCards();
    }
  })
  .then(cards => {
    // we need to ping each saved computer to see if we can reach it and turn the bluetooth off.
    return Q.all(cards.map(card => {
      if (iMac == null && card.type == 'imac') {
        iMac = card;
      }

      // no need to check the target computer again, or this computer
      if (card.address != address && card.address != 'localhost') {
        return network.ping(card.address)
        .then(result => {
          if (result.success) {
            toTurnOff.push(card);
          } else {
            toSkip.push(card);
          }
        });
      }
    }));
  })
  .then(() => {
    // Toggle target display mode now if the iMac is going to have it's
    // bluetooth switched off. this is because the iMac doesn't seem to
    // take the keycode if there aren't any keyboards connected).
    if (toggleTargetDisplayMode) {
      if (iMac && toTurnOff.includes(iMac)) {
        console.log('toggling target display mode for ' + iMac.nickname);
        return display.toggleTargetDisplayMode(iMac.address, iMac.username);
      } else {
        // this computer might be the iMac, but there might not be a card for it
        return exec('sysctl hw.model').then(response => {
          if (response.toLowerCase().includes('imac')) {
            return display.toggleOwnTargetDisplayMode();
          }
        });
      }
    }
  })
  .then(() => {
    logger.log('computers to turn bluetooth off', toTurnOff);
    if (toSkip.length > 0) {
      logger.log('notice: computers that cannot be reached', toSkip);
    }

    // now, we need to turn off bluetooth for the others (usually it should
    // already be off though)
    return Q.all(toTurnOff.map(card => bluetooth.turnOff(card.address, card.username)));
  })
  .then(() => {
    // turn bluetooth off for this computer
    return exec(`${blueutil} off`);
  })
  .then(() => {
    // turn bluetooth on for the target computer
    return bluetooth.turnOn(address, username);
  })
  .then(() => {
    // confirm bluetooth is on for the other computer
    return bluetooth.status(address, username);
  })
  .then(isOn => {
    if (!isOn) {
      // egads! ok so we have to turn our bluetooth back on then
      console.warn('could not confirm bluetooth was actually turned on, ' +
        'so turning bluetooth for this computer back on.');

      return exec(`${blueutil} on`)
      .then(() => {
        // undo display mode toggle
        if (toggleTargetDisplayMode) {
          console.log('reversing target display mode for ' + iMac.nickname);
          if (iMac && toTurnOff.includes(iMac)) {
            return display.toggleTargetDisplayMode(iMac.address, iMac.username);
          } else {
            return exec('sysctl hw.model').then(response => {
              if (response.toLowerCase().includes('imac')) {
                return display.toggleOwnTargetDisplayMode();
              }
            });
          }
        }
      })
      .then(() => {
        return Q.reject('Could not confirm bluetooth was turned on for ' + address);
      });
    }
  });
};
