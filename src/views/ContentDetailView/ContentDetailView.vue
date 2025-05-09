<script setup lang="ts">
import { ref, computed, onMounted, onBeforeMount, onBeforeUnmount } from 'vue';
import { useContentStore } from '@/stores/useContentStore';
import { useUserStore } from '@/stores/userStore';
import { api } from '@/services/api';
import { toast } from 'vue-sonner';
import { useRoute, useRouter } from 'vue-router';

import FixedInfos from '@/components/Content/FixedInfos/FixedInfos.vue';
import ContentCreationModal from '@/components/Content/ContentCreationModal/ContentCreationModal.vue';
import AppAccordion from '@/components/Content/ContentAccordion/ContentAccordion.vue';
import AppButton from '@/components/Common/AppButton/AppButton.vue';
import BottomCreationStepperSkeleton from '@/components/Content/BottomCreationStepperSkeleton/BottomCreationStepperSkeleton.vue';
import TextEditor from '@/components/Content/TextEditor/TextEditor.vue';
import BaseModal from '@/components/Base/BaseModal/BaseModal.vue';

import { WEBHOOKS } from './constants.ts';

import type {
  StepInterface,
  ContentItem,
  CreateContentResponse,
  ContentDetailResponse,
} from './types.ts';

const contentStore = useContentStore();
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

const currentStepIndex = ref(0);
const loading = ref(false);
const showFinishedContent = ref(false);
const contentTitle = ref('');
const currentContentId = ref<number | null>(null);
const contentIntervalId = ref<number | null>(null);
const blogPostId = ref<number | null>(null);

const STATUS_TO_STEPS: Record<string, number[]> = {
  'BlogPost concluido': [0, 1, 2, 3, 4],
  'New Outline Generated': [0, 1, 2, 3],
  'SEO Outline Done': [0, 1, 2],
  'Gerar BlogPost': [0, 1, 2],
};

const steps = ref<StepInterface[]>(
  WEBHOOKS.STEPS.map((step) => ({
    webhookRetrieve: step.retrieve,
    webhookUpdate: step.update,
    webhookExport: step.export,
    generated_content: null,
    original_content: null,
  }))
);

const avatar = computed(() => contentStore.avatar);
const persona = computed(() => contentStore.persona);
const keyword = computed(() => contentStore.keyword);
const currentUserId = computed(() => userStore.getUser?.id);
const isDataValid = computed(() => contentStore.isDataValid);
const formattedContentTitle = computed(() =>
  contentTitle.value
    ? contentTitle.value
    : 'Título não definido (blogpost não concluído)'
);

const progress = computed(() => {
  const stepIndex = Math.min(
    Math.max(currentStepIndex.value, 0),
    steps.value.length
  );
  return `${(stepIndex / steps.value.length) * 100}%`;
});

const accordionItems = computed(() => {
  return steps.value
    .filter((step) => step.generated_content)
    .flatMap(
      (step) =>
        step.generated_content?.map((contentItem, index) => ({
          id: index,
          title: contentItem.title,
          content: contentItem.content,
        })) || []
    );
});

const createContent = async (): Promise<void> => {
  try {
    if (!contentStore.avatar?.id || !contentStore.persona?.id) {
      contentStore.toggleModal(true);
      toast.error('Persona e avatar devem ser selecionados');
      return;
    }

    const { data } = await api.get<CreateContentResponse>(
      WEBHOOKS.CREATE_CONTENT,
      {
        params: {
          user: currentUserId.value,
          keyword: contentStore.keyword,
          avatar: contentStore.avatar?.id ?? 0,
          persona: contentStore.persona?.id ?? 0,
          status: 'pesquisar',
        },
      }
    );

    currentContentId.value = data.id;

    toast.success(
      'Conteúdo criado com sucesso! Vamos iniciar o processo de pesquisa!'
    );

    const status = await checkContentStatus('SEO Outline Done');
    if (status) {
      await Promise.all([0, 1, 2].map(getContentStep));
    }
  } catch (error) {
    toast.error('Erro ao criar conteúdo');
    console.error('Erro ao criar conteúdo', error);
  }
};

