<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useContentStore } from '@/stores/useContentStore';
import { useUserStore } from '@/stores/userStore';
import { api } from '@/services/api';
import { toast } from 'vue-sonner';
import { useRoute, useRouter } from 'vue-router';

import FixedInfos from '@/components/Content/FixedInfos/FixedInfos.vue';
import ContentCreationModal from '@/components/Content/ContentCreationModal/ContentCreationModal.vue';
import AppAccordion from '@/components/Content/ContentAccordion/ContentAccordion.vue';
import AppButton from '@/components/Common/AppButton/AppButton.vue';
import AppTextarea from '@/components/Common/AppTextArea/AppTextarea.vue';
import BottomCreationStepperSkeleton from '@/components/Content/BottomCreationStepperSkeleton/BottomCreationStepperSkeleton.vue';
import BaseModal from '@/components/Base/BaseModal/BaseModal.vue';

import { WEBHOOKS } from './constants.ts';

import type {
  StepInterface,
  ContentItem,
  CreateContentResponse,
} from './types.ts';

const contentStore = useContentStore();
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

const currentStep = ref(0);
const loading = ref(false);

const showFinishedContent = ref(false);

const currentContentId = ref<number | null>(null);
const contentIntervalId = ref<number | null>(null);
const steps = ref<Array<StepInterface>>(
  WEBHOOKS.STEPS.map((step) => ({
    webhookRetrieve: step.retrieve,
    webhookUpdate: step.update,
    webhookExport: step.export,
    generated_content: null,
  }))
);

const avatar = computed(() => contentStore.avatar);
const persona = computed(() => contentStore.persona);
const keyword = computed(() => contentStore.keyword);
const currentUserId = computed(() => userStore.getUser?.id);
const isDataValid = computed(() => contentStore.isDataValid);

const progress = computed(() => {
  if (steps.value.length === 0) {
    return '0%';
  }

  const stepIndex = Math.min(
    Math.max(currentStep.value, 0),
    steps.value.length
  );

  return `${(stepIndex / steps.value.length) * 100}%`;
});

const accordionItems = computed(() => {
  return steps.value
    .filter((step) => step.generated_content)
    .flatMap((step) =>
      step.generated_content
        ? step.generated_content.map((contentItem, index) => ({
            id: index,
            title: contentItem.title,
            content: contentItem.content,
          }))
        : []
    );
});

const createContent = async (): Promise<void> => {
  try {
    if (!contentStore?.avatar?.id || !contentStore?.persona?.id) {
      toast.error(
        'Erro ao criar conteúdo! Uma persona e um avatar devem ser selecionados.'
      );
      contentStore.toggleModal(true);
      return;
    }

    const params = {
      user: currentUserId.value,
      keyword: contentStore.keyword,
      avatar: contentStore.avatar.id,
      persona: contentStore.persona.id,
      status: 'pesquisar',
    };

    const { data } = await api.get<CreateContentResponse>(
      WEBHOOKS.CREATE_CONTENT,
      { params }
    );

    currentContentId.value = data.id;

    toast.success(
      'Conteúdo criado com sucesso! Vamos iniciar o processo da criação do SEO Outline.'
    );

    startContentStatusCheck();
  } catch (error) {
    console.error('Erro ao criar conteúdo:', error);
    toast.error('Erro ao criar conteúdo. Tente novamente.');
  }
};

const startContentStatusCheck = () => {
  const intervalId = setInterval(async () => {
    const status = await getContentStatus();

    if (status === 'SEO Outline Done') {
      clearInterval(intervalId);
      await fetchInitialSteps();
    }
  }, 10000);

  contentIntervalId.value = intervalId;
};

const fetchInitialSteps = async () => {
  await Promise.all([getContentStep(0), getContentStep(1), getContentStep(2)]);
};

