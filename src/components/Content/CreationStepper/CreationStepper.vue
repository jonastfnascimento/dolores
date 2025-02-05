<script lang="ts" setup>
import AppButton from '@/components/Common/AppButton/AppButton.vue';
import AppTextarea from '@/components/Common/AppTextArea/AppTextarea.vue';
import { ref, onMounted, computed } from 'vue';
import BottomCreationStepperSkeleton from '../BottomCreationStepperSkeleton/BottomCreationStepperSkeleton.vue';
import BaseModal from '@/components/Base/BaseModal/BaseModal.vue';
import { api } from '@/services/api';

import { useContentStore } from '@/stores/useContentStore';
import { useUserStore } from '@/stores/userStore';

import { toast } from 'vue-sonner';

const emit = defineEmits(['finalize']);

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

interface SEOOutlineResponse {
  Message: string;
  id_pedido: string;
  Keyword: string;
  id_avatar: string;
  Avatar: string;
  id_persona: string;
  Persona: string;
  'Intenção de busca': string;
  SERP: Array<
    Array<{
      url_serp: string;
      title_serp: string;
      domain_serp: string;
      headings: string;
    }>
  >;
}

interface KWClusterResponse {
  Message: string;
  id_pedido: string;
  id_entidades: string;
  entidades: string;
  id_avatar: string;
  Avatar: string;
  id_persona: string;
  Persona: string;
}

interface OutlineResponse {
  Message: string;
  Outline: string;
  id_pedido: string;
  id_Persona: string;
  persona: string;
  id_avatar: string;
  Avatar: string;
}

interface BlogPostResponse {
  Message: string;
  id_blogpost: string;
  Titulo: string;
  'Meta descrição': string;
  'Nome da página': string;
  Slug: string;
  TLDR: string;
  Introdução: string;
  Seções: string;
  Conclusion: string;
}

interface StepInterface {
  label: string;
  number: number;
  selected?: boolean;
  webhookRetrieve?: string;
  webhookUpdate?: string;
  shortExplanation?: string;
  data?:
    | SEOOutlineResponse
    | KWClusterResponse
    | OutlineResponse
    | BlogPostResponse
    | object;
}

// STATES ======== 🔥

const currentStep = ref(1);
const loading = ref(false);
const showShortExplanationModal = ref(false);

const contentStore = useContentStore();
const userStore = useUserStore();

