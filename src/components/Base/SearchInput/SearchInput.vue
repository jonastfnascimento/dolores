<script setup lang="ts">
import { ref, watch } from 'vue';

import type { Emits, Props } from './types';

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const term = ref<string>('');
watch(term, () => {
  change();
});
const debounce = ref<number>(0);
function change() {
  clearTimeout(debounce.value);
  debounce.value = setTimeout(() => {
    emit('change', term.value);
  }, 500);
}
</script>

<template>
  <form @submit.prevent="change">
    <input v-model="term" type="text" :placeholder="props.placeholder" />
    <button type="submit">
      <img src="./img/icon.svg" width="24" height="24" alt="" />
    </button>
  </form>
</template>

<style scoped src="./styles.scoped.css" />
