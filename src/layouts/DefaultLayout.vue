<script setup lang="ts">
import { useDevice } from '@/composables/useDevice';

import MainHeader from '@/components/Default/MainHeader/MainHeader.vue';
import MobileNavigation from '@/components/Default/MainHeader/MobileNavigation/MobileNavigation.vue';
import MainFooter from '@/components/Default/MainFooter/MainFooter.vue';

const { isMobile } = useDevice();
</script>

<template>
  <div class="default-layout">
    <MainHeader />
    <MobileNavigation v-if="isMobile" />
    <slot />
    <MainFooter />
  </div>
</template>