const getContentStatus = async (): Promise<string | null> => {
  if (!currentContentId.value) {
    toast.error('Erro ao criar conteúdo: ID não encontrado.');
    return null;
  }

  try {
    const { data } = await api.get<{ status: string }>(WEBHOOKS.STATUS_PEDIDO, {
      params: { id_pedido: currentContentId.value },
    });

    return data.status;
  } catch {
    toast.error('Erro ao obter status do conteúdo.');
    return null;
  }
};

const getContent = async (): Promise<void> => {
  currentContentId.value = Number(route.params.id);

  const stepsToLoad: Record<string, number[]> = {
    'BlogPost concluido': [0, 1, 2, 3, 4],
    'New Outline Generated': [0, 1, 2, 3],
    'SEO Outline Done': [0, 1, 2],
    'Gerar BlogPost': [0, 1, 2],
  };

  try {
    const status = await getContentStatus();
    if (status && status.length) {
      const steps = stepsToLoad[status] || [];
      await Promise.all(steps.map(getContentStep));
    }
  } catch {
    toast.error('Erro ao carregar conteúdo!');
  }
};

const getContentStep = async (stepIndex: number): Promise<void> => {
  loading.value = true;

  const step = steps.value[stepIndex];
  if (!step || !step.webhookRetrieve) {
    loading.value = false;
    toast.error('Erro ao carregar conteúdo: Webhook inválido!');
    return;
  }

  try {
    const { data } = await api.get(step.webhookRetrieve, {
      params: {
        id: currentContentId.value,
        id_user: currentUserId.value,
      },
    });

    if (!data.generated_content || !Array.isArray(data.generated_content)) {
      toast.error('Erro ao carregar conteúdo!');
    }

    const filteredContent = filteredContentStepReponse(data.generated_content);

    steps.value[stepIndex] = {
      ...step,
      generated_content: filteredContent,
    };

    filteredContent.forEach((item) => {
      toast.success(
        `O conteúdo da etapa ${item.title} foi carregado com sucesso!`
      );
    });
  } catch {
    toast.error('Erro ao carregar conteúdo!');
  } finally {
    loading.value = false;
  }
};

const filteredContentStepReponse = (content: ContentItem[]): ContentItem[] => {
  return content.filter(
    (item) => !['Keyword', 'Avatar', 'Persona'].includes(item.title)
  );
};

const handleSaveContent = (): void => {
  toast.success('Conteúdo Salvo com sucesso!');

  router.push({
    name: 'listing',
    params: { slug: 'contents' },
  });
};

// STEPS NAVIGATION
const moveToStep = async (stepIndex: number): Promise<void> => {
  if (stepIndex < 0 || stepIndex >= steps.value.length) {
    toast.error('Etapa inválida!');
    return;
  }
  currentStep.value = stepIndex;
};
const backToSteps = (): void => {
  showFinishedContent.value = false;
};
const moveToFinishedContent = (): void => {
  showFinishedContent.value = true;
};

// DELETE
const handleDeleteContent = async (): Promise<void> => {
  if (!currentContentId.value) {
    toast.error('Erro ao excluir conteúdo: ID não encontrado.');
    return;
  }

  try {
    await api.get(`${WEBHOOKS.DELETE_CONTENT}/${currentContentId.value}`);

    toast.success('Conteúdo excluído com sucesso!');

    router.push({ name: 'listing', params: { slug: 'contents' } });
  } catch {
    toast.error('Erro ao excluir conteúdo!');
  }
};

// EXPLANATION MODAL
const showShortExplanationModal = ref(false);
const explanationModalContent = ref('');
const handleOpenShortExplanation = (step: ContentItem) => {
  if (step?.description.length) {
    explanationModalContent.value = step.description;
    showShortExplanationModal.value = true;
  }
};

