<script setup lang="ts">
import type { Emits, Props } from './types';

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
</script>

<template>
  <div class="steps">
    <div
      v-for="(step, stepIndex) in props.steps"
      :key="`step${stepIndex}`"
      :class="['steps__item', { active: step.active }]"
      @click="emit('scrollToElement', step.ancor)"
    >
      {{ step.label }}
    </div>
  </div>
</template>

<style scoped src="./styles.scoped.css" />