const getContentDetail = async (): Promise<void> => {
  try {
    currentContentId.value = Number(route.params.id);

    const { data } = await api.get<ContentDetailResponse>(
      WEBHOOKS.GET_CONTENT_DETAIL,
      {
        params: { id: currentContentId.value },
      }
    );

    contentTitle.value = data.Título;
    contentStore.setContentData(
      { label: data.Avatar, id: 0 },
      { label: data.Persona, id: 0 },
      data.Keyword
    );

    const status = await getContentStatus();
    if (status) {
      const stepsToLoad = STATUS_TO_STEPS[status] || [];
      await Promise.all(stepsToLoad.map(getContentStep));
    }
  } catch (error) {
    toast.error('Erro ao carregar dados');
    console.error('Erro ao carregar dados', error);
  }
};

// setTimeout de forma recursiva para evitar sobreposição de requisições
const checkContentStatus = async (targetStatus: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const check = async () => {
      try {
        const status = await getContentStatus();
        if (status === targetStatus) {
          if (contentIntervalId.value) {
            clearTimeout(contentIntervalId.value);
            contentIntervalId.value = null;
          }
          resolve(true);
        } else if (!contentIntervalId.value) {
          resolve(false);
        } else {
          contentIntervalId.value = window.setTimeout(check, 30000);
        }
      } catch (error) {
        if (contentIntervalId.value) {
          clearTimeout(contentIntervalId.value);
          contentIntervalId.value = null;
        }
        toast.error('Erro ao verificar status do conteúdo');
        console.error('Erro ao verificar status:', error);
        resolve(false);
      }
    };

    contentIntervalId.value = window.setTimeout(check, 30000);
  });
};

const getContentStatus = async (): Promise<string | undefined> => {
  if (!currentContentId.value) {
    toast.error('Erro ao obter status: ID não encontrado.');
    return;
  }

  try {
    const { data } = await api.get<{ status: string }>(WEBHOOKS.STATUS_PEDIDO, {
      params: { id_pedido: currentContentId.value },
    });
    return data.status;
  } catch (error) {
    toast.error('Erro ao obter status');
    console.error('Erro ao obter status', error);
    return;
  }
};

const getContentStep = async (stepIndex: number): Promise<void> => {
  try {
    const step = steps.value[stepIndex];

    if (!step.webhookRetrieve) {
      toast.error('Erro ao atualizar etapa: webhook inválido!');
      return;
    }

    const { data } = await api.get(step.webhookRetrieve, {
      params: { id: currentContentId.value, id_user: currentUserId.value },
    });

    loading.value = false;

    if (stepIndex === 4) {
      blogPostId.value = data.generated_content.shift().content;
      contentTitle.value =
        (data.generated_content.find(
          (item: ContentItem) => item.title === 'Título do Blogpost'
        )?.content as string) || null;

      steps.value[stepIndex] = {
        ...step,
        generated_content: data.generated_content,
        original_content:
          data.generated_content?.map((item: ContentItem) => item.content) ||
          null,
      };
    } else {
      steps.value[stepIndex] = {
        ...step,
        generated_content: data.generated_content,
        original_content:
          data.generated_content?.map((item: ContentItem) => item.content) ||
          null,
      };
    }

    if (data?.generated_content) {
      toast.success(
        `Etapa ${data?.generated_content[0]?.title} carregada com sucesso!`
      );
    }
  } catch (error) {
    toast.error('Erro ao carregar etapa');
    console.error('Erro ao carregar etapa', error);
  }
};

