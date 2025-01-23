import type { Preset, SourceCodeTransformer } from 'unocss'
import {
  defineConfig,
  presetIcons,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

import presetWeapp from 'unocss-preset-weapp'
import {
  extractorAttributify,
  transformerClass,
} from 'unocss-preset-weapp/transformer'
import remToRpxPreset from './rem-to-rpx'

const { presetWeappAttributify, transformerAttributify } =
  extractorAttributify()

export default defineConfig({
  presets: [
    presetWeapp() as Preset,
    presetWeappAttributify() as Preset,
    remToRpxPreset({ baseFontSize: 4 }) as Preset,
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
      },
    }),
  ],
  /**
   * 自定义快捷语句
   * @see https://github.com/unocss/unocss#shortcuts
   */
  shortcuts: {},
  transformers: [
    // 启用 @apply 功能
    transformerDirectives({
      enforce: 'pre',
    }),
    // 启用 () 分组功能
    transformerVariantGroup(),
    transformerAttributify() as unknown as SourceCodeTransformer,
    transformerClass() as unknown as SourceCodeTransformer,
  ],
  rules: [
    [
      'p-safe',
      {
        padding:
          'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)',
      },
    ],
    ['pt-safe', { 'padding-top': 'env(safe-area-inset-top)' }],
    ['pb-safe', { 'padding-bottom': 'env(safe-area-inset-bottom)' }],
  ],
})
