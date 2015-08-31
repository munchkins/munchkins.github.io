'use strict';

var gulp = require('gulp');
var eslint = require('gulp-eslint');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var newer = require('gulp-newer');
var annotate = require('gulp-ng-annotate');
var jade = require('gulp-jade');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

gulp.task('js-babel', function() {
  return gulp
    .src(['src/js/**/*.js'])
    .pipe(newer('app.js'))
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(annotate())
    .pipe(uglify())
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
    .on('error', function(err) {
      console.error(err.stack || err.message || err);
      this.emit('end');
    })
    .pipe(gulp.dest('.'));
});

gulp.task('default', [
  'js-eslint',
  'js-babel',
  'html-jade'
]);
