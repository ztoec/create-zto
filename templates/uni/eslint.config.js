import antfu from '@antfu/eslint-config'

export default antfu({
  unocss: true,
  ignores: ['./dist/*'],
  rules: {
    'antfu/if-newline': 'off',
  },
})
