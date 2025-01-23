/**
 * @des 任务队列  支持取消
 * 接口 request 队列
 * 国密 sm2 sm4 加解密队列
 */
import store from '@/store'
export const useTaskStore = defineStore('task', () => {
  // 接口白名单,在白名单内的接口不会被 all 跟页面取消, 必须一对一取消
  const taskWhiteList = ref([
    '/basic/getCryptoUrl',
    '/member/user/getAuthResult',
  ])

  // 所有未完成的接口请求列表
  const pagesRequestTaskList = reactive<
    Record<string, Array<{ url: string; task: any }>>
  >(uni.getStorageSync('zto_basic_pagesRequestTaskList') || {})

  // 添加新的 Request task
  function setRequestTask(params: { cpath: string; url: string; task: any }) {
    let { cpath, url, task } = params
    if (cpath === '/') cpath = 'APP_BASIC'

    if (!pagesRequestTaskList[cpath]) pagesRequestTaskList[cpath] = []
    pagesRequestTaskList[cpath].push({ url, task })

    uni.setStorageSync('zto_basic_pagesRequestTaskList', pagesRequestTaskList)
  }

  // 取消接口队列
  function removeRequestTask(
    params: 'all' | { type: 'path' | 'single'; path: string; url?: string }
  ) {
    try {
      if (params === 'all') {
        // 取消所有接口请求
        Object.entries(pagesRequestTaskList).forEach(([key, taskList]) => {
          taskList?.forEach((item) => {
            if (!taskWhiteList.value.includes(item.url)) {
              item?.task?.abort?.()
            }
          })
        })

        Object.keys(pagesRequestTaskList).forEach(
          (key) => delete pagesRequestTaskList[key]
        )
        uni.setStorageSync('zto_basic_pagesRequestTaskList', {})
        return
      }

      // 取消页面相关接口
      if (['path', 'single'].includes(params.type) && params.path) {
        const path = params.path === '/' ? 'APP_BASIC' : params.path
        const taskList = pagesRequestTaskList[path] || []

        for (let i = taskList.length - 1; i >= 0; i--) {
          const item = taskList[i]
          if (
            params.type === 'path' ||
            (params.type === 'single' && params.url && item?.url === params.url)
          ) {
            if (taskWhiteList.value.includes(item.url)) continue
            item?.task?.abort?.()
            taskList.splice(i, 1)
          }
        }

        if (taskList.length === 0) {
          delete pagesRequestTaskList[path]
        }

        uni.setStorageSync(
          'zto_basic_pagesRequestTaskList',
          pagesRequestTaskList
        )
      }
    } catch (error) {
      console.log('store/REMOVE_REQUEST_TASK/error', error)
    }
  }

  return {
    taskWhiteList,
    pagesRequestTaskList,
    setRequestTask,
    removeRequestTask,
  }
})

export function useTaskStoreHook() {
  return useTaskStore(store)
}
