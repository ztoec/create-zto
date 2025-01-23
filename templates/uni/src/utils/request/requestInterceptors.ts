/*
 * @Author: houbaoguo
 * @Date: 2025-01-17 18:03:16
 * @Description:
 * @LastEditTime: 2025-01-21 13:32:19
 * @LastEditors: houbaoguo
 */
/**
 * 请求拦截
 * @param {Object} http
 */
import { useUserStore } from '@/store'
import type { HttpRequestConfig } from '@/plugins/luch-request/index.d'
import type HttpRequest from '@/plugins/luch-request/index.d'

export default (request: HttpRequest) => {
  const userStore = useUserStore()
  request.interceptors.request.use(
    async (config: HttpRequestConfig) => {
      config.header.Authorization = `Bearer ${userStore.access_token}`
      // 可使用async await 做异步操作
      // 初始化请求拦截器时，会执行此方法，此时data为undefined，赋予默认{}
      config.data = config.data || {}

    },
    (
      config // 可使用async await 做异步操作
    ) => Promise.reject(config)
  )
}
