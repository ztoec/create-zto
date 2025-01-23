/*
 * @Author: houbaoguo
 * @Date: 2025-01-21 13:32:56
 * @Description: Vue 3 Composable 路由工具
 * @LastEditTime: 2025-01-21 13:48:05
 * @LastEditors: houbaoguo
 */

type RouteMode =
  | 'navigateTo'
  | 'redirectTo'
  | 'switchTab'
  | 'reLaunch'
  | 'navigateBack'
  | true

type RouteUrl = string | -1 | 'back'

export function useRoute() {
  const addRootPath = (url: string) => {
    return url[0] == '/' ? url : '/' + url
  }

  const toHref = (url: RouteUrl, mode: RouteMode = 'navigateTo') => {
    if (mode === true) {
      mode = 'redirectTo'
    }

    if (url == -1 || url == 'back') {
      return uni.navigateBack({
        delta: 1,
      })
    }

    url = addRootPath(url as string)
    const href = uni[mode] as Function

    href({
      url,
      success: () => {
        console.log('navigate success')
      },
      fail: (res: any) => {
        console.log('navigate fail', res)
        if (res.errMsg == `${mode}:fail can not ${mode} a tabbar page`) {
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
