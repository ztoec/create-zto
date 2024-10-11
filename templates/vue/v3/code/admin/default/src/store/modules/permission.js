import { ref } from "vue"
import { defineStore } from "pinia"
import { constantRoutes, asyncRoutes } from "@/router"
import { flatMultiLevelRoutes } from "@/router/helper"
import routeSettings from "@/config/route"
import store from ".."

const hasPermission = (roles, route) => {
  const routeRoles = route.meta?.roles
  return routeRoles ? roles.some((role) => routeRoles.includes(role)) : true
}

export class PermissionService {
  filterAsyncRoutes(routes, roles) {
    const res = []
    routes.forEach((route) => {
      const tempRoute = { ...route }
      if (hasPermission(roles, tempRoute)) {
        if (tempRoute.children) {
          tempRoute.children = this.filterAsyncRoutes(tempRoute.children, roles)
        }
        res.push(tempRoute)
      }
    })
    return res
  }

  setRoutes(roles) {
    const accessedRoutes = routeSettings.async ? this.filterAsyncRoutes(asyncRoutes, roles) : asyncRoutes
    const finalRoutes = constantRoutes.concat(accessedRoutes)
    return routeSettings.thirdLevelRouteCache ? flatMultiLevelRoutes(finalRoutes) : finalRoutes
  }
}

export const usePermissionStore = defineStore("permission", () => {
  const routes = ref([])
  const dynamicRoutes = ref([])
  const permissionService = new PermissionService()

  const setRoutes = (roles) => {
    const accessedRoutes = permissionService.setRoutes(roles)
    routes.value = accessedRoutes
    dynamicRoutes.value = flatMultiLevelRoutes(accessedRoutes)
  }

  return { routes, dynamicRoutes, setRoutes }
})

/** 在 setup 外使用 */
export function usePermissionStoreHook() {
  return usePermissionStore(store)
}
