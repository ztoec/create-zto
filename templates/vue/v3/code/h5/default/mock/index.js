
export default [
  {
    url: '/api/login',
    method: 'post',
    response: ({ body, query }) => {
      console.log('body>>>>>>>>', body);
      console.log('query>>>>>>>>', query);
      return {
        code: 200,
        message: 'ok',
        data: { name: 'Evan', age: 26 },
      };
    },
  },
]
