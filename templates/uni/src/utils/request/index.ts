/*
 * @Author: houbaoguo
 * @Date: 2025-01-17 18:03:16
 * @Description:
 * @LastEditTime: 2025-01-21 13:32:04
 * @LastEditors: houbaoguo
 */
import Request from '@/plugins/luch-request'
import requestInterceptors from './requestInterceptors'
import responseInterceptors from './responseInterceptors'
import type HttpRequest from '@/plugins/luch-request/index.d'
import type { HttpRequestConfig } from '@/plugins/luch-request/index.d'

export const request = new Request() as unknown as HttpRequest

request.setConfig((defaultConfig: HttpRequestConfig) => {
  defaultConfig.baseURL = import.meta.env.VITE_APP_API_URL

  defaultConfig.validateStatus = (statusCode) => [200, 401].includes(statusCode)
  return defaultConfig
})

requestInterceptors(request)
responseInterceptors(request)

export default request.request
