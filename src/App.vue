<script setup lang="ts">
import { LayoutView } from './layouts/core';
import { Toaster } from 'vue-sonner';
import { useDevice } from './composables/useDevice';
const { isMobile } = useDevice();
</script>

<template>
  <LayoutView>
    <RouterView v-slot="{ Component }">
      <Transition name="router-slide" mode="out-in">
        <component :key="$route.path" :is="Component" />
      </Transition>

      <Toaster
        :position="isMobile ? 'bottom-center' : 'bottom-right'"
        :expand="true"
        rich-colors
      />
    </RouterView>
  </LayoutView>
</template>
