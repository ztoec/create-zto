export default {
  // 明确指定只处理根目录的文件
  './*.{js,ts,vue,json}': ['prettier --write'],
  // 显式忽略 templates 目录
  'templates/**/*': () => [],
}
