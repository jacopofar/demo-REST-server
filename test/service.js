'use strict';
const request = require('request');
const rimraf = require('rimraf');
const fs = require('fs');
const should = require('should');
const testServer = require('../index.js');

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
      //close then restart to reload the config
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
        should.equal(response.statusCode, 201, 'status code is 201');
        done();
      });
    });
  });


  describe('cannot PUT somehting that is not JSON', function () {
    it('responds with a 400 when writing an invalid JSON string', function (done) {
      let options = { method: 'PUT',
      url: 'http://localhost:7000/testpath/',
      headers:
      { 'content-type': 'application/json' },
      body: '{{"answer":42}'
      };

      request(options, function (error, response) {
        if (error) {
          done(error);
          return;
        }
        should.equal(response.statusCode, 400, 'status code is 400');
        done();
      });
    });

    it('responds with a 415 when writing a non-JSON mimetype', function (done) {
      let options = { method: 'PUT',
      url: 'http://localhost:7000/testpath/',
      headers:
      { 'content-type': 'application/xml' },
      body: '{"answer":42}'
      };

      request(options, function (error, response) {
        if (error) {
          done(error);
          return;
        }
        should.equal(response.statusCode, 415, 'status code is 415');
        done();
      });
    });
  });

  describe('can GET back', function () {
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
        should.equal(response.statusCode, 201, 'the first PUT status code is 201');
        options.method = 'GET';
        options.body = {};
        request(options, function (error, response, body) {
          should.equal(response.statusCode, 200, 'the GET status code is 200');
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
        should.equal(response.statusCode, 201, 'the first PUT status code is 201');
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
          should.equal(response.statusCode, 200, 'the second PUT status code is 200');
          done();
        });
      });
    });
  });

  describe('can PUT and then DELETE', function () {
    it('DELETEs a content', function (done) {
      let options = { method: 'PUT',
      url: 'http://localhost:7000/testpath/deleteme',
      headers:
      { 'content-type': 'application/json' },
      body: { answer: 42, test: true },
      json: true };

      request(options, function (error, response) {
        if (error) {
          done(error);
          return;
        }
        should.equal(response.statusCode, 201, 'status code is 201');


        let options2 = { method: 'DELETE',
        url: 'http://localhost:7000/testpath/deleteme',
        headers:
        { 'content-type': 'application/json' },
        json: true };

        request(options2, function (error, response) {
          if (error) {
            done(error);
            return;
          }
          should.equal(response.statusCode, 200, 'the second DELETE status code is 200');
          done();
        });
      });
    });
  });
});