const updateStep = async (
  currentStepIndex: number,
  nextStepIndex: number
): Promise<void> => {
  const currentStep = steps.value[currentStepIndex];
  const nextStep = steps.value[nextStepIndex];
  const updateWebhook = currentStep.webhookUpdate;
  const contentToSend = currentStep.generated_content?.[0]?.content;

  if (!updateWebhook || !nextStep) {
    toast.error('Erro ao atualizar conteúdo: webhook inválido!');
    console.error('Erro ao atualizar conteúdo: webhook inválido!');
    return;
  }

  if (!contentToSend || !contentToSend.length) {
    toast.error('Ao menos algum conteúdo deve ser preenchido!');
    console.error('Ao menos algum conteúdo deve ser preenchido!');
    return;
  }

  const params: Record<string, unknown> = {
    id: currentContentId.value,
    id_user: currentUserId.value,
  };

  switch (currentStepIndex) {
    case 0:
      params.intencao_de_busca = String(contentToSend);
      break;
    case 1:
      params.keywords = String(contentToSend);
      break;
    case 2:
      params.entidades = String(contentToSend);
      break;
    case 3:
      params.outline = String(contentToSend);
      break;
  }

  try {
    await api.get(updateWebhook, { params });
    toast.success(
      `Conteúdo da etapa ${currentStepIndex + 1} atualizado com sucesso!`
    );

    if (nextStepIndex === 3) {
      toast.success('Iniciando o processo de pesquisa da etapa 4...');
      const status = await checkContentStatus('New Outline Generated');
      if (status) await getContentStep(3);
    }

    if (nextStepIndex === 4) {
      toast.success('Iniciando o processo de pesquisa da etapa 5...');
      const status = await checkContentStatus('BlogPost concluido');
      if (status) await getContentStep(4);
    }
  } catch (error) {
    toast.error(`Erro ao atualizar conteudo da etapa ${currentStepIndex + 1}`);
    console.error(
      `Erro ao atualizar conteudo da etapa ${currentStepIndex + 1}`,
      error
    );
  }
};

const moveToStep = async (nextStepIndex: number): Promise<void> => {
  if (nextStepIndex === currentStepIndex.value) {
    toast.info('Você já está nessa etapa!');
    return;
  }

  if (
    nextStepIndex !== currentStepIndex.value + 1 &&
    nextStepIndex !== currentStepIndex.value - 1
  ) {
    toast.info('Etapa inválida! Você só pode avançar ou voltar uma etapa.');
    return;
  }

  if (nextStepIndex < 0 || nextStepIndex >= steps.value.length) {
    toast.error('Etapa inválida! Índice inexiste.');
    return;
  }

  loading.value = true;

  const { canSkip } = await validateStepChange(nextStepIndex);

  if (!canSkip) {
    await updateStep(currentStepIndex.value, nextStepIndex);
  }

  currentStepIndex.value = nextStepIndex;
  loading.value = false;
};

const validateStepChange = async (nextStepIndex: number) => {
  // 1. Se for voltar uma etapa, pode pular a verificação
  if (nextStepIndex === currentStepIndex.value - 1) {
    return { canSkip: true };
  }

  // 2. Verifica se o conteúdo da etapa atual foi modificado
  const currentStep = steps.value[currentStepIndex.value];
  const isContentUnchanged =
    Array.isArray(currentStep.original_content) &&
    Array.isArray(currentStep.generated_content) &&
    currentStep.generated_content.length ===
      currentStep.original_content.length &&
    currentStep.generated_content.every(
      (item, index) =>
        currentStep.original_content &&
        item.content === currentStep.original_content[index]
    );

  //

  if (currentStepIndex.value === 4 && !isContentUnchanged) {
    return { canSkip: false };
  }

  // 3. Verifica a partir do status atual se a próxima etapa já deve existir
  const currentStatus = await getContentStatus();
  const isNextStepAvailable =
    currentStatus && STATUS_TO_STEPS[currentStatus]?.includes(nextStepIndex);

  // 4. Retorna se pode pular a atualização
  return {
    canSkip: isContentUnchanged && isNextStepAvailable,
  };
};

// NAVIGATION
const backToSteps = (): void => {
  showFinishedContent.value = false;
};

