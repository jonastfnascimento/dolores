<script lang="ts" setup>
// import ContentDetailTimer from '../ContentDetailTimer/ContentDetailTimer.vue';

// const props = defineProps<{ showTimer: boolean }>();

// const phrases = [
//   'Iniciando a preparação do conteúdo!',
//   'Conectando aos modelos de IA!',
//   'Coletando dados relevantes!',
//   'Analisando tendências e referências!',
//   'Extraindo palavras-chave estratégicas!',
//   'Estruturando os principais tópicos!',
//   'Aprimorando coesão e fluidez do texto!',
//   'Otimizando para SEO e legibilidade!',
//   'Ajustando o tom e a personalização!',
//   'Inserindo exemplos e insights relevantes!',
//   'Finalizando a revisão do conteúdo!',
//   'Realizando os últimos ajustes de qualidade!',
//   'Finalizando a formatação e estruturação!',
//   'Preparando a entrega do conteúdo!',
//   'Tudo pronto! Seu conteúdo foi gerado com sucesso!',
// ];
</script>

<template>
  <div class="container">
    <div class="skeleton mobile">
      <div class="skeleton-top">
        <div class="skeleton-bar large"></div>
        <div class="skeleton-bar small"></div>
      </div>

      <div class="skeleton-buttons">
        <div class="skeleton-bar small"></div>
        <div class="skeleton-button"></div>
      </div>

      <div class="skeleton-box">
        <img
          class="skeleton-icon"
          src="./img/ai-stars.gif"
          alt="Estrelas de geração de IA"
          width="55px"
        />

        <!-- <ContentDetailTimer
          :messages="phrases"
          :minutes="9"
          :seconds="45"
          @timer-end="$emit('timer-end')"
          v-if="props.showTimer"
        /> -->
      </div>

      <div class="skeleton-buttons">
        <div class="skeleton-button"></div>
        <div class="skeleton-button"></div>
      </div>

      <div class="skeleton-bar medium"></div>
    </div>

    <div class="skeleton desktop">
      <div class="skeleton-top">
        <div class="skeleton-bar large"></div>
        <div class="skeleton-bar small"></div>
      </div>

      <div class="skeleton-buttons">
        <div class="skeleton-bar small"></div>
        <div class="skeleton-button" style="max-width: 125px"></div>
      </div>

      <div class="skeleton-box">
        <img
          class="skeleton-icon"
          src="./img/ai-stars.gif"
          alt="Estrelas de geração de IA"
          width="55px"
        />

        <!-- <ContentDetailTimer :messages="phrases" :minutes="1" /> -->
      </div>

      <div class="skeleton-buttons">
        <div class="skeleton-button"></div>

        <div class="skeleton-button"></div>
      </div>

      <div class="skeleton-bar medium"></div>
    </div>
  </div>
</template>

<style scoped src="./styles.scoped.css" />
