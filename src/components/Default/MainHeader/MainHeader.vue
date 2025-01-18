<script setup lang="ts">
import { RouterView } from 'vue-router';

import { useDevice } from '@/composables/useDevice';

import GoToBackButton from './GoToBackButton/GoToBackButton.vue';

const { isMobile } = useDevice();
</script>

<template>
  <header class="header">
    <div class="row column">
      <div class="header__flex">
        <GoToBackButton v-if="isMobile" />
        <RouterView to="/" class="header--logo-link"> Dolores </RouterView>
      </div>
    </div>
  </header>
</template>

<style scoped src="./styles.scoped.css" />
