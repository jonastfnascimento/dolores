<script setup lang="ts">
import type { Props } from './types';

const props = defineProps<Props>();
</script>

<template>
  <div class="steps">
    <div
      v-for="(step, stepIndex) in props.steps"
      :key="`step${stepIndex}`"
      :class="['steps__item', { active: step.active }]"
    >
      {{ step.label }}
    </div>
  </div>
</template>

<style scoped src="./styles.scoped.css" />
