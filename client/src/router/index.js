import { useAuthStore } from '@/stores/auth';
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import AuthView from '@/views/AuthView.vue';
import PageNotFoundView from '@/views/PageNotFoundView.vue';



const routes = [
	{ path: '/:pathMatch(.*)*', name: '404', component: PageNotFoundView },
	{ path: '/', name: 'Login', component: AuthView, meta: { requiresGuest: true }},
	{ path: '/dashboard', name: 'dashboard', component: HomeView, meta: { requiresAuth: true }}
];

const router = createRouter({
	history: createWebHistory(
		import.meta.env.BASE_URL),
	routes
});

router.beforeEach(async (to, from, next) => {
	// On vérifie si c'est un utilisateur connecté ou pas
	const authStore = useAuthStore();
	await authStore.checkAuth();
  
	// Si la route nécessite un utilisateur non authentifié et que l'utilisateur est authentifié
	if (to.meta.requiresGuest && authStore.isAuthenticated) {
		next('/dashboard'); // Rediriger vers le dashboard
	}
	// Si la route nécessite une authentification et que l'utilisateur n'est pas authentifié
	else if (to.meta.requiresAuth && !authStore.isAuthenticated) {
		next('/'); // Rediriger vers la page de login
	}
	// Dans tous les autres cas, permettre la navigation
	else {
		next();
	}
})

export default router