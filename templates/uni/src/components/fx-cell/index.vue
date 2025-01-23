<template>
  <view
    class="fx-cell"
    :class="{
      'is-link': isLink,
      'is-clickable': isLink || clickable,
    }"
    @click="handleClick"
  >
    <view class="fx-cell__title">
      <slot name="title">
        <text v-if="title">{{ title }}</text>
      </slot>
    </view>

    <view class="fx-cell__content">
      <slot name="content">
        <text v-if="content" class="fx-cell__text">{{ content }}</text>
      </slot>
      <view v-if="isLink" class="fx-cell__right-icon">
        <div class="i-carbon:chevron-right w-32px h-32px"></div>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  content?: string
  isLink?: boolean
  clickable?: boolean
  to?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  content: '',
  isLink: false,
  clickable: false,
  to: '',
})

const emit = defineEmits(['click'])

const handleClick = (event: MouseEvent) => {
  emit('click', event)
  if (props.to && props.isLink) {
    uni.navigateTo({
      url: props.to,
    })
  }
}
</script>

<style scoped lang="scss">
.fx-cell {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 32rpx;
  background-color: #fff;
  font-size: $font-size-base;
  line-height: 48rpx;

  &::after {
    content: '';
    position: absolute;
    left: 32rpx;
    right: 32rpx;
    bottom: 0;
    height: 2rpx;
    background-color: #eee;
    transform: scaleY(0.5);
  }

  &.is-clickable {
    cursor: pointer;

    &:active {
      background-color: #f2f3f5;
    }
  }

  &__title {
    flex: none;
    margin-right: 24rpx;
    color: #333;
  }

  &__content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    color: #666;
  }

  &__text {
    flex: 1;
    text-align: right;
  }

  &__right-icon {
    flex: none;
    margin-left: 8rpx;
    color: #969799;
    font-size: 24rpx;
  }
}
</style>
