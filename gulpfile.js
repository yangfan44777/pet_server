const gulp = require('gulp');
const babel = require('gulp-babel');
 
gulp.task('default', () => {
    gulp.src('./*.js')
        .pipe(babel({
            presets: ['stage-3']
        }))
        .pipe(gulp.dest('dist'));

    gulp.src('./models/**/*.js', {base: './'})
        .pipe(babel({
            presets: ['stage-3']
        }))
        .pipe(gulp.dest('dist'));
    gulp.src('./routes/**/*.js', {base: './'})
        .pipe(babel({
            presets: ['stage-3']
        }))
        .pipe(gulp.dest('dist'));
    gulp.src('./bin/www', {base: './'})
        .pipe(babel({
            presets: ['stage-3']
        }))
        .pipe(gulp.dest('dist'));
    gulp.src('./node_modules/**', {base: './'})
        .pipe(gulp.dest('dist'));
});