<template>
  <header :class="['header', { scrolled: isScrolled }]">
    <div class="container header-content">
      <router-link to="/" class="logo">
        <img src="/logotipo.png" alt="Joinville Logo" class="logo-img" />
      </router-link>

      <nav class="main-nav">
        <router-link to="/" class="nav-item">
          <font-awesome-icon icon="fa-solid fa-home" class="nav-icon" />
          <span>Home</span>
        </router-link>
        <router-link to="/categories" class="nav-item">
          <font-awesome-icon icon="fa-solid fa-calendar-days" class="nav-icon" />
          <span>Eventos</span>
        </router-link>
        <router-link to="/favorites" class="nav-item">
          <font-awesome-icon icon="fa-solid fa-heart" class="nav-icon" />
          <span>Favoritos</span>
        </router-link>
        <router-link to="/chat" class="nav-item">
          <font-awesome-icon icon="fa-solid fa-comment-dots" class="nav-icon" />
          <span>Chat</span>
        </router-link>
      </nav>

      <div class="header-actions">
        <button
          class="action-btn search-btn"
          @click="isSearchModalOpen = true"
          title="Buscar Eventos"
        >
          <font-awesome-icon icon="fa-solid fa-search" />
        </button>

        <div v-if="!isAuthenticated" class="auth-group">
          <button class="btn-primary desktop-only" @click="goToAuth">
            <font-awesome-icon icon="fa-solid fa-sign-in-alt" />
            <span>Entrar</span>
          </button>
        </div>
        <div v-else class="profile-group" @click="toggleProfileSidebar">
          <div class="profile-avatar">
            <img v-if="authStore.user?.avatar" :src="authStore.user.avatar" :alt="userName" />
            <font-awesome-icon v-else icon="fa-solid fa-user" />
          </div>
        </div>

        <button class="action-btn menu-btn" @click="isMobileMenuOpen = true">
          <font-awesome-icon icon="fa-solid fa-bars" />
        </button>
      </div>
    </div>
  </header>

  <div :class="['profile-sidebar', { open: isProfileSidebarOpen }]">
    <div class="sidebar-header">
      <h3>Meu Perfil</h3>
      <button class="close-sidebar-btn" @click="isProfileSidebarOpen = false">
        <font-awesome-icon icon="fa-solid fa-times" />
      </button>
    </div>
    <div class="sidebar-user-info">
      <div class="profile-avatar sidebar-avatar">
        <img v-if="authStore.user?.avatar" :src="authStore.user.avatar" :alt="userName" />
        <font-awesome-icon v-else icon="fa-solid fa-user" />
      </div>
      <h4>{{ userName }}</h4>
      <p v-if="authStore.user?.email">{{ authStore.user.email }}</p>
    </div>
    <nav class="sidebar-links">
      <a @click="goToProfile" class="sidebar-link">
        <font-awesome-icon icon="fa-solid fa-cog" />
        <span>Configurações do Perfil</span>
      </a>
      <a v-if="userType === 'EMPRESA'" @click="goToCreateEvent" class="sidebar-link">
        <font-awesome-icon icon="fa-solid fa-plus" />
        <span>Criar Evento</span>
      </a>
    </nav>
    <div class="sidebar-footer">
      <button class="btn-logout" @click="handleLogout">
        <font-awesome-icon icon="fa-solid fa-sign-out-alt" />
        Sair
      </button>
    </div>
  </div>
  <div v-if="isProfileSidebarOpen" class="overlay" @click="isProfileSidebarOpen = false"></div>

  <div
    :class="['mobile-menu-overlay', { open: isMobileMenuOpen }]"
    @click.self="isMobileMenuOpen = false"
  >
    <nav :class="['mobile-nav', { open: isMobileMenuOpen }]">
      <div class="sidebar-header">
        <h3>Menu</h3>
        <button class="close-sidebar-btn" @click="isMobileMenuOpen = false">
          <font-awesome-icon icon="fa-solid fa-times" />
        </button>
      </div>

      <ul class="mobile-nav-links">
        <li v-for="item in navItems" :key="item.name">
          <router-link :to="item.path" @click="closeAllOverlays">
            <font-awesome-icon :icon="item.icon" class="nav-icon" />
            {{ item.name }}
          </router-link>
        </li>
      </ul>

      <div class="nav-footer">
        <button v-if="!isAuthenticated" class="btn-auth" @click="goToAuth">
          <font-awesome-icon icon="fa-solid fa-sign-in-alt" />
          Entrar ou Cadastrar
        </button>
        <button v-else class="btn-logout" @click="handleLogout">
          <font-awesome-icon icon="fa-solid fa-sign-out-alt" />
          Sair
        </button>
      </div>
    </nav>
  </div>

  <div
    v-if="isSearchModalOpen"
    class="search-modal-overlay"
    @click.self="isSearchModalOpen = false"
  >
    <div class="search-modal-content">
      <button class="close-search-btn" @click="isSearchModalOpen = false">
        <font-awesome-icon icon="fa-solid fa-times" />
      </button>
      <SearchBar @close-search="isSearchModalOpen = false" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import SearchBar from '@/components/SearchBarComponent.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const emit = defineEmits(['openLogin'])
