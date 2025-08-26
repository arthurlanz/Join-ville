<script setup>
import { ref } from 'vue'

const searchQuery = ref('')

const categorias = [
  {
    titulo: 'Gastronomia',
    itens: [
      { nome: 'Festa do colono', img: '/gastronomia/festadocolono.png' },
      { nome: 'Festival gastronômico de Joinville', img: '/gastronomia/festivalgastronomico.png' },
      { nome: 'Craft Beer', img: '/gastronomia/craftbeer.png' },
      { nome: 'Comida di buteco', img: '/gastronomia/comidadibuteco.png' },
    ],
  },
  {
    titulo: 'Clássicos de Joinville',
    itens: [
      { nome: 'Festa das flores', img: '/classicosdejoinville/festadasflores.png' },
      { nome: 'Festival de dança', img: '/classicosdejoinville/festivaldedanca.png' },
      { nome: 'Feira do livro', img: '/classicosdejoinville/feiradolivro.png' },
      { nome: 'Festa das cores', img: '/classicosdejoinville/festadascores.png' },
    ],
  },
  {
    titulo: 'Festas e Shows',
    itens: [
      { nome: 'Armandinho', img: '/festaseshows/armandinho.png' },
      { nome: 'Matuê', img: '/festaseshows/matue.png' },
      { nome: 'Menos é Mais e Ferrugem', img: '/festaseshows/menosemais.png' },
      { nome: 'Victor e Leo', img: '/festaseshows/victoreleo.png' },
    ],
  },
  {
    titulo: 'Destaques da semana',
    itens: [
      { nome: 'Festival pianístico', img: '/destaquesdasemana/festivalpianistico.png' },
      { nome: 'Festival da Vigorelli', img: '/destaquesdasemana/festivaldavigorelli.png' },
      { nome: 'Musicarium In Concert', img: '/destaquesdasemana/concertomusical.png' },
      { nome: "Exposição 'O que permanece...'", img: '/destaquesdasemana/exposicao.png' },
      { nome: 'Festival Meraki', img: '/destaquesdasemana/festivalmeraki.png' },
    ],
  },
  {
    titulo: 'Esportes',
    itens: [
      { nome: 'Jec x Blumenau', img: '/esportes/jecfutsal.png' },
      { nome: 'Jec x Nação', img: '/esportes/jecenacao.png' },
      { nome: 'Jec x Carlos Renaux', img: '/esportes/jececarlos.png' },
      { nome: 'Jec x Cianorte', img: '/esportes/jececianorte.png' },
    ],
  },
  {
    titulo: 'Atividades ao Ar Livre',
    itens: [
      { nome: 'Parque Zoobotânico', img: '/atividadesaoarlivre/zoobotanico.png' },
      { nome: 'Corrida Pela Vida', img: '/atividadesaoarlivre/corridapelavida.png' },
      { nome: 'Parque Caminho das Águas', img: '/atividadesaoarlivre/caminhodasaguas.png' },
      { nome: 'Corrida Halloween', img: '/atividadesaoarlivre/corridahallowen.png' },
    ],
  },
  {
    titulo: 'Cultura',
    itens: [
      { nome: 'Animaneco', img: '/cultura/animaneco.png' },
      { nome: 'Irmã Selma', img: '/cultura/comedia.png' },
      { nome: 'VinVeneto', img: '/cultura/vinveneto.png' },
      { nome: 'Joinville Matsuri', img: '/cultura/matsuri.png' },
    ],
  },
]

function search() {
  alert('Buscando por: ' + searchQuery.value)
}
</script>


<template>
  <header class="header">
    <p class="slogan">Explore, Avalie e Viva Joinville de Verdade</p>

    <div class="top-bar">
      <a href="#">
        <img src="/logotipo.png" alt="logo" class="logo" />
      </a>

      <!-- Barra de pesquisa no header -->
      <div class="search-bar">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Encontre eventos, shows, restaurantes"
        />
        <button @click="search">🔍</button>
      </div>

      <!-- Navegação -->
      <nav>
        <ul>
          <li><a href="#">Gastronomia</a></li>
          <li><a href="#">Clássicos de Joinville</a></li>
          <li><a href="#">Festas e shows</a></li>
          <li><a href="#">Esportes</a></li>
          <li><a href="#">Atividades ao ar livre</a></li>
          <li><a href="#">Cultura</a></li>
        </ul>
      </nav>

      <!-- Botões extras -->
      <button><img src="/Star 1.png" alt="favoritos" /></button>
      <button><img src="/Group 37.png" alt="perfil" /></button>
    </div>
  </header>

  <main>
    <!-- Seções dinâmicas -->
    <section
      v-for="(cat, i) in categorias"
      :key="i"
      class="categoria"
    >
      <div class="categoria-header">
        <h2>{{ cat.titulo }}</h2>
        <div>
          <a href="#">Filtrar</a> | <a href="#">Ver tudo</a>
        </div>
      </div>

      <div class="grid">
        <div v-for="(item, j) in cat.itens" :key="j" class="card">
          <img :src="item.img" :alt="item.nome" />
          <p>{{ item.nome }}</p>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>

</style>
