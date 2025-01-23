<template>
  <!-- 内置组件不支持v-bind，需要某个原生属性需要手动传递一下 -->
  <button
    :class="[
      'fx-button',
      {
        'is-plain': plain,
        'is-block': block,
        'is-round': round,
        'is-square': square,
        'is-disabled': disabled,
      },
    ]"
    :disabled="disabled"
    :open-type="openType"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import type { ButtonOpenType } from '@uni-helper/uni-app-types/index'

interface Props {
  plain?: boolean
  block?: boolean
  round?: boolean
  square?: boolean
  disabled?: boolean
  customStyle?: Record<string, string>
  openType?: ButtonOpenType
}

const props = withDefaults(defineProps<Props>(), {
  plain: false,
  block: false,
  round: false,
  square: false,
  disabled: false,
})

const emit = defineEmits(['click'])

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit('click', event)
  }
}
</script>

<style scoped lang="scss">
.fx-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 16rpx 32rpx;
  font-size: 24rpx;
  border: 2rpx solid transparent;
  border-radius: 8rpx;
  transition: all 0.2s ease;
  cursor: pointer;
  background-color: var(--fx-primary-color);
  color: #fff;

  &:hover {
    background-color: var(--fx-primary-hover-color);
  }

  &:active {
    background-color: var(--fx-primary-active-color);
  }

  // 块级按钮
  &.is-block {
    width: 100%;
    display: flex;
  }

  // 朴素按钮
  &.is-plain {
    background-color: transparent;
    border-color: var(--fx-primary-color);
    color: var(--fx-primary-color);

    &:hover {
      background-color: rgba($primary-color, 0.1);
    }

    &:active {
      background-color: rgba($primary-color, 0.2);
    }
  }

  // 圆形按钮
  &.is-round {
    border-radius: 999px;
  }

  // 方形按钮
  &.is-square {
    border-radius: 0;
  }

  // 禁用状态
  &.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;

    &:hover,
    &:active {
      background-color: var(--fx-primary-color);
    }

    &.is-plain {
      &:hover,
      &:active {
        background-color: transparent;
      }
    }
  }
}
</style>
