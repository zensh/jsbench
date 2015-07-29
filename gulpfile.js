'use strict'

var gulp = require('gulp')
var gulpSequence = require('gulp-sequence')

gulp.task('benchmark', function (done) {
  require('./benchmark/index')(done)
})

gulp.task('default', ['test'])

gulp.task('test', gulpSequence('benchmark'))
