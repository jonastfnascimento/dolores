<script setup lang="ts">
import CardSkeleton from './CardSkeleton/CardSkeleton.vue';
</script>

<template>
  <div class="shelf-skeleton">
    <div class="shelf-skeleton__top">
      <div class="shelf-skeleton__title skt"></div>
      <div class="shelf-skeleton__seeall skt"></div>
    </div>

    <div class="shelf-skeleton__items">
      <div class="shelf-skeleton__items-container">
        <CardSkeleton
          v-for="item in 7"
          :key="`card${item}`"
          class="shelf-skeleton__item"
        />
      </div>
    </div>
  </div>
</template>

<style scoped src="./styles.scoped.css" />
