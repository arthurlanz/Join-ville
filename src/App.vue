<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import HeaderComponent from './components/HeaderComponent.vue';
import CarrosselComponent from './components/CarrosselComponent.vue';
import CadastroComponent from './components/CadastroComponent.vue';
import FooterComponent from './components/FooterComponent.vue';

const route = useRoute();

// Verifica se a rota atual é a Home
const isHomePage = computed(() => route.name === 'Home');

// Lista de rotas que não devem mostrar header e footer
const noLayoutRoutes = ['LoginPage'];
const shouldShowLayout = computed(() => !noLayoutRoutes.includes(route.name));
</script>

<template>
  <div id="app">
    <!-- Header e Footer só aparecem em páginas que precisam -->
    <HeaderComponent v-if="shouldShowLayout" />
    
    <!-- Carrossel só na home -->
    <CarrosselComponent v-if="isHomePage" />
    
    <!-- Área principal do conteúdo -->
    <router-view />
    
    <!-- Componente de cadastro só na home -->
    <CadastroComponent v-if="isHomePage" />
    
    <!-- Footer em todas as páginas exceto login -->
    <FooterComponent v-if="shouldShowLayout" />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #f7f7f7;
  color: #333;
}

#app {
  min-height: 100vh;
}

/* Estilos globais para páginas de login/perfil */
.auth-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #c2d9e4 0%, #a8c8e0 100%);
}

.profile-page {
  min-height: 100vh;
  background: #f8f9fa;
}

/* Melhorias de responsividade global */
@media (max-width: 768px) {
  body {
    font-size: 14px;
  }
}

/* Transições suaves entre páginas */
.router-link-active {
  color: #1e4d8b !important;
}

/* Loading states globais */
.loading {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #1e4d8b;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Estados de erro globais */
.error-message {
  background: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  border: 1px solid #f5c6cb;
}

.success-message {
  background: #d4edda;
  color: #155724;
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  border: 1px solid #c3e6cb;
}

/* Botões globais consistentes */
.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
  text-align: center;
  border: none;
  font-size: 1rem;
}

.btn-primary {
  background: #1e4d8b;
  color: white;
}

.btn-primary:hover {
  background: #164080;
  transform: translateY(-1px);
}

.btn-secondary {
  background: transparent;
  color: #1e4d8b;
  border: 2px solid #1e4d8b;
}

.btn-secondary:hover {
  background: #1e4d8b;
  color: white;
}

.btn-danger {
  background: #dc3545;
  color: white;
}

.btn-danger:hover {
  background: #c82333;
}

/* Container responsivo global */
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

/* Modals globais */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

/* Acessibilidade */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Focus states melhorados */
*:focus-visible {
  outline: 2px solid #1e4d8b;
  outline-offset: 2px;
}
</style>