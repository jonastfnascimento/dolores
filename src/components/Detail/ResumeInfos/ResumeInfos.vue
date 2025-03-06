<script setup lang="ts">
import { ref } from 'vue';

import type { Props } from './types';

const props = defineProps<Props>();
const resumeInfoText = ref<HTMLElement | null>(null);
</script>

<template>
  <div class="resume-info">
    <div class="resume-info__text" ref="resumeInfoText">
      <p class="resume-info__p">
        <template
          v-for="(info, infoIndex) in props.infos"
          :key="`info${infoIndex}`"
        >
          <span> [{{ info.label }}] </span>
          = {{ info.value }}
          <br />
        </template>
      </p>
    </div>
  </div>
</template>

<style scoped src="./styles.scoped.css" />
