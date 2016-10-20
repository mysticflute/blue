// db.js
// interface to the main data store

const Q = require('q');
const path = require('path');
const nedb = require('nedb');
const electron = require('electron').remote;
const dest = path.join(electron.app.getPath('userData'), 'appData');

const cards = new nedb({
  filename: path.join(dest, 'cards.db'),
  autoload: true,
  timestampData: true
});

const prefs = new nedb({
  filename: path.join(dest, 'prefs.db'),
  autoload: true,
  timestampData: true
});

/* gets all cards */
exports.getCards = function() {
  return Q.ninvoke(cards, 'find', {});
};

/* adds a new cards */
exports.newCard = function(record) {
  console.log('inserting new card into db');
  return Q.ninvoke(cards, 'insert', record);
};

/* updates an existing card */
exports.updateCard = function(id, updates) {
  return Q.ninvoke(cards, 'update', { _id: id}, {$set: updates });
};

/* removes a single card by id */
exports.removeCard = function(id) {
  return Q.ninvoke(cards, 'remove', { _id: id }, {});
};

/* removes all cards */
exports.removeAllCards = function() {
  return Q.ninvoke(cards, 'remove', {}, { multi: true });
};

/** set a single pref */
exports.setPref = function(name, value) {
  let update = {};
  update[name] = value;
  return Q.ninvoke(prefs, 'update', {name: 'prefs'}, {$set: update}, {upsert: true});
};

/** toggle the value of a pref, or set to true if not yet set */
exports.togglePref = function(name) {
  this.getPrefs().then(prefs => {
    this.setPref(name, !prefs[name]);
  });
};

/** gets all prefs */
exports.getPrefs = function() {
  let deferred = Q.defer();

  prefs.find({name: 'prefs'}, (err, docs) => {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(docs.length ? docs[0] : {});
    }
  });

  return deferred.promise;
};

/** gets a single pref value */
exports.getPref = function(name) {
  return this.getPrefs().then(prefs => {
    return prefs[name];
  });
};
