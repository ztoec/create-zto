<!--
 * @Author: houbaoguo
 * @Date: 2024-08-09 15:17:19
 * @Description: 
 * @LastEditTime: 2024-08-29 10:50:53
 * @LastEditors: houbaoguo
-->
<template>
  <router-view v-slot="{ Component }">
    <keep-alive :include="cachedViews">
      <component :is="Component" :key="$route.path" />
    </keep-alive>
  </router-view>
</template>

<script lang="ts" setup name="BasicLayoutPage">
  const route = useRoute();

  // 递归遍历所有匹配的路由及其子路由，收集需要缓存的组件名称
  const getCachedViews = (matchedRoutes) => {
    let cachedViews: string[] = [];
    matchedRoutes.forEach((routeRecord) => {
      if (routeRecord?.meta?.keepAlive) {
        cachedViews.push(routeRecord.name);
      }
      if (routeRecord?.children) {
        cachedViews = cachedViews.concat(getCachedViews(routeRecord.children));
      }
    });
    return cachedViews;
  };

  const cachedViews = computed(() => getCachedViews(route.matched));

  console.log('🚀 ~ cachedViews ~ cachedViews:', cachedViews);
</script>

<style scoped lang="scss"></style>
