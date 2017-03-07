var gulp = require('gulp'),
    clean = require('gulp-clean'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    minify = require('gulp-minify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    uglifyCss = require('gulp-uglifycss'),
    compass = require('gulp-compass'),
    del = require('del'),
    runSequence = require('run-sequence'),
    browserSync = require('browser-sync').create();

gulp.task('clean', function() {
  return del([
    'dist/**/*'
  ]);
});
gulp.task('build-lib', function() {
  return gulp.src('bower_components/**/*')
    .pipe(gulp.dest('dist/bower_components'));
})
gulp.task('build-php', function() {
  return gulp.src('php/**/*')
    .pipe(gulp.dest('dist/php'));
})
gulp.task('build-root', function() {
  return gulp.src(['index.html'])
    .pipe(gulp.dest('dist'));
});

gulp.task('build-images', function() {
  return gulp.src(['images/**'])
    .pipe(gulp.dest('dist/images'));
});

gulp.task('build-fonts', function () {
  return gulp.src('fonts/**')
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('build-templates', function () {
  return gulp.src('templates/*.html')
    .pipe(gulp.dest('dist/templates/'));
});
gulp.task('build-sourcejs', function() {
  return gulp.src(['js/*.js'])
    .pipe(gulp.dest('dist/js'));
});
gulp.task('build-customcss', function() {
  return gulp.src(['css/*.css'])
    .pipe(gulp.dest('dist/css'));
});
gulp.task('compass-build', function() {
  gulp.src('sass/*.scss')
    .pipe(compass({
      config_file: 'config.rb',
      css: 'css',
      sass: 'sass'
    }))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('build', function() {
  return runSequence(['build-root','build-php', 'build-sourcejs', 'build-customcss','compass-build', 'build-templates'], 'jshint');
});

gulp.task('watch-js', function() {
  gulp.watch('js/*.js', ['build-sourcejs']);
});
gulp.task('watch-img', function() {
  gulp.watch('images/**', ['build-images']);
});
gulp.task('watch-php', function() {
  gulp.watch('php/**', ['build-php']);
});
gulp.task('watch-css', function() {
  gulp.watch('css/*.css', ['build-customcss']);
});
gulp.task('compass-watch', function () {
  gulp.watch('sass/*.scss', ['compass-build']);
});
gulp.task('watch-html', function() {
  gulp.watch('**/*.html', ['build']);
});

gulp.task('connect', function() {
  connect.server({
    root: 'dist',
    port: 7000,
    host: '0.0.0.0'
  });
});

gulp.task('jshint', function() {
  return gulp.src('js/*js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

// default task
gulp.task('default', function() {
  return runSequence('clean', 'build', 'build-fonts', 'build-images','build-php', 'build-lib','compass-build',
    ['watch-js', 'watch-css', 'watch-html','watch-php', 'watch-img','compass-watch','connect']
  );
});

// task to run in production
gulp.task('build-prod', function() {
  return runSequence('clean', 'build-root', 'build-sourcejs', 'build-customcss', 'compass-build', 'build-templates', 'build-fonts', 'build-images','build-php','build-lib');
});
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
});

// Sass task, will run when any SCSS files change & BrowserSync
// will auto-update browsers
gulp.task('sass', function () {
    return gulp.src('sass/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('css'))
        .pipe(reload({stream:true}));
});

// Reload all Browsers
gulp.task('bs-reload', function () {
    browserSync.reload();
});

// Default task to be run with `gulp`
// This default task will run BrowserSync & then use Gulp to watch files.
// When a file is changed, an event is emitted to BrowserSync with the filepath.
gulp.task('default', ['browser-sync'], function () {
    gulp.watch('css/*.css', function (file) {
        if (file.type === "changed") {
            reload(file.path);
        }
    });
    gulp.watch("*.html", ['bs-reload']);
});
