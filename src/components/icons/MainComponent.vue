<script setup>
import { ref, onMounted } from 'vue'

const categorias = [
  {
    titulo: 'Gastronomia',
    itens: [
      { nome: 'Festa do colono', img: '/gastronomia/festadocolono.png' },
      { nome: 'Festival gastronômico', img: '/gastronomia/festivalgastronomico.png' },
      { nome: 'Craft Beer', img: '/gastronomia/craftbeer.png' },
      { nome: 'Comida di buteco', img: '/gastronomia/comidadibuteco.png' },
    ],
  },
  {
    titulo: 'Clássicos de Joinville',
    itens: [
      { nome: 'Festa das flores', img: '/classicos/festadasflores.png' },
      { nome: 'Festival de dança', img: '/classicos/festivaldedanca.png' },
      { nome: 'Feira do livro', img: '/classicos/feiradolivro.png' },
      { nome: 'Festa das cores', img: '/classicos/festadascores.png' },
    ],
  },
]

const tracks = ref([])

onMounted(() => {
  tracks.value = document.querySelectorAll('.carousel-track')
})

function scrollLeft(index) {
  tracks.value[index].scrollBy({ left: -300, behavior: 'smooth' })
}

function scrollRight(index) {
  tracks.value[index].scrollBy({ left: 300, behavior: 'smooth' })
}
</script>

<template>
  <main class="main">
    <section
      v-for="(cat, i) in categorias"
      :key="i"
      class="categoria"
    >
      <div class="categoria-header">
        <h2>{{ cat.titulo }}</h2>
        <div class="links">
          <a href="#">Filtrar</a>
          <a href="#">Ver tudo</a>
        </div>
      </div>

      <!-- Carrossel -->
      <div class="carousel">
        <button class="prev" @click="scrollLeft(i)">‹</button>
        <div class="carousel-track">
          <div v-for="(item, j) in cat.itens" :key="j" class="card">
            <img :src="item.img" :alt="item.nome" />
            <p>{{ item.nome }}</p>
          </div>
        </div>
        <button class="next" @click="scrollRight(i)">›</button>
      </div>
    </section>
  </main>
</template>

<style scoped>
.main {
  padding: 2rem;
  background: #FFFCEE;
  color: #11508E;
}

.categoria {
  margin-bottom: 3rem;
}

.categoria-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1.5rem 0;
  font-family: 'Inter', sans-serif;
}

.categoria-header h2 {
  font-size: 1.8rem;
  font-weight: 700;
}

.categoria-header .links {
  display: flex;
  gap: 1rem;
}

.categoria-header a {
  color: #11508E;
  text-decoration: none;
  font-weight: 600;
}

.carousel {
  position: relative;
  display: flex;
  align-items: center;
}

.carousel-track {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: calc(25% - 1rem); /* 4 colunas */
  gap: 1rem;
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: none; /* Firefox */
}

.carousel-track::-webkit-scrollbar {
  display: none; /* Chrome/Safari */
}

.card {
  background: #FFF;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  text-align: center;
  padding: 1rem;
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-5px);
}

.card img {
  width: 100%;
  border-radius: 8px;
}

.carousel button {
  position: absolute;
  top: 40%;
  background: #11508E;
  color: #FFFCEE;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  cursor: pointer;
  font-size: 1.5rem;
  transition: background 0.2s ease;
}

.carousel button:hover {
  background: #B30012;
}

.prev {
  left: -20px;
}

.next {
  right: -20px;
}
</style>
