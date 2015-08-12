// grab our gulp packages
var gulp  = require('gulp'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    bsync = require('browser-sync'),
    browserify = require("browserify"),
    source = require('vinyl-source-stream'),
    watchify = require('watchify'),
    jstify = require('jstify'),
    path = require('path'),
    request = require('request');

function handleError(err) {
    var args = Array.prototype.slice.call(arguments);
    gutil.log(gutil.colors.bgRed(args));
}

// create a default task and just log a message
gulp.task('default', ['jshint', 'build'], function() {
    bsync({
        server: {
            baseDir: 'web',
            middleware: [
                function(req, res, next) {
                    var ext = path.extname(req.url);
                    if ((ext === '' || ext === '.html') && req.url !== '/') {
                        req.pipe(request('http://' + req.headers.host)).pipe(res);
                    } else {
                        next();
                    }
                }
            ]
        },
        port: 8080,
        open: false
    });

    gulp.watch('*.css', bsync.reload);
});

gulp.task('build', function() {
    var bundler = browserify({
        entries: ['web/main.js'],
        fullPaths: true,
        debug: true
    });

    bundler.transform('jstify');

    var bundle = function() {
        return bundler
            .bundle()
            .on('error', handleError)
            .pipe(source('app.js'))
            .pipe(gulp.dest('web/build'))
            .on('end', function() {
                bsync.reload();
            });
    };

    bundler = watchify(bundler);
    bundler.on('update', bundle); // Rebundle with watchify on changes.
    return bundle();
});

gulp.task('jshint', function() {
  return gulp.src('*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});
