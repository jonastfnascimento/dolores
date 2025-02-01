<script setup lang="ts">
import { ref, watch } from 'vue';

import type { Emits, Props } from './types';

const emit = defineEmits<Emits>();
const props = withDefaults(defineProps<Props>(), {
  value: '',
  type: 'input',
  errorLabel: 'Esse campo é obrigatório!',
  disabled: false,
});

const textValue = ref<string>(props.value);
watch(
  () => textValue.value,
  (newValue) => {
    emit('change', newValue);
  }
);
</script>

<template>
  <div :class="{ error: props.error, disabled: props.disabled }">
    <label :for="props.for">
      {{ props.label }}
    </label>
    <input
      v-if="props.type === 'input'"
      v-model="textValue"
      :id="props.for"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      type="text"
    />
    <textarea
      v-else
      v-model="textValue"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      :id="props.for"
    ></textarea>

    <Transition name="error" mode="out-in">
      <div v-if="props.error" class="error-label">
        {{ props.errorLabel }}
      </div>
    </Transition>
  </div>
</template>

<style scoped src="./styles.scoped.css" />
