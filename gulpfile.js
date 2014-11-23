var gulp = require('gulp');
var livereload = require('gulp-livereload');
var watch = require('gulp-watch');

gulp.task('watch', function () {
  livereload.listen();
	gulp.watch([
		'public/**/*',
		'views/*',
		'app.js'
	]).on('change', livereload.changed);
});


gulp.task('default', ['watch']);