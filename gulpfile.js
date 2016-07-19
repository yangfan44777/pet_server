const gulp = require('gulp');
const babel = require('gulp-babel');

gulp.task('default', () => {
    gulp.src('./*.js')
        .pipe(babel({
            presets: ['stage-3']
        }))
        .pipe(gulp.dest('output'));

    gulp.src('./models/**/*.js', {base: './'})
        .pipe(babel({
            presets: ['stage-3']
        }))
        .pipe(gulp.dest('output'));
    gulp.src('./routes/**/*.js', {base: './'})
        .pipe(babel({
            presets: ['stage-3']
        }))
        .pipe(gulp.dest('output'));
    gulp.src('./bin/www', {base: './'})
        .pipe(babel({
            presets: ['stage-3']
        }))
        .pipe(gulp.dest('output'));

    gulp.src('./logs', {base: './'})
        .pipe(gulp.dest('output'));

    gulp.src('./public/**', {base: './'})
        .pipe(gulp.dest('output'));

    gulp.src('./views/**', {base: './'})
        .pipe(gulp.dest('output'));

    gulp.src('./node_modules/**', {base: './'})
        .pipe(gulp.dest('output'));

    gulp.src( './public/**/*', {base : './' } )
      .pipe( gulp.dest( 'output' ) )

});
