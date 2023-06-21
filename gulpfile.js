const gulp = require('gulp');
// public plugins
const replace = require('gulp-replace');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const browserSync = require('browser-sync');
const rename = require('gulp-rename');

//reset plugins
const clean = require('gulp-clean');

// html plugins
const fileInclude = require('gulp-file-include');

// css plugins
const postcss = require('gulp-postcss');

// paths
const buildFolder = './dist';
const scrFolder = './src';

const path = {
  build: {
    img: `${buildFolder}/img/`,
    css: `${buildFolder}/css/`,
    html: `${buildFolder}/`,
    files: `${buildFolder}/files/`,
  },
  src: {
    img: `${scrFolder}/img/**/*.*`,
    css: `${scrFolder}/pcss/style.pcss`,
    html: `${scrFolder}/*.html`,
    files: `${scrFolder}/files/**/*.*`,
  },
  watch: {
    img: `${scrFolder}/img/**/*.*`,
    css: `${scrFolder}/pcss/**/*.pcss`,
    html: `${scrFolder}/**/*.html`,
    files: `${scrFolder}/files/**/*.*`,
  },
  clean: buildFolder,
  scrFolder: scrFolder,
  buildFolder: buildFolder,
  ftp: '',
};

// all tasks
const copy = () => {
  return gulp.src(path.src.files).pipe(gulp.dest(path.build.files));
};

// reset delete build folder
const reset = () => {
  return gulp.src(path.clean, { read: false, allowEmpty: true }).pipe(clean());
};

const copyImg = () => {
  return gulp.src(path.src.img).pipe(gulp.dest(path.build.img));
};

const server = () => {
  browserSync.init({
    server: {
      baseDir: `${path.build.html}`,
    },
    port: 3000,
    notify: false,
  });
};

const html = () => {
  return gulp
    .src(path.src.html)
    .pipe(
      plumber({
        errorHandler: notify.onError({
          title: 'HTML',
          message: 'Error: <%= error.message %>',
        }),
      })
    )
    .pipe(
      fileInclude({
        prefix: '@@',
        basepath: '@file',
      })
    )
    .pipe(replace(/@img\//g, 'img/'))
    .pipe(gulp.dest(path.build.html))
    .pipe(browserSync.stream());
};

const pcss = () => {
  return gulp
    .src(path.src.css)
    .pipe(
      plumber({
        errorHandler: notify.onError(function (err) {
          return {
            title: 'Styles',
            message: err.message,
          };
        }),
      })
    )
    .pipe(postcss())
    .pipe(rename('style.css'))
    .pipe(gulp.dest(path.build.css))
    .pipe(browserSync.stream());
};

function watch() {
  gulp.watch(path.watch.files, copy);
  gulp.watch(path.watch.html, html);
  gulp.watch(path.watch.css, pcss);
  gulp.watch(path.watch.img, copyImg);
}

const mainTask = gulp.parallel(copy, copyImg, html, pcss);

const def = gulp.series(reset, mainTask, gulp.parallel(watch, server));

gulp.task('default', def);
