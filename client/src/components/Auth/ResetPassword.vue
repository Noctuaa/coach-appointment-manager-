<script setup>
   import { useAuthStore } from '@/stores/auth';
	import { ref } from 'vue';

	const authStore = useAuthStore();
	const emit = defineEmits(['backToLogin']);
   const email = ref('');

	const handleBackToLogin = () => {
  		emit('backToLogin');
	};

	const handleResetPassword = async () => {
	const success = await authStore.requestPasswordReset(email.value)
		if (success) {
			// Affiche un message de succès ou redirige l'utilisateur
			console.log(authStore.resetPasswordStatus);
		} else {
			// Gère l'erreur
			console.error(authStore.resetPasswordStatus)
		}
	}

</script>

<template>
		<div class="reset-password">
			<h2 class="txt-center">Récupérer mon mot de passe</h2>
			<form @submit.prevent="handleResetPassword">
				<div class="form-group">
					<label for="reset-email">Email :</label>
					<input type="email" id="reset-email" v-model="email" required>
				</div>
				<div class="txt-right">
					<a href="#" @click.prevent="handleBackToLogin">Connexion</a>
				</div>
				<div class="form-group">
					<button type="submit" class="btn btn-primary">Envoyer</button>
				</div>
			</form>
      </div>
</template>