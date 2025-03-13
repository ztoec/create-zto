/*
 * @Author: houbaoguo
 * @Date: 2025-01-21 13:32:56
 * @Description: Vue 3 Composable 路由工具
 * @LastEditTime: 2025-02-25 17:47:57
 * @LastEditors: houbaoguo
 */
import { useUserStore } from '@/store'

type RouteMode =
  | 'navigateTo'
  | 'redirectTo'
  | 'switchTab'
  | 'reLaunch'
  | 'navigateBack'
  | true

type RouteUrl = string | -1 | 'back'

interface RouteOptions {
  mode?: RouteMode
  needLogin?: boolean
}

export function useRouter() {
  const isLogin = computed(() => {
    const userStore = useUserStore()
    return userStore.access_token
  })
  const addRootPath = (url: string) => {
    return url[0] === '/' ? url : `/${url}`
  }

  // 函数重载声明
  function toHref(url: RouteUrl): void
  function toHref(url: RouteUrl, mode: RouteMode): void
  function toHref(url: RouteUrl, options: RouteOptions): void
  function toHref(url: RouteUrl, arg?: RouteMode | RouteOptions): void {
    // 参数标准化处理
    const options: RouteOptions = typeof arg === 'object'
      ? arg
      : { mode: arg as RouteMode || 'navigateTo' }

    let { mode = 'navigateTo', needLogin = false } = options

    if (needLogin && !isLogin.value) {
      uni.navigateTo({
        url: '/pages/main/login/index',
      })
      return
    }

    if (mode === true) {
      mode = 'redirectTo'
    }

    if (url === -1 || url === 'back') {
      uni.navigateBack({
        delta: 1,
      })
      return
    }

    url = addRootPath(url as string)
    const href = uni[mode] as (options: UniApp.NavigateToOptions) => void

    href({
      url,
      success: () => {
        console.log('navigate success')
      },
      fail: (res: any) => {
        console.log('navigate fail', res)
        if (res.errMsg === `${mode}:fail can not ${mode} a tabbar page`) {
          // tabbar页面需要重新跳转
          uni.switchTab({
            url,
          })
        }
      },
    })
  }

  return {
    toHref,
  }
}
