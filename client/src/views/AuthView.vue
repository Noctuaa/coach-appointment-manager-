<script setup>
   import { ref } from 'vue';
   import LoginForm from '@/components/Auth/LoginForm.vue';
   import ResetPassword from '@/components/Auth/ResetPassword.vue';

   const isActive = ref(false);

</script>

<template>
   <div class="auth-container">
      <div class="auth_img"></div>
      <ResetPassword/>
      <LoginForm/>
   </div>
</template>

<style>
   @import url('../assets/styles/layouts/_auth.css');
</style>