var test = require('tape');
var nock = require('nock');
var dir  = __dirname.split('/')[__dirname.split('/').length-1];
var file = dir + __filename.replace(__dirname, '') + " > ";

var server = require('../example/github_server.js');

test(file+'Visit / root url expect to see a link', function(t) {
  var options = {
    method: "GET",
    url: "/"
  };
  server.inject(options, function(response) {
    t.equal(response.statusCode, 200, "Server is working.");
    setTimeout(function(){ server.stop(t.end); }, 100);
  });
});

// test a bad code does not crash the server!
test(file+'GET /githubauth?code=oauth2codehere', function(t) {
  var options = {
    method: "GET",
    url: "/githubauth?code=badcode"
  };
  server.inject(options, function(response) {
    t.equal(response.statusCode, 401, "Bad Code is Rejected (as expected)");
    t.ok(response.payload.indexOf('something went wrong') > -1,
          'Got: '+response.payload + ' (as expected)');
    server.stop(t.end);
  });
});


test(file+'MOCK GitHub OAuth2 Flow /githubauth?code=mockcode', function(t) {
  // google oauth2 token request url:
  var fs = require('fs');
  var token_fixture = fs.readFileSync('./test/fixtures/sample_access_token.json');
  var nock = require('nock');
  var scope = nock('https://github.com')
            .persist() // https://github.com/pgte/nock#persist
            .post('/login/oauth/access_token')
            .reply(200, token_fixture);

  // see: http://git.io/v4nTR for google plus api url
  // https://www.googleapis.com/plus/v1/people/{userId}
  var sample_profile = fs.readFileSync('./test/fixtures/sample_profile.json');
  var nock = require('nock');
  var scope = nock('https://api.github.com')
            .get('/user')
            .reply(200, sample_profile);

  var options = {
    method: "GET",
    url: "/githubauth?code=mockcode"
  };
  server.inject(options, function(response) {
    t.equal(response.statusCode, 200, "Profile retrieved (Mock)");
    var expected = 'Hello Alex, You Logged in Using GitHub!';
    t.equal(response.payload, expected, "Got: " + expected + " (as expected)");
    // console.log(' - - - - - - - - - - - - - - - - - -');
    // console.log(response.payload);
    // console.log(' - - - - - - - - - - - - - - - - - -');
    server.stop(t.end);
  });
});