// --- Refs de Estado ---
const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)
const isProfileSidebarOpen = ref(false)
const isSearchModalOpen = ref(false)

// --- Dados do Usuário ---
const isAuthenticated = computed(() => authStore.isAuthenticated)
const userType = computed(() => authStore.userType)
const userName = computed(
  () => authStore.user?.first_name || authStore.user?.nome_empresa || 'Usuário'
)

// --- Funções de Controle de Estado ---

const closeAllOverlays = () => {
  isMobileMenuOpen.value = false
  isProfileSidebarOpen.value = false
  isSearchModalOpen.value = false
}

const toggleProfileSidebar = () => {
  if (isAuthenticated.value) {
    if (!isProfileSidebarOpen.value) {
      isMobileMenuOpen.value = false // Fecha outros menus ao abrir
      isSearchModalOpen.value = false
    }
    isProfileSidebarOpen.value = !isProfileSidebarOpen.value
  }
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 0
}

// --- Funções de Navegação e Logout ---
const goToAuth = () => {
  router.push({ name: 'LoginPage' })
  closeAllOverlays()
}

const goToProfile = () => {
  if (userType.value === 'USUARIO') {
    router.push({ name: 'UserProfile' })
  } else if (userType.value === 'EMPRESA') {
    router.push({ name: 'CompanyProfile' })
  }
  closeAllOverlays()
}

const goToCreateEvent = () => {
  router.push({ name: 'CreateEvent' })
  closeAllOverlays()
}

const handleLogout = () => {
  authStore.logout()
  closeAllOverlays()
  router.push('/')
}

// --- Itens de Navegação para Mobile ---
const navItems = computed(() => [
  { name: 'Home', path: '/', icon: 'fa-solid fa-home' },
  { name: 'Eventos', path: '/categories', icon: 'fa-solid fa-calendar-days' },
  { name: 'Favoritos', path: '/favorites', icon: 'fa-solid fa-heart' },
  { name: 'Chat', path: '/chat', icon: 'fa-solid fa-comment-dots' },
])

