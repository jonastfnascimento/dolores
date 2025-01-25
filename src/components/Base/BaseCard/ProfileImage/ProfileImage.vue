<script setup lang="ts">
import type { Props } from './types';

const props = withDefaults(defineProps<Props>(), {
  type: 'content',
});
</script>

<template>
  <img
    v-if="props.src?.length"
    :src="props.src"
    :width="props.width"
    :height="props.height"
    :alt="props.alt"
    :title="props.title"
    v-bind="$attrs"
  />

  <template v-else>
    <img
      v-if="props.type === 'avatar'"
      src="./img/avatar.svg"
      :width="props.width"
      :height="props.height"
      :alt="props.alt"
      :title="props.title"
      v-bind="$attrs"
    />

    <img
      v-else-if="props.type === 'persona'"
      src="./img/persona.svg"
      :width="props.width"
      :height="props.height"
      :alt="props.alt"
      :title="props.title"
      v-bind="$attrs"
    />
    <img
      v-else
      src="./img/content.svg"
      :width="props.width"
      :height="props.height"
      :alt="props.alt"
      :title="props.title"
      v-bind="$attrs"
    />
  </template>
</template>

<style scoped src="./styles.scoped.css"></style>
