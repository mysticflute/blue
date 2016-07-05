// db.js
// interface to the main data store

const Q = require('Q');
const path = require('path');
const nedb = require('nedb');
const electron = require('electron').remote;
const Logger = require('./logger');
const logger = new Logger();
const dbPath = path.join(electron.app.getPath('userData'), 'appData');

const cards = new nedb({
  filename: path.join(dbPath, 'cards.db'),
  autoload: true,
  timestampData: true
});

exports.getCards = function() {
  let deferred = Q.defer();

  cards.find({}, (err, all) => {
    if (err) {
      logger.warn('error retrieving all cards', err);
      deferred.reject(err);
    } else {
      deferred.resolve(all);
    }
  });

  return deferred.promise;
};

exports.newCard = function(record) {
  let deferred = Q.defer();

  logger.log('inserting new card into db');
  cards.insert(record, (err, newCard) => {
    if (err) {
      logger.warn('error inserting new card', err);
      deferred.reject(err);
    }
    logger.log('card successfully inserted', newCard);
    deferred.resolve(newCard);
  });

  return deferred.promise;
};

exports.updateCard = function(id, updates) {
  logger.log('updateCard', id, updates);
};

exports.removeCard = function(id) {
  logger.log('remove card', id);
};

exports.removeAllCards = function() {
  let deferred = Q.defer();

  cards.remove({}, { multi: true }, function (err, numRemoved) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(numRemoved);
    }
  });

  return deferred.promise;
};
