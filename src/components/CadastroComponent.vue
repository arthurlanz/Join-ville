<script setup>
const bullets = [
  {
    icon: '/icons/paper.svg',
    title: 'Publicação grátis',
    text: 'sem taxa de adesão ou mensalidade.'
  },
  {
    icon: '/icons/building.svg',
    title: 'Para quem faz Joinville acontecer',
    text: 'exclusivo para empresas com CNPJ válido.'
  }
]
</script>

<template>
  <section class="cta">
    <div class="cta__inner">
      <div class="cta__left">
        <h3>Crie, divulgue e conecte seus eventos com a maior cidade de SC</h3>

        <ul class="cta__bullets">
          <li v-for="(b, i) in bullets" :key="i">
            <img :src="b.icon" alt="" />
            <div>
              <strong>{{ b.title }}:</strong> {{ b.text }}
            </div>
          </li>
        </ul>

        <div class="cta__actions">
          <a class="btn btn--primary" href="/cadastrar-evento">cadastre seu evento</a>
          <a class="btn btn--ghost" href="/como-funciona">veja como funciona</a>
        </div>
      </div>

      <div class="cta__right">
        <!-- coloque aqui uma ilustração ou animação Lottie -->
        <img src="" alt="Cadastro" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.cta{
  background: #D7E0DE;
  border: 1px solid rgba(17,80,142,.10);
  border-radius: 22px;
  max-width: 1200px;
  margin: 28px auto 48px;
  padding: 22px;
}
.cta__inner{
  display: grid;
  grid-template-columns: 1.2fr .8fr;
  gap: 18px;
  align-items: center;
}
.cta__left h3{
  color: #1F4773;
  font-family: 'Inter', sans-serif;
  font-weight: 800;
  font-size: 28px;
  line-height: 1.15;
  margin: 2px 0 14px;
}
.cta__bullets{
  list-style: none; margin: 0; padding: 0 0 6px;
  display: grid; gap: 12px;
}
.cta__bullets li{
  display: grid; grid-template-columns: 28px 1fr; gap: 10px;
  color: #1a1a1a;
  font-size: 15px;
}
.cta__bullets img{ width: 24px; height: 24px; }
.cta__bullets strong{ color: #1F4773; }

.cta__actions{
  margin-top: 14px; display: flex; gap: 10px;
}
.btn{
  display: inline-flex; align-items: center; justify-content: center;
  height: 40px; padding: 0 18px; border-radius: 10px;
  font-weight: 700; text-decoration: none; font-family: 'Inter', sans-serif;
  border: 1px solid transparent;
}
.btn--primary{
  background: #1F4773; color: #fff;
}
.btn--primary:hover{ filter: brightness(.95); }
.btn--ghost{
  background: #fff; color: #1F4773; border-color: #1F4773;
}
.btn--ghost:hover{ background: #F1F5FA; }

.cta__right img{
  display: block; width: 100%; max-width: 380px; margin: 0 auto;
}
@media (max-width: 900px){
  .cta__inner{ grid-template-columns: 1fr; }
  .cta__left h3{ font-size: 22px; }
  .cta{ padding: 16px; }
}
</style>
