<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps<{
  avatarLabel: string;
  personaLabel: string;
  keyword: string;
  isDataValid: boolean;
}>();
</script>

<template>
  <div class="fixed-infos" :class="{ 'fixed-infos--invalid': !isDataValid }">
    <div class="fixed-infos__tab">
      {{ props.keyword }}
    </div>
    <div class="fixed-infos__tabs">
      <div class="fixed-infos__tab">{{ props.personaLabel }}</div>
      <div class="fixed-infos__tab">{{ props.avatarLabel }}</div>
    </div>
    <div class="fixed-infos__border"></div>
  </div>
</template>

<style scoped src="./styles.scoped.css" />
