#!/usr/bin/env sh
# 切换到dev分支
git checkout dev
# 检测本地是否有未提交文件
if test -n "$(git status --porcelain)"; then
# 输出日志
  echo 'Unclean working tree. Commit or stash changes first.' >&2;
  exit 128;
fi
# 检测本地分支是否有误
if ! git fetch --quiet 2>/dev/null; then
  # 输出日志
  echo 'There was a problem fetching your branch. Run `git fetch` to see more...' >&2;
  exit 128;
fi
# 检测是否有最新提交
if test "0" != "$(git rev-list --count --left-only @'{u}'...HEAD)"; then
  # 输出日志
  echo 'Remote history differ. Please pull changes.' >&2;
  exit 128;
fi
# 输出日志
echo 'No conflicts.' >&2;
