import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home', // maiúsculo pra bater com teu App.vue
      component: HomeView,
    },
    {
      path: '/about',
      name: 'About',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/evento/:id',
      name: 'EventDetails', // rota de detalhe de evento
      component: () => import('../views/EventDetails.vue'),
      props: true, // passa o ID como prop
    },
    {
      path: 'create-event',
      name: 'CreateEvent', // rota de criação de evento
      component: () => import('../views/CreateEvent.vue'),
    },
    {
      path: '/login',
      name: 'LoginPage',
      component: () => import('../views/LoginView.vue'),
    },
  ],
})

export default router
