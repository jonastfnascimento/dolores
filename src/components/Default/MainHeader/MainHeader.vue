<script setup lang="ts">
import { RouterLink } from 'vue-router';

import { useDevice } from '@/composables/useDevice';

import GoToBackButton from './GoToBackButton/GoToBackButton.vue';
import DesktopNavigation from './DesktopNavigation/DesktopNavigation.vue';

const { isMobile, isDesktop } = useDevice();
</script>

<template>
  <header class="header">
    <div class="row column">
      <div class="header__flex">
        <GoToBackButton v-if="isMobile" />
        <RouterLink to="/" class="header--logo-link"> Dolores </RouterLink>
        <DesktopNavigation v-if="isDesktop" />
      </div>
    </div>
  </header>
</template>

<style scoped src="./styles.scoped.css" />
