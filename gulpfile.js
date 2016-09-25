'use strict';

let gulp = require('gulp'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	less = require('gulp-less'),
	autoprefixer = require('gulp-autoprefixer'),
	cleanCss = require('gulp-clean-css'),
	htmlmin = require('gulp-htmlmin'),
	babel = require('gulp-babel'),
	sourcemaps = require('gulp-sourcemaps');

gulp.task('less', function() {
	return gulp.src('./css/*.less')
		.pipe(less().on('error', function(e) {
			console.error(e.message);
			this.emit('end');
		}))
		.pipe(autoprefixer({
			broswers: ['last 2 versions']
		}))
		.pipe(cleanCss())
		.pipe(concat('style.css'))
		.pipe(gulp.dest('./build/css'));
});

gulp.task('html', function() {
	return gulp.src('./*.html')
		.pipe(htmlmin({
			collapseWhitespace: true,
			removeComments: true
		}).on('error', function(e) {
			console.error(e.message);
			this.emit('end');
		}))
		.pipe(gulp.dest('./build'));
});

gulp.task('js', function() {
	gulp.src(['./js/config.js', './js/filter.js', './js/component.js', './js/utils.js', './js/index.js'])
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['es2015']
		}).on('error', function(e) {
			console.error(e.message);
			this.emit('end');
		}))
		.pipe(uglify())
		.pipe(concat('app.js'))
		.pipe(sourcemaps.write('../maps', {
			sourceMappingURL: 'sourceMappingURL=data:application/json;charset=utf-8;base64'
		}))
		.pipe(gulp.dest('./build/js'));
});

gulp.task('staticFiles', function() {
	gulp.src('./css/fonts/**/*')
		.pipe(gulp.dest('./build/css/fonts'));
});

gulp.task('default', ['html', 'less', 'staticFiles', 'js']);