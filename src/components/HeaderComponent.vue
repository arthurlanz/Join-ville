<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { apiService } from '@/services/apiService'
import SearchBar from '@/components/SearchBarComponent.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const q = ref('')
const selectedCategory = ref('')
const selectedDate = ref('')
const events = ref([])

const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)

const favoriteEvents = ref([])

// --- Funções para favoritos ---
function loadFavorites() {
  try {
    const favorites = localStorage.getItem('favoriteEvents')
    favoriteEvents.value = favorites ? JSON.parse(favorites) : []
  } catch {
    favoriteEvents.value = []
  }
}

function toggleFavorite(eventId) {
  const index = favoriteEvents.value.indexOf(eventId)
  if (index > -1) favoriteEvents.value.splice(index, 1)
  else favoriteEvents.value.push(eventId)

  localStorage.setItem('favoriteEvents', JSON.stringify(favoriteEvents.value))
}

function onStorageUpdate(event) {
  if (event.key === 'favoriteEvents') {
    loadFavorites()
  }
}

const quantidade = computed(() => favoriteEvents.value.length)

// --- Dados do Usuário ---
// Usa os getters da Pinia Store para reatividade
const isAuthenticated = computed(() => authStore.isAuthenticated)
const userType = computed(() => authStore.userType)
const userName = computed(() => authStore.user?.first_name || authStore.user?.nome_empresa || 'Usuário')
const userAvatar = computed(() => authStore.user?.avatar || '/default-avatar.png')
const userId = computed(() => authStore.user?.id)

// --- Funções de Navegação e Logout ---
const goToProfile = () => {
  if (!isAuthenticated.value) {
    // Redireciona para o modal de login se não estiver logado
    router.push({ name: 'Home', query: { showLogin: 'true' } })
    return
  }

  if (userType.value === 'USUARIO') {
    router.push({ name: 'UserProfile' })
  } else if (userType.value === 'EMPRESA') {
    router.push({ name: 'CompanyProfile' })
  }
  isMobileMenuOpen.value = false
}

const handleLogout = () => {
  authStore.logout()
  isMobileMenuOpen.value = false
}

// Rotas principais de navegação para mobile e desktop
const navItems = computed(() => [
  { name: 'Home', path: '/', icon: 'fa-solid fa-home' },
  { name: 'Favoritos', path: '/favorites', icon: 'fa-solid fa-heart' },
  { name: 'Eventos', path: '/category', icon: 'fa-solid fa-calendar-days' },
  { name: 'Chat', path: '/chat', icon: 'fa-solid fa-users', requiresAuth: true }, // Nova rota de Chat
  // A rota de perfil é tratada pelo botão de avatar
])

// Rotas de Ação para empresas
const companyActions = [
  { name: 'Criar Evento', path: '/create-event', icon: 'fa-solid fa-plus' },
  { name: 'Meus Eventos', path: '/company-profile', icon: 'fa-solid fa-chart-line' },
]


