import * as fs from 'node:fs'
import * as path from 'node:path'
import { pathToFileURL } from 'node:url'

import deepMerge from './deepMerge'
import sortDependencies from './sortDependencies'

/**
 * 将模板文件夹/文件渲染到文件系统中，通过递归复制`src`目录下的所有文件。
 * 处理以下特殊情况：
 *   - `_filename`应重命名为`.filename`
 *   - `package.json`中的字段应递归合并
 * @param {string} src - 要复制的源文件或目录
 * @param {string} dest - 复制操作的目标文件或目录
 * @param {Array<Function>} callbacks - 用于存储回调函数的数组
 */
function renderTemplate(src, dest, callbacks) {
  // 获取源路径的文件统计信息
  const stats = fs.statSync(src)

  // 如果是目录，则递归处理子目录和文件
  if (stats.isDirectory()) {
    // 跳过 node_modules 目录
    if (path.basename(src) === 'node_modules') {
      return
    }

    // 创建目标目录（如果不存在）
    fs.mkdirSync(dest, { recursive: true })

    // 读取源目录中的文件和子目录
    for (const file of fs.readdirSync(src)) {
      // 递归调用 renderTemplate 处理子目录和文件
      renderTemplate(
        path.resolve(src, file),
        path.resolve(dest, file),
        callbacks,
      )
    }
    return
  }

  // 获取文件名
  const filename = path.basename(src)

  // 如果文件是 package.json 并且目标位置已存在，则合并
  if (filename === 'package.json' && fs.existsSync(dest)) {
    // 读取目标和源的 package.json 文件
    const existing = JSON.parse(fs.readFileSync(dest, 'utf8'))
    const newPackage = JSON.parse(fs.readFileSync(src, 'utf8'))

    // 合并并排序依赖项
    const pkg = sortDependencies(deepMerge(existing, newPackage))

    // 写入合并后的 package.json 到目标位置
    fs.writeFileSync(dest, JSON.stringify(pkg, null, 2) + '\n')
    return
  }

  // 合并 extensions.json 文件
  if (filename === 'extensions.json' && fs.existsSync(dest)) {
    const existing = JSON.parse(fs.readFileSync(dest, 'utf8'))
    const newExtensions = JSON.parse(fs.readFileSync(src, 'utf8'))
    const extensions = deepMerge(existing, newExtensions)
    fs.writeFileSync(dest, JSON.stringify(extensions, null, 2) + '\n')
    return
  }

  // 合并 settings.json 文件
  if (filename === 'settings.json' && fs.existsSync(dest)) {
    const existing = JSON.parse(fs.readFileSync(dest, 'utf8'))
    const newSettings = JSON.parse(fs.readFileSync(src, 'utf8'))
    const settings = deepMerge(existing, newSettings)
    fs.writeFileSync(dest, JSON.stringify(settings, null, 2) + '\n')
    return
  }

  // 如果文件名以 "_" 开头，则重命名为以 "." 开头
  if (filename.startsWith('_')) {
    dest = path.resolve(path.dirname(dest), filename.replace(/^_/, '.'))
  }

  // 如果是 _gitignore 文件并且目标位置已存在，则追加内容
  if (filename === '_gitignore' && fs.existsSync(dest)) {
    const existing = fs.readFileSync(dest, 'utf8')
    const newGitignore = fs.readFileSync(src, 'utf8')
    fs.writeFileSync(dest, existing + '\n' + newGitignore)
    return
  }

  // 处理以 .data.mjs 结尾的数据文件
  if (filename.endsWith('.data.mjs')) {
    // 使用目标路径作为数据存储的键
    dest = dest.replace(/\.data\.mjs$/, '')

    // 将回调函数添加到数组中，以便在处理模板文件时使用
    callbacks.push(async (dataStore) => {
      const getData = (await import(pathToFileURL(src).toString())).default

      // 虽然当前 getData 是同步的，但我们仍然保留异步的可能性
      dataStore[dest] = await getData({
        oldData: dataStore[dest] || {},
      })
    })

    return // 跳过复制数据文件
  }

  // 默认情况下复制文件
  fs.copyFileSync(src, dest)
}

export default renderTemplate // 导出 renderTemplate 函数
