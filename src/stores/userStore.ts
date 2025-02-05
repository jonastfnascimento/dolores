import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User } from '@/types/userTypes';

export const useUserStore = defineStore(
  'user',
  () => {
    const user = ref<User | null>(null);
    const isAuthenticated = ref(false);

    const getUser = computed<User | null>(() => {
      return user.value;
    });

    const setUser = (userData: User) => {
      user.value = userData;
      isAuthenticated.value = true;
    };

    const logout = () => {
      user.value = null;
      isAuthenticated.value = false;
    };

    return { getUser, isAuthenticated, setUser, logout };
  },
  {
    persist: true,
  }
);
