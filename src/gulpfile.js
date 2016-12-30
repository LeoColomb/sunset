'use strict';
const gulp = require('gulp');
const favicons = require('gulp-favicons');
const autoprefixer = require('gulp-autoprefixer');
const less = require('gulp-less');
const webserver = require('gulp-webserver');
const htmlmin = require('gulp-htmlmin');
const bowerFiles = require('main-bower-files');
const inject = require('gulp-inject');
const stripLine = require('gulp-strip-line');
const livereload = require('gulp-livereload');
const uglify = require('gulp-uglify');

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
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('.'));
});

gulp.task('icon', function () {
    return gulp.src('logo.png').pipe(favicons({
        appName: 'Sunset',
        appDescription: 'A pretty light Mediterranean sunset',
        developerName: 'Léo Colombaro',
        developerURL: 'http://colombaro.fr',
        background: '#f0f0f0',
        url: 'http://sunset.colombaro.fr',
        version: 1.0,
        logging: false,
        online: false
    }))
    .pipe(gulp.dest('..'));
});

gulp.task('dist', function () {
  gulp.src('index.html')
    .pipe(stripLine([
      '<link href="style.css" rel="stylesheet" />',
      '<script src="bower_components/mojs/build/mojs.min.js"></script>',
      '<script src="script.js"></script>'
    ]))
    .pipe(inject(gulp.src('style.css'), {
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
    .pipe(inject(gulp.src('script.js').pipe(uglify()), {
      name: 'script',
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
    .pipe(gulp.dest('../docs'));
});
