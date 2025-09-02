<script setup>
import CadastroComponent from './CadastroComponent.vue';
import CarrosselComponent from './CarrosselComponent.vue';

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
    <!-- CARROSSEL -->
    <CarrosselComponent />

    <!-- SEÇÕES DE EVENTOS -->
    <section v-for="(cat, i) in categorias" :key="i" class="categoria">
      <div class="categoria-header">
        <h2>{{ cat.titulo }}</h2>
        <div class="links">
          <a href="#">Filtrar</a>
          <a href="#">Ver tudo</a>
        </div>
      </div>

      <div class="grid">
        <article v-for="(item, j) in cat.itens" :key="j" class="card">
          <div class="card-media" :data-pos="item.pos || 'center'">
            <img :src="item.img" :alt="item.nome" />
          </div>
          <p class="card-title">{{ item.nome }}</p>
        </article>
      </div>
    </section>

    <!-- BLOCO DE CADASTRO -->
    <CadastroComponent />
  </main>
</template>

<style scoped>
.main{
  padding: 0 24px 24px;
  background: #FFFCEE;
  color: #1a1a1a;
  font-family: 'Inter', sans-serif;
  max-width: 1280px; margin: 0 auto;
}
.categoria{ margin: 18px 0 34px; }
.categoria-header{
  display: flex; justify-content: space-between; align-items: center;
  margin: 6px 0 12px;
}
.categoria-header h2{
  font-size: 24px; font-weight: 800; color: #1a1a1a;
}
.links{ display: flex; gap: 18px; }
.links a{
  color: #11508E; text-decoration: none; font-weight: 700; font-size: 14px;
}
.links a:hover{ text-decoration: underline; }

/* Grid responsivo */
.grid{
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}
@media (max-width: 1100px){
  .grid{ grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 760px){
  .grid{ grid-template-columns: repeat(2, 1fr); }
}

/* Cards */
.card{
  background: #fff; border-radius: 16px; overflow: hidden;
  box-shadow: 0 4px 14px rgba(0,0,0,.08);
  transition: transform .18s ease, box-shadow .18s ease;
}
.card:hover{
  transform: translateY(-4px);
  box-shadow: 0 8px 22px rgba(0,0,0,.12);
}
.card-media{
  aspect-ratio: 16 / 9;
  background: #f3f3f3; position: relative;
}
.card-media img{
  position: absolute; inset: 0;
  width: 100%; height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
  user-select: none;
  -webkit-user-drag: none;
}
.card-media[data-pos="top"] img{ object-position: 50% 20%; }
.card-media[data-pos="bottom"] img{ object-position: 50% 80%; }

.card-title{
  padding: 10px 12px 12px;
  text-align: center; font-weight: 600; font-size: 14px; color: #222;
}
</style>