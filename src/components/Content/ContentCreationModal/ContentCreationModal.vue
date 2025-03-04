<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { api } from '@/services/api';
import type { Avatar } from './types';
import type { Persona } from './types';
import BaseModal from '@/components/Base/BaseModal/BaseModal.vue';
import AppButton from '@/components/Common/AppButton/AppButton.vue';
import AppInput from '@/components/Common/AppInput/AppInput.vue';
import AppCombobox from '@/components/Common/AppCombobox/AppCombobox.vue';
import { useContentStore } from '@/stores/useContentStore';
import { useRouter } from 'vue-router';
import { toast } from 'vue-sonner';

import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();

const router = useRouter();
const contentStore = useContentStore();

const loading = ref(true);
const avatars = ref<Array<Avatar>>([]);
const personas = ref<Array<Persona>>([]);
const selectedAvatar = ref(null);
const selectedPersona = ref(null);
const keyword = ref('');

const fetchAvatarsAndPersonas = async (searchTerm: string = '') => {
  loading.value = true;
  try {
    const [avatarsResponse, personasResponse] = await Promise.all([
      api.get('a639000d-d2a8-44c0-be19-1b9fb7f272c2', {
        params: {
          user_id: userStore.getUser?.id,
          id_user: userStore.getUser?.id,
          query: searchTerm,
        },
      }),
      api.get('a60029ee-936b-4397-a81a-577d80b22f9f', {
        params: {
          user_id: userStore.getUser?.id,
          id_user: userStore.getUser?.id,
          query: searchTerm,
        },
      }),
    ]);

    avatars.value = avatarsResponse.data.avatars?.avatars || [];
    personas.value = personasResponse.data.avatars?.personas || [];

    if (!avatars.value.length && !personas.value.length) {
      toast.error('Nenhum dado encontrado.');
      console.error('Nenhum dado encontrado.');
    }
  } catch (error) {
    toast.error(`Erro ao buscar dados: ${error}`);
    console.error(`Erro ao buscar dados: ${error}`);
  } finally {
    loading.value = false;
  }
};

const formattedPersonas = computed(() =>
  personas.value.map((p) => ({ id: p.id_target, label: p.name }))
);

const formattedAvatars = computed(() =>
  avatars.value.map((a) => ({ id: a.id_avatar, label: a.company_name }))
);

const invalidCreationContentData = computed(
  () => !selectedAvatar.value || !selectedPersona.value || !keyword.value
);

watch(
  () => contentStore.showModal,
  (newValue) => {
    if (newValue) {
      fetchAvatarsAndPersonas();
    }
  }
);

const initContentCreationProcess = () => {
  if (selectedAvatar.value && selectedPersona.value && keyword.value) {
    contentStore.setContentData(
      selectedAvatar.value,
      selectedPersona.value,
      keyword.value
    );

    contentStore.toggleModal(false);

    router.push({ name: 'saveContent' });
    return;
  }
};
</script>

<template>
  <BaseModal
    :show="contentStore.showModal"
    @close="contentStore.toggleModal(false)"
    animation="fade"
  >
    <div class="cc-modal">
      <p class="cc-modal__title">Escolha a sua palavra-chave para começar!</p>

      <AppInput
        class="cc-modal__input"
        type="text"
        placeholder="Escreva aqui sua palavra-chave"
        v-model:value="keyword"
      />

      <div class="cc-modal__combobox-container">
        <AppCombobox
          :items="formattedAvatars"
          v-model:value="selectedAvatar"
          placeholder="Avatar"
          autocomplete="off"
          class="cc-modal__combobox-item"
          :loading="loading"
        />
        <AppCombobox
          :items="formattedPersonas"
          v-model:value="selectedPersona"
          placeholder="Persona"
          autocomplete="off"
          class="cc-modal__combobox-item"
          :loading="loading"
        />
      </div>

      <AppButton
        class="cc-modal__btn"
        :dark="true"
        @click="initContentCreationProcess"
        :disabled="invalidCreationContentData"
      >
        <template #label> Confirmar </template>
      </AppButton>
    </div>
  </BaseModal>
</template>

<style scoped src="./styles.scoped.css" />
