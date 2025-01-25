<script setup lang="ts">
import { computed } from 'vue';

import type { Props } from './types';

import { useDevice } from '@/composables/useDevice';

import {
  ProfileImage,
  TextName,
  WrapperContent,
  CreateButton,
} from '@/components/Base/BaseCard';

const { isMobile } = useDevice();

const props = defineProps<Props>();

const label = computed(() => {
  if (props.type === 'avatar') return 'Criar Avatar';
  if (props.type === 'persona') return 'Criar Persona';

  return 'Criar Conteúdo';
});
</script>

<template>
  <WrapperContent class="card">
    <ProfileImage
      :type="props.type"
      class="card__img"
      :width="isMobile ? 54 : 70"
      :height="isMobile ? 54 : 70"
    />
    <TextName class="card__name">
      {{ label }}
    </TextName>

    <CreateButton />
  </WrapperContent>
</template>

<style scoped src="./styles.scoped.css" />
