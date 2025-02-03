<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useContentStore } from '@/stores/useContentStore';

import FixedInfos from '@/components/Content/FixedInfos/FixedInfos.vue';
import CreationStepper from '@/components/Content/CreationStepper/CreationStepper.vue';
import ContentCreationModal from '@/components/Content/ContentCreationModal/ContentCreationModal.vue';

const contentStore = useContentStore();

const avatar = computed(() => contentStore.avatar);
const persona = computed(() => contentStore.persona);
const keyword = computed(() => contentStore.keyword);

const isDataValid = computed(() => contentStore.isDataValid);

onMounted(() => {
  if (!isDataValid.value) {
    contentStore.toggleModal(true);
  }
});
</script>

<template>
  <div
    class="content-detail row column"
    :class="{ 'content-detail--fullscreen': !isDataValid }"
  >
    <FixedInfos
      class="content-detail__fixed-infos"
      :avatarLabel="avatar?.label ?? 'Avatar não selecionado'"
      :personaLabel="persona?.label ?? 'Persona não selecionada'"
      :keyword="keyword || 'Keyword não escolhida'"
      :isDataValid="isDataValid"
    />

    <Transition name="fade" mode="in-out">
      <div v-if="isDataValid">
        <CreationStepper />
      </div>

      <p v-else>
        <Teleport to="#teleports">
          <ContentCreationModal />
        </Teleport>
      </p>
    </Transition>
  </div>
</template>

<style scoped src="./styles.scoped.css" />
<style src="@/assets/vue-animations.css" />
