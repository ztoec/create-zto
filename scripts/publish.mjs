#!/usr/bin/env zx
import 'zx/globals'
import { readFile, writeFile } from 'fs/promises'

// 读取 package.json 中的版本信息
let { version, name } = JSON.parse(await readFile('./package.json'))

// 解析参数
const versionType = process.argv[3] || 'patch' // 默认使用 patch
if (!['patch', 'minor', 'major'].includes(versionType)) {
  console.error('Invalid version type. Use "patch", "minor", or "major".')
  process.exit(1)
}

// 保存当前版本号以便回滚
const oldVersion = version

// 确保所有更改已提交
const status = await $`git status --porcelain`
if (status.stdout.trim()) {
  console.error(
    'There are uncommitted changes in the working directory. Please commit or stash them before releasing.',
  )
  process.exit(1)
}

// 确保没有未完成的更改
await $`git fetch origin`
const localHash = await $`git rev-parse HEAD`
const remoteHash = await $`git rev-parse origin/main`
if (localHash.stdout.trim() !== remoteHash.stdout.trim()) {
  console.error(
    'The local branch is not up-to-date with the remote branch. Please pull the latest changes.',
  )
  process.exit(1)
}

// 构建项目
await $`npm run build`

// 更新版本号
await $`npm version ${versionType} --no-git-tag-version`
const newVersion = (await JSON.parse(await readFile('./package.json'))).version

try {
  // 发布到 npm
  await $`npm publish`
  // 创建标签
  await $`git tag -a v${newVersion} -m "v${newVersion}"`
  // 推送更改和标签到远程
  await $`git push --follow-tags`
  // 打印发布成功信息
  console.log(`Successfully released ${name}@${newVersion}`)
} catch (error) {
  console.error('Failed to publish. Rolling back version...')
  // 回滚到旧版本号
  const packageJson = JSON.parse(await readFile('./package.json'))
  packageJson.version = oldVersion
  await writeFile('./package.json', JSON.stringify(packageJson, null, 2) + '\n')
  console.log(`Rolled back to ${oldVersion}`)
  process.exit(1)
}
