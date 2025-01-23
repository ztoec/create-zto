/*
 * @Author: houbaoguo
 * @Date: 2025-01-20 10:48:22
 * @Description:
 * @LastEditTime: 2025-01-21 12:54:12
 * @LastEditors: houbaoguo
 */
import { request } from '@/utils/request'
import type { ResponseData, LoginRes } from '@/api/types/index'

export const login = (params: AnyObject, config?: AnyObject) =>
  request.post<ResponseData<LoginRes>>(
    '/xxx/xx',
    params,
    config
  )
