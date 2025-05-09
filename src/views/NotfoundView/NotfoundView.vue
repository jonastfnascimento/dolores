<script setup lang="ts">
import AppButton from '@/components/Common/AppButton/AppButton.vue';
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const countdownTime = ref(2 * 60 + 30); // 2 minutos e 30 segundos

const formatTime = (time: number) => {
  const hours = Math.floor(time / 3600)
    .toString()
    .padStart(2, '0');
  const minutes = Math.floor((time % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (time % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
};

// Atualiza o contador a cada segundo
let interval: number | undefined;
onMounted(() => {
  interval = setInterval(() => {
    if (countdownTime.value > 0) {
      countdownTime.value--;
    } else {
      clearInterval(interval);
      router.push({ name: 'home' });
    }
  }, 1000);
});

onUnmounted(() => {
  clearInterval(interval);
});

const goToHome = () => {
  router.push({ name: 'home' });
};

import { useDevice } from '../../composables/useDevice';
const { isMobile } = useDevice();
</script>

<template>
  <div class="notfound">
    <img src="./gifs/404-desktop.gif" class="nofound__404" v-if="!isMobile" />

    <img src="./gifs/404-mobile.gif" class="nofound__404" v-else />

    <p class="notfound__title">
      Não se preocupe! Voltando para a home para que você possa continuar suas
      criações!
    </p>

    <!-- Contador regressivo -->
    <p class="notfound__countdown">{{ formatTime(countdownTime) }}</p>

    <AppButton class="not-found__btn" :dark="true" @click="goToHome">
      <template #label> Voltar para a home </template>
    </AppButton>
  </div>
</template>

<style scoped src="./styles.scoped.css" />
