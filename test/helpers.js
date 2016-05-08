'use strict';
const should = require('should');
const fs = require('fs');
const helpers = require('../helpers');
const rimraf = require('rimraf');
const testServer = require('../index.js');

describe('Helpers works properly', function () {
  before(function (done) {
    //replace the config with a test one
    fs.renameSync('config.json', 'config_temp.json');
    fs.renameSync('config_test.json', 'config.json');
    //destroy previous data, if present, and run the server
    rimraf('data_test', function (err_rmdir) {
      if (err_rmdir) {
        console.log('error deleting the test data folder', err_rmdir);
        process.exit();
      }
      //close then restart, or it will use the old config
      testServer.terminate();
      testServer.startServer();
      testServer.onReady(done);
    });
  });

  after(function (done) {
    //replace the test config with the original one
    fs.renameSync('config.json', 'config_test.json');
    fs.renameSync('config_temp.json', 'config.json');
    rimraf('data_test', function (err_rmdir) {
      if (err_rmdir) {
        console.log('error deleting the test data folder', err_rmdir);
        process.exit();
      }
      testServer.terminate();
      done();
    });
  });
  describe('hashing works properly', function () {
    it('always return the same value for the same argument', function () {
      should.equal(helpers.mapToNiceKey('A è haiDS8O +._8'), helpers.mapToNiceKey('A è haiDS8O +._8'), 'same arguments lead to same hashes');
      should.equal(helpers.mapToNiceKey('散列函数适用于任何字符范围'), helpers.mapToNiceKey('散列函数适用于任何字符范围'), 'same arguments lead to same hashes');
      should.equal(helpers.mapToNiceKey(''), helpers.mapToNiceKey(''), 'same arguments lead to same hashes');
      should.equal(helpers.mapToNiceKey('  '), helpers.mapToNiceKey('  '), 'same arguments lead to same hashes');
    });
  });
});
