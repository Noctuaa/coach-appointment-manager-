<script setup>
   import { ref } from 'vue';

   const email = ref('');

</script>

<template>
		<div class="form-container reset-password">
			<h2 class="txt-center">Récupérer mon mot de passe</h2>
			<form submit.prevent="handleSubmit">
				<div class="form-group">
					<label for="email">Email :</label>
					<input type="email" id="email" v-model="email" required>
				</div>
				<div class="txt-right">
					<a href="#">Connexion</a>
				</div>
				<div class="form-group">
					<button class="btn btn-primary">Envoyer</button>
				</div>
			</form>
      </div>
</template>