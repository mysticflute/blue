// db.js
// interface to the main data store

const Q = require('Q');
const path = require('path');
const nedb = require('nedb');
const electron = require('electron').remote;
const dest = path.join(electron.app.getPath('userData'), 'appData');

const cards = new nedb({
  filename: path.join(dest, 'cards.db'),
  autoload: true,
  timestampData: true
});

exports.getCards = function() {
  return Q.ninvoke(cards, 'find', {});
};

exports.newCard = function(record) {
  console.log('inserting new card into db');
  return Q.ninvoke(cards, 'insert', record);
};

exports.updateCard = function(id, updates) {
  return Q.ninvoke(cards, 'update', { _id: id}, {$set: updates });
};

exports.removeCard = function(id) {
  return Q.ninvoke(cards, 'remove', { _id: id }, {});
};

exports.removeAllCards = function() {
  return Q.ninvoke(cards, 'remove', {}, { multi: true });
};
