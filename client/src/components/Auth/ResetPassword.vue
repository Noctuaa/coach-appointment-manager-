<script setup>
   import { ref } from 'vue';

   const email = ref('');
   
</script>

<template>
		<div class="form forget">
			<h2>Récupérer mon mot de passe</h2>
			<form submit.prevent="handleSubmit">
				<div class="form-group field">
					<label for="email">Email :</label>
					<input type="email" id="email" v-model="email" required>
				</div>
				<div class="reset-password">
					<a href="#">Connexion</a>
				</div>
				
				<div class="field">
					<button>Envoyer</button>
				</div>
				
			</form>
      </div>
</template>