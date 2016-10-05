// Using mocha as the testing framework, supertest to do integration tests,
// chai to do unit tests and cheerio to test the rendered HTML, test the functionality of each resource

// This is an example using supertest and mocha. Mocha is the describe and it
// block and also pretties up output in console. Supertest supplies the request(app) part.

var request = require('supertest');
//require our app, which is possible because we exported it
var app = require('./../server');

describe('GET /', function() {
  it('should respond with 200 status code', function(done) {
    request(app)
      .get('/')
      .expect(200)
      .end(function(err, res){
        if (err) throw err;
        done();
      });
  });
});
