export default function sortDependencies(packageJson) {
  packageJson = sortPackageJson(packageJson)

  const sorted = {}

  const depTypes = [
    'dependencies',
    'devDependencies',
    'resolutions',
    'peerDependencies',
    'optionalDependencies',
  ]

  for (const depType of depTypes) {
    if (packageJson[depType]) {
      sorted[depType] = {}

      Object.keys(packageJson[depType])
        .sort()
        .forEach((name) => {
          sorted[depType][name] = packageJson[depType][name]
        })
    }
  }

  return {
    ...packageJson,
    ...sorted,
  }
}

/**
 * 将动态生成的 package.json 数据按常规的格式排序
 * @param {Object} packageData 动态生成的 package.json 数据
 * @returns {Object} 排序后的 package.json 数据
 */
function sortPackageJson(packageData) {
  // 定义 package.json 的标准字段顺序
  const standardOrder = [
    'name',
    'version',
    'description',
    'type',
    'main',
    'scripts',
    'dependencies',
    'devDependencies',
    'peerDependencies',
    'optionalDependencies',
    'engines',
    'author',
    'license',
    'repository',
    'bugs',
    'homepage',
  ]

  // 新的排序后的 package.json 对象
  const sortedPackageJson = {}

  // 按照标准顺序添加字段
  standardOrder.forEach((key) => {
    if (packageData[key]) {
      sortedPackageJson[key] = packageData[key]
    }
  })

  // 处理标准顺序之外的字段
  Object.keys(packageData)
    .filter((key) => !standardOrder.includes(key))
    .sort()
    .forEach((key) => {
      sortedPackageJson[key] = packageData[key]
    })

  return sortedPackageJson
}
