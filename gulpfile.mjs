import gulp from "gulp";
import sassPkg from "gulp-sass";
import * as dartSass from "sass";
const sass = sassPkg(dartSass);

import autoprefixer from "gulp-autoprefixer";
import cleanCSS from "gulp-clean-css";
import terser from "gulp-terser";
import concat from "gulp-concat";
import browserSyncPkg from "browser-sync";
const browserSync = browserSyncPkg.create();
import sourcemaps from "gulp-sourcemaps";
import fileInclude from "gulp-file-include";
import fs from "fs";
import path from "path";

// === Шляхи ===
const paths = {
  html: "src/html/*.html",
  scss: "src/scss/**/*.scss",
  js: "src/js/**/*.js",
  images: "src/images/**/*",
  fonts: "src/fonts/**/*",
  dist: "dist",
};

// === HTML ===
export function html(cb) {
  gulp
    .src(paths.html)
    .pipe(fileInclude({ prefix: "@@", basepath: "@file" }))
    .pipe(gulp.dest(paths.dist))
    .on("end", () => {
      browserSync.reload();
      cb();
    });
}

// === SCSS ===
export function styles() {
  return gulp
    .src("src/scss/style.scss")
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(`${paths.dist}/css`))
    .pipe(browserSync.stream());
}

// === JS ===
export function scripts() {
  return gulp
    .src(paths.js)
    .pipe(concat("main.js"))
    .pipe(terser())
    .pipe(gulp.dest(`${paths.dist}/js`))
    .pipe(browserSync.stream());
}

// === Images — копіюємо без обробки ===
export function images(cb) {
  const srcDir = "src/images";
  const distDir = `${paths.dist}/images`;
  fs.mkdirSync(distDir, { recursive: true });
  fs.readdirSync(srcDir).forEach((file) => {
    fs.copyFileSync(path.join(srcDir, file), path.join(distDir, file));
  });

  // Гарантуємо reload після копіювання
  setTimeout(() => {
    browserSync.reload();
    cb();
  }, 0);
}

// === Fonts ===
export function fonts(cb) {
  const srcDir = "src/fonts";
  const distDir = `${paths.dist}/fonts`;
  fs.mkdirSync(distDir, { recursive: true });
  fs.readdirSync(srcDir).forEach((file) => {
    fs.copyFileSync(path.join(srcDir, file), path.join(distDir, file));
  });

  // Reload після копіювання
  setTimeout(() => {
    browserSync.reload();
    cb();
  }, 0);
}

// === Server ===
export function serve() {
  browserSync.init({
    server: { baseDir: paths.dist },
    open: false,
    notify: false,
  });

  gulp.watch(paths.html, html);
  gulp.watch(paths.scss, styles);
  gulp.watch(paths.js, scripts);
  gulp.watch(paths.images, images);
  gulp.watch(paths.fonts, fonts);
}

// === Build і Dev ===
export const build = gulp.series(
  gulp.parallel(html, styles, scripts, images, fonts)
);
export const dev = gulp.series(build, serve);
export default dev;
