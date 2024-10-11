/*
 * @Author: houbaoguo
 * @Date: 2024-08-09 15:17:19
 * @Description:
 * @LastEditTime: 2024-08-29 11:23:40
 * @LastEditors: houbaoguo
 */
import axios from 'axios';
import { showToast } from 'vant';

const service = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL + import.meta.env.VITE_BASE_API,
  withCredentials: false,
  timeout: 10000,
});

service.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

service.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.code !== 200) {
      showToast(res.msg);
      return Promise.reject(res.msg || 'Error');
    } else {
      return res;
    }
  },
  (error) => {
    console.log('err' + error);
    showToast(error.message);
    return Promise.reject(error.message);
  },
);

export default service;
