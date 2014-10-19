"use strict";
var gulp = require('gulp'),
    favicons = require('favicons'),
    uncss = require('gulp-uncss'),
    autoprefixer = require('gulp-autoprefixer'),
    less = require('gulp-less'),
    webserver = require('gulp-webserver'),
    htmlmin = require('gulp-htmlmin'),
    bowerFiles = require('main-bower-files'),
    inject = require('gulp-inject'),
    stripLine = require('gulp-strip-line'),
    livereload = require('gulp-livereload');

gulp.task('webserver', function () {
  gulp.src('.')
    .pipe(webserver({
      livereload: true,
      open: true
    }));
});

gulp.task('watch', ['webserver'], function () {
  var server = livereload();
  gulp.watch('**').on('change', function (file) {
    server.changed(file.path);
  });
  gulp.watch('*.less', ['css']);
});

gulp.task('css', function () {
  gulp.src('style.less')
    .pipe(less())
    .pipe(uncss({
      html: ['./index.html'],
      ignore: /goodnight/
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('src'));
});

gulp.task('icon', function () {
  favicons({
    source: 'logo.png',
    dest: '../'
  });
});

gulp.task('dist', function () {
  gulp.src('index.html')
    .pipe(stripLine([
      '<link href="style.css" rel="stylesheet" />',
      '<script src="goodnight.js"></script>'
    ]))
    .pipe(inject(gulp.src(['style.css']), {
      name: 'style',
      transform: function (filePath, file) {
        return "<style>" + file.contents.toString('utf8') + "</style>";
      }
    }))
    .pipe(inject(gulp.src(bowerFiles()), {
      name: 'bower',
      transform: function (filePath, file) {
        return "<script>" + file.contents.toString('utf8') + "</script>";
      }
    }))
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true,
      minifyJS: true,
      minifyCSS: true
    }))
    .pipe(gulp.dest('..'));
});
