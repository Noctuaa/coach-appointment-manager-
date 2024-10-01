<script setup>
import { RouterLink, RouterView} from 'vue-router'
import { useAuthStore } from './stores/auth';

const authStore = useAuthStore();

</script>

<template>
  <header>
      <nav v-if="authStore.isAuthenticated">
        <button @click.prevent="authStore.logout">Déconnexion</button>
        <RouterLink to="/dashboard">Home</RouterLink>
      </nav>
  </header>

  <RouterView />
</template>

<style scoped>

</style>
