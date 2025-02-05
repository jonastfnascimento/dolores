import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User } from '@/types/userTypes';

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null);
  const isAuthenticated = ref(false);

  const getUser = computed<User | null>(() => {
    return user.value;
  });

  const setUser = (userData: User) => {
    user.value = userData;
    isAuthenticated.value = true;

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
    isAuthenticated.value = true;
  }

  return { getUser, isAuthenticated, setUser, logout, authorization };
});
