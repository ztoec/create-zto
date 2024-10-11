/*
 * @Author: houbaoguo
 * @Date: 2024-08-09 15:17:19
 * @Description:
 * @LastEditTime: 2024-09-18 10:06:31
 * @LastEditors: houbaoguo
 */
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import basicLayout from '@/layout/basic/index.vue';
let routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home',
    component: basicLayout,
    children: [
      {
        path: 'home',
        component: () => import('@/views/home/index.vue'),
        meta: { title: '首页' }, // meta.keepAlive 控制是否缓存页面
      },
    ],
  },
];

// 动态加载模块路由
const modules = import.meta.glob<{ default: RouteRecordRaw[] }>('./modules/*.ts', { eager: true });
for (const path in modules) {
  const module = modules[path];
  routes = routes.concat(module.default);
}

// 添加 404 页面, 必须放在最后
routes.push({
  path: '/:pathMatch(.*)',
  redirect: '/',
});

// 创建路由实例
const router = createRouter({
  history: createWebHistory(process.env.VITE_PUBLIC_PATH),
  routes,
});

router.beforeEach(async (_to, _from, next) => {
  next();
});

export default router;
