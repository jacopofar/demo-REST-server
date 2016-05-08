'use strict';
const request = require('request');
const rimraf = require('rimraf');
const fs = require('fs');
require('should');

describe('Basic service PUT and GET functionalities', function (done) {
  before(function (done) {
    //replace the config with a test one
    fs.renameSync('config.json', 'config_temp.json');
    fs.renameSync('config_test.json', 'config.json');
    //run the server
      rimraf('data_test', function (err_rmdir) {
        const app = require('../index.js');
        done();
      });
  });

  after(function (done) {
    //replace the test config with the original one
    fs.renameSync('config.json', 'config_test.json');
    fs.renameSync('config_temp.json', 'config.json');
      rimraf('data_test', function (err_rmdir) {
        done();
      });
  });
  describe('can PUT', function () {
    it('respond with a 200 the second time a key is written', function (done) {
      let options = { method: 'PUT',
      url: 'http://localhost:7000/testpath/',
      headers:
      { 'content-type': 'application/json' },
      body: { answer: 42, test: true },
      json: true };

      request(options, function (error, response) {
        if (error) {
          done(error);
          return;
        }
        response.statusCode.should.equal(201);
        let options2 = { method: 'PUT',
        url: 'http://localhost:7000/testpath/',
        headers:
        { 'content-type': 'application/json' },
        body: { answer: 42, test: true, second: true },
        json: true };

        request(options2, function (error, response) {
          if (error) {
            done(error);
            return;
          }
          response.statusCode.should.equal(200);
          done();
        });
      });
    });
  });
});
