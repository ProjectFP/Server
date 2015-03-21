var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var jshint = require('gulp-jshint');
var	sass = require('gulp-sass');
var browserSync = require('browser-sync');

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


gulp.task('dev', function(){
	nodemon({ script: 'app.js', ext: 'html js', ignore: ['public/*'] });

	gulp.start('sass');
	gulp.watch(paths.sass.src, ['sass']);
	gulp.start('browser-sync');
});
