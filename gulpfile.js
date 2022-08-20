const projectFolder = 'dist',
  sourceFolder = 'src',
  path = {
    build: {
      html: `${projectFolder}/`,
      css: `${projectFolder}/css/`,
      img: `${projectFolder}/img/`,
      fonts: `${projectFolder}/fonts/`,
    },
    src: {
      html: [`${sourceFolder}/*.html`, `!${sourceFolder}/_*.html`],
      css: `${sourceFolder}/scss/style.scss`,
      img: `${sourceFolder}/img/**/*.{jpg,png,svg,gif,ico,webp}`,
      fonts: `${sourceFolder}/fonts/`,
    },
    watch: {
      html: `${sourceFolder}/**/*.html`,
      css: `${sourceFolder}/scss/**/*.scss`,
      img: `${sourceFolder}/img/**/*.{jpg,png,svg,gif,ico,webp}`,
    },
  }

const { src, dest } = require('gulp'),
  gulp = require('gulp'),
  browsersync = require('browser-sync').create(),
  scss = require('gulp-sass')(require('sass')),
  autoprefixer = require('gulp-autoprefixer'),
  groupMedia = require('gulp-group-css-media-queries'),
  cleanCss = require('gulp-clean-css'),
  rename = require('gulp-rename')

function browserSync(params) {
  browsersync.init({
    server: {
      baseDir: './' + projectFolder + '/',
    },
    port: 3000,
    notify: false,
  })
}

function html() {
  return src(path.src.html)
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream())
}

function css() {
  return src(path.src.css)
    .pipe(
      scss({
        outputStyle: 'expanded',
        includePaths: ['node_modules/bootstrap/scss'],
      })
    )
    .pipe(groupMedia())
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['last 2 versions'],
        cascade: true,
      })
    )
    .pipe(dest(path.build.css))
    .pipe(cleanCss())
    .pipe(
      rename({
        extname: '.min.css',
      })
    )
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream())
}

function images() {
  return src(path.src.img).pipe(dest(path.build.img)).pipe(browsersync.stream())
}

function fonts() {
  src(path.src.fonts).pipe(dest(path.build.fonts))
}

function watchFiles(params) {
  gulp.watch([path.watch.html], html)
  gulp.watch([path.watch.css], css)
  gulp.watch([path.watch.img], images)
}

const build = gulp.series(gulp.parallel(html, css, images, fonts)),
  watch = gulp.parallel(build, watchFiles, browserSync)

exports.fonts = fonts
exports.images = images
exports.css = css
exports.html = html
exports.build = build
exports.watch = watch
exports.default = watch
