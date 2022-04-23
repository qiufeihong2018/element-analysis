var fs = require('fs');
var path = require('path');
var Components = require('../../components.json');
var themes = [
  'theme-chalk'
];
Components = Object.keys(Components);
var basepath = path.resolve(__dirname, '../../packages/');

function fileExists(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch (err) {
    return false;
  }
}

themes.forEach((theme) => {
  var isSCSS = theme !== 'theme-default';
  var indexContent = isSCSS ? '@import "./base.scss";\n' : '@import "./base.css";\n';
  Components.forEach(function(key) {
    // 导入的组件不在packages文件夹下,需要过滤
    // 以下是option-group的代码
//     import ElOptionGroup from '../select/src/option-group';

// /* istanbul ignore next */
// ElOptionGroup.install = function(Vue) {
  //   Vue.component(ElOptionGroup.name, ElOptionGroup);
  // };
  
  // export default ElOptionGroup;
  if (['icon', 'option', 'option-group'].indexOf(key) > -1) return;
  var fileName = key + (isSCSS ? '.scss' : '.css');

  // @import "./popconfirm.scss";
  indexContent += '@import "./' + fileName + '";\n';
  
  // 组装组件css文件路径 E:\element-master\element-master\packages\theme-chalk\src\popconfirm.scss
  var filePath = path.resolve(basepath, theme, 'src', fileName);
  
  // 文件不存在就创建遗漏的css文件
  if (!fileExists(filePath)) {
      fs.writeFileSync(filePath, '', 'utf8');
      console.log(theme, ' 创建遗漏的 ', fileName, ' 文件');
    }
  });
  // 往index.scss中写入导入 如:@import "./base.scss";
  fs.writeFileSync(path.resolve(basepath, theme, 'src', isSCSS ? 'index.scss' : 'index.css'), indexContent);
});
