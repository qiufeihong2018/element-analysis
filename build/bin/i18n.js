'use strict';

var fs = require('fs');
var path = require('path');
// 从examples/i18n/page.json获取国际化的配置
var langConfig = require('../../examples/i18n/page.json');
// 遍历配置
langConfig.forEach(lang => {
  // 创建 zh-CN 等在内的文件夹
  try {
    fs.statSync(path.resolve(__dirname, `../../examples/pages/${ lang.lang }`));
  } catch (e) {
    fs.mkdirSync(path.resolve(__dirname, `../../examples/pages/${ lang.lang }`));
  }

  Object.keys(lang.pages).forEach(page => {
    // 按照键创建模板下面的tpl
    var templatePath = path.resolve(__dirname, `../../examples/pages/template/${ page }.tpl`);
    // 按照键创建对应语言文件夹下的vue文件
    var outputPath = path.resolve(__dirname, `../../examples/pages/${ lang.lang }/${ page }.vue`);
    var content = fs.readFileSync(templatePath, 'utf8');
    var pairs = lang.pages[page];
    // 通过tpl模板获取内容
    Object.keys(pairs).forEach(key => {
      content = content.replace(new RegExp(`<%=\\s*${ key }\\s*>`, 'g'), pairs[key]);
    });
    // 往各个语言文件夹下的vue文件写入内容
    fs.writeFileSync(outputPath, content);
  });
});
