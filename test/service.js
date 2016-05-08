'use strict';
const request = require('request');
const rimraf = require('rimraf');
const fs = require('fs');
const should = require('should');

describe('Basic service PUT and GET functionalities', function () {
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
      require('../index.js');
      done();
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
      done();
    });
  });
  describe('can PUT', function () {
    it('responds with a 201 the first time a key is written', function (done) {
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
        done();
      });
    });

    it('responds with the object just PUT', function (done) {
      let options = { method: 'PUT',
      url: 'http://localhost:7000/testpath/retrieve',
      headers:
      { 'content-type': 'application/json' },
      body: { answer: 42, see_me: 'yes' },
      json: true };

      request(options, function (error, response) {
        if (error) {
          done(error);
          return;
        }
        response.statusCode.should.equal(201);
        options.method = 'GET';
        options.body = {};
        request(options, function (error, response, body) {
          response.statusCode.should.equal(200);
          should.deepEqual(body, { answer: 42, see_me: 'yes' }, 'the JSON is the same which was just PUT');
          done();
        });
      });
    });
  });

  describe('can PUT twice', function () {
    it('respond with a 200 the second time a key is written', function (done) {
      let options = { method: 'PUT',
      url: 'http://localhost:7000/testpath/overwrite',
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
        url: 'http://localhost:7000/testpath/overwrite',
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