// --- Configuração do Scroll e Menu Mobile ---
const handleScroll = () => {
  isScrolled.value = window.scrollY > 0
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

onMounted(() => {
  loadFavorites()
  window.addEventListener('storage', onStorageUpdate)
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('storage', onStorageUpdate)
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header :class="{ scrolled: isScrolled }">
    <div class="header-content container">
      <router-link to="/" class="logo">
        <img src="/logotipo.png" alt="JoinVille Logo" />
        <span class="logo-text">JoinVille</span>
      </router-link>

      <div class="search-bar-desktop">
        <SearchBar />
      </div>

      <nav :class="['main-nav', { 'mobile-open': isMobileMenuOpen }]">
        <div class="search-bar-mobile">
          <SearchBar />
        </div>
        <ul>
          <li v-for="item in navItems" :key="item.name">
            <router-link :to="item.path" @click="isMobileMenuOpen = false" v-if="!item.requiresAuth || isAuthenticated">
              <font-awesome-icon :icon="item.icon" class="nav-icon" />
              {{ item.name }}
              <span v-if="item.name === 'Favoritos'" class="badge">{{ quantidade }}</span>
            </router-link>
          </li>
          <li v-if="userType === 'EMPRESA'">
            <div class="dropdown">
              <button class="nav-link dropdown-toggle">
                <font-awesome-icon icon="fa-solid fa-building" class="nav-icon" />
                Empresa
              </button>
              <div class="dropdown-menu">
                <router-link
                  v-for="action in companyActions"
                  :key="action.name"
                  :to="action.path"
                  @click="isMobileMenuOpen = false"
                >
                  <font-awesome-icon :icon="action.icon" class="dropdown-icon" />
                  {{ action.name }}
                </router-link>
              </div>
            </div>
          </li>
        </ul>

        <div class="mobile-actions" v-if="isAuthenticated">
          <button @click="goToProfile" class="mobile-action-item">
            <img :src="userAvatar" alt="Avatar" class="profile-avatar" />
            <span class="user-name-mobile">{{ userName }}</span>
          </button>

          <router-link
            v-if="userType === 'EMPRESA'"
            v-for="action in companyActions"
            :key="action.name"
            :to="action.path"
            @click="isMobileMenuOpen = false"
            class="mobile-action-item"
          >
            <font-awesome-icon :icon="action.icon" />
            {{ action.name }}
          </router-link>

          <button @click="handleLogout" class="mobile-action-item logout-btn">
            <font-awesome-icon icon="fa-solid fa-sign-out-alt" />
            Sair
          </button>
        </div>
      </nav>
      <div class="header-actions">
        <button v-if="!isAuthenticated" @click="goToProfile" class="login-btn">Entrar / Cadastrar</button>
        <div v-else class="profile-dropdown-desktop">
          <button @click="goToProfile" class="profile-btn">
            <img :src="userAvatar" :alt="userName" class="profile-avatar" />
            <span class="user-name-desktop">{{ userName }}</span>
          </button>
          <div class="profile-dropdown-menu">
            <router-link :to="{ name: userType === 'USUARIO' ? 'UserProfile' : 'CompanyProfile' }">
              <font-awesome-icon :icon="userType === 'EMPRESA' ? 'fa-solid fa-building' : 'fa-solid fa-user'" />
              Meu Perfil
            </router-link>
            <router-link to="/chat">
                <font-awesome-icon icon="fa-solid fa-users" />
                Mensagens
            </router-link>
            <button @click="handleLogout">
              <font-awesome-icon icon="fa-solid fa-sign-out-alt" />
              Sair
            </button>
          </div>
        </div>
      </div>

      <button class="mobile-menu-btn" @click="toggleMobileMenu">
        <font-awesome-icon :icon="isMobileMenuOpen ? 'fa-solid fa-times' : 'fa-solid fa-bars'" />
      </button>
    </div>
  </header>

  <div class="mobile-menu-overlay" v-if="isMobileMenuOpen" @click="toggleMobileMenu"></div>
</template>

<style scoped>
/* Variáveis de cor (se não estiver em um arquivo global) */
:root {
  --primary-color: #1e4d8b;
  --secondary-color: #21a179;
  --text-color: #333;
  --gray-light: #f7f7f7;
}

header {
  position: sticky;
  top: 0;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  z-index: 1000;
  transition: box-shadow 0.3s ease;
}

header.scrolled {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  max-width: 1200px;
  margin: 0 auto;
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: var(--primary-color);
  font-size: 1.5rem;
  font-weight: 700;
}

.logo img {
  height: 40px;
  margin-right: 8px;
}

.logo-text {
  display: block;
}

/* --- Search Bar --- */
.search-bar-desktop {
  flex-grow: 1;
  max-width: 400px;
  margin: 0 30px;
}

.search-bar-mobile {
  display: none; /* Esconde no desktop */
  padding: 10px 20px;
  border-bottom: 1px solid #f0f0f0;
}

/* --- Navegação Principal (Desktop) --- */
.main-nav {
  display: flex;
  align-items: center;
}

.main-nav ul {
  display: flex;
  list-style: none;
  gap: 25px;
  margin: 0;
  padding: 0;
}

.main-nav a,
.dropdown-toggle {
  text-decoration: none;
  color: var(--text-color);
  font-weight: 500;
  padding: 8px 0;
  transition: color 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.main-nav a:hover,
.router-link-active,
.dropdown-toggle:hover {
  color: var(--secondary-color);
}

.nav-icon {
  font-size: 1.1rem;
}

/* Badge de Favoritos */
.badge {
  background: #ff4d4d;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 0.7rem;
  font-weight: 700;
  margin-left: 4px;
}

/* Dropdown da Empresa (Desktop) */
.dropdown {
  position: relative;
}

.dropdown-toggle {
  padding: 8px 0;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 180px;
  padding: 10px 0;
  display: none;
  z-index: 1000;
}

.dropdown:hover .dropdown-menu {
  display: block;
}

.dropdown-menu a {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;
  white-space: nowrap;
  font-size: 0.95rem;
  color: var(--text-color);
  text-decoration: none;
}

.dropdown-menu a:hover {
  background: var(--gray-light);
  color: var(--primary-color);
}

.dropdown-icon {
    font-size: 1rem;
}

/* --- Ações do Header (Desktop) --- */
.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.login-btn {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.login-btn:hover {
  background: #153c6a;
}

/* Botão de Perfil/Dropdown (Desktop) */
.profile-dropdown-desktop {
  position: relative;
  /* Use 'inline-block' para que o dropdown funcione */
  display: inline-block;
}

.profile-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: var(--text-color);
  transition: color 0.2s ease;
}

.profile-btn:hover {
  color: var(--secondary-color);
}

.user-name-desktop {
  max-width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}

.profile-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--primary-color);
}

.profile-dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 180px;
  padding: 10px 0;
  display: none;
  z-index: 1000;
}

.profile-dropdown-desktop:hover .profile-dropdown-menu {
  display: block;
}

.profile-dropdown-menu a,
.profile-dropdown-menu button {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;
  white-space: nowrap;
  font-size: 0.95rem;
  color: var(--text-color);
  text-decoration: none;
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
}

.profile-dropdown-menu a:hover,
.profile-dropdown-menu button:hover {
  background: var(--gray-light);
  color: var(--primary-color);
}

.profile-dropdown-menu button {
  color: #ff4d4d; /* Cor para o botão Sair */
}

.profile-dropdown-menu button:hover {
  background: #ffebeb;
}


.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-color);
  padding: 5px;
}

