var fs = require('fs');
// 导出文件
var save = require('file-save');
// 解析为绝对路径
var resolve = require('path').resolve;
// 获取扩展名,返回path最后一部分 path.basename('/foo/bar/quux.html', '.html'); // 返回：‘quux’
var basename = require('path').basename;
var localePath = resolve(__dirname, '../../src/locale/lang');
// 读取src/locale/lang下的列表
var fileList = fs.readdirSync(localePath);
// 通过babel转译
var transform = function (filename, name, cb) {
  // https://babel.docschina.org/docs/en/6.26.3/babel-core/
  require('babel-core').transformFile(resolve(localePath, filename), {
    plugins: [
      'add-module-exports',
      ['transform-es2015-modules-umd', {
        loose: true
      }]
    ],
    moduleId: name
  }, cb);
};
fileList
  // 过滤js文件
  .filter(function (file) {
    return /\.js$/.test(file);
  })
  .forEach(function (file) {
    var name = basename(file, '.js');
    // 异步转译文件中的全部内容
    transform(file, name, function (err, result) {
      if (err) {
        console.error(err);
      } else {
        var code = result.code;

        code = code
          .replace('define(\'', 'define(\'element/locale/')
          .replace('global.', 'global.ELEMENT.lang = global.ELEMENT.lang || {}; \n    global.ELEMENT.lang.');
        save(resolve(__dirname, '../../lib/umd/locale', file)).write(code);

        console.log(file);
      }
    });
  });
