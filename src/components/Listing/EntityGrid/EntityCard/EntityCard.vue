<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink } from 'vue-router';

import type { Props } from './types';

import { useDevice } from '@/composables/useDevice';
import { useDate } from '@/composables/useDate';

const { isMobile } = useDevice();

const props = defineProps<Props>();
const entityData = computed(() => {
  const entity = {
    name: '',
    img: '',
    date: '',
    data: '',
  };
  if (props.type === 'avatar') {
    entity.name = props.entity.company_name || '-';
    entity.date = props.entity.created_at || '-';
    entity.data = `${props.entity.related_publications || '0'} conteúdos`;
  }

  return entity;
});
</script>

<template>
  <div class="entity-card">
    <div class="entity-card__top">
      <RouterLink class="entity-card--img" to="/">
        <img
          v-if="entityData.img.length"
          :src="entityData.img"
          :alt="entityData.name"
          :title="entityData.name"
          width="336"
          height="125"
        />
        <img
          v-else
          src="./img/default-336-125.jpg"
          :alt="entityData.name"
          :title="entityData.name"
          width="336"
          height="125"
        />
      </RouterLink>

      <RouterLink class="entity-card--name" to="/">
        {{ entityData.name }}
      </RouterLink>
    </div>

    <div class="entity-card__bottom">
      <div class="entity-card__resume">
        <p class="entity-card__date">
          <img
            src="./img/calendar.svg"
            :width="isMobile ? 13 : 23"
            :height="isMobile ? 13 : 23"
          />
          {{ useDate(entityData.date) }}
        </p>
        <p class="entity-card__data">
          <img
            src="./img/graphic.svg"
            :width="isMobile ? 13 : 23"
            :height="isMobile ? 13 : 23"
          />
          {{ entityData.data }}
        </p>
      </div>

      <RouterLink class="entity-card--link" to="/"> Detalhes </RouterLink>
    </div>
  </div>
</template>

<style scoped src="./styles.scoped.css" />
