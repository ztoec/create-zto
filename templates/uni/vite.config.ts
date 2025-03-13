/*
 * @Author: houbaoguo
 * @Date: 2024-11-29 20:28:52
 * @Description:
 * @LastEditTime: 2025-01-20 10:08:36
 * @LastEditors: houbaoguo
 */
import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import UnoCSS from 'unocss/vite'
import { fileURLToPath, URL } from 'node:url'
// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    plugins: [
      // 组件自动引入放在uni插件之前：https://github.com/dcloudio/uni-app/issues/3057
      Components({
        dts: 'types/components.d.ts',
      }),
      (uni as any).default(),
      UnoCSS(),
      AutoImport({
        imports: ['vue', 'uni-app', 'pinia'],
        dts: 'types/auto-imports.d.ts',
        vueTemplate: true,
        dirs: ['src/composables'],
      }),
    ],
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          silenceDeprecations: ['legacy-js-api'],
          additionalData: `@use "@/styles/variable.scss" as *;@use "@/styles/index.scss" as *;`,
        },
      },
    },
    esbuild: {
      drop:
        process.env.NODE_ENV === 'production'
          ? ['console' as const, 'debugger' as const]
          : [],
    },
  }
})
