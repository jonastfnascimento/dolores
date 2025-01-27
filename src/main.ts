import './assets/main.css';
import './assets/grid.css';
import './assets/colors.css';
import './assets/skeleton.css';
import './assets/vue-animations.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import App from './App.vue';
import router from './router';

import { layouts } from './layouts/core';

const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);
app.use(pinia);
app.use(router);
app.use(layouts);

app.mount('#app');
