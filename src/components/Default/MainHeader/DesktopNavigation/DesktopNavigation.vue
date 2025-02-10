<script setup lang="ts">
import { RouterLink } from 'vue-router';
import UserNavigation from '../UserNavigation/UserNavigation.vue';
</script>

<template>
  <nav class="desktop-navigation">
    <RouterLink
      to="/contents"
      class="desktop-navigation--link"
      active-class="desktop-navigation--link--active"
    >
      Conteúdos
    </RouterLink>
    <RouterLink
      to="/personas"
      class="desktop-navigation--link"
      active-class="desktop-navigation--link--active"
    >
      Personas
    </RouterLink>
    <RouterLink
      to="/avatars"
      class="desktop-navigation--link"
      active-class="desktop-navigation--link--active"
    >
      Avatares
    </RouterLink>

    <UserNavigation />
  </nav>
</template>

<style scoped src="./styles.scoped.css" />
