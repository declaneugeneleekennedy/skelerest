var gulp        = require('gulp');
var sass        = require('gulp-sass');
var minify      = require('gulp-minify-css');
var concat      = require('gulp-concat');
var browserify  = require('browserify');
var source      = require('vinyl-source-stream')
var streamify   = require('gulp-streamify')
var uglify      = require('gulp-uglify');
var handlebars  = require('gulp-handlebars');
var wrap        = require('gulp-wrap');
var declare     = require('gulp-declare');
var sourcemaps  = require('gulp-sourcemaps');
var rename      = require('gulp-rename');
var del         = require('del');

gulp.task('sass', function() {
    gulp.src('./src/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(gulp.dest('./public/css'))
        .pipe(concat('style.css'))
        .pipe(gulp.dest('./'))
        .pipe(minify())
        .pipe(rename('style.min.css'))
        .pipe(gulp.dest('./'))
        .pipe(sourcemaps.write('./public/map'));
});

gulp.task('js', function() {
    var bundler = browserify('./src/js/bootstrap.js').bundle();

    bundler
        .pipe(sourcemaps.init())
        .pipe(source('bootstrap.js'))
        .pipe(streamify(uglify()))
        .pipe(rename('app.js'))
        .pipe(gulp.dest('./public/js'))
        .pipe(sourcemaps.write('./public/map'));
});

gulp.task('html', function() {
    gulp.src('./src/html/**/*.hbs')
        .pipe(handlebars())
        .pipe(wrap('Handlebars.template(<%= contents %>);'))
        .pipe(declare({
            namespace:      'NodeBB.template',
            noRedeclare:    true
        }))
        .pipe(concat('template.js'))
        .pipe(gulp.dest('./public/js'));
});

gulp.task('default', ['sass', 'js', 'html']);