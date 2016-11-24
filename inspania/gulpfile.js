var gulp = require('gulp'),
  	connect = require('gulp-connect'),
  	runSequence = require('run-sequence'),
  	imagemin = require('gulp-imagemin'),
  	rev = require('gulp-rev'),
  	revCollector = require('gulp-rev-collector');
/*---------------
 * 基本任务
 */
//启动本地服务
gulp.task('connect', function() {
  	connect.server();
});
//复制文件
gulp.task('revCss',function(){
	return gulp.src('css/**/*')
		.pipe(rev())
		.pipe(rev.manifest())
		.pipe(gulp.dest('rev/css'));
});
gulp.task('revJs', function(){
    return gulp.src('js/**/*')
        .pipe(rev())
        .pipe(rev.manifest())
        .pipe(gulp.dest('rev/js'));
});
gulp.task('file',function(){
	gulp.src('css/**/*')
		.pipe(revCollector())
		.pipe(gulp.dest('dist/css'));
	gulp.src('font-awesome/**/*')
		.pipe(gulp.dest('dist/font-awesome'));
	gulp.src('fonts/**/*')
		.pipe(gulp.dest('dist/fonts'));
	gulp.src('img/**/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/img'));
	gulp.src('js/**/*')
		.pipe(gulp.dest('dist/js'));
	gulp.src('views/**/*')
		.pipe(gulp.dest('dist/views'));
	gulp.src(['rev/**/*.json','index.html'])
		.pipe(revCollector())
		.pipe(gulp.dest('dist/'));
});
/*---------------
 * 完整任务
 */
gulp.task('default', ['connect']);
gulp.task('dist', function (done) {
    condition = false;
    runSequence(
        ['revCss'],
        ['revJs'],
        ['file'],
        done);
});