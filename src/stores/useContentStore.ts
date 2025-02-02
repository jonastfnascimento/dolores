import { defineStore } from 'pinia';
import type { Avatar } from '@/views/AvatarDetailView/types';
import type { Persona } from '@/views/PersonaDetailView/types';

export const useContentStore = defineStore('content', {
  state: () => ({
    avatar: null as Avatar | null,
    persona: null as Persona | null,
    keyword: '',
    showModal: false,
  }),
  actions: {
    setContentData(avatar: Avatar, persona: Persona, keyword: string) {
      this.avatar = avatar;
      this.persona = persona;
      this.keyword = keyword;
    },
    toggleModal(show: boolean) {
      this.showModal = show;
    },
  },
});
