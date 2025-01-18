<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

const show = ref<boolean>(false);
</script>

<template>
  <div class="mobile-navigation">
    <button
      @click="show = !show"
      :class="['mobile-navigation--button', { disabled: show }]"
      title="Clique para abrir o menu de navegação"
    >
      <img
        src="./img/menu.svg"
        width="59"
        height="59"
        alt="Clique para abrir o menu de navegação"
      />
    </button>

    <Transition name="fade-bottom-to-top">
      <nav v-if="show" class="mobile-navigation__links">
        <RouterLink to="/" class="mobile-navigation--link">
          Conteúdos
          <div class="mobile-navigation_icon">
            <img src="./img/content.svg" />
          </div>
        </RouterLink>
        <RouterLink to="/" class="mobile-navigation--link">
          Personas
          <div class="mobile-navigation_icon">
            <img src="./img/persona.svg" />
          </div>
        </RouterLink>
        <RouterLink to="/" class="mobile-navigation--link">
          Avatares
          <div class="mobile-navigation_icon">
            <img src="./img/avatar.svg" />
          </div>
        </RouterLink>
        <button class="mobile-navigation--close" @click="show = false">
          <div class="mobile-navigation_icon">
            <img src="./img/close-menu.svg" />
          </div>
        </button>
      </nav>
    </Transition>
  </div>
</template>

<style scoped src="./styles.scoped.css" />
<style scoped src="./animations.scoped.css" />
