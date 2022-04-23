'use strict';

const {
  series,
  src,
  dest
} = require('gulp');
// 编译gulp工具
const sass = require('gulp-sass');
// 添加厂商前缀
const autoprefixer = require('gulp-autoprefixer');
// 压缩css
const cssmin = require('gulp-cssmin');

// src下面的所有文件编译到lib下
function compile() {
  return src('./src/*.scss')
    .pipe(sass.sync()) //把scss编译成css
    .pipe(autoprefixer({ //基于目标浏览器版本,添加厂商前缀
      browsers: ['ie > 9', 'last 2 versions'],
      cascade: false
    }))
    .pipe(cssmin()) //压缩css
    // dest: 流会将 vinyl File保存到指定目录下
    .pipe(dest('./lib')); //输出到lib下
}
// 读取src下的fonts文件目录输出到lib下
function copyfont() {
  return src('./src/fonts/**')
    .pipe(cssmin())
    .pipe(dest('./lib/fonts'));
}
// series: 接受可变数量的字符串(taskName)和/或函数(fn)，并返回组合任务或函数的一个函数
exports.build = series(compile, copyfont);
