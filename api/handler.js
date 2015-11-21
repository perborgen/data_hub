var index = "./public/index.html";
var mongoose = require('mongoose');


var home = function (request, reply) {
    reply.file('./public/index.html');
};

module.exports = {
	home: home
};