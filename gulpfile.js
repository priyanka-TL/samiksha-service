const gulp = require('gulp');
const apidoc = require('gulp-apidoc');

gulp.task('apidoc', (done) => {
  apidoc(
    {
      src: './controllers',
      dest: './public/apidoc',
    },
    done,
  );
});

gulp.task('watch', () => {
  gulp.watch(['./controllers/**'], ['apidoc']);
});
