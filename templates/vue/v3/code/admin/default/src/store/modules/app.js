import { reactive, ref, watch } from "vue"
import { defineStore } from "pinia"
import { getSidebarStatus, setSidebarStatus } from "@/utils/cache/local-storage"
import { SIDEBAR_OPENED, SIDEBAR_CLOSED, DeviceEnum } from "@/constants/app-key"

/** 设置侧边栏状态本地缓存 */
function handleSidebarStatus(opened) {
  opened ? setSidebarStatus(SIDEBAR_OPENED) : setSidebarStatus(SIDEBAR_CLOSED)
}

export const useAppStore = defineStore("app", () => {
  /** 侧边栏状态 */
  const sidebar = reactive({
    opened: getSidebarStatus() !== SIDEBAR_CLOSED,
    withoutAnimation: false
  })
  /** 设备类型 */
  const device = ref(DeviceEnum.Desktop)

  /** 监听侧边栏 opened 状态 */
  watch(
    () => sidebar.opened,
    (opened) => handleSidebarStatus(opened)
  )

  /** 切换侧边栏 */
  const toggleSidebar = (withoutAnimation) => {
    sidebar.opened = !sidebar.opened
    sidebar.withoutAnimation = withoutAnimation
  }
  /** 关闭侧边栏 */
  const closeSidebar = (withoutAnimation) => {
    sidebar.opened = false
    sidebar.withoutAnimation = withoutAnimation
  }
  /** 切换设备类型 */
  const toggleDevice = (value) => {
    device.value = value
  }

  return { device, sidebar, toggleSidebar, closeSidebar, toggleDevice }
})
