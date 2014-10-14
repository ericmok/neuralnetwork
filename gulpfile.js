var fs = require('fs'),
    gulp = require('gulp'),
    rename = require('gulp-rename'),
    browserify = require('gulp-browserify'),
    header = require('gulp-header'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify');

console.log(fs.readFileSync('./LICENSE', 'utf8'));

gulp.task('browserify', function() {
    return gulp.src('./lib/browser.js').
        pipe(browserify({
        })).
        pipe(rename(function(path) {
            path.basename = 'neuralNet';
        })).
        pipe(header(
            '/**' + fs.readFileSync('./LICENSE', 'utf8') + '*/\n\n'
        )).
        pipe(gulp.dest('./dist')).
        pipe(rename(function(path) {
            path.basename = 'neuralNet.min';
        })).
        pipe(uglify()).
        pipe(header(
            '/**' + fs.readFileSync('./LICENSE', 'utf8') + '*/\n\n'
        )).
        pipe(gulp.dest('./dist'));
});

// gulp.task('licensify', function() {
//     return gulp.src(['./LICENSE', './dist/neuralNet.js']).
//         pipe(concat('all.js')).
//         pipe(gulp.dest('./dist'))
// });

gulp.task('default', ['browserify']);