import type { App } from 'vue';

import DefaultLayout from '@/layouts/DefaultLayout.vue';
import LoginLayout from '@/layouts/LoginLayout.vue';

export const layouts = {
  install(app: App) {
    app.component('DefaultLayout', DefaultLayout);
    app.component('LoginLayout', LoginLayout);
  }
};