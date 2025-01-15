<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const { currentRoute } = useRouter();
const layoutName = computed(() => {
  if (currentRoute.value.meta.layout) {
    return currentRoute.value.meta.layout;
  }

  return 'DefaultLayout';
});
</script>
<template>
  <component :is="layoutName">
    <slot />
  </component>
</template>
