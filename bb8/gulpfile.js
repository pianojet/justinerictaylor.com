var gulp = require('gulp');
var bower = require('gulp-bower');

gulp.task('default', function() {
  
});

gulp.task('bower', function() {
  return bower()
    .pipe(gulp.dest('public/js/lib/'))
});