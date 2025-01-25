<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import type { Entity, EntityType } from './types';

import { api } from '@/services/api';
import EntityGrid from '@/components/Listing/EntityGrid/EntityGrid.vue';
import StartingBar from '@/components/Listing/StartingBar/StartingBar.vue';
import SearchInput from '@/components/Base/SearchInput/SearchInput.vue';

// import { Props } from './types';
// defineProps<Props>();
onMounted(() => {
  listEntities();
});

const route = useRoute();
const listingType = computed<EntityType>(() => {
  if (route.params.slug === 'avatars') return 'avatar';
  if (route.params.slug === 'personas') return 'persona';

  return 'content';
});

const entites = ref<Array<Entity>>([]);
const loading = ref<boolean>(false);
async function listEntities(searchTerm: string = '') {
  loading.value = true;

  let urlByType = 'a639000d-d2a8-44c0-be19-1b9fb7f272c2'; // avatars

  if (listingType.value === 'content')
    urlByType = '399b962f-dd3e-4ceb-828c-2e3ea26d8661';
  else if (listingType.value === 'persona')
    urlByType = 'a60029ee-936b-4397-a81a-577d80b22f9f';

  entites.value = await api
    .get(`${urlByType}`, { params: { id_user: 1, query: searchTerm } })
    .then(({ data }) => data.avatars.avatars)
    .catch(() => ({}));

  loading.value = false;
}
</script>

<template>
  <main class="listing">
    <div class="row column">
      <SearchInput
        @change="(term) => listEntities(term)"
        placeholder="Pesquisar..."
        class="listing__search"
      />

      <StartingBar :type="listingType" class="listing__starting-bar" />

      <EntityGrid
        :type="listingType"
        :entites="entites"
        :loading="loading"
        class="listing__items"
      />
    </div>
  </main>
</template>

<style scoped src="./styles.scoped.css" />
