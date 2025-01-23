/*
 * @Author: houbaoguo
 * @Date: 2025-01-17 18:03:16
 * @Description:
 * @LastEditTime: 2025-01-21 13:32:27
 * @LastEditors: houbaoguo
 */
import clone from '@/plugins/luch-request/utils/clone'
import type HttpRequest from '@/plugins/luch-request/index.d'
import type { HttpResponse } from '@/plugins/luch-request/index.d'
import { useTaskStore } from '@/store/modules/task'

/**
 * 响应拦截
 * @param {Object} http
 */

export default (request: HttpRequest) => {
  request.interceptors.response.use(
    async (response: HttpResponse) => {
      const taskStore = useTaskStore()
      // console.log('response', response)
      /* 对响应成功做点什么 可使用async await 做异步操作*/
      taskStore.removeRequestTask({
        type: 'single',
        path: response.config.header?.TASK_PATH ?? '',
        url: response.config.url ?? '',
      })
      
      // 1.登录态过期 跳转登录
      // 自定义参数
      let custom = response.config?.custom
      if (response.statusCode == 401) {
        // 401
      }

      if (data.code !== 0) {
        if (!custom || !Object.keys(custom).length) {
          //无自定义默认对报错进行toast弹出提示
          // TODO: 需要根据code码进行提示
          uni.showToast({
            title: data?.msg || '系统繁忙,请稍后重试',
            icon: 'none',
          })
        }

        return Promise.reject(data)
      }
      
      return data
    },
    (response) => {
      /*  对响应错误做点什么 （statusCode !== 200）*/
      if (response.statusCode == 500) {
        // TODO: 需要根据code码进行提示
        // uni.$zt.toast('系统繁忙,请稍后重试')
      }
      return Promise.reject(response)
    }
  )
}
