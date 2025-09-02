<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue'
import { EffectCoverflow, Pagination, Navigation, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

// Ajuste os paths para seus banners 1200x500 aprox.
const slides = [
  { id: 1, img: '/festaseshows/matue.png',    alt: 'Matuê - Joinville Square Garden' },
  { id: 2, img: '/festaseshows/armandinho.png', alt: 'Armandinho em Joinville' },
  { id: 3, img: '/gastronomia/festivalgastronomico.png', alt: 'Festival Gastronômico de Joinville' },
  { id: 4, img: '/classicosdejoinville/festadascores.png', alt: 'Festa das Cores' },
]
</script>

<template>
  <section class="hero">
    <Swiper
      :modules="[EffectCoverflow, Pagination, Navigation, Autoplay]"
      effect="coverflow"
      :centered-slides="true"
      :grab-cursor="true"
      :slides-per-view="'auto'"
      :loop="true"
      :autoplay="{ delay: 3500, pauseOnMouseEnter: true, disableOnInteraction: false }"
      :coverflow-effect="{
        rotate: 0,
        stretch: 0,
        depth: 180,
        modifier: 1.1,
        slideShadows: false
      }"
      :navigation="true"
      :pagination="{ clickable: true }"
      class="hero-swiper"
    >
      <SwiperSlide v-for="s in slides" :key="s.id" class="hero-slide">
        <img :src="s.img" :alt="s.alt" />
      </SwiperSlide>
    </Swiper>
  </section>
</template>

<style scoped>
.hero{
  padding: 18px 0 8px;
  background: #FFFCEE;
}
.hero-swiper{
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 36px;
}
.hero-slide{
  width: 860px;
  max-width: calc(100vw - 140px);
}
.hero-slide img{
  width: 100%;
  height: 420px;
  object-fit: cover;
  border-radius: 18px;
  display: block;
  box-shadow: 0 10px 24px rgba(0,0,0,.12);
}

/* Botões de navegação */
:deep(.swiper-button-prev),
:deep(.swiper-button-next){
  width: 42px; height: 42px;
  background: #2D69A8;
  color: #fff;
  border-radius: 9999px;
  box-shadow: 0 6px 16px rgba(45,105,168,.35);
}
:deep(.swiper-button-prev::after),
:deep(.swiper-button-next::after){
  font-size: 18px; font-weight: 700;
}
:deep(.swiper-button-prev){ left: 24px; }
:deep(.swiper-button-next){ right: 24px; }

/* Bullets */
:deep(.swiper-pagination-bullet){
  background: rgba(17,80,142,.35);
  opacity: 1;
}
:deep(.swiper-pagination-bullet-active){
  background: #11508E;
}
@media (max-width: 900px){
  .hero-slide img{ height: 300px; }
}
</style>
