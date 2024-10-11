import { MockMethod, Recordable } from 'vite-plugin-mock';

interface response {
  body: Recordable;
  query: Recordable;
}

export default [
  {
    url: '/users/login',
    method: 'post',
    response: ({ body, query }: response) => {
      console.log('body>>>>>>>>', body);
      console.log('query>>>>>>>>', query);
      return {
        code: 0,
        message: 'ok',
        data: { token: '123456' },
      };
    },
  },
  {
    url: '/users/info',
    method: 'get',
    response: ({ body, query }: response) => {
      console.log('body>>>>>>>>', body);
      console.log('query>>>>>>>>', query);
      return {
        code: 0,
        message: 'ok',
        data: { name: '测试', role: ['admin'] },
      };
    },
  },
] as MockMethod[];
