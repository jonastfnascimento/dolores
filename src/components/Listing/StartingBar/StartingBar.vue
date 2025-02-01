<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

import type { Props } from './types';

const props = defineProps<Props>();

const approachText = computed(() => {
  if (props.type === 'avatar') return 'Crie aqui um novo avatar.';

  if (props.type === 'persona') return 'Crie aqui uma nova persona';

  return 'Crie aqui um novo conteudo';
});

const urlType = computed(() => {
  if (props.type === 'avatar') return '/create/avatar';

  if (props.type === 'persona') return '/create/persona';

  return '/create/content';
});
</script>

<template>
  <div class="starting-bar">
    <p class="starting-bar__approach">
      {{ approachText }}
    </p>

    <RouterLink :to="urlType" class="starting-bar--link"> Começar </RouterLink>
  </div>
</template>

<style scoped src="./styles.scoped.css" />
