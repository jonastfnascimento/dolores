<script setup lang="ts">
import LoginAuthForm from '@/components/Login/LoginAuthForm/LoginAuthForm.vue';
import LoginLogo from '@/components/Login/LoginLogo/LoginLogo.vue';
import LoginProjectInfos from '@/components/Login/LoginProjectInfos/LoginProjectInfos.vue';

import { useDevice } from '@/composables/useDevice';
const { isMobile } = useDevice();
</script>

<template>
  <div class="login-view">
    <div class="login-view__graphics-section">
      <img
        class="login-view__top-decorator"
        src="./img/login-top-decorator.svg"
      />

      <img
        class="login-view__bottom-decorator"
        src="./img/login-bottom-decorator.svg"
      />

      <img
        v-if="!isMobile"
        class="login-view__cogna-logo"
        src="./img/logo-cogna.png"
        alt="Cogna Educação"
      />

      <LoginProjectInfos v-if="!isMobile" class="login-view__project-infos" />
    </div>

    <div class="login-view__wrapper">
      <LoginLogo class="login-view__logo" />
      <LoginProjectInfos v-if="isMobile" class="login-view__project-infos" />
      <LoginAuthForm class="login-view__auth-form" />
    </div>
  </div>
</template>

<style scoped src="./styles.scoped.css" />
