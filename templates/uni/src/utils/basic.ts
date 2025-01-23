/*
 * @Author: houbaoguo
 * @Date: 2025-01-20 10:22:20
 * @Description:
 * @LastEditTime: 2025-01-20 10:28:59
 * @LastEditors: houbaoguo
 */
/**
 * @des 获取当前路由栈实例数组
 */
export function getCurrentPageList() {
  const pages = getCurrentPages()
  return pages
}

/**
 * @des 获取当前页面路径
 */
export function getCurrentPagePath() {
  const pages = getCurrentPageList()
  // 某些特殊情况下(比如页面进行redirectTo时的一些时机)，pages可能为空数组
  return `/${pages[pages.length - 1]?.route ?? ''}`
}
