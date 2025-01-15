<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const { currentRoute } = useRouter();
const layoutName = computed(() => currentRoute.value.meta.layout || 'DefaultLayout');
</script>
<template>
  <component :is="layoutName">
    <slot />
  </component>
</template>
