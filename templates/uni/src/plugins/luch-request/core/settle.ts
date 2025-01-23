/*
 * @Author: houbaoguo
 * @Date: 2025-01-17 17:50:52
 * @Description:
 * @LastEditTime: 2025-01-20 09:39:11
 * @LastEditors: houbaoguo
 */
/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
export default function settle(
  resolve: Function,
  reject: Function,
  response: any
) {
  const { validateStatus } = response.config
  const status = response.statusCode
  if (status && (!validateStatus || validateStatus(status))) {
    resolve(response)
  } else {
    reject(response)
  }
}
