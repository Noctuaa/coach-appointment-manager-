<script setup>
	import { ref } from 'vue';

	const email = ref('');
	const password =  ref('');
	const rememberMe = ref(false);


</script>

<template>
		<div class="form-container sign-in">
			<h2 class="txt-center">Connexion</h2>
			<form submit.prevent="handleSubmit">
				<div class="form-group">
					<label for="email">Email </label>
					<input type="email" id="email" v-model="email" required>
				</div>
				<div class="form-group">
					<label for="password">Mot de passe</label>	
					<input type="password" id="password" v-model="password" required>
				</div>
				<div class="txt-right">
					<a href="#">Mot de passe oublié ?</a>
				</div>
				<div class="form-check">
					<input type="checkbox" id="remember" name="remember" v-model="rememberMe">
					<label for="remember">Se souvenir de moi</label>
				</div>
				<div class="form-group">
					<button class="btn btn-primary">Se connecter</button>
				</div>
			</form>
		</div>
</template>
