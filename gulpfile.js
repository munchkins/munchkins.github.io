'use strict';

/* eslint no-var:0 */
var gulp = require('gulp');
var eslint = require('gulp-eslint');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var newer = require('gulp-newer');
var annotate = require('gulp-ng-annotate');
var jade = require('gulp-jade');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var cssmin = require('gulp-cssmin');
var ignore = require('gulp-ignore');

var errcb = function(err) {
  console.error(err.stack || err.message || err);
  this.emit('end');
};

gulp.task('js-babel', function() {
  return gulp
    .src(['src/js/**/*.js'])
    .pipe(newer('munchkins.js'))
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(annotate())
    //.pipe(uglify())
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
  return gulp
    .src(['src/**/*.jade'])
    .pipe(newer({
      dest: '.',
      ext: '.html'
    }))
    .pipe(jade())
    .on('error', errcb)
    .pipe(gulp.dest('.'));
});

gulp.task('css-sass', function() {
  var nm = __dirname + '/node_modules';

  return gulp.src(['src/css/**/*.scss'])
    .pipe(newer('munchkins.css'))
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

gulp.task('default', [
  'js-eslint',
  'js-babel',
  'html-jade',
  'css-sass'
]);
