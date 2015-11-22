var Bell    = require('bell');
var Hapi = require("hapi");
var server = new Hapi.Server();
var config = require('./config');
var handler = require('./api/handler');

server.connection({
    port: 8080,
    host: 'herokuapp.com'
});

server.register([require('inert'), require('bell'), require('hapi-auth-cookie')], function(err){

    if (err) {
        throw err;
    }

    var authCookieOptions = {
        password: 'cookie-encryption-password', //Password used for encryption
        cookie: 'sitepoint-auth', // Name of cookie to set
        isSecure: false
    };

    server.auth.strategy('site-point-cookie', 'cookie', authCookieOptions);

    var bellAuthOptions = {
        provider: 'github',
        password: process.env.GITHUB_PASSWORD || config.password, //Password used for encryption
        clientId: process.env.CLIENTID || config.clientId,//'YourAppId',
        clientSecret: process.env.CLIENTSECRET || config.clientSecret,//'YourAppSecret',
        isSecure: false,
        location: 'https://frozen-ocean-7041.herokuapp.com'
    };

    server.auth.strategy('github-oauth', 'bell', bellAuthOptions);
    server.auth.default('site-point-cookie');

    server.route([
        {
            method: "GET",
            path: "/",
            config: {
                 auth: {
                    mode: 'optional'
                 },
       /*         auth: {
                    strategy: 'site-point-cookie',
                    mode: 'try'
                },*/
                handler: handler.home
            }
        },
        {
            method: "GET",
            path: "/login",
            config: {
                auth: 'github-oauth',
                handler: handler.login
            }
        },
        {
            method: "GET",
            path: "/bundle.js",
            config: {
                auth: false,
                handler: function(request, reply){
                    reply.file("public/bundle.js");
                }
            }
        },
        {
            method: 'GET',
            path: '/logout',
            config: {
                auth: false,
                handler: handler.logout
            }
        },
        {
            method: "GET",
            path: "/api/user",
            config: {
                auth: {
                    strategy: 'site-point-cookie',
                    mode: 'try'
                },
                handler: handler.user
            }

        },
        {
            method: ["POST"],
            path: "/api/dataset/new",
            config: {
                auth: {
                    strategy: 'site-point-cookie',
                    mode: 'try'
                },
                handler: handler.newDataset
            }
        },
        {
            method: "GET",
            path: "/api/dataset/{datasetId}",
            config: {
                auth: {
                    strategy: 'site-point-cookie',
                    mode: 'try'
                },
                handler: handler.getDataset
            }
        },
        {
            method: "GET",
            path: "/api/datasets/featured",
            config: {
                auth: {
                    strategy: 'site-point-cookie',
                    mode: 'try'
                },
                handler: handler.featuredDatasets
            }
        },
        {
            method: "GET",
            path: "/{param*}",
            config: {
                auth: {
                    strategy: 'site-point-cookie',
                    mode: 'try'
                },
                handler: handler.datasets
            }
        }
    ]);
});

server.start(function(){
    console.log('started');
});

module.exports = {
    server: server
};
