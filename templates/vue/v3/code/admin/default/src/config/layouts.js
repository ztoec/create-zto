import { getConfigLayout } from "@/utils/cache/local-storage"

/** 默认配置 */
export const defaultSettings = {
  /** 系统名称 */
  systemName: "后台管理系统模板",
  /** 是否显示 Settings Panel */
  showSettings: false,
  // 布局模式 left" | "top" | "left-top
  layoutMode: "left",
  // 是否显示标签栏
  showTagsView: true,
  // 是否显示 Logo
  showLogo: false,
  // 是否固定 Header
  fixedHeader: true,
  // 是否显示页脚 Footer
  showFooter: true,
  // 是否显示消息通知
  showNotify: true,
  // 是否显示切换主题按钮
  showThemeSwitch: true,
  // 是否显示全屏按钮
  showScreenfull: true,
  // 是否显示搜索按钮
  showSearchMenu: true,
  // 开启系统水印
  showWatermark: true,
  // 是否显示灰色模式
  showGreyMode: false,
  // 是否显示色弱模式
  showColorWeakness: false,
  // 是否缓存标签栏
  cacheTagsView: false,
}

/** 项目配置 */
export const layoutSettings = { ...defaultSettings, ...getConfigLayout() }
