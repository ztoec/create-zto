/*
 * @Author: houbaoguo
 * @Date: 2025-01-17 17:50:52
 * @Description:
 * @LastEditTime: 2025-01-21 13:31:32
 * @LastEditors: houbaoguo
 */
import adapter from '../adapters/index'
import type { HttpRequestConfig } from '@/plugins/luch-request/index.d'
export default (config: HttpRequestConfig) => adapter(config)
