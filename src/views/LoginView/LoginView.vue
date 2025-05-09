<script setup lang="ts">
import LoginAuthForm from '@/components/Login/LoginAuthForm/LoginAuthForm.vue';
import LoginLogo from '@/components/Login/LoginLogo/LoginLogo.vue';
import LoginTypeIt from '@/components/Login/LoginTypeIt/LoginTypeIt.vue';

import { useDevice } from '@/composables/useDevice';
const { isMobile } = useDevice();
</script>

<template>
  <div class="login-view">
    <div class="login-view__graphics-section">
      <img
        v-if="!isMobile"
        class="login-view__cogna-logo"
        src="./img/logo-cogna.png"
        alt="Cogna Educação"
      />

      <div class="login-view__avatar-typeit">
        <img
          src="./img/girl-and-pattern.png"
          alt="Garota com estilo cyberpunk"
          class="login-view__avatar"
        />
        <LoginTypeIt v-if="!isMobile" class="login-view__typeit" />
      </div>
    </div>

    <div class="login-view__wrapper">
      <LoginLogo class="login-view__logo" />
      <LoginTypeIt v-if="isMobile" class="login-view__typeit" />
      <LoginAuthForm class="login-view__auth-form" />
    </div>
  </div>
</template>

<style scoped src="./styles.scoped.css" />
