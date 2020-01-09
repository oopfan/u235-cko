const { src, dest, series } = require('gulp');
const cleanup = require('gulp-clean');
const htmlreplace = require('gulp-html-replace');
const concat = require('gulp-concat');
const es = require('event-stream');
const replace = require('gulp-replace');
const uglify = require('gulp-uglify');
const order = require('gulp-order');
const rjs = require('gulp-requirejs');
const fs = require('fs');
const vm = require('vm');
const merge = require('deeply');

// Config
var requireJsRuntimeConfig = vm.runInNewContext(fs.readFileSync('src/app/require.config.js') + '; require;');
    requireJsOptimizerConfig = merge(requireJsRuntimeConfig, {
        out: 'scriptsr.js',
        baseUrl: './src',
        name: 'app/startup',
        paths: {
            requireLib: '../node_modules/requirejs/require'
        },
        include: [
            'requireLib',
            'components/app/app',
            'components/nav-bar/nav-bar',
            'components/auto-store/auto-store',
            'pages/home/home',
            'pages/about/about',
            'pages/privacy/privacy',
            'pages/g2v-star-database/g2v-star-database',
            'pages/lrgb-exposure/lrgb-exposure',
            'pages/lrgb-stack-balance/lrgb-stack-balance',
            'pages/color-balance/color-balance',
            'pages/color-balance-instructions/color-balance-instructions',
            'pages/astrocalc-v1/astrocalc-v1',
            'pages/astrocalc-v1-instructions/astrocalc-v1-instructions',
            'pages/astrocalc-release-notes/astrocalc-release-notes',
            'pages/snrcalc-telescope-profiles/snrcalc-telescope-profiles',
            'pages/snrcalc-camera-profiles/snrcalc-camera-profiles',
            'pages/snrcalc-observatory-profiles/snrcalc-observatory-profiles',
            'pages/snrcalc-target-profiles/snrcalc-target-profiles',
            'pages/snrcalc-calculator/snrcalc-calculator'
        ],
        insertRequire: ['app/startup'],
        bundles: {
            // If you want parts of the site to load on demand, remove them from the 'include' list
            // above, and group them into bundles here.
            // 'bundle-name': [ 'some/module', 'another/module' ],
            // 'another-bundle-name': [ 'yet-another-module' ]
            // 'about-page': [ 'pages/about/about' ]
        }
    });

// Removes all files from ./dist/
var clean = function() {
  return src('./dist/', { read: false, allowEmpty: true })
    .pipe(cleanup());
};

// Discovers all AMD dependencies, concatenates together all required .js files, minifies them
var js = function() {
  var part1 = src([
    './node_modules/jquery/dist/jquery.min.js',
    './node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
    ])
    .pipe(concat('part1.js'));
  var part2 = src([
    './node_modules/fitsjs/lib/fits.js'
    ])
    .pipe(uglify())
    .pipe(concat('part2.js'));
  return es.concat(part1, part2)
    .pipe(order([
      'part1.js',
      'part2.js'
    ]))
    .pipe(concat('scripts1.js'))
    .pipe(dest('./dist/'))
    .pipe(rjs(requireJsOptimizerConfig)
      .pipe(uglify())
      .on('error', function (error) {
        console.log(error);
      })
      .pipe(dest('./dist/')));
};

// Copies index.html, replacing <script> and <link> tags to reference production URLs
var html = function() {
  return src('./src/index.html')
    .pipe(htmlreplace({
      'css': 'css.css?' + Date.now(),
      'js1': 'scripts1.js?' + Date.now(),
      'jsr': 'scriptsr.js?' + Date.now()
    }))
    .pipe(src('./src/favicon.ico'))
    .pipe(src('./src/server/**/*'))
    .pipe(dest('./dist/'));
};

var images = function() {
  return src('./src/images/**/*')
    .pipe(dest('./dist/images/'));
};

// Concatenates CSS files, rewrites relative paths to Bootstrap fonts
var css = function() {
  // Array of all CSS files needed
  var appCss = src([
    './node_modules/bootswatch/dist/sandstone/bootstrap.min.css',
    './src/css/*.css'
  ])
  .pipe(replace(/url\((')?\.\.\/fonts\//g, 'url($1fonts/'));
  var combinedCss = es.concat(appCss).pipe(concat('css.css'));
  return es.concat(combinedCss)
    .pipe(dest('./dist/'));
};

exports.clean = clean;
exports.html = html;
exports.js = js;
exports.css = css;
exports.images = images;
exports.build = series(html, js, css, images);
