<script setup>
import { RouterLink, RouterView} from 'vue-router'
import { useAuthStore } from './stores/auth';
import { onMounted } from 'vue';

const authStore = useAuthStore();

onMounted(async () => {
  await authStore.checkAuth()
});

</script>

<template>
  <header>
      <nav v-if="authStore.isAuthenticated">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
  </header>

  <RouterView />
</template>

<style scoped>

</style>
