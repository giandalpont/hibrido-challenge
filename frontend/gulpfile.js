const {
    src,
    dest,
    watch,
    series,
    parallel
} = require('gulp')
const concat = require('gulp-concat')
const uglify = require('gulp-uglify')
const less = require('gulp-less')
const minifyCss = require('gulp-minify-css')
const rename = require('gulp-rename')
const path = require('path')

const browserSync = require("browser-sync").create()

function connectSync() {
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
}

function browserSyncReload(done) {
    browserSync.reload();
    done();
}

function plugins() {
    return src([
            // './js/jquery-1.9.1.js',
            './js/includeHTML.js',
            // './js/plugin/**.js',
        ])
        .pipe(concat('plugins.min.js'))
        .pipe(uglify())
        .pipe(dest('./js'))
}

function mainjs() {
    return src(['./js/main.js'])
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(dest('./js/'))
}

function css() {
    return src('./css/*.less')
        .pipe(less({
            paths: [ path.join(__dirname, 'less', 'includes') ]
        }))
        /*.pipe(dest('./css/')) */
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(rename({
            extname: '.min.css'
        }))
        .pipe(dest('./css/'))
}

function watchFiles() {
    watch("./**.html", browserSyncReload)
    watch('./css/**.less', series(css, browserSyncReload))
    watch('./js/main.js', series(mainjs, browserSyncReload))
    // watch('./js/plugins/*.js')
}

exports.plugins = plugins
exports.mainjs = mainjs
exports.css = css

exports.default = parallel([watchFiles, connectSync])