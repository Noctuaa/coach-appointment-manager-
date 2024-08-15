import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
	state: () => ({
		user: null,
		isAuthenticated: false
	}),

	actions: {
		async login(email, password){
			// Simulation d'un appel API
			console.log('Tentative de connexion avec :', email);

			// Dans une vraie implémentation, nous ferions un appel API ici
			await new Promise(resolve => setTimeout(resolve,1000));

			// Simulation de connexion réussie
			this.user = { email };
			this.isAuthenticated = true;

			 // Dans une vraie implémentation, nous stockerions ici le token JWT
			 localStorage.setItem('token', 'fake-jwt-token')
		},

		async logout() {

			// Simulation d'un délai d'appel API pour la déconnexion
			await new Promise(resolve => setTimeout(resolve, 500))

			this.user = null;
			this.isAuthenticated = false;

			// Dans une vraie implémentation, nous supprimerions ici le token JWT
			localStorage.removeItem('token');
		},

		async checkAuth() {
			const token = localStorage.getItem('token')
			if( token ) {
				try {
					// Simulation d'un délai d'appel API pour la déconnexion
					await new Promise(resolve => setTimeout(resolve, 500))

					// Simulation de connexion réussie
					this.isAuthenticated = true;
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
		}
	}
})
