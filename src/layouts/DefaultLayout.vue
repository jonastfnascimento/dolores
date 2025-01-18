<script setup lang="ts">
import MainHeader from '@/components/Default/MainHeader/MainHeader.vue';
</script>

<template>
  <div class="default-layout">
    <MainHeader />

    <slot />

    <p>End DefaultLayout</p>
  </div>
</template>
