const pkg = require('../../package.json');
const clean = require('gulp-clean-css');
const comment = `/**
 * Name: ${pkg.name} v${pkg.version}
 * Description: ${pkg.description}
 * @version ${pkg.version}
 * Author: ${pkg.author}
 * Copyright © Sebastien Rousseau 2021. All rights reserved.
 * ${pkg.homepage}
 * Repository: ${pkg.repository}
 * License: ${pkg.license}
 * License URI: ${pkg.license_URI}
 */\r\n`;
const concat = require('gulp-concat');
const csscomb = require('gulp-csscomb');
const csslint = require('gulp-csslint');
const groupmediaqueries = require('gulp-group-css-media-queries');
const gulp = require('gulp');
const header = require('gulp-header');
const cleancss = require('gulp-clean-css');
const size = require('gulp-size');
const sourcemaps = require('gulp-sourcemaps');
const stylus = require('gulp-stylus');
csslint.addFormatter('csslint-stylish');
var config = require('../config').buildCSS;

/**
 * Run task buildCSS
 */

gulp.task('buildCSS', function () {
  return gulp.src(config.src)
    .pipe(size())
    .pipe(concat('skeletonic.styl'))
    .pipe(sourcemaps.init())
    .pipe(stylus())
    .pipe(groupmediaqueries())
    .pipe(csslint.formatter('stylish'))
    .pipe(clean())
    .pipe(cleancss({
      debug: true,
      format: 'beautify'
    }))
    .pipe(csscomb('./csscomb.json'))
    .pipe(header(comment + '\r\n'))
    .pipe(concat('./skeletonic-' + pkg.version + '.css', { rebaseUrls: false }))
    .pipe(size())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(config.dest))
    .pipe(clean())
    .pipe(cleancss())
    .pipe(size({ gzip: true, showFiles: false }))
    .pipe(concat('./skeletonic-' + pkg.version + '.min.css'))
    .pipe(gulp.dest(config.dest));
});
