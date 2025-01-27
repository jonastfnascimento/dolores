<template>
  <component
    :is="link ? 'router-link' : 'button'"
    :to="link"
    @click="handleClick"
    :class="[
      'button',
      {
        'button--dark': dark,
        'button--light': !dark,
        'button--disabled': disabled,
      },
    ]"
    :disabled="disabled"
  >
    <slot name="label"></slot>
    <slot name="icon"></slot>
  </component>
</template>

<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';

import type { Props } from './types';

const props = defineProps<Props>();
const emit = defineEmits(['click']);

const handleClick = () => {
  if (!props.link && !props.disabled) {
    emit('click');
  }
};
</script>

<style src="./styles.scoped.css" scoped />
