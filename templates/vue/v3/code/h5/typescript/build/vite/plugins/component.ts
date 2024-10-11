/*
 * @Author: houbaoguo
 * @Date: 2024-08-09 15:17:19
 * @Description:
 * @LastEditTime: 2024-08-28 16:06:02
 * @LastEditors: houbaoguo
 */
/**
 * @name  AutoRegistryComponents
 * @description 按需加载，自动引入组件
 */

import Components from 'unplugin-vue-components/vite';
import { VueUseComponentsResolver, VantResolver, VarletUIResolver } from 'unplugin-vue-components/resolvers';

const NutUIResolver = () => {
  return (name) => {
    if (name.startsWith('Nut')) {
      const partialName = name.slice(3);
      return {
        name: partialName,
        from: '@nutui/nutui',
        sideEffects: `@nutui/nutui/dist/packages/${partialName.toLowerCase()}/style`,
      };
    }
  };
};

export const AutoRegistryComponents = () => {
  return Components({
    // dirs: ['src/components'],
    extensions: ['vue', 'md'],
    deep: true,
    dts: 'types/components.d.ts',
    directoryAsNamespace: false,
    globalNamespaces: [],
    directives: true,
    include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
    exclude: [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/, /[\\/]\.nuxt[\\/]/],
    resolvers: [VueUseComponentsResolver(), VantResolver(), VarletUIResolver(), NutUIResolver()],
  });
};
