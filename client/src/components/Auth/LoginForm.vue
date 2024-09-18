<script setup>
	import { ref } from 'vue';
	import { useForm, useField } from 'vee-validate';
	import { loginSchema } from '@/validations/authValidations';
	import { useAuthStore } from '@/stores/auth';

 	const authStore = useAuthStore();
	const emit = defineEmits(['forgotPassword']); // Event sur le composant, bascule sur le composant resetPassword.vue.

	// Configuration du formulaire avec Vee-Validate.
	const { handleSubmit, errors, setFieldError } = useForm({
  		validationSchema: loginSchema
	});
	
	const rememberMe = ref(false);
	const {value: email} = useField('email');
	const {value: password} = useField('password');

	/**
	 * Gère le clique sur le lien "Mot de passe oublié".
	 */
	const handleForgotPassword = () => {
		emit('forgotPassword');
	}

	/**
	 * Gère la soumission du formulaire de connexion.
	 * @function
	 * @async
	 */
	const handleLogin = handleSubmit( async () => {
		try {		
			await authStore.login(email.value, password.value, rememberMe.value);

			if(authStore.errors) { // Si erreurs on parcourt le tableau pour afficher les erreurs
				authStore.errors.forEach((err) => {
					if (err.path === 'email' || err.path === 'password' || err.path === 'global') {
						setFieldError(err.path, err.msg); // Permet de gérer les erreurs venant de l'api
					}
    			});
			}
		} catch (error) {
			console.error('Login failed:', error);
		}
	})
	
</script>

<template>
		<div class="form-container">
			<div class="form-title">
				<h2 class="txt-center">Connexion</h2>
			</div>
			<div v-if="errors.global" class="global-errors">
				<p class="error-message" >{{ errors.global }}</p>
			</div>
			<form @submit.prevent=handleLogin()>
				<div class="form-group" :class="{'has-error' : errors.email}">
					<input type="email" id="login-email" v-model="email" placeholder="">
					<label for="login-email">Email </label>
					<p v-if="errors.email || errors.global" class="error-message">{{ errors.email  }}</p>
				</div>
				<div class="form-group" :class="{'has-error' : errors.password}">
					<input type="password" id="login-password" v-model="password" placeholder="">
					<label for="login-password">Mot de passe</label>	
					<p v-if="errors.password" class="error-message">{{ errors.password }}</p>
				</div>
				<div class="form-check">
						<input type="checkbox" id="remember" name="remember" v-model="rememberMe">
						<label for="remember">Se souvenir de moi</label>
					</div>
				<div class="form-group">
					<button type="submit" class="btn btn-primary">Se connecter</button>
				</div>
				<div class="txt-center">
					<a href="#" @click.prevent="handleForgotPassword">Mot de passe oublié ?</a>
				</div>
			</form>
		</div>
</template>
