import { defineStore } from 'pinia'
import { fetchWithAuth } from '@/utils/fetchUtils';
import router from '@/router';


/**
 * Store Pinia pour la gestion de l'authentification.
 * @typedef {Object} AuthStore
 * @property {Object|null} user - Informations de l'utilisateur connecté
 * @property {boolean} isAuthenticated - Indique si l'utilisateur est authentifié
 * @property {boolean} rememberMe - Option "Se souvenir de moi"
 * @property {string|null} csrfToken - Token CSRF pour la sécurité
 * @property {Array} errors - Tableau des erreurs d'authentification
 */

/**
 * Crée et exporte le store d'authentification.
 * @type {AuthStore}
 */
export const useAuthStore = defineStore('auth', {
	state: () => ({
		user: null,
		isAuthenticated: false,
		rememberMe: false,
		csrfToken : localStorage.getItem('csrfToken') || null,
		errors: []
	}),

	actions: {
		
		/**
		 * Connexion de l'utilisateur
		 * @param {String} email - Email de l'utilisateur
		 * @param {String} password - Password de l'utilisateur
		 * @param {Boolean} rememberMe - Se souvenir de moi
		 * @throws {Error} Si la connexion échoue
		 */
		async login(email, password, rememberMe){
			try {
				const response = await fetch('/api/auth/login', {
					method: 'POST',
					headers: { 
						'Content-Type': 'application/json',
					 },
					body: JSON.stringify({email, password, rememberMe})
				});

				const data = await response.json();
				
				if (!response.ok) { 
					if(data.errors){
						this.errors = data.errors;
					}
					throw new Error('Erreur lors de la connexion');
				};



				this.user = data.user;
				this.isAuthenticated = data.isAuthenticated;
				this.csrfToken = data.csrfToken;
				localStorage.setItem('csrfToken', data.csrfToken);
				this.errors = [];
				router.push('/dashboard');
			} catch (error) {
				console.error('Login error:', error);
			}
		},

		/**
		 * Vérifie l'état d'authentification de l'utilisateur.
		 * @async
		 */
		async checkAuth() {
			try {
				const response = await fetchWithAuth('/api/auth/me');
				const data = await response.json();

				if (data.isAuthenticated) {
					this.user = await data.user;
					this.isAuthenticated = await data.isAuthenticated;
				 }

			} catch (error) {
				this.user = null;
				this.isAuthenticated = false;
				//throw error(`Erreur lors de la vérification de l'authentification:`, error);
			}
		},

   	/**
       * Déconnecte l'utilisateur.
       * @async
       * @throws {Error} Si la déconnexion échoue
      */
		async logout() {
			try {
				const response = await fetchWithAuth('/api/auth/logout', { method: 'POST' });
				
				if (!response.ok) { throw new Error('Erreur lors de la déconnexion');};

				const data = await response.json();

				localStorage.removeItem('csrfToken');
				this.user = await data.user;
				this.isAuthenticated = await data.isAuthenticated
				router.push('/');

			} catch (error) {
				console.error('Erreur lors de la déconnexion:', error);
				this.user = null;
				this.isAuthenticated = false;
				localStorage.removeItem('csrfToken');
			}
		},
	}
})

