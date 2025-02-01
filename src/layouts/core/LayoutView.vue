<script setup lang="ts">
// import { computed } from 'vue';
// import { useRouter } from 'vue-router';

// const { currentRoute } = useRouter();
// const layoutName = computed(() => currentRoute.value.meta.layout || 'DefaultLayout');

import { computed } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'vue-router';

const { currentRoute } = useRouter();

const userStore = useUserStore();

const layoutName = computed(() => {
  if (userStore.isAuthenticated) {
    return currentRoute.value.meta.layout || 'DefaultLayout';
  }
  return 'LoginLayout';
});
</script>
<template>
  <Transition name="router-slide" mode="out-in">
    <component :key="$route.path" :is="layoutName">
      <slot />
    </component>
  </Transition>
</template>
