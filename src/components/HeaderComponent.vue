<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const q = ref('')
const onSubmit = () => {
  // ação de busca
}

const isScrolled = ref(false)
const isLoggedIn = ref(false)
const userType = ref('')
const userName = ref('')
const isMobileMenuOpen = ref(false)

// Verificar estado de login
const checkLoginStatus = () => {
  const token = localStorage.getItem('userToken')
  const type = localStorage.getItem('userType')
  const userData = localStorage.getItem('userData')
  
  if (token && type) {
    isLoggedIn.value = true
    userType.value = type
    
    if (userData) {
      const user = JSON.parse(userData)
      // Para empresas, usar companyName se disponível
      userName.value = type === 'company' ? (user.companyName || user.name) : user.name
    }
  } else {
    isLoggedIn.value = false
    userType.value = ''
    userName.value = ''
  }
}

const profileRoute = computed(() => {
  if (!isLoggedIn.value) return '/login'
  return userType.value === 'company' ? '/company-profile' : '/user-profile'
})

const profileLabel = computed(() => {
  if (!isLoggedIn.value) return 'Entrar'
  // Trunca o nome se for muito longo
  const name = userName.value || (userType.value === 'company' ? 'Empresa' : 'Usuário')
  return name.length > 15 ? name.substring(0, 15) + '...' : name
})

const profileIcon = computed(() => {
  if (!isLoggedIn.value) return 'user'
  return userType.value === 'company' ? 'building' : 'user'
})

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

let scrollHandler
let intervalId

onMounted(() => {
  scrollHandler = () => {
    isScrolled.value = window.scrollY > 10
  }
  
  window.addEventListener('scroll', scrollHandler)
  
  // Verificar login no carregamento
  checkLoginStatus()
  
  // Escutar mudanças no localStorage
  window.addEventListener('storage', checkLoginStatus)
  
  // Verificar login periodicamente para mudanças na mesma aba
  intervalId = setInterval(checkLoginStatus, 1000)
})

