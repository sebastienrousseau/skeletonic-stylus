var gulp = require('gulp');
var stylelint = require('gulp-stylelint');
var size = require('gulp-size');
var config = require('../config').stylelint;

/**
 * Run task stylelint
 */
gulp.task('stylelint', function () {
  return gulp.src(config.src)
    .pipe(stylelint(
      {
        reporters: [
          {
            formatter: 'string',
            console: true,
            fix: true,
            failAfterError: false,
          }
        ]
      }
    ))
    .pipe(size())
    .pipe(gulp.dest(config.dest));
});
