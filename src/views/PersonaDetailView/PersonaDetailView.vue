<script setup lang="ts">
import { computed, ref, watch, useTemplateRef } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { toast } from 'vue-sonner';

import type { Persona } from './types';

import { api } from '@/services/api';

import { useDevice } from '@/composables/useDevice';
import ContentSteps from '@/components/Detail/ContentSteps/ContentSteps.vue';
import type { Props as ContentStepsProps } from '@/components/Detail/ContentSteps/types';
import ResumeInfos from '@/components/Detail/ResumeInfos/ResumeInfos.vue';
import FieldInput from '@/components/Detail/FieldInput/FieldInput.vue';
import BaseSpinner from '@/components/Base/BaseSpinner/BaseSpinner.vue';
import { useFileToBase64 } from '@/composables/useFileToBase64';

const { isMobile } = useDevice();

// defineProps<Props>();
const route = useRoute();

const PageType = computed(() => {
  if (route.name === 'savePersona') return 'creating';

  return 'editing';
});
const personaId = computed<number>(() => Number(route.params.id));
const currentPersona = ref<Persona>({
  id: 0,
  image: '',
  name: '',
  genero: '',
  faixa: '',
  interess: '',
  dores: '',
  actions: '',
});
const personaName = ref<string>();

const loading = ref<boolean>(false);
async function getPersona() {
  loading.value = true;

  await api
    .get(`471398a5-c5eb-4d31-889e-bba4a5d3115b`, {
      params: { id_target: personaId.value },
    })
    .then(({ data }) => {
      personaName.value = data.Persona.name;
      currentPersona.value = {
        id: data.Persona.id,
        name: data.Persona.name,
        image: data.Persona.Imagem,
        actions: data.Persona['ação desejada'],
        dores: data.Persona['pain points'],
        faixa: data.Persona.age_range,
        genero: data.Persona.gender,
        interess: data.Persona.interest,
      };
    })
    .catch((error) => {
      console.error(error);
    });

  loading.value = false;
}

const steps = computed<ContentStepsProps['steps']>(() => {
  return [
    {
      label: 'Nome Persona',
      active: !!currentPersona.value?.name?.length,
      ancor: 'name',
    },
    {
      label: 'Gênero da Persona',
      active: !!currentPersona.value?.genero?.length,
      ancor: 'gender',
    },
    {
      label: 'Faixa Etária',
      active: !!currentPersona.value?.faixa?.length,
      ancor: 'range',
    },
    {
      label: 'Interesses',
      active: !!currentPersona.value?.interess?.length,
      ancor: 'interest',
    },
    {
      label: 'Dores',
      active: !!currentPersona.value?.dores?.length,
      ancor: 'pain',
    },
    {
      label: 'Ação Desejada',
      active: !!currentPersona.value?.actions?.length,
      ancor: 'action',
    },
  ];
});
const resumeInfos = computed(() => {
  return [
    {
      label: 'Nome Persona',
      value: currentPersona.value?.name || '',
    },
    {
      label: 'Gênero da Persona',
      value: currentPersona.value?.genero,
    },
    {
      label: 'Faixa Etária',
      value: currentPersona.value?.faixa || '',
    },
    {
      label: 'Interesses',
      value: currentPersona.value?.interess || '',
    },
  ];
});

const showFeedbackModal = ref(false);
const editingPersona = ref(false); // Está editando um avatar já existente!
const editLoading = ref(false);
const invalidAttempt = ref(false);
const errorName = computed(() => {
  return !currentPersona.value?.name.length;
});
const errorGenero = computed(() => {
  return !currentPersona.value?.genero.length;
});
const errorFaixa = computed(() => {
  return !currentPersona.value?.faixa.length;
});
const errorInterest = computed(() => {
  return !currentPersona.value?.interess.length;
});
const errorDores = computed(() => {
  return !currentPersona.value?.dores.length;
});
const errorAll = computed(() => {
  return (
    errorName.value ||
    errorGenero.value ||
    errorFaixa.value ||
    errorInterest.value ||
    errorDores.value
  );
});
watch(
  () => [
    currentPersona.value.name,
    currentPersona.value.genero,
    currentPersona.value.faixa,
    currentPersona.value.interess,
    currentPersona.value.dores,
    currentPersona.value.actions,
  ],
  () => {
    if (!loading.value) {
      editingPersona.value = true;

      invalidAttempt.value = false;
    }
  }
);
const newProfileImage = ref('');
async function onFileUpload(event: Event) {
  const target = event.target as HTMLInputElement;

  if (target.files?.length && target.files[0].type.includes('image')) {
    const file = target.files[0];
    newProfileImage.value = await useFileToBase64(file).catch((error) => {
      console.error(error);
      alert(
        'Ops! Ocorreu um erro ao tentar subir esse arquivo. Tente novamente mais tarde'
      );
      return '';
    });
    editingPersona.value = true;
  }
}