const moveToFinishedContent = async (): Promise<void> => {
  if (currentStepIndex.value === 4) {
    const currentStep = steps.value[currentStepIndex.value];

    const isContentUnchanged =
      Array.isArray(currentStep.original_content) &&
      Array.isArray(currentStep.generated_content) &&
      currentStep.generated_content.length ===
        currentStep.original_content.length &&
      currentStep.generated_content.every(
        (item, index) =>
          currentStep.original_content &&
          item.content === currentStep.original_content[index]
      );

    if (isContentUnchanged) {
      showFinishedContent.value = true;
      return;
    }

    const updateWebhook = currentStep.webhookUpdate;

    const params: Record<string, unknown> = {
      id: currentContentId.value,
      id_user: currentUserId.value,
      id_blogpost: blogPostId.value,
      Titulo: String(currentStep.generated_content?.[0]?.content), // titulo
      introducao: String(currentStep.generated_content?.[1]?.content), // introducao
      tldr: String(currentStep.generated_content?.[2]?.content), // resumo do conteúdo
      secoes: String(currentStep.generated_content?.[3]?.content), // Seções do conteúdo
      conclusao: String(currentStep.generated_content?.[4]?.content), // Conclusão
      ['meta description']: String(currentStep.generated_content?.[5]?.content), // Meta Description
      ['nome da pagina']: String(currentStep.generated_content?.[6]?.content), // Nome da página
      slug: String(currentStep.generated_content?.[7]?.content), // URL Amigável
    };

    if (!updateWebhook) {
      toast.error('Erro ao atualizar conteudo da etapa 5');
      console.error('Erro ao atualizar conteudo da etapa 5');
      return;
    }

    await api.get(updateWebhook, { params });
    toast.success(`Conteúdo da etapa 5 atualizado com sucesso!`);
  }

  showFinishedContent.value = true;
};
const handleSaveContent = (): void => {
  toast.success('Conteúdo Salvo com sucesso!');

  setTimeout(() => {
    router.push({ name: 'listing', params: { slug: 'contents' } });
  }, 1000);
};

// DELETE
const loadingDelete = ref(false);
const handleDeleteContent = async (): Promise<void> => {
  loadingDelete.value = true;

  if (!currentContentId.value) {
    toast.error('Erro ao excluir conteúdo, ID não encontrado.');
    console.error('Erro ao excluir conteúdo, ID não encontrado.');
    return;
  }

  try {
    await api.get(`${WEBHOOKS.DELETE_CONTENT}?id=${currentContentId.value}`);

    toast.success('Conteúdo excluído com sucesso! Redirecionando...');

    setTimeout(() => {
      router.push({ name: 'listing', params: { slug: 'contents' } });
    }, 1000);
  } catch {
    toast.error('Erro ao excluir conteúdo!');
    console.error('Erro ao excluir conteúdo!');
  }

  loadingDelete.value = false;
};

