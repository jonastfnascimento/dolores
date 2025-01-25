import { type RouteRecordRaw } from 'vue-router';
import type { LayoutName } from './types';

import HomeView from '@/views/HomeView/HomeView.vue';
import LoginView from '@/views/LoginView/LoginView.vue';

declare module 'vue-router' {
  interface RouteMeta {
    layout: LayoutName;
  }
}

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { layout: 'DefaultLayout' },
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { layout: 'LoginLayout' },
  },
  {
    path: '/:slug',
    name: 'listing',
    component: () => import('@/views/ListingView/Listingview.vue'),
    meta: { layout: 'DefaultLayout' },
  },
];