function upsertAvatar() {
  if (PageType.value === 'creating') return createPersona();

  updateAvatar();
}
async function updateAvatar() {
  if (!editLoading.value) {
    if (errorAll.value) return (invalidAttempt.value = true);

    window.scrollTo(0, 0);
    editLoading.value = true;
    await api
      .get(`31c93e6a-b011-4c17-9937-a897c676698f`, {
        params: {
          id: currentPersona.value?.id,
          nome: currentPersona.value?.name,
          gender: currentPersona.value?.genero,
          age_range: currentPersona.value?.faixa,
          interest: currentPersona.value?.interess,
          pain: currentPersona.value.dores,
          action: currentPersona.value.actions,
          imagem: newProfileImage.value || '',
        },
      })
      .then(({ data }) => {
        currentPersona.value = {
          id: data.avatar.id,
          name: data.avatar.name,
          genero: data.avatar.gender,
          faixa: data.avatar.age_range,
          actions: data.avatar.desired_action,
          dores: data.avatar.pain_points,
          interess: data.avatar.interest,
          image: data.avatar.imagem,
        };

        personaName.value = data.avatar.name;
        toast.success('Persona atualizada com sucesso!');
      })
      .catch((error) => {
        console.error(error);
        toast.error('Ops! Ocorreu um erro ao tentar atualizar.');
        return {};
      });

    editingPersona.value = false;
    editLoading.value = false;
    showFeedbackModal.value = true;
  }
}

const router = useRouter();
async function createPersona() {
  if (!editLoading.value) {
    if (errorAll.value) return (invalidAttempt.value = true);

    window.scrollTo(0, 0);
    editLoading.value = true;
    await api
      .get(`7099b242-11f3-4f0f-87f7-c1a8125cae9b`, {
        params: {
          id_user: 1,
          name: currentPersona.value?.name,
          gender: currentPersona.value.genero,
          age_range: currentPersona.value.faixa,
          interest: currentPersona.value.interess,
          pain_points: currentPersona.value.dores,
          desired_action: currentPersona.value.actions,
          imagem: newProfileImage.value,
        },
      })
      .then(({ data }) => {
        currentPersona.value = {
          id: data.persona.id,
          actions: data.persona.desired_action,
          dores: data.persona.pain_points,
          faixa: data.persona.age_range,
          genero: data.persona.gender,
          image: data.persona.imagem,
          interess: data.persona.interest,
          name: data.persona.name,
        };

        toast.success('Persona criada com sucesso!', {
          action: {
            label: 'Ir para persona',
            onClick: () => router.push(`/personas/${currentPersona.value.id}`),
          },
        });
      })
      .catch((error) => {
        console.error(error);
        toast.error('Ops! Ocorreu um erro ao tentar criar.');
        return {};
      });

    currentPersona.value = {
      id: currentPersona.value.id,
      actions: '',
      dores: '',
      faixa: '',
      genero: '',
      image: '',
      interess: '',
      name: '',
    };

    editingPersona.value = false;
    editLoading.value = false;
    showFeedbackModal.value = true;
  }
}

const wasRemove = ref(false);
async function removePersona() {
  if (!editLoading.value) {
    editLoading.value = true;

    await api
      .get(`2a2cbbdf-4ec7-4593-9872-1996b81e395b`, {
        params: {
          id: currentPersona.value.id,
        },
      })
      .then(() => {
        toast.success('Persona deletada com sucesso!', {
          action: {
            label: 'Ir para início',
            onClick: () => router.push('/'),
          },
        });
      })
      .catch((error) => {
        console.error(error);
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
    if (route.name !== 'savePersona') getPersona();
  },
  { immediate: true }
);

const nameField = useTemplateRef('name-field'); //in
const genderField = useTemplateRef('gender-field'); //in
const rangeFeld = useTemplateRef('range-field'); //tx
const interstField = useTemplateRef('interst-field'); //tx
const painField = useTemplateRef('pain-field'); //tx
const actionField = useTemplateRef('action-field'); //tx
function scrollToElement(element: string) {
  if (element === 'name') {
    nameField.value?.$el.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
    nameField.value?.$el.querySelector('input')?.focus();

    return;
  }
  if (element === 'gender') {
    genderField.value?.$el.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
    genderField.value?.$el.querySelector('input')?.focus();
    return;
  }
  if (element === 'range') {
    rangeFeld.value?.$el.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
    rangeFeld.value?.$el.querySelector('textarea')?.focus();
    return;
  }
  if (element === 'interest') {
    interstField.value?.$el.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
    interstField.value?.$el.querySelector('textarea')?.focus();
    return;
  }
  if (element === 'pain') {
    painField.value?.$el.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
    painField.value?.$el.querySelector('textarea')?.focus();
    return;
  }
  if (element === 'action') {
    actionField.value?.$el.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    });
    actionField.value?.$el.querySelector('textarea')?.focus();
    return;
  }
}
</script>