// EXPLANATION MODAL
const showShortExplanationModal = ref(false);
const explanationModalContent = ref('');
const handleOpenShortExplanation = (step: ContentItem) => {
  if (step?.description?.length) {
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
      toast.error('Erro ao exportar conteúdo, webhook inválido!');
      console.error('Erro ao exportar conteúdo, webhook inválido!');
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
      console.error(
        'Erro ao exportar conteúdo: Link de download não encontrado!'
      );
    }
  } catch (error) {
    toast.error('Erro ao exportar conteúdo. Tente novamente.');
    console.error('Erro ao exportar conteúdo', error);
  } finally {
    loadingExport.value = false;
  }
};
const getCurrentExportStep = () => {
  return currentStepIndex.value === 4 || showFinishedContent.value
    ? steps.value[4]
    : steps.value[currentStepIndex.value];
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

// STOP PRODUCTION
const showStopProductionModal = ref(false);
const savingAfterLeave = ref(false);

const handleSaveAfterLeave = async (): Promise<void> => {
  savingAfterLeave.value = true;

  try {
    if (currentStepIndex.value === 4) {
      await moveToFinishedContent();
      toast.success('Conteúdo salvo com sucesso!');
      return;
    }
    await updateStep(currentStepIndex.value, currentStepIndex.value);
    toast.success('Conteúdo salvo com sucesso!');
  } catch (error) {
    console.error('Erro ao salvar conteúdo', error);
  } finally {
    setTimeout(() => {
      router.push({ name: 'listing', params: { slug: 'contents' } });
    }, 1000);
    savingAfterLeave.value = false;
  }
};

const handleConfirmLeave = async (): Promise<void> => {
  setTimeout(() => {
    router.push({ name: 'listing', params: { slug: 'contents' } });
  }, 1000);
};

const handleStopProduction = (): void => {
  showStopProductionModal.value = true;
};

// LIFECYCLE
onMounted(async () => {
  try {
    loading.value = true;

    if (route.name === 'contentDetail') {
      await getContentDetail();
      if (!isDataValid.value) contentStore.toggleModal(true);
      return;
    }

    if (!isDataValid.value) {
      contentStore.toggleModal(true);
      return;
    }

    await createContent();
  } finally {
    loading.value = false;
  }
});

onBeforeMount(() => {
  if (contentIntervalId.value) {
    clearInterval(contentIntervalId.value);
  }
});

onBeforeUnmount(() => {
  if (contentIntervalId.value) {
    clearTimeout(contentIntervalId.value);
    contentIntervalId.value = null;
  }
});

// COMING SOON
const handleRegenerateContent = async (): Promise<void> => {
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
      :avatarLabel="
        avatar?.label.length ? avatar.label : 'Avatar não selecionado'
      "
      :personaLabel="persona?.label ? persona.label : 'Persona não selecionada'"
      :keyword="keyword || 'Keyword não escolhida'"
      :isDataValid="isDataValid"
    />

    <Transition name="fade" mode="in-out">
      <div v-if="isDataValid">
        <Transition name="fade" mode="out-in">
          <div class="stepper" v-if="!showFinishedContent">
            <div class="stepper__progress-container" :class="{ loading }">
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
                  'stepper__step--done': i < currentStepIndex,
                  'stepper__step--current': i === currentStepIndex,
                  'stepper__step--disabled':
                    i !== currentStepIndex + 1 && i !== currentStepIndex - 1,

                  'stepper__step--last': currentStepIndex === steps.length - 1,
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
                  v-for="(content, i) in steps[currentStepIndex]
                    .generated_content"
                  :key="i"
                >
                  <div class="stepper__content-top">
                    <div>
                      <img src="./img/star.svg" alt="Estrela vermelha" />
                      <p class="stepper__title">{{ content.title }}</p>
                    </div>
                    <img
                      src="./img/question-icon.svg"
                      alt="Botão com ícone de interrogação"
                      title="Quero saber mais"
                      @click="handleOpenShortExplanation(content)"
                    />
                  </div>

                  <div>
                    <div class="stepper__top-buttons" v-if="i === 0">
                      <img
                        src="./img/back-arrow.svg"
                        alt="Seta de voltar"
                        title="Clique para voltar"
                        width="21"
                        class="finished__back-arrow"
                        :class="{ disabled: currentStepIndex === 0 }"
                        @click="moveToStep(currentStepIndex - 1)"
                      />

                      <AppButton
                        @click="handleExportContent"
                        class="stepper__button--export"
                        :loading="loadingExport"
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

                    <TextEditor
                      v-model="content.content"
                      class="stepper__textarea"
                      :id="`editor-${currentStepIndex}-${i}`"
                      :key="i"
                      :class="{
                        ['stepper__editor--last']:
                          currentStepIndex === steps.length - 1,
                      }"
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

              <BaseModal
                :show="showStopProductionModal"
                @close="showStopProductionModal = false"
                class="stopProductionModal"
              >
                <div class="stopProductionModal__modal-content">
                  <p class="stopProductionModal__modal-text">
                    Deseja salvar o conteúdo da etapa atual antes de encerrar?
                  </p>

                  <div class="stopProductionModal__modal-buttons">
                    <AppButton @click="handleConfirmLeave">
                      <template #label> Encerrar </template>
                    </AppButton>
                    <AppButton
                      @click="handleSaveAfterLeave"
                      class="stopProductionModal__button--export"
                      :loading="savingAfterLeave"
                      dark
                    >
                      <template #label> Salvar </template>
                    </AppButton>
                  </div>
                </div>
              </BaseModal>
            </Teleport>
          </div>

          <div class="finished" v-else>
            <div>
              <h2 class="finished__title">
                <img src="./img/star.svg" alt="Estrela vermelha" />
                <span>
                  {{ formattedContentTitle }}
                </span>
              </h2>
            </div>

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
                @click="moveToStep(currentStepIndex + 1)"
                v-if="currentStepIndex < steps.length - 1"
                :disabled="!(currentStepIndex < steps.length)"
                dark
                class="stepper__button--next"
              >
                <template #label> Próxima Etapa </template>
              </AppButton>

              <AppButton
                dark
                v-else-if="currentStepIndex === steps.length - 1"
                class="stepper__button--save"
                @click="moveToFinishedContent"
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

            <span v-if="loadingDelete" class="loader"></span>
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
