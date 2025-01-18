<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const onTheHomePage = computed(() => {
  return router.currentRoute.value.name === 'home';
});
function goToBack() {
  router.back();
}
</script>

<template>
  <button
    v-if="!onTheHomePage || true"
    @click="goToBack"
    title="Clique para voltar"
  >
    <img
      src="./img/back-icon.svg"
      alt="Clique para voltar"
      width="15"
      height="14"
    />
  </button>
</template>

<style scoped src="./styles.scoped.css" />
