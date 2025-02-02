<template>
  <div class="combobox">
    <AppInput
      type="text"
      :placeholder="placeholder"
      :value="searchTerm"
      :maxlength="maxLength"
      :minlength="minLength"
      :error="error"
      :autocomplete="autocomplete"
      @update:value="onInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown="handleDown"
      :loading="props.loading"
    />

    <img
      class="combobox__arrow"
      :class="{ open: showDropdown }"
      src="./img/arrow.svg"
      alt="Alternar"
    />

    <transition name="fade">
      <ul class="combobox__list" v-if="showDropdown">
        <li
          class="combobox__item"
          v-for="(item, index) in filteredItems"
          :key="item.id"
          @click="select(item)"
          :class="{ 'combobox__item--selected': index === selectedIndex }"
        >
          {{ item.label }}
        </li>
      </ul>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  computed,
  defineProps,
  defineEmits,
  onMounted,
  onUnmounted,
} from 'vue';
import AppInput from '../AppInput/AppInput.vue';

import type { Props, Item } from './types';

const props = defineProps<Props>();

const emit = defineEmits(['update:value']);

const searchTerm = ref('');
const showDropdown = ref(false);
const selectedIndex = ref(-1);

const filteredItems = computed(() =>
  props.items.filter((item: Item) =>
    item.label.toLowerCase().includes(searchTerm.value.toLowerCase())
  )
);

const onInput = (value: string) => {
  searchTerm.value = value;
  showDropdown.value = !!value;
  selectedIndex.value = -1;
};

const select = (item: Item) => {
  searchTerm.value = item.label;

  console.log(searchTerm.value);

  emit('update:value', item);
  showDropdown.value = false;
};

const handleFocus = () => {
  showDropdown.value = true;
};

const handleBlur = () => {
  if (searchTerm.value.length === 0) {
    emit('update:value', null);
    return;
  }

  showDropdown.value = false;
};

const handleDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    if (searchTerm.value.length === 0) {
      emit('update:value', null);
      return;
    }

    console.log(filteredItems.value[selectedIndex.value]);

    if (filteredItems.value[selectedIndex.value]) {
      select(filteredItems.value[selectedIndex.value]);
    }

    if (filteredItems.value.length) {
      select(filteredItems.value[0]);
    }

    if (event.target instanceof HTMLInputElement) {
      event.target.blur();
    }
  }
};

const selectNext = () => {
  if (filteredItems.value.length > 0) {
    selectedIndex.value =
      (selectedIndex.value + 1) % filteredItems.value.length;
  }
};

const selectPrev = () => {
  if (filteredItems.value.length > 0) {
    selectedIndex.value =
      (selectedIndex.value - 1 + filteredItems.value.length) %
      filteredItems.value.length;
  }
};

const handleKeydown = (event: KeyboardEvent) => {
  if (showDropdown.value) {
    if (event.key === 'ArrowDown') {
      selectNext();
      event.preventDefault();
    } else if (event.key === 'ArrowUp') {
      selectPrev();
      event.preventDefault();
    }
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
.combobox {
  position: relative;
}

.combobox__arrow {
  position: absolute;
  right: 15px;
  top: calc(50% - 5px);
  transition: transform 0.3s ease;
}

.open {
  transform: rotate(180deg);
}

.combobox__list {
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  right: 0;
  background-color: var(--gray-100);
  border-radius: 8px;
  padding: 0;
  margin: 0;
  overflow: auto;
  max-height: 300px;
}
.combobox__list::-webkit-scrollbar {
  width: 8px;
  border-radius: 15px;
}

.combobox__list::-webkit-scrollbar-thumb {
  background: var(--gray-300);
  border-radius: 15px;
}

.combobox__list::-webkit-scrollbar-track {
  background: var(--gray-200);
}

.combobox__item {
  padding: 16px;
  cursor: pointer;
  font: var(--text-base);
}

.combobox__item:hover {
  background-color: var(--gray-300);
}

.combobox__item--selected {
  background-color: var(--gray-300);
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
