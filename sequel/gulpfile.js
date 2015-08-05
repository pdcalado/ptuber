// grab our gulp packages
var gulp  = require('gulp'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint');

// create a default task and just log a message
gulp.task('default', ['jshint'], function() {
    return gutil.log('Gulp complete!');
});

gulp.task('jshint', function() {
  return gulp.src('*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});
