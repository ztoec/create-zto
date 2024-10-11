const SYSTEM_NAME = "v3-admin-vite"

/** 缓存数据时用到的 Key */
const  CacheKey = {
  TOKEN: `${SYSTEM_NAME}-token-key`,
  CONFIG_LAYOUT: `${SYSTEM_NAME}-config-layout-key`,
  SIDEBAR_STATUS: `${SYSTEM_NAME}-sidebar-status-key`,
  ACTIVE_THEME_NAME: `${SYSTEM_NAME}-active-theme-name-key`,
  VISITED_VIEWS: `${SYSTEM_NAME}-visited-views-key`,
  CACHED_VIEWS: `${SYSTEM_NAME}-cached-views-key`
}

export default CacheKey
