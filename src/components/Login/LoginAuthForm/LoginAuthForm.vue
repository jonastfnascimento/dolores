<script setup lang="ts">
import { ref, watch } from 'vue';
import AppInput from '@/components/Common/AppInput/AppInput.vue';
import AppButton from '@/components/Common/AppButton/AppButton.vue';
import { toast } from 'vue-sonner';
import { api } from '@/services/api';
import { useUserStore } from '@/stores/userStore';
import type { LoginResponse } from '@/types/userTypes';
import { useRouter } from 'vue-router';

const userEmail = ref('');
const userPassword = ref('');
const errorEmail = ref(false);
const errorPassword = ref(false);
const userStore = useUserStore();
const router = useRouter();
const isLoading = ref(false);

watch(userEmail, () => {
  errorEmail.value = false;
});

watch(userPassword, () => {
  errorPassword.value = false;
});

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const handleSubmit = async () => {
  errorEmail.value = false;
  errorPassword.value = false;

  if (!userEmail.value || !isValidEmail(userEmail.value)) {
    errorEmail.value = true;
    toast.error('Endereço de email inválido!');
    console.error('Endereço de email inválido!');
    return;
  }

  if (!userPassword.value) {
    errorPassword.value = true;
    toast.error('A senha deve ser preenchida!');
    console.error('A senha deve ser preenchida!');
    return;
  }

  try {
    isLoading.value = true;
    const { data } = await api.get<LoginResponse>(
      'c55233a4-4fc5-45bb-b306-b05818774d5b',
      {
        params: {
          email: userEmail.value,
          password: userPassword.value,
          origem: '/home/login',
        },
      }
    );

    if (data.message === 'Login Not Allowed') {
      toast.error('Usuário não encontrado, verifique as credenciais!');
      console.error('Usuário não encontrado, verifique as credenciais!');
      errorEmail.value = true;
      errorPassword.value = true;
      setTimeout(() => {
        errorEmail.value = false;
        errorPassword.value = false;
      }, 4000);
      isLoading.value = false;

      return;
    }

    if (data.message === 'Login Allowed') {
      userStore.setUser(data.user);
      isLoading.value = false;

      router.push('/');
    }
  } catch (error) {
    console.error(error);
    toast.error('Ocorreu um erro inesperado! Entre em contato com o suporte.');
    console.error(
      'Ocorreu um erro inesperado! Entre em contato com o suporte.'
    );
    isLoading.value = false;
  }
};

const handleForgotPassword = () => {
  toast.info('Disponível em breve!');
};
</script>

<template>
  <form class="auth-form" @submit.prevent="handleSubmit">
    <AppInput
      class="auth-form__email"
      type="text"
      v-model:value="userEmail"
      placeholder="E-mail"
      :error="errorEmail"
    />

    <AppInput
      class="auth-form__password"
      type="password"
      v-model:value="userPassword"
      placeholder="Password"
      :error="errorPassword"
    />

    <p class="auth-form__forgot-password" @click="handleForgotPassword">
      Esqueceu a senha?
    </p>

    <AppButton
      :dark="true"
      :disabled="!userEmail.length || !userPassword.length || isLoading"
      :loading="isLoading"
    >
      <template #label> Login </template>
    </AppButton>
  </form>
</template>

<style src="./styles.scoped.css" scoped />
