var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var jshint = require('gulp-jshint');
var	sass = require('gulp-sass');
var browserSync = require('browser-sync');
var istanbul = require('gulp-istanbul');
var mocha = require('gulp-mocha');

var paths = {
	browserSync : {
		js : 'public/js/*.js',
		css : 'public/styles/*.css',
		html : 'public/index.html'
	},
	sass : {
		src : 'public/styles/*.scss',
		dest : 'public/styles/'
	}
};

gulp.task('lint', function () {
  gulp.src('./**/*.js')
    .pipe(jshint());
});
 
gulp.task('develop', function () {
  nodemon({ script: 'app.js', ext: 'html js', ignore: ['ignored.js'] })
    .on('change', ['lint'])
    .on('restart', function () {
      console.log('restarted!');
    });
});

gulp.task('default', ['develop']);

gulp.task('browser-sync', function() {
	browserSync({
		proxy: "localhost:3000/filters",
		port: 3030,
        files: [
			paths.browserSync.js,
			paths.browserSync.css,
			paths.browserSync.html
		]
	});
});

gulp.task('sass', function() {
	gulp.src(paths.sass.src)
		.pipe(sass({errLogToConsole: true}))
		.pipe(gulp.dest(paths.sass.dest));
});

gulp.task('test', function (cb) {
  gulp.src(['lib/**/*.js', 'app.js'])
    .pipe(istanbul()) // Covering files
    .pipe(istanbul.hookRequire()) // Force `require` to return covered files
    .on('finish', function () {
      gulp.src(['test/*.js'])
        .pipe(mocha())
        .pipe(istanbul.writeReports()) // Creating the reports after tests runned
        .on('end', cb);
    });
});

gulp.task('dev', function(){
	nodemon({ script: 'app.js', ext: 'html js', ignore: ['public/*'] });

	gulp.start('sass');
	gulp.watch(paths.sass.src, ['sass']);
	gulp.start('browser-sync');
});
