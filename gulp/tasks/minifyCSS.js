var minifyCSS = require('gulp-clean-css');
var comment = '';
var concat = require('gulp-concat');
var gulp = require('gulp');
var header = require('gulp-header');
var size = require('gulp-size');
var config = require('../config').minifyCSS;

/**
 * Run task minifyCSS
 */

 gulp.task('minifyCSS', () => {
  return gulp.src(config.src)
    .pipe(size())
    .pipe(minifyCSS())
    .pipe(header(comment + '\r\n'))
    .pipe(size({ gzip: true, showFiles: false }))
    .pipe(concat('skeletonic.min.css'))
    .pipe(gulp.dest(config.dest));
});
