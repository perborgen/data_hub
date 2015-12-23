var http = require('https'); // ALWAYS use TLS over the internets!
/**
* request is a bare-bones http request using node.js core http module
* see: https://nodejs.org/api/http.html#http_http_request_options_callback
*/
module.exports = function request(options, callback) {
  if(!options || !options.hostname || !options.port || !options.path){
    var msg = "http.request requires valid http request options"
    throw "ERROR: " + __filename + ":16 \n" + msg;
  }
  // check for existence of a callback function
  if(!callback || typeof callback !== 'function') {
    var cmsg = "http.request is Asynchronous, please supply a callback as second param!"
    throw "ERROR: " + __filename + ":21 \n" + cmsg;
  }
  var req = http.request(options, function(res) {
    // console.log('STATUS: ' + res.statusCode);
    if(res.statusCode !== 200){
      return callback(200);
    }
    // console.log('HEADERS: ' + JSON.stringify(res.headers, null, 2));
    res.setEncoding('utf8');
    var resStr = '';
    res.on('data', function (chunk) {
      resStr += chunk;
    }).on('end', function () {
      // console.log(' - - - - - - - - - - - - - - - - - - - resStr:');
      var response = JSON.parse(resStr);
      // console.log(JSON.stringify(response, null, 2));
      return callback(null, response); // return response as object
    });
  })
  // if you have a better suggestion for error handling please submit an issue!
  req.on('error', function(e) {
    console.log('>> Problem with http request: ' + e.message); // non fatal fail
    return callback(e);
  });
  // write to request body if passed to options
  if (options.body) {
    req.write(options.body);
  }
  req.end();
}
