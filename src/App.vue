<script setup>
import { computed, ref, onMounted } from 'vue'; // Importado 'ref' e 'onMounted'
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth'; // Importado authStore para checar o usuário na montagem

import HeaderComponent from './components/HeaderComponent.vue';
import CarrosselComponent from './components/CarrosselComponent.vue';
import CadastroComponent from './components/CadastroComponent.vue';
import FooterComponent from './components/FooterComponent.vue';
import LoginPage from './views/LoginPage.vue'; // Componente LoginPage importado

const route = useRoute();
const authStore = useAuthStore(); // Instanciando a store
const showLoginModal = ref(false); // Estado para controlar a visibilidade do modal

// Verifica se a rota atual é a Home
const isHomePage = computed(() => route.name === 'Home');

// Lista de rotas que não devem mostrar header e footer
const noLayoutRoutes = ['LoginPage', 'ChatRoom']; // Mantenho LoginPage, mas adiciono ChatRoom (opcional, mas comum)
const shouldShowLayout = computed(() => !noLayoutRoutes.includes(route.name));


// Ação para fechar o modal
const closeModal = () => {
  showLoginModal.value = false;
};

// Se tivermos um token, tentamos buscar os dados do usuário na montagem
onMounted(() => {
  authStore.fetchUser();
});
</script>

<template>
  <div id="app">
    <HeaderComponent v-if="shouldShowLayout" @open-login="showLoginModal = true" />

    <CarrosselComponent v-if="isHomePage" />

    <router-view />

    <CadastroComponent v-if="isHomePage" />

    <FooterComponent v-if="shouldShowLayout" />

    <LoginPage v-if="showLoginModal" @close-modal="closeModal" />
  </div>
</template>

<style>
/* ... (Seus estilos globais) ... */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #f7f7f7;
  color: #333;
  line-height: 1.6;
}

/* Container de conteúdo principal */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }
}

/* Espaçamentos consistentes */
.section-spacing {
  padding: 4rem 0;
}

@media (max-width: 768px) {
  .section-spacing {
    padding: 2rem 0;
  }
}

/* Cards globais */
.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  overflow: hidden;
}

.card-body {
  padding: 2rem;
}

/* Forms globais */
.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #1e4d8b;
}

/* Botões globais */
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.75rem 1.5rem;
  background-color: #1e4d8b;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  text-decoration: none;
}

.btn-primary:hover {
  background-color: #153c6d;
}
</style>
