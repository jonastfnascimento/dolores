<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { toast } from 'vue-sonner';

import type { Avatar } from './types';

import { api } from '@/services/api';

import { useDevice } from '@/composables/useDevice';
import ContentSteps from '@/components/Detail/ContentSteps/ContentSteps.vue';
import ResumeInfos from '@/components/Detail/ResumeInfos/ResumeInfos.vue';
import FieldInput from '@/components/Detail/FieldInput/FieldInput.vue';
import BaseSpinner from '@/components/Base/BaseSpinner/BaseSpinner.vue';
import { useFileToBase64 } from '@/composables/useFileToBase64';

const { isMobile } = useDevice();

const route = useRoute();

const PageType = computed(() => {
  if (route.name === 'saveAvatar') return 'creating';

  return 'editing';
});
const avatarId = computed<number>(() => Number(route.params.id));
const currentAvatar = ref<Avatar>({
  id: 0,
  departament: '',
  image: '',
  name: '',
  services: '',
  slogan: '',
});
const avatarName = ref<string>();

const loading = ref<boolean>(false);
async function getAvatar() {
  loading.value = true;

  await api
    .get(`b90b260b-6323-487d-b125-f26713f4b4d9`, {
      params: { id_avatar: avatarId.value },
    })
    .then(({ data }) => {
      avatarName.value = data.avatar.company_name;
      currentAvatar.value = {
        id: data.avatar.id,
        name: data.avatar.company_name,
        slogan: data.avatar.slogan,
        services: data.avatar.products_and_services,
        departament: data.avatar.industry,
        image: data.avatar.imagem,
      };
    })
    .catch(() => ({}));

  loading.value = false;
}

const steps = computed(() => {
  return [
    {
      label: 'Nome da Empresa',
      active: !!currentAvatar.value?.name?.length,
    },
    {
      label: 'Slogan',
      active: !!currentAvatar.value?.slogan?.length,
    },
    {
      label: 'Produtos e Serviços',
      active: !!currentAvatar.value?.services?.length,
    },
    {
      label: 'Setor da Empresa',
      active: !!currentAvatar.value?.departament?.length,
    },
  ];
});
const resumeInfos = computed(() => {
  return [
    {
      label: 'Nome da Empresa',
      value: currentAvatar.value?.name || '',
    },
    {
      label: 'Slogan',
      value: currentAvatar.value?.slogan,
    },
    {
      label: 'Produtos e Serviços',
      value: currentAvatar.value?.services || '',
    },
    {
      label: 'Setor da Empresa',
      value: currentAvatar.value?.departament || '',
    },
  ];
});

const showFeedbackModal = ref(false);
const editingAvatar = ref(false); // Está editando um avatar já existente!
const editLoading = ref(false);
const invalidAttempt = ref(false);
const errorName = computed(() => {
  return !currentAvatar.value?.name.length;
});
const errorSlogan = computed(() => {
  return !currentAvatar.value?.slogan.length;
});
const errorServices = computed(() => {
  return !currentAvatar.value?.services.length;
});
const errorDepartament = computed(() => {
  return !currentAvatar.value?.departament.length;
});
const errorAll = computed(() => {
  return (
    errorName.value ||
    errorSlogan.value ||
    errorServices.value ||
    errorDepartament.value
  );
});
watch(
  () => [
    currentAvatar.value?.name,
    currentAvatar.value?.slogan,
    currentAvatar.value?.services,
    currentAvatar.value?.departament,
  ],
  () => {
    if (!loading.value) {
      editingAvatar.value = true;

      invalidAttempt.value = false;
    }
  }
);
const newProfileImage = ref('');
async function onFileUpload(event: Event) {
  const target = event.target as HTMLInputElement;

  if (target.files?.length && target.files[0].type.includes('image')) {
    const file = target.files[0];
    newProfileImage.value = await useFileToBase64(file).catch(() => {
      alert(
        'Ops! Ocorreu um erro ao tentar subir esse arquivo. Tente novamente mais tarde'
      );
      return '';
    });
  }
}

function upsertAvatar() {
  if (PageType.value === 'creating') return createAvatar();

  updateAvatar();
}
async function updateAvatar() {
  if (!editLoading.value) {
    if (errorAll.value) return (invalidAttempt.value = true);

    window.scrollTo(0, 0);
    editLoading.value = true;
    await api
      .get(`bd8b92a6-d543-4cc3-8b18-35cbfc3f71d1`, {
        params: {
          id: currentAvatar.value?.id,
          'Nome Avatar': currentAvatar.value?.name,
          Slogan: currentAvatar.value?.slogan,
          'Produtos e serviços': currentAvatar.value?.services,
          Setor: currentAvatar.value?.departament,
          imagem: newProfileImage.value || '',
        },
      })
      .then(({ data }) => {
        currentAvatar.value = {
          id: data.avatar.id,
          name: data.avatar.company_name,
          slogan: data.avatar.slogan,
          services: data.avatar.products_and_services,
          departament: data.avatar.industry,
          image: data.avatar.imagem,
        };

        avatarName.value = data.avatar.company_name;
        toast.success('Avatar atualizado com sucesso!');
      })
      .catch(() => {
        toast.error('Ops! Ocorreu um erro ao tentar atualizar.');
        return {};
      });

    editingAvatar.value = false;
    editLoading.value = false;
  }
}

