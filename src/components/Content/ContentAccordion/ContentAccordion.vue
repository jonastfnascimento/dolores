<script setup lang="ts">
import { ref, useTemplateRef, onMounted } from 'vue';

type AccordionItem = {
  id: number;
  title: string;
  content: string;
};

const props = defineProps<{ items: AccordionItem[] }>();
const accordionBody = useTemplateRef<HTMLElement[]>('accordionBody');

const internalItems = ref(
  props.items.map((item) => ({
    ...item,
    isExpand: false,
  }))
);

const toggleExpand = (index: number) => {
  internalItems.value[index].isExpand = !internalItems.value[index].isExpand;

  const body = accordionBody.value[index];

  if (body) {
    body.style.transition = 'height 0.3s ease';

    if (internalItems.value[index].isExpand) {
      body.style.height = '350px';
      body.style.overflow = 'auto';
      body.style.borderTop = '1px solid var(--gray-200)';
    } else {
      body.style.height = '0';
      body.style.overflow = 'hidden';
      body.style.borderTop = '0';
    }

    body.addEventListener('transitionend', () => {
      body.style.transition = '';
    });
  }
};

const checkExpand = () => {
  internalItems.value.forEach((item) => {
    if (item.isExpand) {
      toggleExpand(internalItems.value.indexOf(item));
    }
  });
};

onMounted(() => {
  checkExpand();
});
</script>

<template>
  <div class="accordion">
    <div
      v-for="(item, index) in internalItems"
      :key="item.id"
      class="accordion__wrapper"
    >
      <div
        class="accordion-header"
        @click="toggleExpand(index)"
        :class="{ expanded: item.isExpand }"
      >
        <span>{{ item.title }}</span>
        <img
          src="./img/arrow.svg"
          alt="Seta"
          :class="{ rotated: item.isExpand }"
        />
      </div>

      <div class="accordion-body" ref="accordionBody">
        <div class="accordion-content">
          {{ item.content }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped src="./styles.scoped.css" />
