<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const { currentRoute } = useRouter();

const layoutName = computed(() => {
  return currentRoute.value.meta.layout;
});
</script>
<template>
  <Transition name="router-slide" mode="out-in">
    <component :key="$route.path" :is="layoutName">
      <slot />
    </component>
  </Transition>
</template>
