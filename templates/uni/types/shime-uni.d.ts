/*
 * @Author: houbaoguo
 * @Date: 2024-11-29 20:28:52
 * @Description:
 * @LastEditTime: 2025-01-18 02:09:47
 * @LastEditors: houbaoguo
 */
/// <reference types='@dcloudio/types' />

declare module 'vue' {
  type Hooks = App.AppInstance & Page.PageInstance
  interface ComponentCustomOptions extends Hooks {}
}

import 'vue'

declare module '@vue/runtime-core' {
  type Hooks = App.AppInstance & Page.PageInstance

  interface ComponentCustomOptions extends Hooks {}
}
