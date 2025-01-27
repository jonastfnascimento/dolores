import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { User } from '@/types/userTypes';

export const useUserStore = defineStore(
  'user',
  () => {
    const user = ref<User | null>(null);
    const isAuthenticated = ref(false);

    const setUser = (userData: User) => {
      user.value = userData;
      isAuthenticated.value = true;
    };

    const logout = () => {
      user.value = null;
      isAuthenticated.value = false;
    };

    return { user, isAuthenticated, setUser, logout };
  },
  {
    persist: true,
  }
);
