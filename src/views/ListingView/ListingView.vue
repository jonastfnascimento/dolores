<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useContentStore } from '@/stores/useContentStore';

import type { Entity, EntityType } from './types';

import { api } from '@/services/api';

import EntityGrid from '@/components/Listing/EntityGrid/EntityGrid.vue';
import StartingBar from '@/components/Listing/StartingBar/StartingBar.vue';
import SearchInput from '@/components/Base/SearchInput/SearchInput.vue';
import NotfoundView from '../NotfoundView/NotfoundView.vue';
import ContentCreationModal from '@/components/Content/ContentCreationModal/ContentCreationModal.vue';

import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();

const route = useRoute();
const contentStore = useContentStore();

onMounted(() => {
  listEntities();
});
watch(
  () => route.path,
  () => {
    listEntities();
  }
);

const listingType = computed<EntityType>(() => {
  if (route.params.slug === 'avatars') return 'avatar';
  if (route.params.slug === 'personas') return 'persona';
  if (route.params.slug === 'contents') return 'content';

  return 'notfound';
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
    .get(`${urlByType}`, {
      params: {
        user_id: userStore.getUser?.id,
        id_user: userStore.getUser?.id,
        query: searchTerm,
      },
    })
    .then(({ data }) => {
      if (listingType.value === 'avatar') return data?.avatars?.avatars || [];

      if (listingType.value === 'persona') return data?.avatars?.personas || [];

      return data?.contents || [];
    })
    .catch(() => ({}));

  loading.value = false;
}

const startContentCreation = () => {
  contentStore.toggleModal(true);
};
</script>

<template>
  <main class="listing">
    <div class="row column">
      <NotfoundView v-if="listingType === 'notfound'" />

      <template v-else>
        <SearchInput
          @change="(term) => listEntities(term)"
          placeholder="Pesquisar..."
          class="listing__search"
        />

        <StartingBar
          @start-content-creation="startContentCreation"
          :type="listingType"
          class="listing__starting-bar"
        />

        <EntityGrid
          v-if="loading || entites.length"
          :type="listingType"
          :entites="entites"
          :loading="loading"
          class="listing__items"
        />

        <div v-else class="listing__no-entites">
          Não foi encontrado
          {{
            listingType === 'avatar'
              ? 'nenhum avatar'
              : listingType === 'persona'
                ? 'nenhuma persona'
                : 'nenhum conteúdo'
          }}
        </div>

        <ContentCreationModal />
      </template>
    </div>
  </main>
</template>

<style scoped src="./styles.scoped.css" />
