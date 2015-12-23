require('env2')('.env');
var crypto = require('crypto');    // http://nodejs.org/api/crypto.html
var querystring   = require('querystring'); // nodejs.org/api/querystring.html
var hash = crypto.createHash('sha256');

var assert = require('assert');
require('env2')('.env');
// console.log(process.env);
var Hapi = require('hapi');
var server = new Hapi.Server();
server.connection({
	host: 'localhost',
	port: Number(process.env.PORT)
});

var opts = {
  REDIRECT_URL: '/githubauth',  // must match google app redirect URI
  handler: require('./github_oauth_handler.js'), // your handler
  scope: 'user' // get user's profile see: developer.github.com/v3/oauth/#scopes
};

var hapi_auth_google = require('../lib');

server.register([{ register: hapi_auth_google, options:opts }], function (err) {
  // handle the error if the plugin failed to load:
  assert(!err, "FAILED TO LOAD PLUGIN!!! :-("); // fatal error
});

server.route({
  method: 'GET',
  path: '/',
  handler: function(req, reply) {
    hash.update(Math.random().toString()).digest('hex');
    console.log(hash);
    var params = {
      client_id : process.env.GITHUB_CLIENT_ID,
      redirect_uri : 'http://localhost:8000/githubauth',
      scope : 'repo',
      state: hash
    }
    console.log(params);
    var qs = querystring.stringify(params);
    console.log(qs);
    var url = 'https://github.com/login/oauth/authorize' + '?' + qs;
    console.log(url);
		var src = 'https://cloud.githubusercontent.com/assets/194400/11214293/4e309bf2-8d38-11e5-8d46-b347b2bd242e.png';
		var btn = '<a href="' + url + '"><img src="' + src + '" alt="Login With GitHub"></a>';
    reply(btn);
  }
});

server.start(function(err){ // boots your server
  assert(!err, "FAILED TO Start Server");
	console.log('Now Visit: http://localhost:'+server.info.port);
});

module.exports = server;
