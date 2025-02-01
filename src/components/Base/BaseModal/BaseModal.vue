<script lang="ts">
type Animation = 'fade' | 'left-to-right' | 'right-to-left';

interface Props {
  show: boolean;
  animation?: Animation;
}

interface Emits {
  (e: 'close'): void;
}
</script>
<script setup lang="ts">
import { ref, watch, toRefs } from 'vue';

const props = withDefaults(defineProps<Props>(), { animation: 'fade' });
const { show, animation } = toRefs(props);

const showBaseModal = ref<boolean>(props.show);
const showContent = ref<boolean>(props.show);

watch(show, (newValue) => {
  if (newValue) {
    showBaseModal.value = newValue;
    document.body.style.overflow = 'hidden';
  } else {
    showContent.value = newValue;
    document.body.style.overflow = 'unset';
  }
});

const emit = defineEmits<Emits>();

function afterEnterBaseModal() {
  showContent.value = true;
}
function afterLeaveBaseModal() {
  emit('close');
}

function afterLeaveContent() {
  showBaseModal.value = false;
}
</script>
<template>
  <Transition
    name="fade"
    @after-enter="afterEnterBaseModal"
    @after-leave="afterLeaveBaseModal"
  >
    <div v-show="showBaseModal" class="base-modal force-fill">
      <Transition :name="animation" @after-leave="afterLeaveContent">
        <div
          v-show="showContent"
          class="base-modal__content-wrapper"
          @click.self="showContent = false"
        >
          <slot />
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<style scoped src="./styles.scoped.css" />