const router = useRouter();
async function createAvatar() {
  if (!editLoading.value) {
    if (errorAll.value) return (invalidAttempt.value = true);

    window.scrollTo(0, 0);
    editLoading.value = true;
    await api
      .get(`f5792738-34da-4040-802a-b58b207c626a`, {
        params: {
          id_user: 1,
          company_name: currentAvatar.value?.name,
          slogan: currentAvatar.value?.slogan,
          products_and_services: currentAvatar.value?.services,
          industry: currentAvatar.value?.departament,
          imagem: newProfileImage.value || '',
          related_publications: 0,
        },
      })
      .then(({ data }) => {
        currentAvatar.value = {
          id: data.avatar.id,
          name: data.avatar.company_name,
          slogan: data.avatar.slogan,
          services: data.avatar.products_and_services,
          departament: data.avatar.industry,
          image: data.avatar.imagem,
        };

        toast.success('Avatar criado com sucesso!', {
          action: {
            label: 'Ir para avatar',
            onClick: () => router.push(`/avatars/${currentAvatar.value.id}`),
          },
        });
      })
      .catch(() => {
        toast.error('Ops! Ocorreu um erro ao tentar criar.');
        return {};
      });

    currentAvatar.value = {
      id: currentAvatar.value.id,
      departament: '',
      image: '',
      name: '',
      services: '',
      slogan: '',
    };

    editingAvatar.value = false;
    editLoading.value = false;
    showFeedbackModal.value = true;
  }
}

const wasRemove = ref(false);
async function removeAvatar() {
  if (!editLoading.value) {
    editLoading.value = true;

    await api
      .get(`59b3a8b8-33e6-4baa-b308-dbdf6837d12f`, {
        params: {
          id: currentAvatar.value.id,
        },
      })
      .then(() => {
        toast.success('Avatar deletado com sucesso!', {
          action: {
            label: 'Ir para início',
            onClick: () => router.push('/'),
          },
        });
      })
      .catch(() => {
        toast.error('Ops! Ocorreu um erro ao tentar remover.');
        return {};
      });

    wasRemove.value = true;
    editLoading.value = false;
    showFeedbackModal.value = true;
  }
}

watch(
  () => route.path,
  () => {
    if (route.name !== 'saveAvatar') getAvatar();
  },
  { immediate: true }
);
</script>

<template>
  <main class="detail">
    <div v-if="loading" class="detail__initial-loading">
      <BaseSpinner size="small" />
    </div>

    <template v-else-if="currentAvatar">
      <div class="detail__container">
        <div v-if="editLoading" class="detail__edit-loading">
          <BaseSpinner />
        </div>

        <div
          :class="[
            'detail__flex-container',
            'row',
            'column',
            { 'edit-loading': editLoading },
          ]"
        >
          <div class="detail__img-wrapper">
            <label for="imageField" class="detail__img-container">
              <img
                v-if="newProfileImage.length || currentAvatar.image.length"
                class="detail__profile-img"
                :src="newProfileImage || currentAvatar.image"
                :alt="currentAvatar.name"
                :title="currentAvatar.name"
              />
              <img
                v-else
                class="detail__no-profile-img"
                src="./img/default-303-303.jpg"
                :alt="currentAvatar.name"
                :title="currentAvatar.name"
              />

              <input
                @change="onFileUpload"
                id="imageField"
                type="file"
                accept=".jpg, .png"
              />
            </label>
            <img
              class="detail__profile-icon"
              src="./img/profile-icon.svg"
              :width="isMobile ? 34 : 49"
              :height="isMobile ? 30 : 43"
            />
          </div>

          <div class="detail__content">
            <p class="detail__name">
              {{ PageType === 'creating' ? 'Criando novo Avatar' : avatarName }}
            </p>
            <ContentSteps class="detail__steps" :steps="steps" />
            <ResumeInfos class="detail__resume" :infos="resumeInfos" />

            <form
              :key="`form${showFeedbackModal}`"
              @submit.prevent="upsertAvatar"
              class="detail__form"
            >
              <FieldInput
                for="name"
                :error="errorName && invalidAttempt"
                label="Nome da Empresa*"
                :disabled="editLoading"
                :value="currentAvatar.name"
                @change="(newName) => (currentAvatar.name = newName)"
                placeholder="Qual o nome da sua empresa?"
              />
              <FieldInput
                for="slogan"
                :error="errorSlogan && invalidAttempt"
                label="Slogan*"
                :value="currentAvatar.slogan"
                :disabled="editLoading"
                @change="(newSlogan) => (currentAvatar.slogan = newSlogan)"
                placeholder="Qual o slogan da sua empresa?"
              />
              <FieldInput
                for="product"
                :error="errorServices && invalidAttempt"
                type="textarea"
                :disabled="editLoading"
                label="Produtos e Serviços*"
                :value="currentAvatar.services"
                @change="(newService) => (currentAvatar.services = newService)"
                placeholder="Quais produtos e serviços?"
              />
              <FieldInput
                for="departament"
                :error="errorDepartament && invalidAttempt"
                type="textarea"
                :disabled="editLoading"
                label="Setor da Empresa"
                :value="currentAvatar.departament"
                @change="
                  (newDepartament) =>
                    (currentAvatar.departament = newDepartament)
                "
                placeholder="Qual nicho sua empresa pertence?"
              />

              <button
                v-if="PageType === 'editing'"
                type="button"
                :class="['detail--btn', 'remove', { disabled: editLoading }]"
                @click="removeAvatar"
              >
                Excluir Avatar
              </button>
              <button
                type="submit"
                :class="[
                  'detail--btn',
                  'save',
                  {
                    disabled: editLoading || !editingAvatar || errorAll,
                  },
                ]"
              >
                <BaseSpinner v-if="editLoading" size="mini" color="#FFF" />

                <template v-else>
                  {{ PageType === 'creating' ? 'Cadastrar' : 'Salvar' }}
                </template>
              </button>
            </form>
          </div>
        </div>
      </div>
    </template>
  </main>
</template>

<style scoped src="./styles.scoped.css" />
