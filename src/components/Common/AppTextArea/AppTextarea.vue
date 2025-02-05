<template>
  <div class="app-textarea">
    <textarea
      :name="props.name"
      :placeholder="props.placeholder"
      :value="props.value"
      :maxlength="props.maxLength"
      :minlength="props.minLength"
      :rows="props.rows"
      :cols="props.cols"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      :class="{ error: props.error, loading: props.loading }"
      :autocomplete="props.autocomplete"
    ></textarea>
  </div>
</template>

<script lang="ts" setup>
import type { TextAreaProps } from './types.ts';

const props = defineProps<TextAreaProps>();
const emit = defineEmits(['update:value', 'focus', 'blur']);

const onInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement;
  emit('update:value', target.value);
};

const onFocus = () => {
  emit('focus');
};

const onBlur = () => {
  emit('blur');
};
</script>

<style scoped src="./styles.scoped.css" />
