<script setup lang="ts">
import { ref } from 'vue';

import type { Props } from './types';

import BaseModal from '@/components/Base/BaseModal/BaseModal.vue';

const props = defineProps<Props>();
const show = ref<boolean>(false);
const resumeInfoText = ref<HTMLElement | null>(null);
const isExpanded = ref(false);

const showFullContent = () => {
  if (resumeInfoText.value) {
    if (isExpanded.value) {
      resumeInfoText.value.style.height =
        window.innerWidth <= 768 ? '167px' : '174px';
    } else {
      resumeInfoText.value.style.height = `${resumeInfoText.value.scrollHeight}px`;
    }
    isExpanded.value = !isExpanded.value;
  }
};
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

      <button @click="showFullContent" class="resume-info--open-full-btn">
        <img
          src="./img/full-icon.svg"
          width="21"
          height="21"
          alt="Clique aqui para uma visualização em completa"
          title="Clique aqui para uma visualização em completa"
        />
      </button>
    </div>

    <Teleport to="#teleports">
      <BaseModal :show="show" @close="show = false" class="resume-info__modal">
        <div class="resume-info__modal-content">
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
      </BaseModal>
    </Teleport>
  </div>
</template>

<style scoped src="./styles.scoped.css" />
