var header = require('gulp-header');
var comment = '';
var csscomb = require('gulp-csscomb');
var gulp = require('gulp');
var size = require('gulp-size');

/**
 * Run task csscomb
 */
gulp.task('csscomb', function () {
  return gulp.src(['./skeletonic/css/*.css'])
    .pipe(csscomb('./csscomb.json'))
    .pipe(header(comment + '\r\n'))
    .pipe(size())
    .pipe(gulp.dest('./skeletonic/css/'));
});
