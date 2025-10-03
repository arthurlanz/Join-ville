<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import SearchBar from '@/components/SearchBarComponent.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

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

// --- Funções de Navegação e Logout ---
const goToAuth = () => {
  router.push({ name: 'LoginPage' })
  closeAllOverlays()
}

const handleLogout = () => {
  authStore.logout()
  closeAllOverlays()
  router.push('/')
}

// --- Itens de Navegação ---
const navItems = computed(() => [
  { name: 'Home', path: '/', icon: 'fa-solid fa-home' },
  { name: 'Eventos', path: '/categories', icon: 'fa-solid fa-calendar-days' },
  { name: 'Favoritos', path: '/favorites', icon: 'fa-solid fa-heart' },
  { name: 'Chat', path: '/chat', icon: 'fa-solid fa-users', requiresAuth: true },
])

// --- Controle dos Overlays (Sidebar, Search Modal, Mobile Menu) ---
function closeAllOverlays() {
  isMobileMenuOpen.value = false
  isProfileSidebarOpen.value = false
  isSearchModalOpen.value = false
}

function toggleMobileMenu() {
  if (isMobileMenuOpen.value) {
    closeAllOverlays()
  } else {
    closeAllOverlays()
    isMobileMenuOpen.value = true
  }
}

function toggleProfileSidebar() {
  if (isProfileSidebarOpen.value) {
    closeAllOverlays()
  } else {
    closeAllOverlays()
    isProfileSidebarOpen.value = true
  }
}

function toggleSearchModal() {
  if (isSearchModalOpen.value) {
    closeAllOverlays()
  } else {
    closeAllOverlays()
    isSearchModalOpen.value = true
  }
}

// Fecha overlays ao pressionar a tecla 'Escape'
const handleKeydown = (e) => {
  if (e.key === 'Escape') {
    closeAllOverlays()
  }
}

// --- Lifecycle Hooks ---
onMounted(() => {
  window.addEventListener('scroll', () => (isScrolled.value = window.scrollY > 10))
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('scroll', () => (isScrolled.value = window.scrollY > 10))
  window.removeEventListener('keydown', handleKeydown)
})

// Fecha overlays quando a rota muda
watch(route, () => {
  closeAllOverlays()
})
</script>

<template>
  <div>
    <div class="slogan-bar">
      <p>Explore, Avalie e Viva Joinville de Verdade</p>
    </div>

    <header :class="['main-header', { scrolled: isScrolled }]">
      <div class="container header-content">
        <router-link to="/" class="logo">
          <img src="/logotipo.png" alt="JoinVille Logo" />
          <span class="logo-text">JoinVille</span>
        </router-link>

        <nav class="main-nav">
          <ul>
            <li v-for="item in navItems" :key="item.name">
              <router-link :to="item.path" v-if="!item.requiresAuth || isAuthenticated">
                {{ item.name }}
              </router-link>
            </li>
          </ul>
        </nav>

        <div class="header-actions">
          <button @click="toggleSearchModal" class="action-btn search-btn">
            <font-awesome-icon icon="fa-solid fa-search" />
          </button>

          <div v-if="!isAuthenticated" class="auth-buttons">
            <button @click="goToAuth" class="btn btn-secondary">Entrar</button>
            <button @click="goToAuth" class="btn btn-primary">Cadastrar</button>
          </div>
          <div v-else>
            <button @click="toggleProfileSidebar" class="user-profile-button">
              {{ userName }}
            </button>
          </div>
        </div>

        <button class="mobile-menu-btn" @click="toggleMobileMenu">
          <font-awesome-icon :icon="isMobileMenuOpen ? 'fa-solid fa-times' : 'fa-solid fa-bars'" />
        </button>
      </div>
    </header>

    <div v-if="isSearchModalOpen" class="search-modal-overlay" @click="toggleSearchModal">
      <div class="search-modal-content" @click.stop>
        <button class="close-modal-btn" @click="toggleSearchModal">
          <font-awesome-icon icon="fa-solid fa-times" />
        </button>
        <SearchBar />
      </div>
    </div>

    <div
      :class="['profile-sidebar-overlay', { open: isProfileSidebarOpen }]"
      @click="toggleProfileSidebar"
    ></div>
    <aside :class="['profile-sidebar', { open: isProfileSidebarOpen }]">
      <div class="sidebar-header">
        <h3>Olá, {{ userName }}!</h3>
        <button class="close-sidebar-btn" @click="toggleProfileSidebar">
          <font-awesome-icon icon="fa-solid fa-times" />
        </button>
      </div>
      <div class="sidebar-links">
        <router-link :to="userType === 'EMPRESA' ? '/company-profile' : '/user-profile'">
          <font-awesome-icon icon="fa-solid fa-user" /> Meu Perfil
        </router-link>
        <router-link to="/favorites">
          <font-awesome-icon icon="fa-solid fa-heart" /> Meus Favoritos
        </router-link>
        <router-link to="/chat">
          <font-awesome-icon icon="fa-solid fa-users" /> Minhas Mensagens
        </router-link>
      </div>
      <div class="sidebar-footer">
        <button @click="handleLogout" class="logout-btn">
          <font-awesome-icon icon="fa-solid fa-sign-out-alt" /> Sair
        </button>
      </div>
    </aside>
  </div>
