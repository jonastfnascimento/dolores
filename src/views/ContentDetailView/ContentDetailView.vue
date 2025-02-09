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

// INTERFACES AND TYPES ================ 🔥🔥
interface CreateContentResponse {
  id: number;
  message: string;
  keyword: string;
  avatar: string;
  persona: string;
  id_avatar: string;
  id_persona: string;
  status: string;
}

type ContentItem = {
  title: string;
  description: string;
  content: string;
};

interface StepInterface {
  title?: string;
  selected?: boolean;
  webhookRetrieve?: string;
  webhookUpdate?: string;
  generated_content?: Array<ContentItem> | null;
}

type getContentResponse = {
  content: Array<ContentItem>;
};

// ROUTERS AND STORES ========= 🔥🔥
const contentStore = useContentStore();
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

// STATES ===================== 🔥🔥
const currentStep = ref(0);
const loading = ref(false);
const showFinishedContent = ref(false);
const showShortExplanationModal = ref(false);
const explanationModalContent = ref('');
const contentStatus = ref('');
const contentIntervalId = ref<number | null>(null);
const steps = ref<Array<StepInterface>>([
  {
    webhookRetrieve: 'cef66e1d-b973-40b0-9704-72478b4670cd',
    webhookUpdate: 'b2e5bc6e-db0e-4b53-aac7-a7c76e42d1dd',
    generated_content: null,
  },
  {
    webhookRetrieve: 'a5fa5a00-2839-4ce2-83a1-26bd7cfd8587',
    webhookUpdate: 'e3f73bed-f4bd-47a3-9dc2-29ff00243fe0',
    generated_content: null,
  },
  {
    webhookRetrieve: 'eed10b3b-891e-41f5-b167-7d15a16bb96f',
    webhookUpdate: '204dbbf6-d76a-4b61-b8f6-19629412a621',
    generated_content: null,
  },
  {
    webhookRetrieve: '7c9730cf-0742-4e84-83b0-55fa4de466a2',
    webhookUpdate: 'dolores-step-S4-new-outline-update',
    generated_content: null,
  },
  {
    webhookRetrieve: 'dolores-step-S5-blog-post-retrieve',
    webhookUpdate: 'dolores-step-S5-blog-post-update',
    generated_content: null,
  },
]);

// COMPUTEDS ================== 🔥🔥
const avatar = computed(() => contentStore.avatar);
const persona = computed(() => contentStore.persona);
const keyword = computed(() => contentStore.keyword);
const isDataValid = computed(() => contentStore.isDataValid);
const currentContentId = ref<number | null>(null);
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
const isFirstStep = computed(() => currentStep.value === 0);
const isLastStep = computed(() => currentStep.value === steps.value.length);
const accordionItems = computed(() => {
  const result = [];
  const validsSteps = steps.value.filter((step) => step.generated_content);

  validsSteps.forEach((item) => {
    item.generated_content.forEach((contentItem, index) => {
      result.push({
        id: index,
        title: contentItem.title,
        content: contentItem.content,
      });
    });
  });

  return result;
});

// FUCTIONS ================== 🔥🔥
const createContent = async (): Promise<void> => {
  try {
    if (!contentStore?.avatar?.id || !contentStore?.persona?.id) {
      toast.error(
        'Erro ao criar conteúdo! Uma persona e um avatar devem ser selecionados'
      );
      contentStore.toggleModal(true);
      return;
    }

    const params = {
      user: userStore.getUser?.id,
      keyword: contentStore.keyword,
      avatar: contentStore.avatar.id,
      persona: contentStore.persona.id,
      status: 'pesquisar',
    };

    const response = await api.get<CreateContentResponse>(
      'de204e88-fd1a-4c4a-bae3-1973a1a43857',
      {
        params,
      }
    );

    currentContentId.value = response.data.id;

    toast.success(
      'Conteúdo criado com sucesso! Vamos iniciar o processo da criação do conteúdo.'
    );

    const intervalId = setInterval(async () => {
      await getContentStatus();

      if (contentStatus.value === 'SEO Outline Done') {
        clearInterval(intervalId);
        await getStepContent(0);
        await getStepContent(1);
        await getStepContent(2);
      }
    }, 10000);

    contentIntervalId.value = intervalId;
  } catch (error) {
    toast.error(`Erro ao criar conteúdo: ${error}`);
  }
};

