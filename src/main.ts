import './assets/main.css';
import './assets/grid.css';
import './assets/colors.css';
import './assets/skeleton.css';
import './assets/vue-animations.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

import { layouts } from './layouts/core';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(layouts);

app.mount('#app');
