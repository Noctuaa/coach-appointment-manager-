import { defineStore } from 'pinia'
import { fetchWithAuth } from '@/utils/fetchUtils';
import router from '@/router';


export const useAuthStore = defineStore('auth', {
	state: () => ({
		user: null,
		isAuthenticated: false,
		rememberMe: false,
		resetPasswordStatus: null,
		isAuthChecked: false,
		csrfToken : null
	}),

	actions: {
		async login(email, password, rememberMe){
			try {
				const response = await fetchWithAuth('/api/auth/login', {
					method: 'POST',
					headers: { 
						'Content-Type': 'application/json',
						//'X-CSRF-token': localStorage.getItem('csrfToken')
					 },
					body: JSON.stringify({email, password, rememberMe})
				});

				if (!response.ok) { throw new Error('Erreur lors de la connexion');};

				const data = await response.json();

				this.user = data.user;
				this.isAuthenticated = data.isAuthenticated;
				this.csrfToken = data.csrfToken;
				localStorage.setItem('csrfToken', data.csrfToken);

				router.push('/dashboard');
			} catch (error) {
				console.error('Login error:', error);
				throw error;
			}
		},

		async checkAuth() {
			if (this.isAuthChecked) return;

			try {
				const response = await fetchWithAuth('/api/auth/me');
				const data = await response.json();

				if (data.isAuthenticated) {
					this.user = await data.user;
					this.isAuthenticated = await data.isAuthenticated;
				 } else {
					this.user = await data.user;
					this.isAuthenticated = await data.isAuthenticated;
				 }

			} catch (error) {
				//throw error(`Erreur lors de la vérification de l'authentification:`, error);
				this.user = null;
				this.isAuthenticated = false;
			}finally {
        		this.isAuthChecked = true;
      	}
		},

		async logout() {

			// Simulation d'un délai d'appel API pour la déconnexion
			try {
				const response = await fetchWithAuth('/api/auth/logout', {
					method: 'POST',
					headers: { 
						'Content-Type': 'application/json',
						'X-CSRF-token': localStorage.getItem('csrfToken')
					 },
				});
				if (!response.ok) { throw new Error('Erreur lors de la déconnexion');};

				const data = await response.json();

				localStorage.removeItem('csrfToken');
				this.user = await data.user;
				this.isAuthenticated = await data.isAuthenticated
				router.push('/');

			} catch (error) {
				
			}
		},

		async requestPasswordReset(email) {
			try {
			  // appel API pour demander la réinitialisation du mot de passe
			  // Simulation d'un délai d'appel API 
			  await new Promise(resolve => setTimeout(resolve, 1000))
			  
			  this.resetPasswordStatus = 'Un email de réinitialisation a été envoyé.'
			  return true
			} catch (error) {
			  this.resetPasswordStatus = 'Erreur lors de la demande de réinitialisation.'
			  return false
			}
		 },
	
		 clearResetPasswordStatus() {
			this.resetPasswordStatus = null
		 }
	}
})

