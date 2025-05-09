<script setup lang="ts">
import { onMounted } from 'vue';
import TypeIt from 'typeit';

onMounted(() => {
  new TypeIt('#description', {
    speed: 45,
    startDelay: 1000,
    deleteSpeed: 50,
    cursor: true,
    lifeLike: true,
  })
    .type('Reinventando o jeito de criar conteúdo, ')
    .pause(1000)
    .type('com tecnologia e inovação.')
    .pause(500)
    .delete(9)
    .pause(500)
    .type('criatividade.')
    .go();
});
</script>

<template>
  <div class="typeit">
    <div class="typeit__wrapper">
      <img
        src="./img/desktop-contector.svg"
        alt="Linha que conecta as duas imagens"
        class="typeit__line"
      />

      <img
        src="./img/mobile-bars.svg"
        alt="Barras vermelhas na vertical"
        class="typeit__bars"
      />

      <p id="description" class="typeit__description"></p>
    </div>
  </div>
</template>

<style src="./styles.scoped.css" scoped />
