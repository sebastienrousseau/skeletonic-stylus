var gulp           = require('gulp');
var runSequence    = require('gulp4-run-sequence');

/**
 * Run all tasks needed for a build in defined order
 */
gulp.task('build:development', function (callback) {
  runSequence(
    'base64',
    'sizereport',
    callback
  );
});
