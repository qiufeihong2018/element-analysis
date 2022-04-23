# Makefile中，.PHONY后面的target表示的也是一个伪造的target, 而不是真实存在的文件target，注意Makefile的target默认是文件。
.PHONY: dist test
# 执行make默认指向help
default: help
# 构建主题
# build all theme
build-theme:
	npm run build:theme
# 安装依赖
install:
	npm install
# 使用淘宝源安装依赖
install-cn:
	npm install --registry=http://registry.npm.taobao.org
# 构建应用
dev:
	npm run dev

play:
	npm run dev:play
# 新增组件
new:
	node build/bin/new.js $(filter-out $@,$(MAKECMDGOALS))
# 为网站添加新语言
new-lang:
	node build/bin/new-lang.js $(filter-out $@,$(MAKECMDGOALS))
# 打包
dist: install
	npm run dist
# 部署
deploy:
	@npm run deploy
# 发布
pub:
	npm run pub
# 单元测试
test:
	npm run test:watch
# 帮助信息
help:
	@echo "   \033[35mmake\033[0m \033[1m命令使用说明\033[0m"
	@echo "   \033[35mmake install\033[0m\t\033[0m\t\033[0m\t\033[0m\t---  安装依赖"
	@echo "   \033[35mmake new <component-name> [中文名]\033[0m\t---  创建新组件 package. 例如 'make new button 按钮'"
	@echo "   \033[35mmake dev\033[0m\t\033[0m\t\033[0m\t\033[0m\t---  开发模式"
	@echo "   \033[35mmake dist\033[0m\t\033[0m\t\033[0m\t\033[0m\t---  编译项目，生成目标文件"
	@echo "   \033[35mmake deploy\033[0m\t\033[0m\t\033[0m\t\033[0m\t---  部署 demo"
	@echo "   \033[35mmake pub\033[0m\t\033[0m\t\033[0m\t\033[0m\t---  发布到 npm 上"
	@echo "   \033[35mmake new-lang <lang>\033[0m\t\033[0m\t\033[0m\t---  为网站添加新语言. 例如 'make new-lang fr'"
