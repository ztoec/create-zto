import { loginPassword } from '@/api';
import { useCookies } from '@vueuse/integrations/useCookies';
import { defineStore } from 'pinia';

const { VITE_TOKEN_KEY } = import.meta.env;
const token = useCookies().get(VITE_TOKEN_KEY);

export const useUserStore = defineStore({
  id: 'app-user',
  state: () => ({
    token: token,
    info: {},
  }),
  getters: {
    getUserInfo() {
      return this.info || {};
    },
  },
  actions: {
    setInfo(info) {
      this.info = info ? info : '';
    },
    login() {
      return new Promise((resolve) => {
        loginPassword().then((res) => {
          this.setInfo(res);
          resolve(res);
        });
      });
    },
  },
  persist: {
    key: 'token',
    storage: localStorage,
    paths: ['token'],
  },
});
