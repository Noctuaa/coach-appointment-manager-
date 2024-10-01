/**
 * Effectue une requête authentifiée avec gestion automatique du rafraîchissement du token.
 * @param {string} url - L'URL de la requête.
 * @param {Object} options - Les options de la requête fetch (optionnel).
 * @returns {Promise<Response>} La réponse de la requête.
 * @throws {Error} Si la session a expiré ou s'il y a une erreur réseau.
 */
export const fetchWithAuth = async (url, options = {}) => {


	// Prépare les options de la requête en incluant le CSRF token et les credentials
	const fetchOptions = { 
		...options,
		headers: {
			...options.headers,  
			'X-CSRF-Token': localStorage.getItem('csrfToken'), // Ajoute le CSRF token aux headers
			'Content-Type': 'application/json'
		},  
		credentials: 'include' // Inclut les cookies dans la requête
	};

	// Effectue la requête initiale
   let response = await fetch(url, fetchOptions);
   
	// Si la réponse est 401 (Non autorisé), tente de rafraîchir le token
   if (response.status === 401) {

		const auth = await response.json();

		if(auth.isAuthenticated && auth.refresh){
			// Effectue une requête pour rafraîchir le token
			const refreshResponse = await fetch('/api/auth/refresh', {
				method: 'POST',
				credentials: 'include',
			});
			  
			const data = await refreshResponse.json();
			// Met à jour le CSRF token dans le localStorage
			localStorage.setItem('csrfToken',  data.csrfToken);
			// Si le rafraîchissement a réussi, réessaie la requête originale
			if (refreshResponse.ok) {
				response = await fetch(url, fetchOptions);	
			} else {
			// Si le rafraîchissement échoue, la session est considérée comme expirée
				throw new Error('Session expirée');
			}
		}
   }
 
	if (!response.ok) {
		throw new Error('Erreur réseau');
	 }
 
   return response;
}