import { type RouteRecordRaw } from 'vue-router';
import type { LayoutName } from './types';

import HomeView from '@/views/HomeView/HomeView.vue';
import LoginView from '@/views/LoginView/LoginView.vue';
import ListingView from '@/views/ListingView/ListingView.vue';
import AvatarDetailView from '@/views/AvatarDetailView/AvatarDetailView.vue';
import PersonaDetailView from '@/views/PersonaDetailView/PersonaDetailView.vue';
import ContentDetailView from '@/views/ContentDetailView/ContentDetailView.vue';

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
    path: '/avatars/:id',
    name: 'avatarDetail',
    component: AvatarDetailView,
    meta: { layout: 'DefaultLayout' },
  },
  {
    path: '/create/avatar',
    name: 'saveAvatar',
    component: AvatarDetailView,
    meta: { layout: 'DefaultLayout' },
  },
  {
    path: '/personas/:id',
    name: 'personaDetail',
    component: PersonaDetailView,
    meta: { layout: 'DefaultLayout' },
  },
  {
    path: '/create/persona',
    name: 'savePersona',
    component: PersonaDetailView,
    meta: { layout: 'DefaultLayout' },
  },
  {
    path: '/content/:id',
    name: 'contentDetail',
    component: ContentDetailView,
    meta: { layout: 'DefaultLayout' },
  },
  {
    path: '/create/content',
    name: 'saveContent',
    component: ContentDetailView,
    meta: { layout: 'DefaultLayout' },
  },
  {
    path: '/:slug',
    name: 'listing',
    component: ListingView,
    meta: { layout: 'DefaultLayout' },
  },
];
