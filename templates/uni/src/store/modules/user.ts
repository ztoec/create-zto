/*
 * @Author: houbaoguo
 * @Date: 2025-01-17 15:09:13
 * @Description:
 * @LastEditTime: 2025-01-21 12:44:15
 * @LastEditors: houbaoguo
 */
import { login } from '@/api/inedx'
import store from '@/store'

export const useUserStore = defineStore(
  'user',
  () => {
    const access_token = ref('')

    async function loginHandle(mobile: string, password: string) {
      const res = await login({
        mobile,
        password
      })
      access_token.value = res.data.access_token
      console.log('res', res.data)
    }
    return {
      access_token,
      loginHandle,
    }
  },
  {
    persist: true,
  }
)

export function useUserStoreHook() {
  return useUserStore(store)
}
