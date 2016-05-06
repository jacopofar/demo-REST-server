'use strict';
const crypto = require('crypto');

/*
* Pure function to map an arbitrary string to a unique and filesystem-friendly key
*/

module.exports.mapToNiceKey = function (key) {
  const hash = crypto.createHash('sha256');
  hash.update(key);
  const ret = key.replace(/[^a-zA-Z0-9_-]/g, '').substr(-10) + '_' + hash.digest('hex');
  return ret;
};

/**
* Finds the key-value pair where the key is the longest initial slice of the given one, possibly the exact same
* The callback will receive the optional error, the keys array (null when not found) and the corresponding value
*/
module.exports.getBestKeyValue = function(keys, cb){
//TODO actually implement this
cb(null,['foo','apple'],{duh:34});
};
