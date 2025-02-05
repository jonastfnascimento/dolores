import { useUserStore } from '@/stores/userStore';
import { createRouter, createWebHistory } from 'vue-router';

import { routes } from './routes';

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const userStore = useUserStore();

  userStore.authorization();

  if (to.name !== 'login' && !userStore.isAuthenticated) {
    return { name: 'login' };
  }

  if (to.name === 'login' && userStore.isAuthenticated) {
    return { name: 'home' };
  }
});

export default router;
