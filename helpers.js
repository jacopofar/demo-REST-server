'use strict';
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const mkdirp = require('mkdirp');
/*
* Pure synchronous function to map an arbitrary string to a unique and filesystem-friendly key
* @param {String} key - the key to hash
*/

module.exports.mapToNiceKey = function (key) {
  const hash = crypto.createHash('sha256');
  hash.update(key);
  const ret = key.replace(/[^a-zA-Z0-9_-]/g, '').substr(-10) + '_' + hash.digest('hex');
  return ret;
};

/*
* Finds the key-value pair where the key is the longest initial slice of the given one, possibly the exact same
* The callback will receive the optional error, the keys array (empty when not found) and the corresponding value, if any
* @param {Array} keys - the keys to search, from the most important to the least
* @param {Function} cb - a callback which will receive the error code, the matching key array and the corresponding content
*/
const getBestKeyValue = function (keys, cb) {
  if (keys.length === 0) {
    return cb(null, []);
  }
  const complete_path = path.join(conf.get('data_folder'), keys.reduce((a, b) => path.join(a, b))) + '.json';
  fs.readFile(complete_path, 'utf8', (err, data) => {
    if (err) {
      if (err.code !== 'ENOENT') {
        log.error('error accessing the filesystem: ' + JSON.stringify(err));
        cb(err);
        return;
      }
      getBestKeyValue(keys.slice(0, -1), cb);
    }
    else {
      cb(null, keys, JSON.parse(data));
    }
  });
};
module.exports.getBestKeyValue = getBestKeyValue;

/**
* Write the given data on the given key array, creating the folders when necessary
* @param {Array} keys - the keys array to write to
* @param {String} data - the data to write
* @param {Function} cb - a callback which will receive the error code, if any, and a boolean reporting true if the value was overwtitten
*/
module.exports.writeKV = function (fs_keys, data, cb) {
  if (fs_keys.length === 0) {
    cb({ error: 'cannot write an empty key array' });
    return;
  }
  const folder_path = (fs_keys.length === 1) ?
    conf.get('data_folder') :
    path.join(conf.get('data_folder'), fs_keys.slice(0, -1).reduce((a, b) => path.join(a, b)));
  //if we know in advance no folder has to be created, just avoid to check
  let dir_creator = (a, fun) => {fun();};
  if (fs_keys.length > 1) {
    dir_creator = mkdirp;
  }
  dir_creator(folder_path, function (err) {
    if (err) {
      cb({ error: 'cannot create the necessary folders', detail: err });
      return;
    }
    //the folders are ready, check whether the file exists
    const file_name = path.join(folder_path, fs_keys.slice(-1) + '.json');
    fs.stat(file_name, function (err_non_existing) {
      if (err_non_existing !== null && err_non_existing.code !== 'ENOENT') {
        cb({ error: 'cannot access the file', detail: err_non_existing });
        return;
      }
      fs.writeFile(file_name, data, 'utf8', (err) => {
        if (err) {
          cb({ error: 'cannot write the file', detail: err });
          return;
        }
        //if stats did not report it didn't exist, it was overwritten
        cb(null, err_non_existing === null);
      });
    });
  });
};
