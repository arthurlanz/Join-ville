<script setup>
import { ref, onMounted } from 'vue'

const q = ref('')
const onSubmit = () => {
  // ação de busca
}

const isScrolled = ref(false)

onMounted(() => {
  window.addEventListener('scroll', () => {
    isScrolled.value = window.scrollY > 10
  })
})
</script>

<template>
  <header :class="['site-header', { 'scrolled': isScrolled }]">
    <div class="slogan-bar">
      <span>Explore, Avalie e Viva Joinville de Verdade</span>
    </div>
    <div class="nav-area">
      <div class="container">
        <a href="HeaderComponent.vue" class="brand">
          <img src="/logotipo.png" alt="JoinVille" />
        </a>

        <nav class="main-nav" aria-label="Categorias">
          <ul>
            <li><a href="#">Gastronomia</a></li>
            <li><a href="#">Clássicos de Joinville</a></li>
            <li><a href="#">Festas e shows</a></li>
            <li><a href="#">Esportes</a></li>
            <li><a href="#">Atividades ao ar livre</a></li>
            <li><a href="#">Cultura</a></li>
          </ul>
        </nav>

        <div class="actions">
          <button class="icon-btn" aria-label="Favoritos">
            <img src="/Star 1.png" alt="" />
          </button>
          <button class="profile-btn" aria-label="Perfil">
            <img src="/fotoperfil.png" alt="" />
          </button>
        </div>
      </div>

      <form class="search-line" @submit.prevent="onSubmit">
        <div class="search">
          <span class="icon" aria-hidden="true">🔍</span>
          <input
            v-model="q"
            type="text"
            placeholder="Encontre eventos, shows, restaurantes"
          />
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
}

/* sombra suave quando scroll > 10px */
.site-header.scrolled {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  background-color: white; /* mantém a cor do header ao rolar */
}

/* slogan-bar */
.slogan-bar {
  background: #11508E;
  color: #fff;
  font-family: 'Istok Web', sans-serif;   
  line-height: 1;
  padding: .65rem 1rem;
  text-align: center;
}

/* nav-area */
.nav-area {
  background: #FFFEEE;
  color: #11508E;
  border-bottom: 1px solid rgba(17,80,142,.10);
  margin: 0;
}

/* container */
.container {
  max-width: 1200px;
  padding: .6rem 24px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 180px 1fr 120px;
  align-items: center;
  gap: 16px;
}

/* logo */
.brand img {
  height: 36px;
  display: block;
}

/* menu central */
.main-nav ul {
  display: flex;
  gap: 28px;
  list-style: none;
  margin: 0;
  padding: 0;
  justify-content: center;
}

.main-nav a {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: .98rem;
  color: #11508E;
  text-decoration: none;
  padding: .25rem 0;
}

/* actions */
.actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 20px;
}

.icon-btn {
  background: transparent;
  border: 0;
  padding: 6px;
  cursor: pointer;
}
.icon-btn img {
  width: 20px;
  height: 20px;
}

.profile-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 28px;
  padding: 0 10px;
  background: #fff;
  border: 1px solid rgba(0,0,0,.08);
  border-radius: 9999px;
  cursor: pointer;
}
.profile-btn img {
  width: 18px;
  height: 18px;
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
  opacity: .6;
}
.search input {
  width: 100%;
  height: 36px;
  padding: 0 14px 0 38px;
  border: 1px solid rgba(17,80,142,.25);
  background: #fff;
  color: #11508E;
  border-radius: 9999px;
  outline: none;
  font-family: 'Inter', sans-serif;
  font-size: .95rem;
}
.search input::placeholder {
  color: rgba(17,80,142,.6);
}

/* Responsividade */
@media (max-width: 1100px){
  .container{ grid-template-columns: 140px 1fr 100px; }
  .main-nav ul{ gap: 18px; }
  .search{ width: 460px; }
}
@media (max-width: 900px){
  .brand{ display:none; }
  .container{ grid-template-columns: 1fr 120px; }
}
@media (max-width: 720px){
  .main-nav ul{
    overflow-x: auto;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
  }
  .search{ width: 100%; }
}

/* EVITA QUE CONTEÚDO FIQUE DEBAIXO DO HEADER FIXO */
body {
  padding-top: 104px; /* ajuste conforme altura total do header */
}
</style>
