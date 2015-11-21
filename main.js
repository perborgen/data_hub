var Hapi = require('hapi');
var handler = require('./api/handler');
var internals = {};


var server = new Hapi.Server();

server.connection({
    port: process.env.PORT || 3000, 
    host: '0.0.0.0' 
});


server.register([require('inert')], function(err) {

    server.route([
        { 
            method: 'GET', 
            path: '/', 
            config: { 
                handler: handler.home 
            } 
        }
    ]);
});


server.start(function () {
    console.log('Server started at [' + server.info.uri + ']');
});

module.exports = {
    server: server
};