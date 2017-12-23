var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    pug = require('gulp-pug'),
    sass = require('gulp-sass'),
    sassLint = require('gulp-sass-lint'),
    sourcemaps = require('gulp-sourcemaps'),
    ts = require('gulp-typescript');

// If you want details of the error in the console
function swallowError(error) {
    console.log(error.toString());
    this.emit('end');
}


/**
 * Server Tasks
 */
gulp.task('copy', function () {
    var css = [
        './src/vendor/**/*.css',
        './src/vendor/*.css'
    ];

    var javascript = [
        './node_modules/bluebird/js/browser/bluebird.min.js',
        './node_modules/bootstrap/dist/js/bootstrap.min.js',
        './node_modules/jquery/dist/jquery.min.js',
        './node_modules/jquery/dist/jquery.min.js.map',
        './node_modules/systemjs/dist/system-production.js',
        './node_modules/systemjs/dist/system-production.js.map',
        './src/vendor/*.js'
    ];

    gulp.src(css)
        .pipe(gulp.dest('./static/css/'));

    gulp.src('./node_modules/bootstrap/dist/fonts/*')
        .pipe(gulp.dest('./static/fonts/'));

    gulp.src('./src/img/*')
        .pipe(gulp.dest('./static/img/'));

    gulp.src(javascript)
            .pipe(gulp.dest('./static/js/'));

    return gulp.src('./src/node/aws-config.json')
            .pipe(gulp.dest('./static/node/'));
});

gulp.task('node', function () {
    var tsProject = ts.createProject('./src/node/tsconfig.json');

    var tsResult = gulp
        .src('./src/node/**/*.ts')
        .pipe(tsProject())
        .on('error', swallowError);

    return tsResult
        .js
        .on('error', swallowError)
        .pipe(gulp.dest('./static/node/'));
});

gulp.task('server', ['copy', 'node'], function () {
    nodemon({
        script: 'static/node/server.js',
        watch: ["server.js", 'static/*', 'static/*/**'],
        ext: 'js'
    }).on('restart', () => {
        gulp.src('server.js')
    });
});

gulp.task('views', function buildHTML() {
    return gulp.src(['./src/views/*.pug', './src/views/**/*.pug', '!./src/views/components/*.pug'])
        .pipe(pug())
        .pipe(gulp.dest('./static/views/'))
});


/**
 * SASS Tasks
 */
gulp.task('sass-lint', function () {
    return gulp.src('./src/scss/**/*.scss')
        .pipe(sassLint())
        .pipe(sassLint.format());
});

gulp.task('sass', ['sass-lint'], function() {
    return gulp.src('./src/scss/theme.scss')
        .pipe(
            sass({ outputStyle: 'compressed' })
                .on('error', sass.logError)
        )
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./static/css/'));
});


/**
 * Typescript Tasks
 */
gulp.task('ts', function () {
    var tsProject = ts.createProject('./tsconfig.json');

    var tsResult = gulp
        .src('./src/ts/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .on('error', swallowError);

    return tsResult
        .js
        .pipe(sourcemaps.write('./'))
        .on('error', swallowError)
        .pipe(gulp.dest('./static/js/'));
});


/**
 * Watch Tasks
 */
gulp.task('watch:node', function () {
    return gulp.watch('./src/node/**/*.ts', ['node']);
});

gulp.task('watch:sass', function () {
    gulp.watch('./src/scss/**/*.scss', ['sass-lint']);
});

gulp.task('watch:ts', function () {
    return gulp.watch('./src/ts/**/*.ts', ['ts']);
});

gulp.task('watch:views', function () {
    return gulp.watch('./src/views/**/*.pug', ['views']);
});

gulp.task('watch', ['server'], function () {
    gulp.watch(['./src/node/**/*.ts'], ['node']);
    gulp.watch(['./src/scss/**/*.scss'], ['sass']);
    gulp.watch(['./src/ts/**/*.ts'], ['ts']);
    gulp.watch(['./src/views/**/*.pug'], ['views']);
});


gulp.task('build', ['copy', 'node', 'views', 'sass', 'ts']);
gulp.task('default', ['build', 'watch']);