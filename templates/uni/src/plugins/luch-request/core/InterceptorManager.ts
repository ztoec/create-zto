/*
 * @Author: houbaoguo
 * @Date: 2025-01-17 20:57:11
 * @Description:
 * @LastEditTime: 2025-01-20 09:34:39
 * @LastEditors: houbaoguo
 */
'use strict'

interface Handler {
  fulfilled: Function
  rejected: Function
}

export interface IInterceptorManager {
  handlers: (Handler | null)[]
  use(fulfilled: Function, rejected: Function): number
  reject(id: number): void
  forEach(fn: Function): void
}

class InterceptorManager implements IInterceptorManager {
  handlers: (Handler | null)[] = []

  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(fulfilled: Function, rejected: Function): number {
    this.handlers.push({
      fulfilled,
      rejected,
    })
    return this.handlers.length - 1
  }

  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   */
  reject(id: number): void {
    if (this.handlers[id]) {
      this.handlers[id] = null
    }
  }

  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   */
  forEach(fn: Function): void {
    this.handlers.forEach((h) => {
      if (h !== null) {
        fn(h)
      }
    })
  }
}

export default InterceptorManager
