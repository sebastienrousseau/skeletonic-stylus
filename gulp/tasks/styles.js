const autoprefixer = require('gulp-autoprefixer');
const config       = require('../config').styles;
const cssimport    = require('postcss-import');
const cssvars      = require('postcss-simple-vars');
const gcmq         = require('gulp-group-css-media-queries');
const gulp         = require('gulp');
const gulpif       = require('gulp-if');
const gutil        = require('gulp-util');
const minify       = require('gulp-clean-css');
const nested       = require('postcss-nested');
const plugins      = require('gulp-load-plugins')({camelize: true});
const plumber      = require('gulp-plumber');
const rename       = require('gulp-rename');
const sourcemap    = require('gulp-sourcemaps');
const size         = require('gulp-size');
const stylus       = require('gulp-stylus');

function onError (err) {
  gutil.beep();
  console.log(err);
  this.emit('end');
}

gulp.task('packagestylus', function () {
  return gulp.src(config.src)
    .pipe(plumber({errorHandler: onError}))
    .pipe(gulpif(config.sourcemap, sourcemap.init()))
    .pipe(gulpif(config.type === 'stylus', stylus(config.stylus)))
    .pipe(size())
    .pipe(autoprefixer(config.options.autoprefixer))
    .pipe(minify(config.options.minify))
    .pipe(gcmq())
    // .pipe(rename({suffix: '.min'}))
    .pipe(plugins.postcss(plugins, { parser: nested, cssimport, cssvars }))
    .pipe(size({gzip: true, showFiles: true, title: 'Skeletonic CSS\'s minified Stylus source file'}))
    .pipe(gulpif(config.sourcemap, sourcemap.write('.')))
    .pipe(gulp.dest(config.dest));
});
