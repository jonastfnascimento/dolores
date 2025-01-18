<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
  <nav class="desktop-navigation">
    <RouterLink to="/" class="desktop-navigation--link"> Conteúdos </RouterLink>
    <RouterLink to="/" class="desktop-navigation--link"> Personas </RouterLink>
    <RouterLink to="/" class="desktop-navigation--link"> Avatares </RouterLink>
  </nav>
</template>

<style scoped src="./styles.scoped.css" />
