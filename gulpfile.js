var fs = require('fs'),
    gulp = require('gulp'),
    debug = require('gulp-debug'),
    cache = require('gulp-cached'),
    exec = require('child_process').exec,
    rename = require('gulp-rename'),
    browserify = require('gulp-browserify'),
    header = require('gulp-header'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    ts = require('gulp-typescript');

console.log(fs.readFileSync('./LICENSE', 'utf8'));

var tsProject = ts.createProject('tsconfig.json');

gulp.task('browserify', function() {
    var tsResult = gulp.src('**/*.ts')
      .pipe(tsProject())
      .js.pipe(browserify({
        })).
        pipe(rename(function(path) {
            path.basename = 'neuralnetwork0';
        })).
        pipe(header(
            '/**' + fs.readFileSync('./LICENSE', 'utf8') + '*/\n\n'
        )).
        pipe(gulp.dest('./dist')).
        pipe(rename(function(path) {
            path.basename = 'neuralnetwork0.min';
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

gulp.task('build', function() {
    console.log('Performing incremental build...');

    var tsResult = tsProject.src().pipe(cache('build'))
        .pipe(debug({title: 'files'}))
        .pipe(tsProject()).pipe(gulp.dest('./build'));

        exec('npm run mocha "build/test/*.js"', function(err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
        });
});

gulp.task('watch', function() {
    gulp.watch('**/*.ts', ['build']);
});

gulp.task('default', ['build']);
