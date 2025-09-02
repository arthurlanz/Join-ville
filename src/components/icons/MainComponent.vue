<script setup>

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
</script>

<template>
  <main class="main">
    <section v-for="(cat, i) in categorias" :key="i" class="categoria">
      <div class="categoria-header">
        <h2>{{ cat.titulo }}</h2>
        <div class="links">
          <a href="#">Filtrar</a>
          <a href="#">Ver tudo</a>
        </div>
      </div>

      <!-- GRID -->
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
.main {
  padding: 2rem;
  background: #FFFCEE;
  color: #1a1a1a;
  font-family: 'Inter', sans-serif;
}

.categoria {
  margin-bottom: 3rem;
}

.categoria-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1.5rem 0;
}

.categoria-header h2 {
  font-size: 1.6rem;
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
  font-size: 0.95rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.2rem;
}

.card {
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-4px);
}

.card img {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.card p {
  padding: 0.8rem;
  font-weight: 500;
  color: #222;
  font-size: 0.95rem;
  text-align: center;
}
</style>