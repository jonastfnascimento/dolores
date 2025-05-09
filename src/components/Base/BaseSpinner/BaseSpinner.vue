<script lang="ts" setup>
import type { Props } from './types';

const props = withDefaults(defineProps<Props>(), {
  color: '#146A67',
  size: 'medium',
  speed: 'average',
});
</script>

<template>
  <div
    :class="['spinner', props.size, props.speed]"
    :style="`--spinner_color: ${props.color}`"
  />
</template>

<style scoped src="./styles.scoped.css" />
