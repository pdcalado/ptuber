// grab our gulp packages
var gulp  = require('gulp'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),

function handleError(err) {
    var args = Array.prototype.slice.call(arguments);
    gutil.log(gutil.colors.bgRed(args));
}

// create a default task and just log a message
gulp.task('default', ['jshint', 'build'], function() {
    console.log('Done.');
});

gulp.task('jshint', function() {
  return gulp.src('*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});
