
var gulp = require('gulp')
var webpack = require('webpack')
var wpConf = require('./webpack.config.js')
var gutil = require('gulp-util')
var uglify = require('gulp-uglify')
var rename = require('gulp-rename')

gulp.task('default', ['uglify'])

gulp.task('webpack', function (callback) {
  webpack(wpConf, function (err, stats) {
    if (err) throw new gutil.PluginError('webpack', err)
    gutil.log('[webpack]', stats.toString({}))
    callback()
  })
})

gulp.task('uglify', ['webpack'], function () {
  return gulp.src('dist/distinct-colors.js')
    .pipe(uglify())
    .pipe(rename({
      extname: '.min.js'
    }))
    .pipe(gulp.dest('dist'))
})
