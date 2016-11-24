var gulp = require('gulp');
var less = require('gulp-less'); //提供less编译的插件
var uglify = require('gulp-uglify'); //提供js文件压缩的插件
var cssmin = require('gulp-minify-css'); //提供css文件压缩的插件
var concat = require('gulp-concat'); //提供文件合并的插件
var rename = require("gulp-rename"); //提供修改文件名的插件
var sourcemaps = require('gulp-sourcemaps'); //编译后不容易找到对应less文件，所以需要生成sourcemap文件，方便修改
var connect = require('gulp-connect'); //启本地服务
var rev = require('gulp-rev-append'); //添加版本号
var htmlmin = require('gulp-htmlmin'); //压缩html
//less只编译不压缩
gulp.task('css', function() {
    gulp.src(['less/*.less'])
        .pipe(less())
        .pipe(rename(function(path) {
            path.basename += ".min";
            return path;
        }))
        .pipe(gulp.dest('css/'));
});
//js不压缩
gulp.task('js', function() {
    gulp.src(['jssrc/*.js','!jssrc/config.js'])
        .pipe(rename(function(path) {
            path.basename += ".min";
            return path;
        }))
        .pipe(gulp.dest('js/'));
    gulp.src('jssrc/config.js')
        .pipe(gulp.dest('js/'));
});
//静态文件复制到dist里
gulp.task('file', function() {
    gulp.src('fonts/**')
        .pipe(gulp.dest('dist/fonts/'));
    gulp.src('img/**')
        .pipe(gulp.dest('dist/img/'));
    gulp.src('lib/**')
        .pipe(gulp.dest('dist/lib/'));
});
//less编译后压缩并添加.min后缀
gulp.task('min_css', function() {
    gulp.src(['less/*.less'])
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(cssmin())
        .pipe(rev())
        .pipe(rename(function(path) {
            path.basename += ".min";
            return path;
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/css/'));
});
//js压缩并添加.min后缀
gulp.task('min_js', function() {
    gulp.src(['jssrc/*.js','!jssrc/config.js'])
        .pipe(uglify())
        .pipe(rename(function(path) {
            path.basename += ".min";
            return path;
        }))
        .pipe(gulp.dest('dist/js/'));
    gulp.src('jssrc/config.js')
        .pipe(gulp.dest('dist/js/'));
});
//html压缩
var options = {
    collapseWhitespace: true, //清除空格，压缩html
    collapseBooleanAttributes: true, //省略布尔属性的值，比如：<input checked="checked"/>
    removeComments: true, //清除html中注释的部分，我们应该减少html页面中的注释
    removeEmptyAttributes: true, //清除所有的空属性
    removeScriptTypeAttributes: true, //清除所有script标签中的type="text/javascript"属性
    removeStyleLinkTypeAttributes: true, //清楚所有Link标签上的type属性
    minifyJS: true, //压缩html中的javascript代码
    minifyCSS: true //压缩html中的css代码
};
gulp.task('min_html', function() {
    gulp.src('html/*.html')
        .pipe(rev())
        .pipe(htmlmin(options))
        .pipe(gulp.dest('dist/html/'));
});
//定义本地服务任务
gulp.task('host', function() {
    connect.server({
        livereload: true
    });
});
//监听js和less文件变化，不执行优化处理
gulp.task('watch', function() {
    gulp.watch(['less/*.less'], ['css']);
    gulp.watch(['jssrc/*.js'], ['js']);
    gulp.watch(['gless/*.less'], ['css']);
});
//启服务并监听文件
gulp.task('www', ['host', 'watch']);
//默认任务 'gulp' ,只执行构建，不执行优化处理
gulp.task('default', ['css', 'js']);
//'dist'任务，执行代码优化
gulp.task('dist', ['min_css', 'min_js', 'min_html', 'file']);