// --- Hooks de Ciclo de Vida ---
onMounted(() => {
  window.addEventListener('scroll', handleScroll)

  // CORREÇÃO CRÍTICA (LOCAL DO ERRO DE TYPERROR)
  // Troca authStore.initializeAuth() por authStore.fetchUser()
  // No entanto, como o App.vue já chama fetchUser(), esta chamada é feita
  // apenas como fallback ou se for estritamente necessária aqui.
  if (localStorage.getItem('accessToken') && !authStore.isAuthenticated) {
    authStore.fetchUser()
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// Lógica de watch para fechar o modal de busca ao navegar
watch(
  () => route.path,
  () => {
    if (isSearchModalOpen.value) {
      isSearchModalOpen.value = false
    }
  }
)

// Lógica de watch para fechar a barra lateral de perfil ao navegar
watch(
  () => route.path,
  () => {
    if (isProfileSidebarOpen.value) {
      isProfileSidebarOpen.value = false
    }
  }
)
</script>

<style scoped>
/* O restante do CSS fica aqui */
:root {
  --primary-color: #1e4d8b;
  --secondary-color: #ff6f61;
}

/* Header principal */
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  z-index: 50;
  transition: all 0.3s ease;
}

.header.scrolled {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px; /* Altura padrão do header */
  padding: 0 2rem;
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  height: 100%;
}

.logo-img {
  height: 40px; /* Ajuste o tamanho da logo */
  width: auto;
}

/* Navegação Principal */
.main-nav {
  display: flex;
  gap: 30px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: #333;
  font-weight: 500;
  transition: color 0.2s ease;
}

.nav-item:hover,
.nav-item.router-link-exact-active {
  color: var(--primary-color);
}

.nav-icon {
  font-size: 1.1rem;
}

/* Ações do Header */
.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #333;
  font-size: 1.2rem;
  transition: color 0.2s ease;
  padding: 5px;
}

.action-btn:hover {
  color: var(--primary-color);
}

.search-btn {
  display: block;
}

/* Grupo de Autenticação */
.auth-group {
  display: flex;
}

.btn-primary {
  background-color: #1a4178;
  color: white;
  padding: 8px 15px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Grupo de Perfil (Avatar) */
.profile-group {
  cursor: pointer;
}

.profile-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f4f9;
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-avatar .fa-user {
  font-size: 1.3rem;
  color: var(--primary-color);
}

/* --- Sidebar de Perfil (Comum para Desktop e Mobile) --- */
.profile-sidebar {
  position: fixed;
  top: 0;
  right: -300px;
  width: 300px;
  height: 100vh;
  background: white;
  z-index: 1001;
  box-shadow: -4px 0 15px rgba(0, 0, 0, 0.1);
  transition: right 0.3s ease;
  display: flex;
  flex-direction: column;
}

.profile-sidebar.open {
  right: 0;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
}
.sidebar-header h3 {
  margin: 0;
  color: var(--primary-color);
}
.close-sidebar-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #888;
  cursor: pointer;
}

.sidebar-user-info {
  padding: 1.5rem;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
}

.sidebar-avatar {
  width: 80px;
  height: 80px;
  margin: 0 auto 10px;
}
.sidebar-user-info h4 {
  margin: 0 0 5px 0;
  color: #333;
}
.sidebar-user-info p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.sidebar-links {
  padding: 1rem 0;
  flex-grow: 1;
}
.sidebar-links a {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 1rem 1.5rem;
  color: #333;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s ease, color 0.2s ease;
}
.sidebar-links a:hover,
.sidebar-links a.router-link-exact-active {
  background-color: #f0f4f9;
  color: var(--primary-color);
}

.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid #f0f0f0;
}
.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  background-color: #dc3545;
  color: white;
  border: none;
  font-weight: 600;
  transition: background-color 0.2s ease;
}
.logout-btn:hover {
  background-color: #c82333;
}
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  transition: opacity 0.3s ease;
}

/* --- Menu Mobile (Hamburger) --- */
.menu-btn {
  display: none; /* Esconde em desktop */
}

.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1001;
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}
.mobile-menu-overlay.open {
  opacity: 1;
  visibility: visible;
}

/* Menu lateral */
.mobile-nav {
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  right: -100%; /* Começa fora da tela */
  width: 280px;
  height: 100vh;
  background: white;
  z-index: 1002;
  transition: right 0.3s ease;
  padding: 0;
  box-shadow: -4px 0 15px rgba(0, 0, 0, 0.1);
}
.mobile-nav.open {
  right: 0;
}
.mobile-nav-links {
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
}
.mobile-nav-links a {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 1rem 1.5rem;
  text-decoration: none;
  color: #333;
  font-weight: 600;
  transition: background-color 0.2s ease;
}
.mobile-nav-links a:hover,
.mobile-nav-links a.router-link-exact-active {
  background-color: #f0f4f9;
  color: var(--primary-color);
}
.mobile-nav .nav-icon {
  width: 20px;
  color: var(--primary-color);
}

.nav-footer {
  padding: 1.5rem;
  border-top: 1px solid #eee;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.nav-footer button {
  width: 100%;
  padding: 0.75rem;
  border-radius: 6px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid transparent;
}
.btn-auth {
  background-color: #1a4178;
  color: white;
}
.btn-logout {
  background-color: rgba(255, 0, 0, 0.753);
  color: white;
  border-color: #dc3545;
}
.btn-logout:hover {
  background-color: #f8d7da;
}

/* --- Modal de Pesquisa --- */
.search-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 900;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 80px; /* Para ficar abaixo do header fixo */
}

.search-modal-content {
  position: relative;
  background: white;
  width: 90%;
  max-width: 600px;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  transform: translateY(20px);
  animation: slideDown 0.3s forwards;
}

.close-search-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  z-index: 10;
}

@keyframes slideDown {
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* --- Media Queries --- */
@media (max-width: 1024px) {
  .main-nav {
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .header-content {
    padding: 0 1rem;
    height: 60px;
  }
  .logo-img {
    height: 30px;
  }
  .main-nav,
  .desktop-only {
    display: none;
  }
  .menu-btn {
    display: block; /* Mostra o menu hamburger */
  }
  .header-actions {
    gap: 10px;
  }
}
</style>
