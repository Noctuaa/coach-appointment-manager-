<script setup>
	import { ref } from 'vue';

	const email = ref('');
	const password =  ref('');
	const rememberMe = ref('');


</script>

<template>
		<div class="form sign-in">
			<h2>Connexion</h2>
			<form submit.prevent="handleSubmit">
				<div class="form-group field">
					<label for="email">Email </label>
					<input type="email" id="email" v-model="email" required>
				</div>
				
				<div class="form_group field">
					<label for="password">Mot de passe</label>	
					<input type="password" id="password" v-model="password" required>
				</div>

				<div class="reset-password">
					<a href="#" @click.prevent="isActive = true">Mot de passe oublié ?</a>
				</div>
				
				<div class="form-group checkbox">
					<input type="checkbox" id="remember" v-model="rememberMe">
					<label for="remember">Se souvenir de moi</label>
				</div>

				<div class="field">
					<button>Se connecter</button>
				</div>
			</form>
		</div>
</template>


<style>

	.form-container{
		position: relative;
		max-width: 56rem;
		background: #fff;
		box-shadow:  0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1),
		0 10px 15px -3px,
		0 4px 6px -4px;
		border-radius: .5rem;
		color: rgb(55 65 81);
		height: 100%;
		width: 56rem;
		max-width: 100%;
		min-height: 480px;
	}

	.reset-password{
		width: 100%;
		text-align: right;
	}

	.reset-password a {
		font-weight: 500;
		color: black;
	}

	.sign-in{
		left: 50%;
		z-index: 2;
	}

	.field button{
		background-color: rgba(84, 105, 212, 1);
		box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, 
                rgba(0, 0, 0, 0) 0px 0px 0px 0px, 
                rgba(0, 0, 0, 0.12) 0px 1px 1px 0px, 
                rgb(84, 105, 212) 0px 0px 0px 1px, 
                rgba(0, 0, 0, 0) 0px 0px 0px 0px, 
                rgba(0, 0, 0, 0) 0px 0px 0px 0px, 
                rgba(60, 66, 87, 0.08) 0px 2px 5px 0px;
		border: none;
		padding: 8px 16px;
		line-height: 16px;
		border-radius: 4px;
		min-height: 44px;
		color: #fff;
		font-size: 15px;
		font-weight: 600;
		margin-top: 34px;
		cursor: pointer;
	}

	.field {
		padding-bottom: 24px;
		display: flex;
		flex-direction: column;
		position: relative;
	}

	.field label{
		background: #fff;
		position: relative;
		left: 30px;
		top: 10px;
		width: 4rem;
		text-align: center;
		font-size: 16px;
		font-weight: 500;
		color: rgba(84, 105, 212, 1);
	}

	.field label[for=password] {
		width: 7rem;
	}

	.field input{
		font-size: 14px;
		line-height: 16px;
		padding: 8px 16px;
		width: 100%;
		min-height: 44px;
		border-radius: 4px;
		border: unset;
		outline-color: rgba(84, 105, 212, .5);
		box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, 
                rgba(0, 0, 0, 0) 0px 0px 0px 0px, 
                rgba(0, 0, 0, 0) 0px 0px 0px 0px, 
                rgba(60, 66, 87, 0.16) 0px 0px 0px 1px, 
                rgba(0, 0, 0, 0) 0px 0px 0px 0px, 
                rgba(0, 0, 0, 0) 0px 0px 0px 0px, 
                rgba(0, 0, 0, 0) 0px 0px 0px 0px;
	}

	.img_login{
		background: url("../assets/images/jogging.jpg");
		background-size: cover;
		background-position: center;
		height: 100%;
		width: 50%;
		border-radius: .5rem 0 0 .5rem;
		z-index: 3;
		transition: all 0.6s ease-in-out;
	}

	.toggle-img{
		position: absolute;
		transform: translateX(0%)
	}

	.form-container.activeToggle .img_login{
		transform: translateX(100%);
		border-radius: 0 .5rem .5rem 0 ;
	}

	.form-container .forget{
		opacity: 1;
		z-index: 1;
		left: 0;
		transform: translateX(0%);
	}

	.form {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 3rem;
		position: absolute;
		height: 100%;
		width: 50%;
		transition: opacity .8s, transform .7s;
	}

	.form h2 {
		text-align: center;
		font-weight: 500;
	}

</style>