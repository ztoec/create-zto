/*
 * @Author: houbaoguo
 * @Date: 2024-08-09 15:17:19
 * @Description:
 * @LastEditTime: 2024-08-29 11:18:02
 * @LastEditors: houbaoguo
 */
import { createVitePlugins } from './build/vite/plugins';
import { resolve } from 'path';
import { type ConfigEnv, type UserConfigExport, loadEnv } from 'vite';
import { wrapperEnv } from './build/utils';

const pathResolve = (dir: string) => {
  return resolve(process.cwd(), '.', dir);
};

// https://vitejs.dev/config/
export default function ({ command, mode }: ConfigEnv): UserConfigExport {
  const isProduction = command === 'build';
  const root = process.cwd();
  const env = loadEnv(mode, root);
  const viteEnv = wrapperEnv(env);
  return {
    define: {
      'process.env': viteEnv,
    },
    root,
    resolve: {
      alias: [
        // @/xxxx => src/xxxx
        {
          find: /@\//,
          replacement: pathResolve('src') + '/',
        },
        // #/xxxx => types/xxxx
        {
          find: /#\//,
          replacement: pathResolve('types') + '/',
        },
      ],
    },
    server: {
      // 设置 host: true 才可以使用 Network 的形式，以 IP 访问项目
      host: true,
      // 端口号
      port: 4396,
      // 禁用或配置 HMR 连接（用于 HMR websocket 必须使用不同的 http 服务器地址的情况）。
      hmr: true,
      // 是否自动打开浏览器
      open: false,
      // 跨域设置允许
      cors: true,
      // 端口被占用时，是否直接退出
      strictPort: false,
      // 启用 TLS + HTTP/2
      // https: true,
      // 预热常用文件，提高初始页面加载速度
      warmup: {
        clientFiles: ["./src/layouts/**/*.vue"]
      }
    },
    // 混淆器
    /* esbuild: {
      // 打包时移除 console.log
      pure: ["console.log"],
      // 打包时移除 debugger
      drop: ["debugger"],
      // 打包时移除所有注释
      legalComments: "none"
    }, */
    plugins: createVitePlugins(viteEnv, isProduction),
    build: {
      // 单个 chunk 文件的大小超过 2048KB 时发出警告
      chunkSizeWarningLimit: 2048,
      // 启用/禁用 gzip 压缩大小报告。压缩大型输出文件可能会很慢，因此禁用该功能可能会提高大型项目的构建性能
      reportCompressedSize: false,
      // 打包后静态资源目录
      assetsDir: 'static',
      rollupOptions: {
        output: {
          /**
           * 分块策略
           * 1. 注意这些包名必须存在，否则打包会报错
           * 2. 如果你不想自定义 chunk 分割策略，可以直接移除这段配置
           */
          manualChunks: {
            vue: ["vue", "vue-router", "pinia"],
            // element: ["element-plus", "@element-plus/icons-vue"],
            // vxe: ["vxe-table", "vxe-table-plugin-element", "xe-utils"]
          }
        }
      },
      // 压缩
      minify: 'terser',
      terserOptions: {
        compress: {
          //生产环境时移除console
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import '@/styles/mixins.scss';`,
        },
      },
    },
  };
}