<template>
  <main class="detail">
    <div v-if="loading" class="detail__initial-loading">
      <BaseSpinner size="small" />
    </div>

    <template v-else-if="currentPersona">
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
                v-if="newProfileImage.length || currentPersona.image.length"
                class="detail__profile-img"
                :src="newProfileImage || currentPersona.image"
                :alt="currentPersona.name"
                :title="currentPersona.name"
              />
              <img
                v-else
                class="detail__no-profile-img"
                src="./img/default-303-303.jpg"
                :alt="currentPersona.name"
                :title="currentPersona.name"
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
              {{
                PageType === 'creating' ? 'Criando nova Persona' : personaName
              }}
            </p>
            <ContentSteps
              class="detail__steps"
              :steps="steps"
              @scroll-to-element="scrollToElement"
            />
            <ResumeInfos class="detail__resume" :infos="resumeInfos" />

            <form
              :key="`form${showFeedbackModal}`"
              @submit.prevent="upsertAvatar"
              class="detail__form"
            >
              <FieldInput
                ref="name-field"
                for="name"
                :error="errorName && invalidAttempt"
                label="Nome Persona*"
                :disabled="editLoading"
                :value="currentPersona.name"
                @change="(newName) => (currentPersona.name = newName)"
                placeholder="Qual o nome da persona?"
              />
              <FieldInput
                ref="gender-field"
                for="genero"
                :error="errorGenero && invalidAttempt"
                label="Gênero da Persona*"
                :value="currentPersona.genero"
                :disabled="editLoading"
                @change="(newGenero) => (currentPersona.genero = newGenero)"
                placeholder="Feminino e Masculino."
              />
              <FieldInput
                ref="range-field"
                for="faixa"
                :error="errorFaixa && invalidAttempt"
                type="textarea"
                :disabled="editLoading"
                label="Faixa Etária*"
                :value="currentPersona.faixa"
                @change="(newFaixa) => (currentPersona.faixa = newFaixa)"
                placeholder="Qual é a idade da persona? Ex: 19 à 39 anos."
              />
              <FieldInput
                ref="interst-field"
                for="interesse"
                :error="errorInterest && invalidAttempt"
                type="textarea"
                :disabled="editLoading"
                label="Interesses*"
                :value="currentPersona.interess"
                @change="
                  (newInterest) => (currentPersona.interess = newInterest)
                "
                placeholder="A persona busca aprender e se desenvolver, tanto pessoal quanto profissionalmente. Ela não tem um objetivo claro de investir imediatamente em um curso."
              />

              <FieldInput
                ref="pain-field"
                for="dores"
                :error="errorDores && invalidAttempt"
                type="textarea"
                :disabled="editLoading"
                label="Dores*"
                :value="currentPersona.dores"
                @change="(newDores) => (currentPersona.dores = newDores)"
                placeholder="Quais são as principais dores e problemas a serem solucionados desta persona?"
              />

              <FieldInput
                ref="action-field"
                for="actions"
                :error="false"
                type="textarea"
                :disabled="editLoading"
                label="Ação Desejada"
                :value="currentPersona.actions"
                @change="(newActions) => (currentPersona.actions = newActions)"
                placeholder="Qual ou quais ações você espera que esta persona faça?"
              />

              <button
                v-if="PageType === 'editing'"
                type="button"
                :class="['detail--btn', 'remove', { disabled: editLoading }]"
                @click="removePersona"
              >
                Excluir Persona
              </button>
              <button
                type="submit"
                :class="[
                  'detail--btn',
                  'save',
                  {
                    disabled: editLoading || !editingPersona || errorAll,
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
