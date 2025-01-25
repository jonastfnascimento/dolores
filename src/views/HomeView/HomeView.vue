<script setup lang="ts">
import { ref, onMounted } from 'vue';

import { api } from '@/services/api';

import ShelfMate from '@/components/Home/ShelfMate/ShelfMate.vue';
import HomeSkeleton from '@/components/Home/HomeSkeleton/HomeSkeleton.vue';
import SearchInput from '@/components/Base/SearchInput/SearchInput.vue';
import HomeAllSkeleton from '@/components/Home/HomeAllSkeleton/HomeAllSkeleton.vue';

const loadingAll = ref<boolean>(false);
const loadingShelves = ref<boolean>(false);
const avatars = ref();
const personas = ref();
const contents = ref();

onMounted(async () => {
  loadingAll.value = true;
  await Promise.all([
    api
      .get('a639000d-d2a8-44c0-be19-1b9fb7f272c2?id_user=1')
      .then(({ data }) => {
        avatars.value = data.avatars.avatars;
      })
      .catch(() => ({})),
    api
      .get('/a60029ee-936b-4397-a81a-577d80b22f9f?user_id=1')
      .then(({ data }) => {
        personas.value = data.avatars.personas;
      })
      .catch(() => ({})),
    api
      .get('/399b962f-dd3e-4ceb-828c-2e3ea26d8661?user_id=1')
      .then(({ data }) => {
        contents.value = data.contents['Content List'];
      })
      .catch(() => ({})),
  ]);
  loadingAll.value = false;
});

async function onSearch(term: string) {
  loadingShelves.value = true;
  await api
    .get(`/c980ae3f-e50b-489f-abd5-e9ff2914cf93?query=${term}`)
    .then(({ data }) => {
      avatars.value = data.data.avatars.filter(
        (d: never) => Object.keys(d).length
      );
      personas.value = data.data.targets.filter(
        (d: never) => Object.keys(d).length
      );
      contents.value = data.data.contents.filter(
        (d: never) => Object.keys(d).length
      );
    })
    .catch(() => ({}));
  loadingShelves.value = false;
}
</script>

<template>
  <main class="home">
    <template v-if="loadingAll">
      <HomeAllSkeleton />
    </template>
    <template v-else>
      <div class="row column">
        <SearchInput
          placeholder="Pesquise: avatar, persona, ou conteudo...."
          class="home__search"
          @change="onSearch"
        />
      </div>

      <template v-if="loadingShelves">
        <HomeSkeleton />
      </template>
      <template v-else>
        <ShelfMate
          v-if="avatars"
          :items="avatars"
          types="avatar"
          label="Avatares"
          class="home__shelf-avatar"
        />
        <ShelfMate
          v-if="personas"
          :items="personas"
          types="persona"
          label="Personas"
          class="home__shelf-persona"
        />
        <ShelfMate
          v-if="contents"
          :items="[]"
          types="content"
          label="Conteúdos"
          class="home__shelf-content"
        />
      </template>
    </template>
  </main>
</template>

<style scoped src="./styles.scoped.css" />
