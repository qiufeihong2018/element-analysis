'use strict';
// 生成目录
const fs = require('fs');
const path = require('path');
// 是一个托管的全文、数字和分面搜索引擎，能够从第一次击键交付实时结果。
const algoliasearch = require('algoliasearch');
// 将Unicode str转换为段字符串，确保在URL或文件名中使用它是安全的。
// https://www.npmjs.com/package/transliteration?activeTab=readme
// demo:
// slugify('你好，世界');
// // ni-hao-shi-jie
const slugify = require('transliteration').slugify;
// 密钥
const key = require('./algolia-key');

const client = algoliasearch('4C63BTGP6S', key);
const langs = {
  'zh-CN': 'element-zh',
  'en-US': 'element-en',
  'es': 'element-es',
  'fr-FR': 'element-fr'
};
// 四种语言
['zh-CN', 'en-US', 'es', 'fr-FR'].forEach(lang => {
  const indexName = langs[lang];
  const index = client.initIndex(indexName);
  index.clearIndex(err => {
    if (err) return;
    // 读取/examples/docs/中的文件
    fs.readdir(path.resolve(__dirname, `../../examples/docs/${ lang }`), (err, files) => {
      if (err) return;
      let indices = [];
      files.forEach(file => {
        console.log(file)
        const component = file.replace('.md', '');
        const content = fs.readFileSync(path.resolve(__dirname, `../../examples/docs/${ lang }/${ file }`), 'utf8');
        const matches = content
          .replace(/:::[\s\S]*?:::/g, '')
          .replace(/```[\s\S]*?```/g, '')
          .match(/#{2,4}[^#]*/g)
          .map(match => match.replace(/\n+/g, '\n').split('\n').filter(part => !!part))
          .map(match => {
            const length = match.length;
            if (length > 2) {
              const desc = match.slice(1, length).join('');
              return [match[0], desc];
            }
            return match;
          });

        indices = indices.concat(matches.map(match => {
          const isComponent = match[0].indexOf('###') < 0;
          const title = match[0].replace(/#{2,4}/, '').trim();
          const index = { component, title };
          index.ranking = isComponent ? 2 : 1;
          index.anchor = slugify(title);
          index.content = (match[1] || title).replace(/<[^>]+>/g, '');
          return index;
        }));
      });

      index.addObjects(indices, (err, res) => {
        console.log(err, res);
      });
    });
  });
});