onUnmounted(() => {
  if (scrollHandler) {
    window.removeEventListener('scroll', scrollHandler)
  }
  window.removeEventListener('storage', checkLoginStatus)
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>

<template>
  <header :class="['site-header', { scrolled: isScrolled }]">
    <div class="slogan-bar">
      <span>Explore, Avalie e Viva Joinville de Verdade</span>
    </div>
    <div class="nav-area">
      <div class="container">
        <router-link to="/" class="brand">
          <img src="/logotipo.png" alt="JoinVille" />
        </router-link>

        <!-- Menu Hamburger Mobile -->
        <button class="mobile-menu-btn" @click="toggleMobileMenu">
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav class="main-nav" :class="{ 'mobile-open': isMobileMenuOpen }" aria-label="Categorias">
          <ul>
            <li>
              <router-link :to="{ name: 'CategoryPage', params: { categoryName: 'Gastronomia' } }"
                @click="isMobileMenuOpen = false">Gastronomia</router-link>
            </li>
            <li>
              <router-link
                :to="{ name: 'CategoryPage', params: { categoryName: 'Clássicos de Joinville' } }"
                @click="isMobileMenuOpen = false">Clássicos de Joinville</router-link>
            </li>
            <li>
              <router-link
                :to="{ name: 'CategoryPage', params: { categoryName: 'Festas e Shows' } }"
                @click="isMobileMenuOpen = false">Festas e shows</router-link>
            </li>
            <li>
              <router-link :to="{ name: 'CategoryPage', params: { categoryName: 'Esportes' } }"
                @click="isMobileMenuOpen = false">Esportes</router-link>
            </li>
            <li>
              <router-link
                :to="{ name: 'CategoryPage', params: { categoryName: 'Atividades ao Ar Livre' } }"
                @click="isMobileMenuOpen = false">Atividades ao ar livre</router-link>
            </li>
            <li>
              <router-link :to="{ name: 'CategoryPage', params: { categoryName: 'Cultura' } }"
                @click="isMobileMenuOpen = false">Cultura</router-link>
            </li>
          </ul>

          <!-- Ações Mobile dentro do menu -->
          <div class="mobile-actions">
            <router-link to="/favorites" class="mobile-action-item" @click="isMobileMenuOpen = false">
              <font-awesome-icon icon="fa-solid fa-heart" />
              <span>Favoritos</span>
            </router-link>
            
            <router-link :to="profileRoute" class="mobile-action-item" @click="isMobileMenuOpen = false">
              <font-awesome-icon :icon="profileIcon" />
              <span>{{ profileLabel }}</span>
            </router-link>
          </div>
        </nav>

        <div class="actions">
          <router-link to="/favorites" class="icon-btn" aria-label="Favoritos">
            <font-awesome-icon icon="fa-solid fa-heart" style="color: #11508e" size="lg" />
          </router-link>
          
          <router-link :to="profileRoute" class="profile-btn" :aria-label="profileLabel">
            <font-awesome-icon :icon="profileIcon" />
            <span class="profile-text">{{ profileLabel }}</span>
          </router-link>
        </div>
      </div>

      <form class="search-line" @submit.prevent="onSubmit">
        <div class="search">
          <span class="icon" aria-hidden="true">🔍</span>
          <input v-model="q" type="text" placeholder="Encontre eventos, shows, festivais" />
        </div>
      </form>
    </div>
  </header>
</template>

<style scoped>
/* HEADER FIXO */
.site-header {
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  transition: all 0.3s ease;
  box-shadow: none;
  background-color: white;
}

/* sombra suave quando scroll > 10px */
.site-header.scrolled {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* slogan-bar */
.slogan-bar {
  background: #11508e;
  color: #fff;
  font-family: 'Istok Web', sans-serif;
  line-height: 1;
  padding: 0.65rem 1rem;
  text-align: center;
}

/* nav-area */
.nav-area {
  background: #f7f7f7;
  color: #11508e;
  margin: 0;
}

/* container */
.container {
  max-width: 1200px;
  padding: 0.6rem 24px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 20px;
}

/* logo */
.brand img {
  height: 36px;
  display: block;
}

/* Mobile Menu Button */
.mobile-menu-btn {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 22px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1002;
}

.mobile-menu-btn span {
  display: block;
  height: 3px;
  width: 100%;
  background: #11508e;
  border-radius: 3px;
  transition: all 0.3s ease;
}

/* menu central */
.main-nav ul {
  display: flex;
  gap: 20px;
  list-style: none;
  margin: 0;
  padding: 0;
  justify-content: center;
  flex-wrap: wrap;
}

.main-nav a {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  color: #11508e;
  text-decoration: none;
  padding: 0.25rem 0;
  white-space: nowrap;
  transition: color 0.3s ease;
}

.main-nav a:hover {
  color: #0066cc;
}

/* Mobile actions (hidden on desktop) */
.mobile-actions {
  display: none;
}

/* actions */
.actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 15px;
}

.icon-btn {
  background: transparent;
  border: 0;
  padding: 8px;
  cursor: pointer;
  text-decoration: none;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.icon-btn:hover {
  background-color: rgba(17, 80, 142, 0.1);
}

.profile-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 36px;
  padding: 0 14px;
  background: #fff;
  border: 1px solid rgba(17, 80, 142, 0.2);
  border-radius: 18px;
  cursor: pointer;
  text-decoration: none;
  color: #11508e;
  transition: all 0.3s ease;
  font-size: 0.85rem;
  font-weight: 500;
  min-width: fit-content;
  max-width: 200px;
}

.profile-btn:hover {
  background: #f0f8ff;
  border-color: #11508e;
  transform: translateY(-1px);
}

.profile-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* busca */
.search-line {
  max-width: 1200px;
  margin: 0 auto;
  padding: 4px 24px 18px;
}

.search {
  position: relative;
  width: 520px;
  margin: 0 auto;
}

.search .icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1rem;
  opacity: 0.6;
}

.search input {
  width: 100%;
  height: 40px;
  padding: 0 14px 0 38px;
  border: 1px solid rgba(17, 80, 142, 0.25);
  background: #fff;
  color: #11508e;
  border-radius: 20px;
  outline: none;
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.search input:focus {
  border-color: #11508e;
  box-shadow: 0 0 0 3px rgba(17, 80, 142, 0.1);
}

.search input::placeholder {
  color: rgba(17, 80, 142, 0.6);
}

/* Responsividade */
@media (max-width: 1200px) {
  .main-nav ul {
    gap: 15px;
  }
  .main-nav a {
    font-size: 0.85rem;
  }
}

@media (max-width: 1100px) {
  .container {
    gap: 15px;
  }
  .main-nav ul {
    gap: 12px;
  }
  .main-nav a {
    font-size: 0.8rem;
  }
}

@media (max-width: 900px) {
  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .mobile-menu-btn {
    display: flex;
    order: 2;
  }
  
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
    padding-top: 80px;
    overflow-y: auto;
  }
  
  .main-nav.mobile-open {
    left: 0;
  }
  
  .main-nav ul {
    flex-direction: column;
    padding: 20px;
    gap: 0;
  }
  
  .main-nav li {
    border-bottom: 1px solid #f0f0f0;
  }
  
  .main-nav a {
    display: block;
    padding: 15px 0;
    font-size: 1rem;
  }
  
  .mobile-actions {
    display: flex;
    flex-direction: column;
    padding: 20px;
    border-top: 2px solid #f0f0f0;
    gap: 15px;
  }
  
  .mobile-action-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: #f8f9fa;
    border-radius: 8px;
    text-decoration: none;
    color: #11508e;
    font-weight: 500;
  }
  
  .actions {
    display: none;
  }
  
  .search {
    width: 90%;
    max-width: 400px;
  }
}

@media (max-width: 600px) {
  .slogan-bar {
    font-size: 0.85rem;
    padding: 0.5rem 0.5rem;
  }
  
  .search-line {
    padding: 4px 16px 18px;
  }
  
  .brand img {
    height: 30px;
  }
  
  .main-nav {
    width: 250px;
  }
}
</style>