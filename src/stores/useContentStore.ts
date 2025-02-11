import { defineStore } from 'pinia';
import type { AvatarStore } from '@/views/AvatarDetailView/types';
import type { PersonaStore } from '@/views/PersonaDetailView/types';

export const useContentStore = defineStore('content', {
  state: () => ({
    // avatar: null as AvatarStore | null,
    // persona: null as PersonaStore | null,
    // keyword: '',
    avatar: {
      id: '1',
      label: 'Avatar Teste enquanto o chat está fora do ar',
    },
    persona: {
      id: '1',
      label: 'Persona Teste enquanto o chat está fora do ar',
    },
    keyword: 'keyword teste enquanto o chat está fora do ar',
    showModal: false,
  }),
  actions: {
    setContentData(
      avatar: AvatarStore,
      persona: PersonaStore,
      keyword: string
    ) {
      this.avatar = avatar;
      this.persona = persona;
      this.keyword = keyword;
    },
    toggleModal(show: boolean) {
      this.showModal = show;
    },
  },
  getters: {
    isDataValid(state) {
      const isAvatarValid = state.avatar !== null && state.avatar.label !== '';
      const isPersonaValid =
        state.persona !== null && state.persona.label !== '';
      const isKeywordValid = state.keyword !== '';

      return isAvatarValid && isPersonaValid && isKeywordValid;
    },
  },
});
