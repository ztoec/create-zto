/*
 * @Author: houbaoguo
 * @Date: 2024-07-30 17:45:17
 * @Description:
 * @LastEditTime: 2024-07-30 17:54:58
 * @LastEditors: houbaoguo
 */
import { defineStore } from "pinia"
import { useUserStore } from "./user"
import { LoginService } from "@/api/login"
import { ILoginService, type LoginRequestData } from "@/api/login/types/login"
import { setToken } from "@/utils/cache/cookies"
import routeSettings from "@/config/route"

const loginService: ILoginService = new LoginService()
/**
 * 用户认证状态管理
 */
export const useAuthStore = defineStore("auth", () => {
  const userStore = useUserStore()

  /**
   * 用户登录
   * @param {LoginRequestData} loginData - 登录请求数据
   */
  const login = async (loginData: LoginRequestData) => {
    const { data } = await loginService.loginApi(loginData)
    userStore.token = data.token
    setToken(data.token)
  }

  /**
   * 获取用户信息
   */
  const getInfo = async () => {
    const { data } = await loginService.getUserInfoApi()
    userStore.username = data.username
    // 验证返回的 roles 是否为一个非空数组，否则塞入一个没有任何作用的默认角色，防止路由守卫逻辑进入无限循环
    userStore.roles = data.roles?.length > 0 ? data.roles : routeSettings.defaultRoles
  }

  return { login, getInfo }
})

export function useAuthStoreHook() {
  return useAuthStore()
}
