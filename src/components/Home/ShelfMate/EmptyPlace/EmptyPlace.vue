<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

import type { Props } from './types';

import { useDevice } from '@/composables/useDevice';

const props = defineProps<Props>();

const { isMobile } = useDevice();

const name = computed(() => {
  if (props.types === 'avatar') return 'Criar Avatar';
  if (props.types === 'persona') return 'Criar Persona';

  return 'Criar Conteúdo';
});
</script>

<template>
  <RouterLink to="/" class="empty-place">
    <div class="empty-place__img">
      <img
        v-if="props.types === 'avatar'"
        src="./img/avatar.svg"
        :width="isMobile ? 54 : 70"
        :height="isMobile ? 54 : 70"
      />
      <img
        v-else-if="props.types === 'persona'"
        src="./img/persona.svg"
        :width="isMobile ? 54 : 70"
        :height="isMobile ? 54 : 70"
      />
      <img
        v-else
        src="./img/content.svg"
        :width="isMobile ? 54 : 70"
        :height="isMobile ? 54 : 70"
      />
    </div>

    <p class="empty-place__name">
      {{ name }}
    </p>

    <button class="empty-place--btn">
      <img src="./img/add.svg" />
    </button>
  </RouterLink>
</template>

<style scoped src="./styles.scoped.css" />
