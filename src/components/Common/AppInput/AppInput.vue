<template>
  <div class="app-input">
    <input
      :type="inputType"
      :name="inputType"
      autocomplete="on"
      :placeholder="props.placeholder"
      :value="props.value"
      :maxlength="props.maxLength"
      :minlength="props.minLength"
      @input="onInput"
      @focus="onFocus"
      :class="{ error: props.error }"
    />

    <div
      v-if="props.type === 'password'"
      class="app-input__eye-container"
      @click="toggleShowPassword"
    >
      <div class="app-input__eye-wrapper">
        <img src="./img/opened-eye.svg" alt="Mostrar/Esconder senha" />
        <Transition name="fade">
          <div v-if="showPassword" class="app-input__eye-slash"></div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits, computed } from 'vue';
import type { Props } from './types';

const props = defineProps<Props>();
const emit = defineEmits(['update:value', 'focus']);

const showPassword = ref(false);

const inputType = computed(() =>
  props.type === 'password' && showPassword.value ? 'text' : props.type
);

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:value', target.value);
};

const onFocus = () => {
  emit('focus');
};

const toggleShowPassword = () => {
  showPassword.value = !showPassword.value;
};
</script>

<style scoped src="./styles.scoped.css" />
