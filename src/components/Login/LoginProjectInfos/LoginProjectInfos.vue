<script setup lang="ts">
import { onMounted } from 'vue';
import TypeIt from 'typeit';

onMounted(() => {
  new TypeIt('#description', {
    speed: 45,
    startDelay: 1000,
    deleteSpeed: 14,
    cursor: true,
    lifeLike: true,
  })
    .type('Reinventando o jeito de criar conteúdo, ')
    .pause(1000)
    .type('combinando inovação e inspiração...')
    .pause(1000)
    .delete(35)
    .pause(500)
    .type('com tecnologia e criatividade.')
    .go();
});
</script>

<template>
  <div class="project-infos">
    <h1 id="title" class="project-infos__title">Dolores</h1>
    <p id="description" class="project-infos__description"></p>
  </div>
</template>

<style src="./styles.scoped.css" scoped />
