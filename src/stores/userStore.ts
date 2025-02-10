import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User } from '@/types/userTypes';

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null);
  const isAuthenticated = ref(false);

  const getUser = computed<User | null>(() => {
    return user.value;
  });

  const setUser = (userData: User | null) => {
    user.value = userData;
    isAuthenticated.value = userData ? true : false;

    localStorage.setItem('current_user', JSON.stringify(userData));
  };

  const logout = () => {
    user.value = null;
    isAuthenticated.value = false;
  };

  function authorization() {
    const currentUser = localStorage.getItem('current_user');

    if (!currentUser) return;

    setUser(JSON.parse(currentUser));
  }

  return { getUser, isAuthenticated, setUser, logout, authorization };
});