const steps = ref<Array<StepInterface>>([
  {
    label: 'SEO Outline',
    webhookRetrieve: 'cef66e1d-b973-40b0-9704-72478b4670cd',
    webhookUpdate: 'b2e5bc6e-db0e-4b53-aac7-a7c76e42d1dd',
    shortExplanation: `<strong>SEO Outline SEO Outline</strong> cria automaticamente uma estrutura otimizada para o seu conteúdo, usando as palavras-chave que você define.
<br/><br/>
Ele organiza tópicos e subtópicos para ajudar seu texto a ter mais relevância e alcançar melhores posições nos buscadores, sem contar que também organizada os links que estão em relevância.`,
    number: 1,
    data: {},
  },
  {
    label: 'Kw Cluster',
    webhookRetrieve: 'a5fa5a00-2839-4ce2-83a1-26bd7cfd8587',
    webhookUpdate: 'e3f73bed-f4bd-47a3-9dc2-29ff00243fe0',
    shortExplanation: `A <strong>Organização de Palavras-Chave (KW Cluster)</strong> agrupa suas palavras-chave de forma inteligente, criando conjuntos relacionados que ajudam você a estruturar conteúdos mais completos e relevantes, classificando quantas palavras-chave e quais, sejam interessante ter no seu conteúdo.
<br/><br/>
💡 Isso facilita a criação de textos que atendem diferentes intenções de busca e aumentam suas chances de ranquear bem no Google.`,
    number: 2,
    data: {},
  },
  {
    label: 'Entidades',
    webhookRetrieve: 'eed10b3b-891e-41f5-b167-7d15a16bb96f',
    webhookUpdate: '204dbbf6-d76a-4b61-b8f6-19629412a621',
    shortExplanation: `As <strong>Entidades</strong> são conceitos, nomes, marcas, personalidades ou termos específicos que ajudam os buscadores a entenderem melhor o contexto do seu conteúdo e, logo, aumentar sua relevância e credibilidade.
<br/><br/>
No Dolores, identificamos essas palavras importantes para deixar seu texto mais relevante e alinhado com o que as pessoas estão buscando.
<br/><br/>
💡 Pense nelas como as peças-chave que conectam seu conteúdo ao que o público realmente precisa!`,
    number: 3,
    data: {},
  },
  {
    label: 'Outline',
    webhookRetrieve: '7c9730cf-0742-4e84-83b0-55fa4de466a2',
    webhookUpdate: 'dolores-step-S4-new-outline-update',
    shortExplanation: `O <strong>Outline</strong> é a estrutura básica do conteúdo, organizada com tópicos, subtópicos e perguntas específicas que guiam a criação do texto de forma lógica e fluida.
<br/><br/>
Diferentemente do SEO Outline, que é focado diretamente em resultados de busca, o Outline foca em construir a base do seu conteúdo passo a passo, pronta para ser trabalhada e otimizada conforme necessário para ranquear nos buscadores.`,
    number: 4,
    data: {},
  },
  {
    label: 'Blog Post',
    webhookRetrieve: 'dolores-step-S5-blog-post-retrieve',
    webhookUpdate: 'dolores-step-S5-blog-post-update',
    shortExplanation: `Os <strong>Dados Gerais do Conteúdo</strong> são informações principais que mostram como o seu texto foi estruturado e otimizado. Eles incluem detalhes como as palavras-chave utilizadas, o tamanho estimado do texto, a distribuição dos tópicos e as práticas de SEO aplicadas.
<br/><br/>
💡 Para que servem? <br/><br/>
 • Oferecem um resumo da estratégia usada no conteúdo; <br/><br/>
 • Garantem que o texto esteja alinhado com seus objetivos de SEO e comunicação; <br/><br/>
 • Permitem ajustes rápidos antes da publicação, se necessário. <br/><br/>`,
    number: 5,
    data: {},
  },
  {
    label: 'Finished',
    number: 6,
  },
]);

// FUNCTIONS ======== 🔥

