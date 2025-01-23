/*
 * @Author: houbaoguo
 * @Date: 2025-01-21 10:34:51
 * @Description:
 * @LastEditTime: 2025-01-21 10:59:11
 * @LastEditors: houbaoguo
 */
export interface ResponseData<T> {
  code: number
  bizCode: number | string | null
  data: T
  msg: string
  traceId: string
}

export interface LoginRes {
  access_token: string
}
