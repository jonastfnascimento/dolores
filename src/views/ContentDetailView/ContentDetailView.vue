<script setup lang="ts">
import { computed } from 'vue';
import { useContentStore } from '@/stores/useContentStore';

const contentStore = useContentStore();

const avatar = computed(() => contentStore.avatar);
const persona = computed(() => contentStore.persona);
const keyword = computed(() => contentStore.keyword);
</script>

<template>
  <div>
    <p>Avatar: {{ avatar }}</p>
    <p>Persona: {{ persona }}</p>
    <p>Keyword: {{ keyword }}</p>
  </div>
</template>

<style scoped src="./styles.scoped.css" />
