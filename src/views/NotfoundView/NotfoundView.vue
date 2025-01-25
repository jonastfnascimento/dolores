<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
  <div class="notfound">
    <p class="nofound__404">404</p>
    <p class="notfound__title">Ops! Não encontramos nada por aqui.</p>

    <RouterLink to="/" class="notfound--link"> ir para a home </RouterLink>
  </div>
</template>

<style scoped src="./styles.scoped.css" />
