<script setup lang="ts">
import { useRouter } from 'vue-router';

import { useUserStore } from '@/stores/userStore';

const router = useRouter();
const userStore = useUserStore();
function loggout() {
  userStore.setUser(null);
  router.push('/login');
}
</script>

<template>
  <div class="user-navigation">
    <img
      src="./img/user.svg"
      alt="Opções de perfil de usuários"
      title="Clique para ver opções de perfil"
      width="39"
      height="39"
    />

    <div class="user-navigation__items-container">
      <div class="user-navigation__items">
        <div
          class="user-navigation__item disabled"
          title="Opção em desenvolvimento! Disponível embreve"
        >
          Perfil
        </div>
        <div
          class="user-navigation__item disabled"
          title="Opção em desenvolvimento! Disponível embreve"
        >
          Configurações
        </div>
        <button class="user-navigation__item" @click="loggout">Sair</button>
      </div>
    </div>
  </div>
</template>

<style scoped src="./styles.scoped.css" />
