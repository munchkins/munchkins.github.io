'use strict';

/* eslint no-var:0 */
var gulp = require('gulp');
var babel = require('gulp-babel');
var bower = require('gulp-bower');
var concat = require('gulp-concat');
var cssmin = require('gulp-cssmin');
var eslint = require('gulp-eslint');
var ignore = require('gulp-ignore');
var jade = require('gulp-jade');
var annotate = require('gulp-ng-annotate');
var replace = require('gulp-replace');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var karma = require('karma');

var errcb = function(err) {
  console.error(err.stack || err.message || err);
  this.emit('end');
};

gulp.task('js-babel', function() {
  return gulp
    .src(['src/js/**/*.js'])
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(annotate())
    .pipe(concat('munchkins.js'))
    .pipe(sourcemaps.write('.', {
      sourceRoot: '.',
      sourceMappingURLPrefix: '.'
    }))
    .pipe(gulp.dest('.'));
});

gulp.task('js-eslint', function() {
  return gulp
    .src(['src/js/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('html-jade', function() {
  var two = function(val) {
    return ('00' + val).slice(-2);
  };

  var d = new Date();
  var version = d.getFullYear() + two(d.getMonth() + 1) + two(d.getDate()) + '-' + two(d.getHours()) + two(d.getMinutes());

  return gulp
    .src(['src/**/*.jade'])
    .pipe(replace(/MUNCHKINSVERSION/g, version))
    .pipe(jade())
    .on('error', errcb)
    .pipe(gulp.dest('.'));
});

gulp.task('css-sass', function() {
  var nm = __dirname + '/node_modules';

  return gulp.src(['src/css/**/*.scss'])
    .pipe(sass({
      indentedSyntax: false,
      sourceComments: 'normal',
      outputStyle: 'nested',
      includePaths: ['bourbon', 'bourbon-neat'].map(function(p) {
        return nm + '/' + p + '/app/assets/stylesheets';
      })
    }))
    .on('error', errcb)
    .pipe(ignore.exclude('*.css.map'))
    .pipe(cssmin({
      keepBreaks: true
    }))
    .pipe(concat('munchkins.css'))
    .pipe(gulp.dest('.'));
});

gulp.task('bower', function() {
  return bower();
});

gulp.task('build', ['js-eslint', 'js-babel', 'html-jade', 'css-sass']);

gulp.task('test', ['bower', 'build'], function(done) {
  new karma.Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('default', ['test']);