.mobile-actions {
  display: none;
}

.mobile-menu-overlay {
  display: none;
}

/* --- Media Queries (Ajustes para Mobile) --- */
@media (max-width: 992px) {
  .header-content {
    padding: 10px 20px;
  }

  .logo {
    order: 1;
  }

  .search-bar-desktop {
    display: none;
  }

  .header-actions {
    display: none;
  }

  .mobile-menu-btn {
    display: flex;
    order: 2;
  }

  .search-bar-mobile {
      display: block; /* Mostra no mobile */
  }

  /* Oculta o texto do logo no mobile */
  .logo-text {
      display: none;
  }

  /* Estilização do Menu Mobile */
  .main-nav {
    position: fixed;
    top: 0;
    left: -100%;
    width: 280px;
    height: 100vh;
    background: white;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
    transition: left 0.3s ease;
    z-index: 1001;
    padding-top: 60px; /* Espaço para o header */
    overflow-y: auto;
    flex-direction: column;
    align-items: flex-start;
  }

  .main-nav.mobile-open {
    left: 0;
  }

  .main-nav ul {
    flex-direction: column;
    padding: 10px 20px;
    gap: 0;
    width: 100%;
    border-top: 1px solid #f0f0f0;
  }

  /* Garante que o menu Empresa não apareça como dropdown */
  .main-nav li {
    width: 100%;
  }

  .main-nav a {
    display: flex;
    justify-content: flex-start;
    padding: 15px 0;
    font-size: 1rem;
    border-bottom: 1px solid #f0f0f0;
  }

  /* Esconde o dropdown da empresa no mobile e mostra os links como itens normais */
  .dropdown {
      display: none;
  }

  /* Mostra as Ações Móveis */
  .mobile-actions {
    display: flex;
    flex-direction: column;
    padding: 20px;
    border-top: 2px solid #f0f0f0;
    gap: 15px;
    width: 100%;
  }

  .mobile-action-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    color: var(--text-color);
    text-decoration: none;
    font-weight: 500;
  }

  .mobile-action-item:hover {
    background: #f0f0f0;
    border-radius: 8px;
  }

  .logout-btn {
      color: #ff4d4d;
      font-weight: 600;
  }

  .user-name-mobile {
    font-weight: 600;
  }

  .profile-avatar {
    width: 30px;
    height: 30px;
  }

  .mobile-menu-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 1000;
  }
}
</style>