// EXPORT CONTENT
const loadingExport = ref(false);
const handleExportContent = async (): Promise<void> => {
  loadingExport.value = true;

  try {
    const step = getCurrentExportStep();
    if (!step?.webhookExport) {
      toast.error('Erro ao exportar conteúdo: Webhook inválido!');
      return;
    }

    const downloadLink = await fetchExportLink(step.webhookExport);
    if (downloadLink) {
      initiateDownload(downloadLink);
      toast.info('Iniciando o download do conteúdo!');
    } else {
      toast.error(
        'Erro ao exportar conteúdo: Link de download não encontrado!'
      );
    }
  } catch (error) {
    console.error('Erro ao exportar conteúdo:', error);
    toast.error('Erro ao exportar conteúdo. Tente novamente.');
  } finally {
    loadingExport.value = false;
  }
};
const getCurrentExportStep = () => {
  return currentStep.value === 4 || showFinishedContent.value
    ? steps.value[4]
    : steps.value[currentStep.value];
};
const fetchExportLink = async (webhookUrl: string): Promise<string | null> => {
  try {
    const { data } = await api.get<{ 'Link Download'?: string }>(webhookUrl, {
      params: {
        id: currentContentId.value,
        id_user: currentUserId.value,
      },
    });

    return data['Link Download'] ?? null;
  } catch (error) {
    console.error('Erro ao buscar link de download:', error);
    return null;
  }
};
const initiateDownload = (downloadLink: string): void => {
  const a = document.createElement('a');
  a.href = downloadLink;
  a.download = 'conteudo_exportado';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

onMounted(async () => {
  loading.value = true;

  if (route.name && route.name === 'contentDetail') {
    await getContent();
    return;
  }

  if (!isDataValid.value) {
    contentStore.toggleModal(true);
    return;
  }

  await createContent();
});
onUnmounted(() => {
  if (contentIntervalId.value) {
    clearInterval(contentIntervalId.value);
  }
});

// COOMING SOON
const handleRegenerateContent = async (): Promise<void> => {
  toast.info('Disponível em breve!');
};
const handleStopProduction = (): void => {
  toast.info('Disponível em breve!');
};
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
        <Transition name="fade" mode="out-in">
          <div class="stepper" v-if="!showFinishedContent">
            <div class="stepper__progress-container">
              <div class="stepper__progress">
                <div
                  class="stepper__progress-bar"
                  role="progressbar"
                  :style="{ width: progress }"
                ></div>
              </div>
              <div
                class="stepper__step"
                v-for="(step, i) in steps"
                :key="i"
                :class="{
                  'stepper__step--done': i < currentStep,
                  'stepper__step--current': i === currentStep,
                  'stepper__step--last': currentStep === steps.length - 1,
                  'stepper__step--disabled': !step.generated_content,
                }"
              >
                <div
                  class="stepper__step-number"
                  :id="'step-' + (i + 1)"
                  @click="moveToStep(i)"
                >
                  <span>{{ i + 1 }}</span>
                </div>
              </div>

              <div
                class="stepper__step stepper__step--last"
                @click="moveToFinishedContent()"
              >
                <div class="stepper__step-number">
                  <img
                    src="./img/flow-completed-icon.svg"
                    alt="Ícone de concluído"
                    title="Etapa concluida"
                    width="30"
                  />
                </div>
              </div>
            </div>

            <Transition name="fade" mode="out-in">
              <div v-if="!loading" class="stepper__content-wrapper">
                <div
                  class="stepper__content-container"
                  v-for="(content, i) in steps[currentStep].generated_content"
                  :key="i"
                >
                  <div class="stepper__content-top">
                    <p class="stepper__title">{{ content.title }}</p>
                    <img
                      src="./img/question-icon.svg"
                      alt="Botão com ícone de interrogação"
                      title="Quero saber mais"
                      @click="handleOpenShortExplanation(content)"
                    />
                  </div>

                  <div>
                    <div class="stepper__top-buttons">
                      <img
                        src="./img/back-arrow.svg"
                        alt="Seta de voltar"
                        title="Clique para voltar"
                        width="21"
                        class="finished__back-arrow"
                        :class="{ disabled: currentStep === 0 }"
                        @click="moveToStep(currentStep - 1)"
                      />

                      <AppButton
                        @click="handleExportContent"
                        class="stepper__button--export"
                      >
                        <template #label> Exportar </template>
                        <template #icon>
                          <img
                            src="./img/export-icon.svg"
                            alt="Botão de exportar"
                            title="Exportar"
                            width="15"
                          />
                        </template>
                      </AppButton>
                    </div>

                    <AppTextarea
                      :placeholder="content.title"
                      :rows="4"
                      :value="content.content"
                      @input="content.content = $event.target.value"
                      class="stepper__textarea"
                    />
                  </div>
                </div>
              </div>

              <BottomCreationStepperSkeleton v-else />
            </Transition>

            <Teleport to="#teleports">
              <BaseModal
                :show="showShortExplanationModal"
                @close="showShortExplanationModal = false"
                class="stepper__modal"
              >
                <div class="stepper__modal-content">
                  <p
                    class="stepper__modal-text"
                    v-html="explanationModalContent"
                  />
                </div>
              </BaseModal>
            </Teleport>
          </div>

          <div class="finished" v-else>
            <h2 class="finished__title">
              Plataforma de ensino EaD é boa opção para você?
            </h2>

            <img
              src="./img/back-arrow.svg"
              alt="Seta de voltar"
              title="Clique para voltar"
              width="21"
              class="finished__back-arrow"
              @click="backToSteps"
            />

            <AppAccordion
              class="finished__accordion"
              :items="accordionItems"
              v-if="accordionItems.length"
            />
          </div>
        </Transition>

        <template v-if="!loading">
          <div class="stepper__bottom-buttons">
            <Transition mode="out-in" name="fade">
              <AppButton
                v-if="showFinishedContent"
                @click="handleExportContent"
                class="finished__button--export"
              >
                <template #label> Exportar </template>
                <template #icon>
                  <img
                    src="./img/export-icon.svg"
                    alt="Botão de exportar"
                    title="Exportar"
                    width="15"
                  />
                </template>
              </AppButton>

              <AppButton
                v-else
                @click="handleRegenerateContent"
                class="stepper__button--regenerate"
              >
                <template #label> Regerar </template>
                <template #icon>
                  <img
                    src="./img/regenerate-icon.svg"
                    alt="Botão de Regerar"
                    title="Regerar"
                    width="15"
                  />
                </template>
              </AppButton>
            </Transition>

            <Transition mode="out-in" name="fade" v-if="!showFinishedContent">
              <AppButton
                @click="moveToStep(currentStep)"
                v-if="currentStep < steps.length - 1"
                :disabled="!(currentStep < steps.length)"
                dark
                class="stepper__button--next"
              >
                <template #label> Próxima Etapa </template>
              </AppButton>

              <AppButton
                dark
                v-else-if="currentStep === steps.length - 1"
                @click="moveToStep(currentStep)"
                class="stepper__button--save"
              >
                <template #label> Salvar </template>
              </AppButton>
            </Transition>

            <AppButton
              dark
              v-if="showFinishedContent"
              @click="handleSaveContent"
              class="stepper__button--save"
            >
              <template #label> Concluir </template>
            </AppButton>
          </div>

          <p
            v-if="showFinishedContent"
            class="stepper__delete-content"
            @click="handleDeleteContent"
          >
            Excluir Conteúdo
          </p>

          <p
            v-else
            class="stepper__stop-production"
            @click="handleStopProduction"
          >
            Encerrar Produção
          </p>
        </template>
      </div>

      <div v-else>
        <Teleport to="#teleports">
          <ContentCreationModal />
        </Teleport>
      </div>
    </Transition>
  </div>
</template>

<style scoped src="./styles.scoped.css" />
<style src="./styles.css" />
<style src="@/assets/vue-animations.css" />
