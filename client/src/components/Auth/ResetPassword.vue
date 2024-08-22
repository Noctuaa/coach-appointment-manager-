<script setup>
   import { ref } from 'vue';

	const emit = defineEmits(['backToLogin']);
   const email = ref('');

	const handleBackToLogin = () => {
  		emit('backToLogin');
	};

</script>

<template>
		<div class="reset-password">
			<h2 class="txt-center">Récupérer mon mot de passe</h2>
			<form submit.prevent="handleSubmit">
				<div class="form-group">
					<label for="reset-email">Email :</label>
					<input type="email" id="reset-email" v-model="email" required>
				</div>
				<div class="txt-right">
					<a href="#" @click.prevent="handleBackToLogin">Connexion</a>
				</div>
				<div class="form-group">
					<button class="btn btn-primary">Envoyer</button>
				</div>
			</form>
      </div>
</template>