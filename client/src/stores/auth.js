import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
	state: () => ({
		user: null,
		isAuthenticated: false,
		rememberMe: false,
		resetPasswordStatus: null
	}),

	actions: {
		async login(email, password, rememberMe){
			// Simulation d'un appel API
			console.log('Tentative de connexion avec :', email);

			// Dans une vraie implémentation, nous ferions un appel API ici
			await new Promise(resolve => setTimeout(resolve,1000));

			// Simulation de connexion réussie
			this.user = { email };
			this.isAuthenticated = true;
			this.rememberMe = rememberMe;

			if(rememberMe) {
				// Stockez le token dans le localStorage
				localStorage.setItem('authToken', 'fake-jwt-token');
			}else{
				// Stockez le token dans le sessionStorage
				sessionStorage.setItem('authToken', 'fake-jwt-token');
			}
		},

		async logout() {

			// Simulation d'un délai d'appel API pour la déconnexion
			await new Promise(resolve => setTimeout(resolve, 500));

			this.user = null;
			this.isAuthenticated = false;
			this.rememberMe = false;
			

			// Dans une vraie implémentation, nous supprimerions ici le token JWT
			sessionStorage.removeItem('authToken');
			localStorage.removeItem('token');
		},

		async checkAuth() {
			const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
			if( token ) {
				try {
					// Simulation d'un délai d'appel API pour la déconnexion
					await new Promise(resolve => setTimeout(resolve, 500))

					// Simulation de connexion réussie
					this.isAuthenticated = true;
					this.rememberMe = !!localStorage.getItem('authToken');
					this.user = { email: 'John@Doe.com' }; // En réalité, ces infos viendraient du serveur
				} catch (error) {
					console.error("Erreur lors de la vérification de l'authentification:'", error);
					this.isAuthenticated = false;
					this.user = null;
					localStorage.removeItem('token');
				}
			} else {
				this.isAuthenticated = false;
				this.user = null;
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
