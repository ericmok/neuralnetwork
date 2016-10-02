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
    ts = require('gulp-typescript'),
    sourcemaps = require('gulp-sourcemaps');

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
        .pipe(sourcemaps.init())
        .pipe(debug({title: 'files'}))
        .pipe(tsProject())
        .pipe(sourcemaps.write('maps/'))
        .pipe(gulp.dest('./build'));
});

gulp.task('test', function() {
    var spawnSync = require("child_process").spawnSync;
    //spawnSync('npm', ['run', 'mocha', 'build/test/**/*.spec.js', '--colors'], { stdio: "inherit" });
    spawnSync('npm', ['test', '--colors'], { stdio: "inherit" });
    // exec('npm test', (err, stdout, stderr) => {
    //     if (err) {
    //         console.error(err);
    //         return;
    //     }
    //         console.log(stdout);
    //     }
    // );
});

gulp.task('watch', function() {
    gulp.watch('**/*.ts', ['build', 'test']);
});

gulp.task('default', ['build', 'test']);
