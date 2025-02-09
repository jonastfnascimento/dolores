<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';

const props = defineProps<{
  minutes: number;
  seconds?: number;
  messages: string[];
}>();

const emit = defineEmits(['timer-end']);

const timeLeft = ref(props.minutes * 60 + (props?.seconds || 0));
const messageIndex = ref(0);
const intervalDuration = Math.floor(timeLeft.value / props.messages.length);

const formattedTime = computed(() => {
  const hours = Math.floor(timeLeft.value / 3600);
  const minutes = Math.floor((timeLeft.value % 3600) / 60);
  const seconds = timeLeft.value % 60;
  const twoDigits = (n: number) => (n < 10 ? `0${n}` : n);
  return hours
    ? `${hours}:${twoDigits(minutes)}:${twoDigits(seconds)}`
    : `${minutes}:${twoDigits(seconds)}`;
});

const currentMessage = computed(() => props.messages[messageIndex.value] || '');

const startCountdown = () => {
  const interval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
      if (
        timeLeft.value % intervalDuration === 0 &&
        messageIndex.value < props.messages.length - 1
      ) {
        messageIndex.value++;
      }
    } else {
      clearInterval(interval);
      emit('timer-end');
    }
  }, 1000);
};

onMounted(() => {
  startCountdown();
});
</script>

<template>
  <div class="timer">
    <div class="timer__time">{{ formattedTime }}</div>
    <Transition name="slide-down" mode="out-in">
      <div class="timer__message" :key="messageIndex">{{ currentMessage }}</div>
    </Transition>
  </div>
</template>

<style scoped>
.timer {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 20px;
  padding: 0 20px;
}
.timer__time {
  font: var(--text-2xl-bold);
  color: #8e8e8e;
}
.timer__message {
  font: var(--text-base-bold);
  color: #8e8e8e;
  max-width: 210px;
  text-align: center;
}

/* Animação de slide-down */
.slide-down-enter-active,
.slide-down-leave-active {
  transition:
    transform 0.5s ease,
    opacity 0.5s ease;
}
.slide-down-enter-from {
  transform: translateY(-20px);
  opacity: 0;
}
.slide-down-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
