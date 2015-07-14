var gulp        = require('gulp'),
    browserify  = require('browserify'),
    sass        = require('gulp-sass'),
    sourcemaps  = require('gulp-sourcemaps'),
    babel       = require('gulp-babel'),
    babelify    = require('babelify'),
    copy        = require('gulp-copy'),
    server      = require('gulp-develop-server'),
    clean       = require('gulp-rimraf'),
    plumber     = require('gulp-plumber'),
    source      = require('vinyl-source-stream'),
    mocha       = require('gulp-mocha');
    //livereload  = require('gulp-livereload');

var paths = {
    scripts: ['src/**/*.js', 'src/**/*.jsx'],
    tests: ['tests/**/*.js'],
    sass: ['src/**/*.s?ss'],
    main_client_script: 'src/main.js',
    main_sass: 'src/styles/main.scss',
    server_path: 'server/',
    server_files: 'server/**/*.js',
    main_server_script: 'server.js',
    build_path: 'build/',
    tests_src_build_path: 'build/src/',
    tests_build_path: 'build/tests/',
    static_files: 'public/**/*.*',
    public_build_path: 'build/public/'
};

/*
function babel(src, dest) {
    return gulp.src(src)
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(babel({ stage: 0, optional: ["runtime"] }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(dest));
}
*/

gulp.task('server:babel', function () {
    return gulp.src(paths.server_files)
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(babel({ stage: 0, optional: ["runtime"] }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.build_path));
});

gulp.task('tests:source:babel', ['clean'], function () {
    return gulp.src(paths.scripts)
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(babel({ stage: 0, optional: ["runtime"] }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.tests_src_build_path));
});

gulp.task('tests:babel', ['tests:source:babel'], function () {
    return gulp.src(paths.tests)
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(babel({ stage: 0, optional: ["runtime"] }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.tests_build_path));
});

gulp.task('client:browserify', function () {
    return browserify(paths.main_client_script, {
        debug: true //it's necessary to a source map generate
    })
    .transform(babelify, { stage: 0, optional: ["runtime"] })
    .bundle()
    .pipe(plumber())
    .pipe(source('main.js'))
    .pipe(gulp.dest(paths.public_build_path));
});

gulp.task('sass', function () {
    return gulp.src([paths.main_sass])
        .pipe(sass())
        .pipe(gulp.dest(paths.public_build_path));
});

gulp.task('static:copy', function() {
    return gulp.src(paths.static_files)
        .pipe(copy(paths.build_path));
});

gulp.task('server:run', ['client:compile', 'server:babel'], function() {
    server.listen( { path: paths.build_path + paths.main_server_script } );
});

gulp.task('client:compile', ['client:browserify', 'sass', 'static:copy'], function() {

});

gulp.task('server:compile', ['server:babel'], function() {
    server.restart();
});

gulp.task('clean', function() {
    return gulp.src([paths.build_path], { read: false }).pipe(clean());
});

gulp.task('default', ['clean'], function() {
    gulp.start('server:run');
});

gulp.task('watch', ['default'], function () {
    //livereload.listen();
    gulp.watch([paths.scripts], ['client:compile']);
    gulp.watch(paths.sass, ['sass']);
    gulp.watch(paths.server_files, ['server:compile'])
});

gulp.task('tests', ['tests:babel'], function() {
    return gulp.src(paths.tests_build_path + '**/*.js', { read: false })
            // gulp-mocha needs filepaths so you can't have any plugins before it
            .pipe(mocha({reporter: 'nyan'}));
});

gulp.task('heroku:dev', ['default']);
gulp.task('build', ['default']);
