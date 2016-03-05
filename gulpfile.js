/*!
 * Command line to install node.js modules:
 * $ npm install  gulp-jshint gulp-concat gulp-uglify gulp-imagemin gulp-notify gulp-rename gulp-livereload gulp-cache jshint gulp-svg2png gulp-shell svg2png gulp-rename gulp-replace --save-dev
 *
 *
 * -------- Minify & concat javascript files --------
 * $ gulp scripts
 * --------------------------------------------------
 *
 * -------- smush images ---------
 * $ gulp images
 *---------------------------------
 * images uses gifsicle which can create huge animated gifs.
 * Change to use graphicsmagic
 *
 * -------- svg2png for opengraph--
 * $ gulp svg2png
 *---------------------------------
 *
 * -------- zip for code----------
 * $ gulp zip
 *---------------------------------
 *
 *
 */

// Load plugins
var gulp = require('gulp'),
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	imagemin = require('gulp-imagemin'),
	rename = require('gulp-rename'),
	concat = require('gulp-concat'),
	notify = require('gulp-notify'),
	cache = require('gulp-cache'),
	livereload = require('gulp-livereload'),
	svg2png = require('gulp-svg2png'),
	shell = require('gulp-shell'); // svg2png needs gulp-shell; no idea why
	replace = require('gulp-replace');
	zip = require('gulp-zip');




// Combine and minify scripts in js/source
// output js/main.js & js/main.min.js
gulp.task('scripts', function () {
	return gulp.src('./js/source/*.js')
		.pipe(jshint('./.jshintrc'))
		.pipe(jshint.reporter('default'))
		.pipe(concat('main.js'))
		.pipe(gulp.dest('js/'))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(uglify())
		.pipe(gulp.dest('js/'))
		.pipe(notify({
			message: 'Scripts Merged & Minified: <%= file.relative %>'
		}));
});



// ******************************************************************************
// *images
// ******************************************************************************
// Smush images in images/*.jpg|gif|PNG
// images should live in own master folder with smushed images made at build time.
// DON'T RUN; I'll configure Travis to build with these images.

gulp.task('images', function () {
	return gulp.src(['images/*.*', '!images/*.svg'])
		.pipe(cache(imagemin({
			optimizationLevel: 3,
			progressive: true,
			interlaced: true
		})))
		.pipe(gulp.dest('images'))
		.pipe(notify({
			message: ' <%= file.relative %>'
		}));
});

// ******************************************************************************
// *copyimages
// ******************************************************************************
// copy over *.png *.jpg to build/opengraph folder


gulp.task('copyimages', function () {
	return gulp.src(['images/*feature.jpg', 'images/*-feature.gif', 'images/*-feature.png'])
		.pipe(imagemin({
			optimizationLevel: 3,
			progressive: true,
			interlaced: true
		}))
		.pipe(gulp.dest('build/opengraph'))
		.pipe(notify({
			message: ' <%= file.relative %>'
		}));
});


// ******************************************************************************
// *svg2png
// ******************************************************************************
// SVG not supported by facebook, twitter et al.
// Converts SVG to PNG to get pretty twitter cards
gulp.task('svg2png', function () {
	gulp.src('./images/*feature.svg')
		.pipe(svg2png(1,false))
		.pipe(gulp.dest('./build/opengraph'))
		.pipe(notify({ message: 'Converted to PNG: <%= file.relative %>'}));

});


// ******************************************************************************
// *zip
// ******************************************************************************
// ZIP archive of code.
gulp.task('zip', function () {
	return gulp.src('programs/*/_posts/*.py')
		.pipe(zip('microbit-playground-code.zip'))
		.pipe(gulp.dest('build'))
		.pipe(notify({ message: 'Created ZIP file: <%= file.relative %>'}));
});




gulp.task('default', ['scripts', 'svg2png', 'zip', 'copyimages']);
