import { ElLoading } from "element-plus"

const defaultOptions = {
  lock: true,
  text: "加载中..."
}

/**
 * 传入一个函数 fn，在它执行周期内，加上「全屏」loading
 * @param fn 要执行的函数
 * @param options LoadingOptions
 * @returns 返回一个新的函数，该函数返回一个 Promise
 */
export const useFullscreenLoading = (fn, options = {}) => {
  let loadingInstance = null
  return async (...args) => {
    try {
      loadingInstance = ElLoading.service({ ...defaultOptions, ...options })
      return await fn(...args)
    } finally {
      loadingInstance?.close()
    }
  }
}
