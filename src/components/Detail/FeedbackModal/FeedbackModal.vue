<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import type { Emits, Props } from './types';
import BaseModal from '@/components/Base/BaseModal/BaseModal.vue';

const props = withDefaults(defineProps<Props>(), {
  entityUrl: '',
});
const emit = defineEmits<Emits>();

const route = useRoute();
const PageType = computed(() => {
  if (route.name === 'saveAvatar') return 'saveAvatar';
  if (route.name === 'avatarDetail') return 'avatarDetail';
  if (route.name === 'personaDetail') return 'personaDetail';

  return 'savePersona';
});
const feedbackText = computed(() => {
  if (props.hasSuccess) {
    if (props.remove) return 'Removido com sucesso!';
    if (PageType.value === 'avatarDetail')
      return 'Avatar atualizado com sucesso!';
    if (PageType.value === 'saveAvatar') return 'Avatar criado com sucesso!';
    if (PageType.value === 'personaDetail')
      return 'Persona atualizada com sucesso!';

    return 'Persona criada com sucesso!';
  }

  if (props.remove) return 'Ops! Ocorreu um erro ao tentar remover.';
  if (PageType.value === 'avatarDetail' || PageType.value === 'personaDetail')
    return 'Ops! Ocorreu um erro ao tentar atualizar.';

  return 'Ops! Ocorreu um erro ao tentar criar.';
});

function onClose() {
  if (!props.remove) return emit('close');
}
</script>

<template>
  <Teleport to="#teleports">
    <BaseModal
      :show="props.show"
      @close="onClose"
      :class="['feedbackmodal', { success: props.hasSuccess }]"
    >
      <div class="feedbackmodal__content">
        <p class="feedbackmodal__p">{{ feedbackText }}</p>

        <div class="feedbackmodal__btns-container">
          <RouterLink
            v-if="
              ((PageType === 'saveAvatar' || PageType === 'savePersona') &&
                hasSuccess) ||
              props.remove
            "
            class="feedbackmodal--btn-goto"
            @click="emit('close')"
            :to="props.entityUrl"
          >
            {{
              props.remove
                ? 'Ir para tela inicial'
                : PageType === 'saveAvatar'
                  ? 'Ir para o novo Avatar'
                  : 'Ir para a nova Persona'
            }}
          </RouterLink>
          <button
            v-if="!props.remove"
            class="feedbackmodal--btn"
            @click="emit('close')"
          >
            ok
          </button>
        </div>
      </div>
    </BaseModal>
  </Teleport>
</template>

<style scoped src="./styles.scoped.css" />
