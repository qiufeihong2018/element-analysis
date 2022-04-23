```json
{
/** 
name和version字段是package.json文件中最重要的字段。这是必须的字段，如果你的npm包没有指定这两个字段，将无法被安装。name和version字段被假定组合成一个唯一的标识符。包内容的更改和包版本的更改是同步的。
name字段的含义不需要过多解释，就是npm包名。

几个规则：

1. name的长度必须小于等于214个字符。
2. name不能以"."(点)或者"_"(下划线)开头。
3. name中不能包含大写字母。
4. name最终将被用作URL的一部分、命令行的参数和文件夹名。因此，name不能含有非URL安全的字符。

几个建议：

1. 不要使用已存在的name作为包名。
2. 不要在name中使用"js"和"node"，这会假定这是js文件，一旦你写一个package.json文件，你就可以在"engines"字段中指定解释器引擎。
3. name字段可能会被作为传输传递给require()函数，因此它最好是简短的、自描述的。
4. 你可能会需要在深入开发一个包之前先检查npm的registry来确认某个name是否被使用过，可以参考https://www.npmjs.com/。
**/   

  "name": "element-ui",
  /**
  版本必须由node-semver解析，它与npm绑定为一个依赖项。(npm安装semver自己使用。)更多版本号和范围在semver。
  **/
  "version": "2.13.0",
  /**
  在里面放上描述。它是一个字符串。这有助于人们发现你的包，因为它列在npm搜索。
  **/
  "description": "A Component Library for Vue.js.",
  /**
  main是一个模块ID，它是程序的主要入口点。也就是说，如果您的包名为foo，并且用户安装了它，然后确实需要(“foo”)，那么您的主模块的导出对象将被返回。这应该是一个相对于包文件夹根目录的模块ID。对于大多数模块来说，拥有一个主脚本是最有意义的，通常没有其他的东西。
  **/
  "main": "lib/element-ui.common.js",
  /**
  les字段是一个被项目包含的文件名数组，如果你在里面放一个文件夹名，那么这个文件夹中的所有文件都会被包含进项目中(除非是那些在其他规则中被忽略的文件)。

你还可以在包的根目录或子目录下提供一个".npmignore"文件来忽略项目包含文件，即使这些文件被包含在files字段中。.npmignore文件和.gitignore的功能很像。

某些文件总是被包含的，不论是否在规则中指定了它们：

package.json
README (and its variants)
CHANGELOG (and its variants)
LICENSE / LICENCE

相反地，一些文件总是被忽略：

.git
CVS
.svn
.hg
.lock-wscript
.wafpickle-N
*.swp
.DS_Store
._*
npm-debug.log
  **/
  "files": [
    "lib",
    "src",
    "packages",
    "types"
  ],
//   未知
  "typings": "types/index.d.ts",
  /**
  “scripts”属性是一个字典，其中包含在包的生命周期中不同时间运行的脚本命令。关键是生命周期事件，而值是要在该点运行的命令。有关编写包脚本的更多信息，请参见npm -scripts。
  **/
  "scripts": {
    "bootstrap": "yarn || npm i",
    "build:file": "node build/bin/iconInit.js & node build/bin/build-entry.js & node build/bin/i18n.js & node build/bin/version.js",
    "build:theme": "node build/bin/gen-cssfile && gulp build --gulpfile packages/theme-chalk/gulpfile.js && cp-cli packages/theme-chalk/lib lib/theme-chalk",
    "build:utils": "cross-env BABEL_ENV=utils babel src --out-dir lib --ignore src/index.js",
    "build:umd": "node build/bin/build-locale.js",
    "clean": "rimraf lib && rimraf packages/*/lib && rimraf test/**/coverage",
    "deploy:build": "npm run build:file && cross-env NODE_ENV=production webpack --config build/webpack.demo.js && echo element.eleme.io>>examples/element-ui/CNAME",
    "deploy:extension": "cross-env NODE_ENV=production webpack --config build/webpack.extension.js",
    "dev:extension": "rimraf examples/extension/dist && cross-env NODE_ENV=development webpack --watch --config build/webpack.extension.js",
    "dev": "npm run bootstrap && npm run build:file && cross-env NODE_ENV=development webpack-dev-server --config build/webpack.demo.js & node build/bin/template.js",
    "dev:play": "npm run build:file && cross-env NODE_ENV=development PLAY_ENV=true webpack-dev-server --config build/webpack.demo.js",
    "dist": "npm run clean && npm run build:file && npm run lint && webpack --config build/webpack.conf.js && webpack --config build/webpack.common.js && webpack --config build/webpack.component.js && npm run build:utils && npm run build:umd && npm run build:theme",
    "i18n": "node build/bin/i18n.js",
    "lint": "eslint src/**/* test/**/* packages/**/* build/**/* --quiet",
    "pub": "npm run bootstrap && sh build/git-release.sh && sh build/release.sh && node build/bin/gen-indices.js && sh build/deploy-faas.sh",
    "test": "npm run lint && npm run build:theme && cross-env CI_ENV=/dev/ BABEL_ENV=test karma start test/unit/karma.conf.js --single-run",
    "test:watch": "npm run build:theme && cross-env BABEL_ENV=test karma start test/unit/karma.conf.js"
  },
//   未知
  "faas": [
    {
      "domain": "element",
      "public": "temp_web/element"
    },
    {
      "domain": "element-theme",
      "public": "examples/element-ui",
      "build": [
        "yarn",
        "npm run deploy:build"
      ]
    }
  ],
//   指明你的代码被托管在何处，这对那些想要参与到这个项目中的人来说很有帮助。如果git仓库在github上，用npm docs命令将会找到你。
  "repository": {
    "type": "git",
    "url": "git@github.com:ElemeFE/element.git"
  },
//   指向项目主页的url。
  "homepage": "http://element.eleme.io",
//   它是一个字符串数组。这有助于人们发现你的包，因为它是列在npm搜索。
  "keywords": [
    "eleme",
    "vue",
    "components"
  ],
//   你应该对你的包指定一个license来让用户知道他们的使用权利和和任何限制。
  "license": "MIT",
//   项目的issue跟踪页面或这报告issue的email地址。这对使用这个包遇到问题的用户会有帮助。
  "bugs": {
    "url": "https://github.com/ElemeFE/element/issues"
  },
//   未知
  "unpkg": "lib/index.js",
//   未知
  "style": "lib/theme-chalk/index.css",
  /**
  dependencies字段是一个对象，它指定了依赖的包名和其版本范围的映射。版本范围是个有一个或多个空白分隔描述符的字符串。dependencies字段还可以用tarball或者git URL。

请不要将测试或过渡性的依赖放到dependencies中，请参考下面的devDependencies。

可以参考semver获取更多关于指定版本范围的细节信息。

1. version 必须确切匹配这个version
2. \>version 必须大于这个version
3. \>=version 必须大于等于这个version
4. < version 必须小于这个version
5. <=version 必须小于等于这个version
6. ~version 大约相当于version，参考[semver](https://docs.npmjs.com/misc/semver)
7. ^version 与version兼容，参考[semver](https://docs.npmjs.com/misc/semver)
8. 1.2.x 可以是1.2.0、1.2.1等，但不能是1.3.0
9. http://... 参考下面的URL作为依赖项
10. \* 匹配任何版本
11. ""(空字符串) 匹配任何版本，和\*一样
12. version1 - version2 相当于 >=version1 <=version2
13. range1 || range2 range1或range2其中一个满足时采用该version
14. git... 参考下面的Git URL作为依赖项
15. user/repo 参考下面的GitHub URLs
16. tag 一个以tag发布的指定版本，参考[npm-tag](https://docs.npmjs.com/cli/tag)
17. path/path/path 参考下面的本地Paths
  **/
  "dependencies": {
    "async-validator": "~1.8.1",
    "babel-helper-vue-jsx-merge-props": "^2.0.0",
    "deepmerge": "^1.2.0",
    "normalize-wheel": "^1.0.1",
    "resize-observer-polyfill": "^1.5.0",
    "throttle-debounce": "^1.0.1"
  },
  /**
  在某些情况下，当一个主机无法require依赖包时，你会想要告诉它还有哪些工具或库与这个依赖包兼容。这通常被成为一个插件。尤其是在host文档中声明的模块会暴露一个特定的接口。

举个栗子：

复制代码
{
    "name": "tea-latte",
    "version": "1.3.5",
    "peerDependencies": {
        "tea": "2.x"
    }
}
复制代码
这将确保tea-latte这个包只会和2.x版本的tea一起被安装。执行npm install tea-latte可能产生以下关系图：

├── tea-latte@1.3.5
└── tea@2.2.0

注意：如果没有在依赖树中显式声明比它们更高的依赖版本，版本1和版本2的npm将会自动安装peerDependencies。在npm的下一个大版本npm3中，情况将完全不同。你将收到一个警告，告诉你peerDependency还没有被安装。在npm1和npm2中这个行为经常会导致混乱，新的npm版本的设计将会极力避免这种情况。

试图安装一个有冲突的依赖项的插件将会导致一个错误。因此你必须确保你的插件的依赖项版本范围尽可能大，并且不要把版本锁死在一个特点的补丁版本上。

假设主机使用semver进行编译，只改变这个包的主版本将会导致你的插件不可用。因此，如果你的插件的某个依赖包运行在每个1.x版本下，使用"^1.0"或"1.x"。如果你需要的功能在1.5.2版本中，使用">= 1.5.2 < 2"。
  **/
  "peerDependencies": {
    "vue": "^2.5.17"
  },
  /**
  如果有人计划在他们的项目中下载和使用你的模块，但他们可能并不想或并不需要你开发所使用的外部测试和文档框架。

在这种情况下，最好将这些附加的项放在devDependencies中。

这些项将会在根目录下执行npm link或npm install时被安装，并且可以像其他npm配置参数一样被管理。可以参考npm-config获得更多信息。

对于那些非特定平台的构建步骤，比如编译CoffeeScript或把其他语言转换成JavaScript，可以使用prepublish脚本来处理，并且把这个过程的依赖包放在devDependencies中。

举个栗子：

复制代码
{
    "name": "ethopia-waza",
    "description": "a delightfully fruity coffee varietal",
    "version": "1.2.3",
    "devDependencies": {
        "coffee-script": "~1.6.3"
    },
    "scripts": {
        "prepublish": "coffee -o lib/ -c src/waza.coffee"
    },
    "main": "lib/waza.js"
}
复制代码
prepublish脚本会在publishing前运行，这样用户就可以不用自己去require来编译就能使用。在开发模式下(比如本地运行npm install)，将会执行这个脚本，这样测试就非常方便了。
  **/
  "devDependencies": {
    "@vue/component-compiler-utils": "^2.6.0",
    "algoliasearch": "^3.24.5",
    "babel-cli": "^6.26.0",
    "babel-core": "^6.26.3",
    "babel-loader": "^7.1.5",
    "babel-plugin-add-module-exports": "^0.2.1",
    "babel-plugin-istanbul": "^4.1.1",
    "babel-plugin-module-resolver": "^2.2.0",
    "babel-plugin-syntax-jsx": "^6.18.0",
    "babel-plugin-transform-vue-jsx": "^3.7.0",
    "babel-preset-env": "^1.7.0",
    "babel-preset-stage-2": "^6.24.1",
    "babel-regenerator-runtime": "^6.5.0",
    "chai": "^4.2.0",
    "chokidar": "^1.7.0",
    "copy-webpack-plugin": "^5.0.0",
    "coveralls": "^3.0.3",
    "cp-cli": "^1.0.2",
    "cross-env": "^3.1.3",
    "css-loader": "^2.1.0",
    "es6-promise": "^4.0.5",
    "eslint": "4.18.2",
    "eslint-config-elemefe": "0.1.1",
    "eslint-loader": "^2.0.0",
    "eslint-plugin-html": "^4.0.1",
    "eslint-plugin-json": "^1.2.0",
    "file-loader": "^1.1.11",
    "file-save": "^0.2.0",
    "gulp": "^4.0.0",
    "gulp-autoprefixer": "^6.0.0",
    "gulp-cssmin": "^0.2.0",
    "gulp-sass": "^4.0.2",
    "highlight.js": "^9.3.0",
    "html-webpack-plugin": "^3.2.0",
    "json-loader": "^0.5.7",
    "json-templater": "^1.0.4",
    "karma": "^4.0.1",
    "karma-chrome-launcher": "^2.2.0",
    "karma-coverage": "^1.1.2",
    "karma-mocha": "^1.3.0",
    "karma-sinon-chai": "^2.0.2",
    "karma-sourcemap-loader": "^0.3.7",
    "karma-spec-reporter": "^0.0.32",
    "karma-webpack": "^3.0.5",
    "markdown-it": "^8.4.1",
    "markdown-it-anchor": "^5.0.2",
    "markdown-it-chain": "^1.3.0",
    "markdown-it-container": "^2.0.0",
    "mini-css-extract-plugin": "^0.4.1",
    "mocha": "^6.0.2",
    "node-sass": "^4.11.0",
    "optimize-css-assets-webpack-plugin": "^5.0.1",
    "postcss": "^7.0.14",
    "progress-bar-webpack-plugin": "^1.11.0",
    "rimraf": "^2.5.4",
    "sass-loader": "^7.1.0",
    "select-version-cli": "^0.0.2",
    "sinon": "^7.2.7",
    "sinon-chai": "^3.3.0",
    "style-loader": "^0.23.1",
    "transliteration": "^1.1.11",
    "uglifyjs-webpack-plugin": "^2.1.1",
    "uppercamelcase": "^1.1.0",
    "url-loader": "^1.0.1",
    "vue": "2.5.21",
    "vue-loader": "^15.7.0",
    "vue-router": "^3.0.1",
    "vue-template-compiler": "2.5.21",
    "vue-template-es2015-compiler": "^1.6.0",
    "webpack": "^4.14.0",
    "webpack-cli": "^3.0.8",
    "webpack-dev-server": "^3.1.11",
    "webpack-node-externals": "^1.7.2"
  }
}
```