var gulp       = require('gulp');
var babelify   = require('babelify');
var browserify = require('browserify');
var fs         = require('fs');
var nodemon = require('gulp-nodemon');

var build = function () {
  console.log("Build started...");
  var timer_name = "Build complete";
  console.time(timer_name);

  // from babel's example setup.
  // see https://babeljs.io/docs/setup/#browserify
  browserify({ debug: true })
    .transform(babelify)
    .require("./app/client.js", { entry: true })
    .bundle()
    .on("error", function (err) {
      console.log("error: " + err.message);
    })
    .on('end', function() {
      console.timeEnd(timer_name);
    })
    .pipe(fs.createWriteStream("./public/bundle.js"))
};

gulp.task('build', function () {
  build();
});
