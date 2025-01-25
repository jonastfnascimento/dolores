<script setup lang="ts">
import ShelfSkeleton from '../ShelfMate/ShelfSkeleton/ShelfSkeleton.vue';
</script>

<template>
  <div class="home-skeleton row column">
    <div class="home-skeleton__search skt" />
    <ShelfSkeleton />
    <ShelfSkeleton />
    <ShelfSkeleton />
  </div>
</template>

<style scoped src="./styles.scoped.css" />
