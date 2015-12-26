var Hapi    = require("hapi");
var server  = new Hapi.Server();
var config  = require('./config');
var handler = require('./api/handler');
var inert   = require('inert');
var bell    = require('bell');
var hapiAC  = require('hapi-auth-cookie');

server.connection({
    port: process.env.PORT || 8080,
    host: "0.0.0.0" || "localhost"
});

server.register([inert, bell, hapiAC], function(err){

    if (err) {
        throw err;
    }

    var authCookieOptions = {
        password: config.password || process.env.PASSWORD, //Password used for encryption
        cookie: 'auth', // Name of cookie to set
        isSecure: false
    };

    server.auth.strategy('site-point-cookie', 'cookie', authCookieOptions);

    var bellAuthOptions = {
        provider: 'github',
        password: process.env.PASSWORD || config.password, //Password used for encryption
        clientId: process.env.CLIENTID || config.clientId, //'YourAppId',
        clientSecret: process.env.CLIENTSECRET || config.clientSecret,//'YourAppSecret',
        isSecure: false,
        location: process.env.LOCATION || 'http://localhost:8080'
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
            path: "/api/signedurl",
            config: {
                auth: false,
                handler: handler.signedurl
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
            method: "GET",
            path: "/api/search/{searchQuery}",
            config: {
                auth: {
                    strategy: 'site-point-cookie',
                    mode: 'try'
                },
                handler: handler.search
            }
        },
        {
            method: ["POST"],
            path: "/api/request/new",
            config: {
                auth: {
                    strategy: 'site-point-cookie',
                    mode: 'try'
                },
                handler: handler.newRequest
            }
        },
        {
            method: "GET",
            path: "/api/request/{requestId}",
            config: {
                auth: {
                    strategy: 'site-point-cookie',
                    mode: 'try'
                },
                handler: handler.getRequest
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
            method: ["POST"],
            path: "/api/testupload/",
            config: {
                auth: {
                    strategy: 'site-point-cookie',
                    mode: 'try'
                },
                handler: handler.testupload
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
            path: "/api/requests/featured",
            config: {
                auth: {
                    strategy: 'site-point-cookie',
                    mode: 'try'
                },
                handler: handler.featuredRequests
            }
        },
        {
            method: "POST",
            path: "/api/request/upvote",
            config: {
                handler: handler.upvoteRequest
            }
        },
        {
            method: "POST",
            path: "/api/dataset/upvote",
            config: {
                handler: handler.upvoteDataset
            }
        },
        {
            method: "POST",
            path: "/api/dataset/comment",
            config: {
                handler: handler.commentDataset
            }
        },
        {
            method: "GET",
            path: "/api/tag/{param}",
            config: {
                auth: {
                    strategy: 'site-point-cookie',
                    mode: 'try'
                },
                handler: handler.getTags
            }
        },
        {
            method: "GET",
            path: "/tag/{param}",
             config: {
                auth: {
                    strategy: 'site-point-cookie',
                    mode: 'try'
                },
                handler: handler.home
            }
        },
        {
            method: "GET",
            path: "/search/{param}",
             config: {
                auth: {
                    strategy: 'site-point-cookie',
                    mode: 'try'
                },
                handler: handler.home
            }
        },
        {
            method: "GET",
            path: "/dataset/{param}",
             config: {
                auth: {
                    strategy: 'site-point-cookie',
                    mode: 'try'
                },
                handler: handler.home
            }
        },
        {
            method: "GET",
            path: "/request/{param}",
             config: {
                auth: {
                    strategy: 'site-point-cookie',
                    mode: 'try'
                },
                handler: handler.home
            }
        },
        {
            method: "GET",
            path: "/{param}",
             config: {
                auth: {
                    strategy: 'site-point-cookie',
                    mode: 'try'
                },
                handler: handler.home
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
