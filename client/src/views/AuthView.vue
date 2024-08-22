<script setup>
   import { ref } from 'vue';
   import LoginForm from '@/components/Auth/LoginForm.vue';
   import ResetPassword from '@/components/Auth/ResetPassword.vue';

   const showLogin = ref(true);

   const toggleForm = () => {
      showLogin.value = !showLogin.value
   }

</script>

<template>
   <div class="auth-container">
      <div class="auth-img" :class="{ toggleAuth: !showLogin}"></div>
      <transition name="fade" mode="out-in">
         <ResetPassword v-if="!showLogin" @back-to-login="toggleForm"/>
         <LoginForm v-model:showLogin="showLogin" @forgot-password="toggleForm" v-else />
      </transition>
   </div>
</template>

<style scoped>
   @import url('../assets/styles/layouts/_auth.css');
</style>