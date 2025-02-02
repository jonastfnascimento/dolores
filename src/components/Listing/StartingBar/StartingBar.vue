<script setup lang="ts">
import { computed } from 'vue';

import type { Props } from './types';

import AppButton from '@/components/Common/AppButton/AppButton.vue';

const props = defineProps<Props>();

const emit = defineEmits(['start-content-creation']);

const approachText = computed(() => {
  if (props.type === 'avatar') return 'Crie aqui um novo avatar.';

  if (props.type === 'persona') return 'Crie aqui uma nova persona';

  return 'Crie aqui um novo conteudo';
});

const urlType = computed(() => {
  if (props.type === 'avatar') return '/create/avatar';

  if (props.type === 'persona') return '/create/persona';

  return '';
});

const startContentCreationFlow = () => {
  if (props.type !== 'avatar' && props.type !== 'persona') {
    emit('start-content-creation');
  }
};
</script>

<template>
  <div class="starting-bar">
    <p class="starting-bar__approach">
      {{ approachText }}
    </p>

    <AppButton :link="urlType" dark @click="startContentCreationFlow">
      <template #label> Começar </template>
    </AppButton>
  </div>
</template>

<style scoped src="./styles.scoped.css" />
