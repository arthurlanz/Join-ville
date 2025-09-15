<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import HeaderComponent from './components/HeaderComponent.vue';
import CarrosselComponent from './components/CarrosselComponent.vue';
import CadastroComponent from './components/CadastroComponent.vue';
import FooterComponent from './components/FooterComponent.vue';
import LoginModal from './components/LoginModal.vue'; // Importa o novo modal

const route = useRoute();
const isLoginModalVisible = ref(false);

// Verifica se a rota atual é a Home
const isHomePage = computed(() => route.name === 'Home');

const showLoginModal = () => {
  isLoginModalVisible.value = true;
};

const hideLoginModal = () => {
  isLoginModalVisible.value = false;
};
</script>

<template>
  <div id="app">
    <HeaderComponent @open-login-modal="showLoginModal" />
    
    <CarrosselComponent v-if="isHomePage" />
    
    <router-view />
    
    <CadastroComponent v-if="isHomePage" />

    <LoginModal :is-visible="isLoginModalVisible" @close-modal="hideLoginModal" />
    
    <FooterComponent />
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
</style>