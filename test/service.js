const request = require("request");

describe('Basic service PUT and GET functionalities', function() {
  describe('can PUT', function() {
    it('respond with json', function(done) {


      var options = { method: 'PUT',
      url: 'http://localhost:7000/testpath/',
      headers:
      { 'content-type': 'application/json' },
      body: { answer: 42, test: true },
      json: true };

      request(options, function (error, response, body) {
        if (error) done(error);
        done();
      });
    });
  });
});