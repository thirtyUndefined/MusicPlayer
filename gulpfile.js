 // series 任务分组， src文件输入路径 dest导出文件路径， watch文件变换监听
 const {
     series,
     src,
     dest,
     watch
 } = require("gulp");
 const cleanCss = require("gulp-clean-css"); // 压缩css
 const rename = require("gulp-rename"); // 修改文件后缀
 const less = require("gulp-less"); // css文件转化
 const stripDebug = require("gulp-strip-debug"); // 删除js文件的调试代码
 const uglify = require("gulp-uglify"); // 压缩js文件
 const htmlClean = require("gulp-htmlclean"); // 压缩HTML文件
 //const imgMin = require("gulp-imagemin"); // 压缩图片

 const connect = require("gulp-connect") // 搭建服务器


 // 文件路径配置
 const fload = {
     src: 'src/',
     dist: 'dist/'
 }

 // 任务
 let html = () =>
     src(fload.src + "html/*")
     .pipe(htmlClean())
     .pipe(dest(fload.dist + "html/"))
     .pipe(connect.reload());

 let css = () =>
     src(fload.src + "css/*")
     .pipe(less())
     .pipe(cleanCss())
     .pipe(dest(fload.dist + "css/"))
     .pipe(connect.reload());

 let js = () =>
     src(fload.src + "js/*")
     //.pipe(stripDebug())
     .pipe(dest(fload.dist + "js/"))
     //.pipe(stripDebug())
     // .pipe(uglify())
     //.pipe(rename({
     //    extname : ".min.js"
     // }))
     // .pipe(dest(fload.dist + "js/"))
     .pipe(connect.reload());

 let image = () =>
     src(fload.src + "images/*")
     //.pipe(imgMin())
     .pipe(dest(fload.dist + "images/"));

 // 服务器
 function sever(cb) {
     connect.server({
         port: "1123",
         livereload: true, // 自动刷新
     })
     cb();
 }
 watch(fload.src + "html/*", function (cb) {
     html()
     cb();
 });
 watch(fload.src + "css/*", function (cb) {
     css()
     cb();
 });
 watch(fload.src + "js/*", function (cb) {
     js()
     cb();
 })


 module.exports.default = series(html, css, js, image, sever);