<script setup>
	import { ref } from 'vue';
	import { useAuthStore } from '@/stores/auth';
	import { useRouter } from 'vue-router';

	const authStore = useAuthStore();
	const emit = defineEmits(['forgotPassword']);
	const router = useRouter
	const email = ref('');
	const password =  ref('');
	const rememberMe = ref(false);

	const handleForgotPassword = () => {
		emit('forgotPassword');
	}

	const handleLogin = async () => {
		try {
			await authStore.login(email.value, password.value, rememberMe.value);
			//router.push('/dashboard')
		} catch (error) {
			console.error('Erreur de connexion:', error)
		}
	}

</script>

<template>
		<div class="sign-in">
			<h2 class="txt-center">Connexion</h2>
			<form @submit.prevent=handleLogin>
				<div class="form-group">
					<label for="login-email">Email </label>
					<input type="email" id="login-email" v-model="email">
				</div>
				<div class="form-group">
					<label for="login-password">Mot de passe</label>	
					<input type="password" id="login-password" v-model="password">
				</div>
				<div class="txt-right">
					<a href="#" @click.prevent="handleForgotPassword">Mot de passe oublié ?</a>
				</div>
				<div class="form-check">
					<input type="checkbox" id="remember" name="remember" v-model="rememberMe">
					<label for="remember">Se souvenir de moi</label>
				</div>
				<div class="form-group">
					<button type="submit" class="btn btn-primary">Se connecter</button>
				</div>
			</form>
		</div>
</template>
