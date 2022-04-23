#!/usr/bin/env sh
set -e
# 切换到master
git checkout master
# 合并dev分支
git merge dev
# npx: 使用本地已安装的可执行工具，而不需要配置 scripts
VERSION=`npx select-version-cli`
# 更新版本号
read -p "Releasing $VERSION - are you sure? (y/n)" -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
  # 输出:压缩版本
  echo "Releasing $VERSION ..."

  # build
  # 编译打包
  VERSION=$VERSION npm run dist

  # ssr test
  node test/ssr/require.test.js            

  # 发布到npm
  # publish theme
  # 输出:压缩theme-chalk版本
  echo "Releasing theme-chalk $VERSION ..."
  cd packages/theme-chalk
  # 更改主题包的版本信息
  npm version $VERSION --message "[release] $VERSION"
  # 如果是beta版本则打个beta标签
  if [[ $VERSION =~ "beta" ]]
  then
    npm publish --tag beta
  else
    npm publish
  fi
  cd ../..

  # commit
  git add -A
  git commit -m "[build] $VERSION"
  # 更改组件库的版本信息
  npm version $VERSION --message "[release] $VERSION"
  # publish
  # 发布到远程仓库
  git push eleme master
  git push eleme refs/tags/v$VERSION
  git checkout dev
  git rebase master
  git push eleme dev
  # 发布组件库
  if [[ $VERSION =~ "beta" ]]
  then
    npm publish --tag beta
  else
    npm publish
  fi
fi
