var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var log = require('gulplog');
var rename = require('gulp-rename');
var csso = require('gulp-csso');
var autoprefixer = require('gulp-autoprefixer');
var through = require('through');

var isDist = process.argv.indexOf('serve') === -1;

gulp.task('css', function () {
    return gulp.src('public/stylesheets/styles.css')
    .pipe(isDist ? csso() : through())
    .pipe(isDist ? autoprefixer('last 2 versions', { map: false }) : through())
    .pipe(rename('build.css'))
    .pipe(gulp.dest('public/stylesheets/'));
});

gulp.task('js', function () {
    var b = browserify({
      entries: 'public/javascripts/index.js',
      debug: true
    });
  
    return b.bundle()
      .pipe(source('public/javascripts/index.js'))
      .pipe(buffer())
      .pipe(uglify())
        .on('error', log.error)
      .pipe(rename('build.js'))
      .pipe(gulp.dest('public/javascripts/'));
});

gulp.task('css-watch', ['css'], function (done) {
    browserSync.reload();
    done();
});

gulp.task('js-watch', ['js'], function (done) {
    browserSync.reload();
    done();
});


gulp.task('reload', function (done) {
    browserSync.reload();
    done();
});

gulp.task('default', ['js', 'css']);

gulp.task('serve', function () {

    browserSync.init({
        proxy: 'http://localhost:' + require('env-port')('8888')
    });

    gulp.watch('public/views/*.html', ['reload']);
    gulp.watch('views/*.ejs', ['reload']);

    gulp.watch('public/stylesheets/styles.css', ['css']);
    gulp.watch(['public/javascripts/**/**.js', '!public/javascripts/build.js'], ['js']);
});
