var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var uncss = require('gulp-uncss');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync').create();
var babel = require("gulp-babel");
var karmaServer = require('karma').Server;
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var sassdoc = require('sassdoc');
var sourcemaps = require('gulp-sourcemaps');
var postcss = require('gulp-postcss');
var reporter = require('postcss-reporter');
var syntax_scss = require('postcss-scss');
var stylelint = require('stylelint');


gulp.task('test', function() {
   new karmaServer({
      configFile: __dirname + '/karma.conf.js',
      singleRun: false
   }).start();
});

////////////////////////////////////////
// Development
////////////////////////////////////////

// SCSS -> CSS Tasks

gulp.task('sass', function() {
   gulp.src('app/sass/**/*.scss')
      .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('app/style'));
});

gulp.task("scss-lint", function() {

   // Stylelint config rules
   var stylelintConfig = {
      "rules": {
         "block-no-empty": true,
         "color-no-invalid-hex": true,
         "declaration-colon-space-after": "always",
         "declaration-colon-space-before": "never",
         "function-comma-space-after": "always",
         "function-url-quotes": "double",
         "media-feature-colon-space-after": "always",
         "media-feature-colon-space-before": "never",
         "media-feature-name-no-vendor-prefix": true,
         "max-empty-lines": 5,
         "number-leading-zero": "always",
         "number-no-trailing-zeros": true,
         //"property-no-vendor-prefix": true,
         "rule-no-duplicate-properties": true,
         "declaration-block-no-single-line": true,
         "rule-trailing-semicolon": "always",
         "selector-list-comma-space-before": "never",
         "selector-list-comma-newline-after": "always",
         "selector-no-id": true,
         "string-quotes": "double",
         "value-no-vendor-prefix": true
      }
   };

   var processors = [
      stylelint(stylelintConfig),
      reporter({
         clearMessages: true,
         throwError: true
      })
   ];

   return gulp.src(
         ['app/sass/**/*.scss'
            // Ignore linting vendor assets
            // Useful if you have bower components
            //'!app/style/d3.css'
         ]
      )
      .pipe(postcss(processors), {
         syntax: syntax_scss
      });
});

// HTML tasks

gulp.task('html', function() {
   gulp.src('app/**/*.html');
});


// JS tasks

gulp.task('js', function() {
   gulp.src('app/**/*.js');
});


// BROWSERIFY tasks

/*gulp.task('browserify', function() {
   return browserify('public/scripts/app.js')
   .bundle()
   //Pass desired output filename to vinyl-source-stream
   .pipe(source('bundle.js'))
   // Start piping stream to tasks!
   .pipe(gulp.dest('public/scripts/'));
});*/

////////////////////////////////////////
// Production
////////////////////////////////////////

// concat & minify JS files

gulp.task('compress', function() {
   return gulp.src('app/js/**/*.js')
      .pipe(concat('allScript.js'))
      .pipe(uglify())
      .pipe(gulp.dest('app/dist/js/'));
});


gulp.task('sassdoc', function() {
   return gulp.src('app/sass/**/*.scss')
      .pipe(sassdoc());
});

////////////////////////////////////////
// ACTIONS
////////////////////////////////////////

// Development

gulp.task('dev', function() {
   browserSync.init({
      server: "./app"
   });
   gulp.watch('app/sass/**/*.scss', ['sass']).on('change', browserSync.reload);
   gulp.watch('app/**/*.html', ['html']).on('change', browserSync.reload);
   gulp.watch('app/**/*.js', ['js']).on('change', browserSync.reload);
});


// Production

gulp.task('prod', ['compress']);
