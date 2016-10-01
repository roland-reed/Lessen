'use strict';

let gulp = require('gulp'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	less = require('gulp-less'),
	autoprefixer = require('gulp-autoprefixer'),
	cleanCss = require('gulp-clean-css'),
	htmlmin = require('gulp-htmlmin'),
	broswerSync = require('browser-sync').create(),
	babel = require('gulp-babel'),
	sourcemaps = require('gulp-sourcemaps'),
	reload = broswerSync.reload;

gulp.task('js', function() {
	return gulp.src(['./js/polyfill.js', './js/config.js', './js/filter.js', './js/component.js', './js/utils.js', './js/index.js'])
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
		.pipe(gulp.dest('../../assets/lessen/js'));
});

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
		.pipe(gulp.dest('../../assets/lessen/css'))
		.pipe(reload({
			stream: true
		}));
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
		.pipe(gulp.dest('../../assets/lessen'));
});

gulp.task('serve', ['html', 'less', 'staticFiles', 'js'], function() {
	broswerSync.init({
		proxy: '192.168.1.199',
		startPath: '/lessen/'
	});

	gulp.watch('./js/*.js', ['js']).on('change', reload);
	gulp.watch('./css/*.less', ['less']);
	gulp.watch('./*.html', ['html']).on('change', reload);
});

gulp.task('default', ['serve']);

gulp.task('jsBuild', function() {
	gulp.src(['./js/config.js', './js/filter.js', './js/component.js', './js/utils.js', './js/index.js'])
		.pipe(babel({
			presets: ['es2015']
		}).on('error', function(e) {
			console.error(e.message);
			this.emit('end');
		}))
		.pipe(uglify())
		.pipe(concat('app.js'))
		.pipe(gulp.dest('../../assets/lessen/js'));
});

gulp.task('staticFiles', function() {
	gulp.src('./css/fonts/**/*')
		.pipe(gulp.dest('../../assets/lessen/css/fonts'));
});

gulp.task('build', ['html', 'less', 'staticFiles', 'jsBuild']);