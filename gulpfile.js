var gulp = require('gulp');
var livereload = require('gulp-livereload');
var watch = require('gulp-watch');
//var server = require('./gulp-express');
//
//gulp.task('server', function() {
//	server.run({
//		file: 'app.js'
//	});
//});

gulp.task('watch', function () {
	gulp.watch([
		'public/**/*',
		'views/*',
		'app.js'
	]).on('change', livereload.changed);
});


gulp.task('default', ['watch']);