<script setup>
   import { ref } from 'vue';
   import LoginForm from '@/components/Auth/LoginForm.vue';
   import ResetPassword from '@/components/Auth/ResetPassword.vue';

   const isActive = ref(false);


</script>

<template>
   <div class="form-container" :class="{activeToggle: isActive}">
      <div class="img_login toggle-img" ></div>
      <ResetPassword/>
      <LoginForm/>
   </div>
</template>