const createContent = async (): Promise<void> => {
  loading.value = true;

  try {
    if (!contentStore?.avatar?.id || !contentStore?.persona?.id) {
      toast.error(
        'Erro ao criar conteúdo! Uma persona e um avatar devem ser selecionados'
      );
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

    toast.success('Conteúdo criado com sucesso! Estamos gerando seu Outline');

    contentStore.setCurrentContentId(response.data.id);
  } catch (error) {
    toast.error(`Erro ao criar conteúdo: ${error}`);
  } finally {
    loading.value = false;
  }
};

const fetchStepData = async (
  stepIndex: number,
  forceFetch = false
): Promise<void> => {
  loading.value = true;
  const step = steps.value[stepIndex - 1];

  if (!step || !step.webhookRetrieve) {
    loading.value = false;
    return;
  }

  if (!forceFetch && step.data && Object.keys(step.data).length > 0) {
    loading.value = false;
    return;
  }

  try {
    let id = 25;
    if (
      step.webhookRetrieve === '7c9730cf-0742-4e84-83b0-55fa4de466a2' ||
      step.webhookRetrieve === 'dolores-step-S5-blog-post-retrieve'
    ) {
      id = 28;
    }

    const response = await api.get<
      | SEOOutlineResponse
      | KWClusterResponse
      | OutlineResponse
      | BlogPostResponse
    >(`${step.webhookRetrieve}`, {
      params: {
        id,
        id_user: userStore.getUser?.id,
      },
    });

    toast.success(`O passo ${step.label} foi gerado com sucesso!`);
    steps.value[stepIndex - 1].data = response.data;
  } catch (error) {
    toast.error(`Erro ao carregar ${step.label} ${error}`);
  } finally {
    loading.value = false;
  }
};

const moveStep = async (stepIndex: number): Promise<void> => {
  if (stepIndex > steps.value.length || stepIndex === currentStep.value) return;

  if (stepIndex === steps.value.length) {
    finalize();
    return;
  }

  currentStep.value = stepIndex;
  await fetchStepData(stepIndex);
};

const finalize = (): void => {
  toast.success(
    'Estamos quase lá! Finalize os toques finais e publique seu conteúdo.'
  );

  emit('finalize');
  return;
};

const exportContent = (): void => {
  toast.info('Disponível em breve!');
};

const regenerateContent = async (): Promise<void> => {
  toast.info('Gerando conteúdo novamente!');
  await fetchStepData(currentStep.value, true);
};

const handleStopProduction = (): void => {
  toast.info('Disponível em breve!');
};

const openShortExplanation = (step: StepInterface) => {
  if (step.shortExplanation) {
    showShortExplanationModal.value = true;
  }
};

// COMPUTEDS ======== 🔥

const progress = computed(() => {
  return `${((currentStep.value - 1) / (steps.value.length - 1)) * 100}%`;
});

const currentStepData = computed(() => steps.value[currentStep.value - 1]);

const isFirstStep = computed(() => currentStep.value === 1);

// LIFECYCLE ======== 🔥

onMounted(async () => {
  await createContent();
  currentStep.value = 1;
  await fetchStepData(1);
});
</script>

<template>
  <div class="stepper">
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
          'stepper__step--done': step.number < currentStep,
          'stepper__step--current': step.number === currentStep,
          'stepper__step--last': i === steps.length - 1,
        }"
      >
        <div
          v-if="step.number"
          class="stepper__step-number"
          :id="'step-' + step.number"
          @click="moveStep(step.number)"
        >
          <template v-if="i === steps.length - 1">
            <img
              src="./img/flow-completed-icon.svg"
              alt="Ícone de concluído"
              title="Etapa concluida"
              width="30"
            />
          </template>

          <span v-else>{{ step.number }}</span>
        </div>
      </div>
    </div>

    <Transition name="fade" mode="out-in">
      <div class="stepper__content-container" v-if="!loading">
        <div class="stepper__content-top">
          <p class="stepper__title">{{ currentStepData.label }}</p>
          <img
            src="./img/question-icon.svg"
            alt="Botão com ícone de interrogação"
            title="Quero saber mais"
            @click="openShortExplanation(currentStepData)"
          />
        </div>

        <div v-if="currentStep > 0 && currentStep <= steps.length">
          <div class="stepper__top-buttons">
            <AppButton
              @click="moveStep(currentStep - 1)"
              :disabled="isFirstStep"
              class="stepper__button--back"
              dark
            >
              <template #label> Voltar </template>
            </AppButton>

            <AppButton @click="exportContent" class="stepper__button--export">
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
            :placeholder="currentStepData.label"
            :rows="4"
            :value="currentStepData.label"
            @input="currentStepData.label = $event.target.value"
            class="stepper__textarea"
          />

          <div class="stepper__bottom-buttons">
            <AppButton
              @click="regenerateContent"
              class="stepper__button--regenerate"
            >
              <template #label> Regerar </template>
              <template #icon>
                <img
                  src="./img/regenerate-icon.svg"
                  alt="Botão de voltar"
                  title="Voltar"
                  width="15"
                />
              </template>
            </AppButton>

            <Transition mode="out-in" name="fade">
              <AppButton
                @click="moveStep(currentStep + 1)"
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
                @click="finalize"
                class="stepper__button--save"
              >
                <template #label> Salvar </template>
              </AppButton>
            </Transition>
          </div>

          <p class="stepper__stop-production" @click="handleStopProduction">
            Encerrar Produção
          </p>
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
            v-html="currentStepData.shortExplanation"
          />
        </div>
      </BaseModal>
    </Teleport>
  </div>
</template>

<style src="./styles.css" />
<style scoped src="./styles.scoped.css" />
