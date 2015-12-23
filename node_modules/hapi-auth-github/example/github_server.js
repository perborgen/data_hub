require('env2')('.env');
var querystring = require('querystring'); // nodejs.org/api/querystring.html
var assert      = require('assert');
var Hapi        = require('hapi');

var server = new Hapi.Server();
server.connection({
	host: 'localhost',
	port: Number(process.env.PORT)
});

var opts = {
  REDIRECT_URL: '/githubauth',  // must match google app redirect URI
  handler: require('./github_oauth_handler.js'), // your handler
  SCOPE: 'user' // get user's profile see: developer.github.com/v3/oauth/#scopes
};

var hapi_auth_github = require('../lib');

server.register([{ register: hapi_auth_github, options:opts }], function (err) {
  // handle the error if the plugin failed to load:
  assert(!err, "FAILED TO LOAD PLUGIN!!! :-("); // fatal error
});

server.route({
  method: 'GET',
  path: '/',
  handler: function(req, reply) {
		var url = hapi_auth_github.login_url();
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