const getContentStatus = async (): Promise<void> => {
  const params = {
    id_pedido: 3,
  };

  const response = await api.get(`dolores-status-pedido`, {
    params,
  });

  contentStatus.value = response.data.status;
};

const getContent = async (): Promise<void> => {
  try {
    const response = await api.get<getContentResponse>(
      'de204e88-fd1a-4c4a-bae3-1973a1a43857',
      {
        params: {
          id: currentContentId.value,
          user: userStore.getUser?.id,
        },
      }
    );
  } catch (error) {
    toast.error(`Erro ao carregar conteúdo: ${error}`);
  }
};

const getStepContent = async (stepIndex: number): Promise<void> => {
  loading.value = true;
  const step = steps.value[stepIndex];

  if (!step || !step.webhookRetrieve) {
    loading.value = false;
    return;
  }

  try {
    const response = await api.get(`${step.webhookRetrieve}`, {
      params: {
        id: 3,
        id_user: userStore.getUser?.id,
      },
    });

    const filteredGeneratedContent = response.data.generated_content.filter(
      (item: ContentItem) =>
        !['Keyword', 'Avatar', 'Persona'].includes(item.title)
    );

    console.log(filteredGeneratedContent);

    steps.value[stepIndex].generated_content = [...filteredGeneratedContent];
    steps.value[stepIndex].generated_content.forEach((item: ContentItem) => {
      toast.success(`O passo ${item.title} foi gerado com sucesso!`);
    });
  } catch (error) {
    toast.error(`Erro ao carregar ${step.generated_content} ${error}`);
  } finally {
    loading.value = false;
  }
};

const moveToStep = async (stepIndex: number): Promise<void> => {
  currentStep.value = stepIndex;
};

const backToSteps = (): void => {
  showFinishedContent.value = false;
};

const moveToFinishedContent = (): void => {
  showFinishedContent.value = true;
};

const handleSaveContent = (): void => {
  toast.success('Conteúdo Salvo com sucesso!');

  router.push({
    name: 'listing',
    params: { slug: 'contents' },
  });
};

const handleExportContent = async (): Promise<void> => {
  if (!currentContentId.value) {
    toast.error('Erro ao exportar conteúdo: ID não encontrado.');
    return;
  }

  const exportUrl = `https://n8n.agcinza.com/webhook/dolores-exportar-conteudo?origem=/content/Exportar Conteudo&id=${currentContentId.value}&id_user=${userStore.getUser?.id}`;

  try {
    const { data, headers } = await api.get(exportUrl, {
      responseType: 'blob',
    });

    const blob = new Blob([data], { type: headers['content-type'] });
    const url = window.URL.createObjectURL(blob);

    const a = Object.assign(document.createElement('a'), {
      href: url,
      download: `conteudo_${currentContentId.value}`,
    });

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success('Exportação concluída com sucesso!');
  } catch (error) {
    toast.error(`Erro ao exportar conteúdo: ${error}`);
  }
};

const handleRegenerateContent = async (): Promise<void> => {
  toast.info('Disponível em breve!');
};

const handleStopProduction = (): void => {
  toast.info('Disponível em breve!');
};

const handleDeleteContent = async (): Promise<void> => {
  if (!currentContentId.value) {
    toast.error('Erro ao excluir conteúdo: ID não encontrado.');
    return;
  }

  try {
    await api.delete(`/content/delete/${currentContentId.value}`);
    toast.success('Conteúdo excluído com sucesso!');

    router.push({ name: 'listing', params: { slug: 'contents' } });
  } catch (error) {
    toast.error(`Erro ao excluir conteúdo: ${error}`);
  }
};

const handleOpenShortExplanation = (step: ContentItem) => {
  if (step?.description.length) {
    explanationModalContent.value = step.description;
    showShortExplanationModal.value = true;
  }
};

// LIFECYCLE ================== 🔥🔥
onMounted(async () => {
  loading.value = true;

  if (route.name !== 'saveContent') {
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
                        :class="{ disabled: isFirstStep }"
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
            v-if="isLastStep"
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
