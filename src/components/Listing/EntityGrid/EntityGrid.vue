<script setup lang="ts">
import type { Props } from './types';

import EntityCard from './EntityCard/EntityCard.vue';
import SkeletonCard from './EntityCard/SkeletonCard/SkeletonCard.vue';

const props = defineProps<Props>();
</script>

<template>
  <div class="entity-grid">
    <template v-if="props.loading">
      <SkeletonCard v-for="item in 9" :key="`skeleton${item}`" />
    </template>

    <template v-else>
      <EntityCard
        v-for="(entity, entityIndex) in props.entites"
        :key="`entity${entityIndex}`"
        :type="props.type"
        :entity="entity"
        class="entity-grid__item"
      />
    </template>
  </div>
</template>

<style scoped src="./styles.scoped.css" />
