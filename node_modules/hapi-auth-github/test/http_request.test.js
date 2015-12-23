var test     = require('tape');
var REQUEST  = require('../lib/http_request');
var optsmsg  = "requires valid http request options";
var cberrmsg = "please supply a callback"

test('Attepmt to invoke REQUEST WITHOUT http request options (ERROR CHECK)', function(t) {
  try {
    var result = REQUEST(); // no options or callback! :-O
  } catch (error){
    console.log(error);
    t.ok(error.indexOf(optsmsg) > -1, "*Wanted Error* Got "+error + " (as expected!)");
    t.end();
  }
})

test('Attepmt to invoke REQUEST WITHOUT VALID callback funciton (ERROR CHECK)', function(t) {
  try {
    var options = {
      hostname: '127.0.0.1', // gets over-written below if using HEROKU
      port: 8000,        // also over-written below if using HEROKU
      path: '/',
      method: 'GET',   // e.g. GET, POST, DELETE for our CRUD
      headers: {
        'Content-Type': 'application/json'
      }
    };
    var result = REQUEST(options);
  } catch (error){
    console.log(error);
    t.ok(error.indexOf(cberrmsg) > -1, "*Wanted Error* Got "+error + " (as expected!)");
    t.end();
  }
})

test('Force req.on("error") condition in http request', function(t) {
  var options = {
    hostname: '127.0.0.1', // gets over-written below if using HEROKU
    port: 8000,        // also over-written below if using HEROKU
    path: '/',
    method: 'GET',   // e.g. GET, POST, DELETE for our CRUD
    headers: {
      'Content-Type': 'application/json'
    }
  };
  REQUEST(options, function(error) {
    // console.log(error);
    t.ok(error.code === 'ECONNREFUSED', "*Wanted Error* Got "+error.code + " (as expected!)");
    t.end();
  });
})