</template>

<style scoped>
/* ESTILOS ANTERIORES (SLOGAN, HEADER GERAL, LOGO, NAV DESKTOP) PERMANECEM OS MESMOS */
.slogan-bar {
  background-color: #1e4d8b;
  color: white;
  text-align: center;
  padding: 8px 16px;
  font-size: 0.9rem;
  font-weight: 500;
}
.slogan-bar p {
  margin: 0;
}
.main-header {
  position: sticky;
  top: 0;
  background: white;
  z-index: 1000;
  transition: box-shadow 0.3s ease;
  border-bottom: 1px solid #e5e5e5;
}
.main-header.scrolled {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
}
.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #1e4d8b;
  font-size: 1.5rem;
  font-weight: 700;
  flex-shrink: 0;
}
.logo img {
  height: 40px;
  margin-right: 10px;
}
.main-nav {
  margin: 0 auto;
}
.main-nav ul {
  display: flex;
  list-style: none;
  gap: 32px;
  margin: 0;
  padding: 0;
}
.main-nav a {
  text-decoration: none;
  color: #333;
  font-weight: 600;
  font-size: 1rem;
  padding: 8px 4px;
  position: relative;
  transition: color 0.3s ease;
}
.main-nav a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #1e4d8b;
  transform: scaleX(0);
  transition: transform 0.3s ease;
}
.main-nav a:hover,
.main-nav a.router-link-exact-active {
  color: #1e4d8b;
}
.main-nav a:hover::after,
.main-nav a.router-link-exact-active::after {
  transform: scaleX(1);
}

/* --- AÇÕES DO HEADER (ATUALIZADO) --- */
.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.action-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: #555;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease, color 0.2s ease;
}
.action-btn:hover {
  background-color: #f0f0f0;
  color: #1e4d8b;
}

.btn-primary {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #1e4d8b 0%, #2d5aa0 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(30, 77, 139, 0.2);
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(30, 77, 139, 0.3);
}

.user-profile-button {
  background: #f0f4f9;
  color: #1e4d8b;
  border: 1px solid #d0e0f0;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}
.user-profile-button:hover {
  background: #e3eef9;
  border-color: #1e4d8b;
}
.auth-buttons {
  display: flex;
  gap: 12px;
}

/* Estilo genérico para os botões */
.btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: 2px solid transparent; /* Adicionado para alinhamento */
  transition: all 0.3s ease;
  white-space: nowrap; /* Impede que o texto quebre */
}

/* Botão Primário (Cadastrar) - Já existente, mas refinado */
.btn-primary {
  background: #1e4d8b;
  color: white;
  box-shadow: 0 2px 8px rgba(30, 77, 139, 0.2);
}
.btn-primary:hover {
  background: #164080;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(30, 77, 139, 0.3);
}

/* NOVO: Botão Secundário (Entrar) */
.btn-secondary {
  background: transparent;
  color: #1e4d8b;
  border-color: #d0e0f0;
}
.btn-secondary:hover {
  background: #f0f4f9;
  border-color: #1e4d8b;
}
/* --- MODAL DE PESQUISA --- */
.search-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  z-index: 1010;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 15vh;
}
.search-modal-content {
  background: white;
  width: 90%;
  max-width: 600px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  position: relative;
}
.close-modal-btn {
  position: absolute;
  top: -40px;
  right: 0;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
}

/* --- SIDEBAR DE PERFIL --- */
.profile-sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1005;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease;
}
.profile-sidebar-overlay.open {
  opacity: 1;
  visibility: visible;
}

.profile-sidebar {
  position: fixed;
  top: 0;
  right: -100%;
  width: 300px;
  height: 100%;
  background: white;
  z-index: 1006;
  transition: right 0.35s ease;
  box-shadow: -5px 0 25px rgba(0, 0, 0, 0.15);
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
  color: #1e4d8b;
}
.close-sidebar-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #888;
  cursor: pointer;
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
  color: #1e4d8b;
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
  padding: 0.75rem;
  border: 1px solid #e74c3c;
  background: #fff5f5;
  color: #e74c3c;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}
.logout-btn:hover {
  background: #e74c3c;
  color: white;
}

/* --- RESPONSIVIDADE --- */
.mobile-menu-btn {
  display: none;
} /* O resto do CSS mobile da versão anterior permanece */
@media (max-width: 992px) {
  .main-nav,
  .user-profile-button {
    display: none;
  }
  .mobile-menu-btn {
    display: block;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #333;
  }
  /* O CSS do menu mobile da versão anterior é necessário aqui */
}
</style>
