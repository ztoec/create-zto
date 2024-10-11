/*
 * @Author: houbaoguo
 * @Date: 2024-08-09 15:17:19
 * @Description:
 * @LastEditTime: 2024-09-18 11:58:29
 * @LastEditors: houbaoguo
 */
import { createApp } from 'vue';
import App from './App.vue';
// import { i18n } from '@/i18n';
import router from '@/router';
import store from '@/store';

const app = createApp(App);

// 路由
app.use(router);

// 国际化
// app.use(i18n);

// 状态管理
app.use(store);

app.mount('#app');
