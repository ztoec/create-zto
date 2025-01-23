import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

const pinia = createPinia()
const piniaPersist = createPersistedState({
  storage: {
    getItem: uni.getStorageSync,
    setItem: uni.setStorageSync,
  },
})

pinia.use(piniaPersist)
// 导出pinia实例
export default pinia

// 导出所有store模块
export * from './modules/user'
export * from './modules/task'
