<script setup lang="ts">
import { useDevice } from '@/composables/useDevice';

const { isMobile } = useDevice();
</script>

<template>
  <div class="card-skeleton skt-border">
    <canvas
      class="card-skeleton__img skt"
      :width="isMobile ? 54 : 70"
      :height="isMobile ? 54 : 70"
    />
    <div class="card-skeleton__name one skt"></div>
    <div class="card-skeleton__name two skt"></div>
    <div class="card-skeleton__date skt"></div>
    <div class="card-skeleton__pubs skt"></div>
  </div>
</template>

<style scoped src="./styles.scoped.css" />
