import dayjs from "dayjs"
import { removeConfigLayout } from "@/utils/cache/local-storage"

/** 
 * @param {string | number | Date} time
 * @returns {string}
 * @description 格式化时间
*/
export const formatDateTime = (time) => {
  return time ? dayjs(new Date(time)).format("YYYY-MM-DD HH:mm:ss") : "N/A"
}

/** 
 * @param {string} cssVariableName 
 * @returns {string}
 * @description 获取 CSS 变量值
 */
export const getCssVariableValue = (cssVariableName) => {
  let cssVariableValue = ""
  try {
    // 没有拿到值时，会返回空串
    cssVariableValue = getComputedStyle(document.documentElement).getPropertyValue(cssVariableName)
  } catch (error) {
    console.error(error)
  }
  return cssVariableValue
}

/** 
 * @param {string} cssVariableName
 * @param {string} cssVariableValue
 * @description 用 JS 设置全局 CSS 变量
 */
export const setCssVariableValue = (cssVariableName, cssVariableValue) => {
  try {
    document.documentElement.style.setProperty(cssVariableName, cssVariableValue)
  } catch (error) {
    console.error(error)
  }
}

/** 重置项目配置 */
export const resetConfigLayout = () => {
  removeConfigLayout()
  location.reload()
}
