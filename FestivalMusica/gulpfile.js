const {src, dest, watch, parallel} = require('gulp');

// CSS
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
// Imágenes
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

//JavaScript
const terser = require('gulp-terser-js');

function css(done){
   
    src('src/scss/**/*.scss') //Identificar el archivo .SCSS a compilar
        .pipe(sourcemaps.init())
        .pipe( plumber() )
        .pipe( sass() ) //Compilar
        .pipe( postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe( dest('build/css') ) //Almacena en el disco duro

    done();
}

function imagenes(done) {  //Optimizamos imágenes
    const opciones = {
        optmizationLevel: 3
    }

    src('src/img/**/*.{png,jpg}')
    .pipe(cache(imagemin(opciones)))
    .pipe(dest('build/img'))

    done();
}

function versionavif(done) {

    const opciones = {
        quality: 50
    };

    src('src/img/**/*.{png,jpg}')
        .pipe( avif(opciones))
        .pipe(dest('build/img'))

    done();
}

function versionwebp(done) {

    const opciones = {
        quality: 50
    };

    src('src/img/**/*.{png,jpg}')
        .pipe( webp(opciones))
        .pipe(dest('build/img'))

    done();
}

function js(done){
    src('src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(terser())
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/js'))

    done();
}

function dev(done){

    watch('src/scss/**/*.scss', css) //Los asteriscos sirven para inidcar que se va a compilar en todos los archivos con las extensión .scss
    watch('src/js/**/*.js', js)
    done();
}


exports.css = css;
exports.js = js;
exports.imagenes = imagenes;
exports.versionwebp = versionwebp;
exports.versionavif = versionavif;
exports.dev = parallel(imagenes, versionwebp, versionavif, js, dev );