var gulp = require('gulp');
var eslint = require('gulp-eslint');

var FILES = [
  'db/mongo.js',
  'db/models/*.js',
  'client/*.js',
  'middlewares/*.js',
  'routes/*.js',
  'views/*.js',
  'server.js',
  'expressApp.js'
];

var options = {
  rulePaths: ['.eslint_rules']
};

gulp.task('eslint', function() {
  return gulp.src(FILES)
    .pipe(eslint())
    .pipe(eslint.format());
});
