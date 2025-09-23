<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router' // Importa o useRouter
import { Swiper, SwiperSlide } from 'swiper/vue'
import { EffectCoverflow, Pagination, Navigation, Autoplay } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-coverflow'

const router = useRouter() // Inicializa o router

const events = [
  {
    id: 1,
    title: 'MATUÊ',
    subtitle: 'SHOW DE RAP NACIONAL',
    location: 'SQUARE GARDEN - JOINVILLE - SC',
    date: 'Sexta, 31 de Out às 22:00',
    image: '/festaseshows/matuebanner.png',
    badge: 'NOVO',
  },
  {
    id: 7,
    title: 'FESTIVAL DE DANÇA',
    subtitle: 'MAIOR FESTIVAL DE DANÇA DO MUNDO',
    location: 'CENTREVENTOS CAU HANSEN - JOINVILLE - SC',
    date: '21 De Jul à 2 De Ago',
    image: '/classicosdejoinville/festivaldancabanner.jpeg',
    badge: 'CLÁSSICOS DE JOINVILLE',
  },
  {
    id: 4,
    title: 'FESTIVAL GASTRONÔMICO',
    subtitle: 'DIVERSIDADE CULINÁRIA',
    location: 'Joinville - SC',
    date: '6 De Ago à 24 De Ago',
    image: '/gastronomia/festivalgastronomicobanner.jpg',
    badge: 'FOOD',
  },
  {
    id: 22,
    title: 'JEC KRONA X BLUMENAU',
    subtitle: 'LIGA NACIONAL DE FUTSAL',
    location: 'CENTREVENTOS CAU HANSEN - JOINVILLE - SC',
    date: 'Sexta Feira, 5 de Set às 20:00',
    image: '/esportes/jecbanner.jpeg',
    badge: 'FUTSAL',
  },
  {
    id: 9,
    title: "ARMANDINHO",
    subtitle: 'SHOW DE REAGE NACIONAL',
    location: 'SQUARE GARDEN',
    date: 'Sexta, 31 de Out às 22:00',
    image: '/festaseshows/armandinho.png',
    badge: 'SHOW',
  },
]

const activeEvent = ref(events[0])

const goToEventDetails = (eventId) => {
  router.push({ name: 'EventDetails', params: { id: eventId } })
}
</script>

<template>
  <div class="carousel-container">
    <Swiper
      :modules="[EffectCoverflow, Pagination, Navigation, Autoplay]"
      effect="coverflow"
      :grab-cursor="true"
      :centered-slides="true"
      :slides-per-view="'auto'"
      :loop="true"
      :autoplay="{ delay: 5000, pauseOnMouseEnter: true, disableOnInteraction: false }"
      :coverflow-effect="{ rotate: 0, stretch: 80, depth: 200, modifier: 1, slideShadows: true }"
      navigation
      pagination
      class="carousel-swiper"
      @slideChange="activeEvent = events[$event.realIndex]"
    >
      <SwiperSlide v-for="event in events" :key="event.id" @click="goToEventDetails(event.id)">
        <div class="event-card">
          <img :src="event.image" :alt="event.title" class="event-image" />
          <div class="event-overlay">
            <div class="event-badge" v-if="event.badge">{{ event.badge }}</div>
            <div class="event-info">
              <h3 class="event-title">{{ event.title }}</h3>
              <p class="event-subtitle" v-if="event.subtitle">{{ event.subtitle }}</p>
            </div>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>

    <div class="event-details" v-if="activeEvent">
      <h2 class="event-main-title">{{ activeEvent.title }}</h2>
      <div class="event-meta">
        <span class="event-location">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-10a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          {{ activeEvent.location }}
        </span>
        <span class="event-date">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          {{ activeEvent.date }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.carousel-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.carousel-swiper {
  width: 100%;
  height: 400px;
}

.swiper-slide {
  width: 500px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer; /* Adiciona cursor de clique */
}

.event-card {
  width: 100%;
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease;
}

.event-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
}

.event-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.event-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.1) 0%,
    rgba(0, 0, 0, 0.3) 50%,
    rgba(0, 0, 0, 0.8) 100%
  );
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
}

.event-badge {
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  align-self: flex-start;
  text-transform: uppercase;
}

.event-info {
  color: white;
}

.event-title {
  font-size: 24px;
  font-weight: bold;
  margin: 0 0 8px 0;
  line-height: 1.2;
}

.event-subtitle {
  font-size: 14px;
  opacity: 0.9;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Event Details */
.event-details {
  text-align: center;
  margin-top: 60px;
}

.event-main-title {
  font-size: 32px;
  font-weight: bold;
  color: #1f2937;
  margin: 0 0 16px 0;
  line-height: 1.2;
}

.event-meta {
  display: flex;
  justify-content: center;
  gap: 32px;
  color: #6b7280;
  font-size: 16px;
}

.event-location,
.event-date {
  display: flex;
  align-items: center;
  gap: 8px;
}

.event-location svg,
.event-date svg {
  color: #9ca3af;
}

@media (max-width: 768px) {
  .swiper-slide {
    width: 300px;
    height: 200px;
  }

  .event-title {
    font-size: 18px;
  }

  .event-main-title {
    font-size: 24px;
  }

  .event-meta {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
