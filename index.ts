#!/usr/bin/env node

import * as fs from 'node:fs'
import * as path from 'node:path'
import { execSync } from 'node:child_process'

import { parseArgs } from 'node:util'

import prompts from 'prompts'
import { red, green, bold } from 'kolorist'
import { postOrderDirectoryTraverse } from './utils/directoryTraverse'
import msgData from './messages'
import renderTemplate from './utils/renderTemplate'
import getCommand from './utils/getCommand'

// #region 辅助方法
function isValidPackageName(projectName) {
  return /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(
    projectName,
  )
}

function toValidPackageName(projectName) {
  return projectName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/^[._]/, '')
    .replace(/[^a-z0-9-~]+/g, '-')
}

function canSkipEmptying(dir: string) {
  if (!fs.existsSync(dir)) {
    return true
  }

  const files = fs.readdirSync(dir)
  if (files.length === 0) {
    return true
  }
  if (files.length === 1 && files[0] === '.git') {
    return true
  }

  return false
}

function emptyDir(dir) {
  if (!fs.existsSync(dir)) {
    return
  }

  postOrderDirectoryTraverse(
    dir,
    (dir) => fs.rmdirSync(dir),
    (file) => fs.unlinkSync(file),
  )
}
// #endregion

// #region 初始化逻辑
async function init() {
  const cwd = process.cwd()
  const args = process.argv.slice(2)
  const options = {} as const

  const { values: argv, positionals } = parseArgs({
    args,
    options,
    strict: false,
  })

  let targetDir = positionals[0]
  const defaultProjectName = !targetDir ? 'zto-project' : targetDir

  const forceOverwrite = argv.force

  let result: {
    projectName?: string
    packageName?: string
    shouldOverwrite?: boolean
    frameworkType?: 'vue' | 'uni' | 'react'
    vueVersion?: 'v2' | 'v3'
    needsTypeScript?: boolean
    sceneType?: 'admin' | 'h5'
  } = {}

  try {
    result = await prompts(
      [
        {
          name: 'projectName',
          type: targetDir ? null : 'text',
          message: '请输入项目名称：',
          initial: defaultProjectName,
          onState: (state) =>
            (targetDir = String(state.value).trim() || defaultProjectName),
        },
        {
          name: 'shouldOverwrite',
          type: () =>
            canSkipEmptying(targetDir) || forceOverwrite ? null : 'toggle',
          message: () => {
            const dirForPrompt =
              targetDir === '.' ? '当前目录' : `目标文件夹 "${targetDir}"`

            return `${dirForPrompt} 非空，是否覆盖？`
          },
          initial: true,
          active: '是',
          inactive: '否',
        },
        {
          name: 'overwriteChecker',
          type: (prev, values) => {
            if (values.shouldOverwrite === false) {
              throw new Error(red('✖') + ` 操作取消`)
            }
            return null
          },
        },
        {
          name: 'packageName',
          type: () => (isValidPackageName(targetDir) ? null : 'text'),
          message: '请输入包名称：',
          initial: () => toValidPackageName(targetDir),
          validate: (dir) =>
            isValidPackageName(dir) || '无效的 package.json 名称',
        },
        {
          name: 'frameworkType',
          type: 'select',
          hint: '- 使用箭头切换按Enter确认。',
          warn: '当前仅支持vue项目，敬请期待...',
          message: '请选择技术栈的类型',
          initial: 0,
          choices: (prev, answers) => [
            {
              title: 'vue',
              description: '一个渐进式JavaScript 框架',
              value: 'vue',
            },
            {
              title: 'uni-app',
              description: '一个基于Vue.js的跨端开发框架',
              value: 'uni',
              disabled: true,
            },
            {
              title: 'react',
              description: '一个用于构建用户界面的JavaScript库',
              value: 'react',
              disabled: true,
            },
          ],
        },
        {
          name: 'vueVersion',
          type: (prev, values) =>
            ['vue', 'uni'].includes(values.frameworkType) ? 'select' : null,
          hint: '- 使用箭头切换按Enter确认。',
          message: '请选择vue版本',
          initial: 0,
          choices: (prev, answers) => [
            {
              title: 'vue2',
              description: '使用vue2.x版本',
              value: 'v2',
            },
            {
              title: 'vue3',
              description: '使用vue3.x版本',
              value: 'v3',
            },
          ],
        },
        {
          name: 'needsTypeScript',
          type: (prev, values) =>
            values.vueVersion === 'v2' ? null : 'toggle',
          message: '是否使用TypeScript？',
          initial: false,
          active: '是',
          inactive: '否',
        },
        {
          name: 'sceneType',
          type: (prev, values) =>
            values.frameworkType === 'vue' ? 'select' : null,
          hint: '- 使用箭头切换按Enter确认。',
          message: '请选择初始化模板类型',
          initial: 0,
          choices: (prev, answers) => [
            {
              title: '后台管理系统项目',
              description:
                answers.vueVersion === 'v2'
                  ? '基于vue2+webpack+elementUI 的后台管理系统项目模板'
                  : '基于vue3+vite+element-Plus 的后台管理系统项目模板',
              value: 'admin',
            },
            {
              title: 'H5项目',
              description:
                answers.vueVersion === 'v2'
                  ? '基于vue2+webpack+vantUI 的H5项目模板'
                  : '基于vue3+vite+vant-UI 的H5项目模板',
              value: 'h5',
            },
          ],
        },
      ],
      {
        onCancel: () => {
          throw new Error(red('✖') + ` 操作取消`)
        },
      },
    )
  } catch (error) {
    console.log(error.message)
    process.exit(1)
  }

  const {
    projectName,
    shouldOverwrite,
    packageName = projectName ?? defaultProjectName,
    frameworkType,
    vueVersion,
    needsTypeScript,
    sceneType,
  } = result

  const root = path.join(cwd, targetDir)

  if (fs.existsSync(root) && shouldOverwrite) {
    emptyDir(root)
  } else if (!fs.existsSync(root)) {
    fs.mkdirSync(root)
  }

  console.log(`\n正在初始化项目 ${root}...`)

  const pkg = { name: packageName, version: '0.0.0' }
  fs.writeFileSync(
    path.resolve(root, 'package.json'),
    JSON.stringify(pkg, null, 2),
  )

  const templateRoot = path.resolve(
    __dirname,
    `templates/${frameworkType}/${vueVersion}`,
  )
  const callbacks: any[] = []

  function render(templateName) {
    const templateDir = path.resolve(templateRoot, templateName)
    renderTemplate(templateDir, root, callbacks)
  }

  // 基础模板
  render(`base`)

  // common
  if (vueVersion === 'v3') {
    render(`code/${sceneType}/common`)
  }

  // 是否使用typeScript
  render(`code/${sceneType}/${needsTypeScript ? 'typescript' : 'default'}`)

  const dataStore = {}
  for (const cb of callbacks) {
    await cb(dataStore)
  }

  const userAgent = process.env.npm_config_user_agent ?? ''
  const packageManager = /pnpm/.test(userAgent)
    ? 'pnpm'
    : /yarn/.test(userAgent)
      ? 'yarn'
      : /bun/.test(userAgent)
        ? 'bun'
        : 'npm'

  if (root !== cwd) {
    const cdProjectName = path.relative(cwd, root)
    // 进入项目目录初始化git仓库
    try {
      execSync(`git init`, { cwd: cdProjectName })
      console.log(
        `${bold(green(`Git repository initialized in ${cdProjectName}`))}`,
      )
    } catch (error) {
      console.log(`${bold(red(`Error initializing git repository: ${error}`))}`)
      process.exit(1)
    }

    console.log(`\n项目初始化完成，可执行以下命令：\n`)
    console.log(
      `  ${bold(green(`cd ${cdProjectName.includes(' ') ? `"${cdProjectName}"` : cdProjectName}`))}`,
    )
  }
  console.log(`  ${bold(green(getCommand(packageManager, 'install')))}`)
  console.log(`  ${bold(green(getCommand(packageManager, 'dev')))}`)
  console.log()
}
// #endregion

init().catch((e) => {
  console.error(e)
})
