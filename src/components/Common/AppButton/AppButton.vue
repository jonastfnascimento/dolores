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
    <Transition name="fade" mode="out-in" :duration="200">
      <div v-if="!props.loading">
        <slot name="label"></slot>
        <slot name="icon"></slot>
      </div>
      <span v-else class="loader"></span>
    </Transition>
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
