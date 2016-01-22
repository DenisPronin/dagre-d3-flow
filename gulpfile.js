var gulp = require('gulp');

var webpack = require('gulp-webpack');
var jshint = require('gulp-jshint');

var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');

var sass = require('gulp-sass');
var scsslint = require('gulp-scss-lint');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var urlAdjuster = require('gulp-css-url-adjuster');

var connect = require('gulp-connect');
var open = require('gulp-open');

var port = 5050;
var isWindows = /^win/.test(require('os').platform());

var paths = {
    html: {
        src: ['demo/**/*.html'],
        main: 'demo/clusters-flow.html'
    },
    js: {
        main: 'js/main.js',
        src: ['js/**/*.js'],
        res: ['dist/dagre-flow.js'],
        distPath: 'dist'
    },
    scss: {
        main: 'scss/main.scss',
        src: ['scss/**/*.scss'],
        distPath: 'dist'
    },
    vendors: {
        js: [
            'bower_components/d3/d3.min.js',
            'bower_components/lodash/lodash.min.js',
            'bower_components/graphlib/dist/graphlib.core.min.js',
            'bower_components/dagre/dist/dagre.core.min.js',
            'bower_components/dagre-d3/dist/dagre-d3.core.min.js',
            'vendors/tipsy.min.js'
        ]
    }
};

gulp.task('connect', function() {
    connect.server({
        root: [__dirname],
        port: port,
        livereload: true
    });
});

gulp.task('open', ['connect'], function() {
    var app = (isWindows) ? 'chrome' : 'google-chrome';
    gulp.src(paths.html.main)
        .pipe(open('', {
            url: 'http://localhost:' + port + '/' +paths.html.main,
            app: app
        }));
});

gulp.task('html', function() {
    return gulp.src(paths.html.src)
        .pipe(connect.reload());
});

gulp.task('js-hint', function() {
    return gulp.src(paths.js.src)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
});

gulp.task('jsVendors', function() {
    gulp.src(paths.vendors.js)
        .pipe(concat('dagre-flow-vendors.js'))
        .pipe(gulp.dest(paths.js.distPath));
});

gulp.task('js', function() {
    return gulp.src(paths.js.src)
        .pipe(webpack({
            entry: "./js/main",
            output: {
                libraryTarget: 'var',
                library: 'DagreFlow',
                filename: 'dagre-flow.js',
                sourceMapFilename: 'dagre-flow.map'
            },
            devtool: 'source-map',
            module: {
                loaders: [{
                    test: /\.js$/,
                    exclude: /(node_modules|bower_components)/,
                    loader: "babel"
                }]
            }
        }))
        .pipe(gulp.dest(paths.js.distPath))
        .pipe(connect.reload());
});

gulp.task('js_min', ['js'], function () {
    return gulp.src(paths.js.res)
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify().on('error', gutil.log))
        .pipe(gulp.dest(paths.js.distPath))
        .pipe(connect.reload());

});

gulp.task('sass-lint', function() {
    gulp.src(paths.scss.src)
        .pipe(scsslint({
            config: 'scss/sassLint.yaml'
        }));
});

gulp.task('sass', function() {
    gulp.src(paths.scss.main)
        .pipe(sourcemaps.init())
        .pipe(sass({
            errLogToConsole: true
        }))
        .pipe(urlAdjuster({
            replace: ['../../', '../'] // fix images paths
        }))
        .pipe(autoprefixer({
            browsers: ['last 10 version']
        }))
        .pipe(rename({
            basename: 'dagre-flow'
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.scss.distPath))
        .pipe(connect.reload());
});

gulp.task('watch', function() {
    gulp.watch(paths.html.src, ['html']);
    gulp.watch(paths.scss.src, ['sass', 'sass-lint']);
    gulp.watch(paths.js.src, ['js-hint', 'js']);
});

gulp.task('default', ['sass', 'sass-lint', 'js-hint', 'jsVendors', 'js', 'watch', 'open']);

gulp.task('prod', ['sass', 'sass-lint', 'js-hint', 'jsVendors', 'js_min']);


