<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { EffectCoverflow, Pagination, Navigation, Autoplay } from 'swiper/modules'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

// Eventos do seu site
const eventos = [
  { id: 1, img: '/festaseshows/matue.png', title: 'Matuê', location: 'Joinville Square Garden', time: '20h' },
  { id: 2, img: '/festaseshows/armandinho.png', title: 'Armandinho', location: 'Joinville', time: '19h' },
  { id: 3, img: '/gastronomia/festivalgastronomico.png', title: 'Festival Gastronômico', location: 'Joinville', time: '12h' },
  { id: 4, img: '/classicosdejoinville/festadascores.png', title: 'Festa das Cores', location: 'Joinville', time: '18h' },
  { id: 5, img: '/esportes/jececianorte.png', title: 'JEC x Cianorte', location: 'Estádio Joinville', time: '16h' },
  { id: 6, img: '/cultura/animaneco.png', title: 'AnimaNeco', location: 'Joinville', time: '14h' },
  { id: 7, img: '/classicosdejoinville/festivaldedanca.png', title: 'Festival de Dança', location: 'Joinville', time: '21h' },
]
</script>

<template>
  <section class="hero">
    <Swiper
      :modules="[EffectCoverflow, Pagination, Navigation, Autoplay]"
      effect="coverflow"
      :grab-cursor="true"
      :centered-slides="true"
      :slides-per-view="'auto'"
      :loop="true"
      :autoplay="{ delay: 3500, pauseOnMouseEnter: true, disableOnInteraction: false }"
      :coverflow-effect="{
        rotate: 0,
        stretch: 0,
        depth: 250,
        modifier: 2.5,
        slideShadows: false,
      }"
      :pagination="{ clickable: true }"
      navigation
      class="hero-swiper"
    >
      <SwiperSlide
        v-for="evento in eventos"
        :key="evento.id"
        class="hero-slide"
      >
        <div class="slide-wrapper">
          <img :src="evento.img" :alt="evento.title" />
          <div class="slide-info">
            <h3>{{ evento.title }}</h3>
            <p>{{ evento.location }}</p>
            <span>{{ evento.time }}</span>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>
  </section>
</template>

<style scoped>
.hero {
  padding: 18px 0 8px;
  background: #fffcee;
}
.hero-swiper {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 36px;
}
.hero-slide {
  width: 860px;
  max-width: calc(100vw - 140px);
}
.slide-wrapper {
  position: relative;
}
.slide-wrapper img {
  width: 100%;
  height: 420px;
  object-fit: cover;
  border-radius: 20px;
  display: block;
  transition: all 0.3s ease;
}

/* Lateral arredondada maior */
:deep(.swiper-slide-prev) img,
:deep(.swiper-slide-next) img {
  border-radius: 40px;
  transform: scale(0.8);
  opacity: 0.8;
}
:deep(.swiper-slide-active) img {
  border-radius: 20px;
  transform: scale(1);
  opacity: 1;
}

/* Info do evento sobre a imagem */
.slide-info {
  position: absolute;
  bottom: 16px;
  left: 16px;
  color: #fff;
  background: rgba(0, 0, 0, 0.45);
  padding: 10px 14px;
  border-radius: 12px;
}
.slide-info h3 {
  margin: 0;
  font-size: 1.2rem;
}
.slide-info p {
  margin: 2px 0 0;
  font-size: 1rem;
}
.slide-info span {
  font-size: 0.9rem;
  opacity: 0.85;
}

/* Botões de navegação */
:deep(.swiper-button-prev),
:deep(.swiper-button-next) {
  width: 42px;
  height: 42px;
  background: #11508e;
  color: #fff;
  border-radius: 50%;
}
:deep(.swiper-button-prev::after),
:deep(.swiper-button-next::after) {
  font-size: 18px;
  font-weight: bold;
}
:deep(.swiper-button-prev) {
  left: 24px;
}
:deep(.swiper-button-next) {
  right: 24px;
}

/* Bullets */
:deep(.swiper-pagination-bullet) {
  background: rgba(17, 80, 142, 0.35);
  opacity: 1;
}
:deep(.swiper-pagination-bullet-active) {
  background: #11508e;
}

/* Responsividade */
@media (max-width: 900px) {
  .hero-slide img {
    height: 300px;
  }
  .slide-info h3 {
    font-size: 1rem;
  }
  .slide-info p,
  .slide-info span {
    font-size: 0.85rem;
  }
}
</style>
