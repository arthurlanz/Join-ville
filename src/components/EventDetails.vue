<template>
  <div class="event-details-page">
    <div class="event-header">
      <button @click="goBack" class="back-button">← Voltar</button>
    </div>

    <div v-if="event" class="main-content">
      <div class="event-hero-sympla" :style="{ '--bg-image': 'url(' + event.image + ')' }">
        <div class="hero-container">
          <div class="hero-details">
            <h1>{{ event.title }}</h1>
            <div class="info-block">
              <font-awesome-icon icon="fa-solid fa-calendar-days" class="info-icon" />
              <p>
                <strong>{{ event.date }}</strong>
                <br />
              </p>
            </div>
            <div class="info-block">
              <font-awesome-icon icon="fa-solid fa-location-dot" class="info-icon" />
              <p>
                <strong>{{ event.location }}</strong
                ><br />
                <span>Joinville - SC</span>
              </p>
            </div>
          </div>
          <div class="hero-image-wrapper">
            <img :src="event.image" :alt="event.title" class="hero-image" />
          </div>
        </div>
      </div>

      <div class="event-body">
        <div class="event-description">
          <h2>Sobre o Evento</h2>
          <p>{{ getEventDescription(event) }}</p>
          <div class="action-buttons">
            <button class="share-btn" @click="shareEvent">
              <font-awesome-icon icon="fa-solid fa-share" />
              Compartilhar
            </button>
            <button
              class="favorite-btn"
              :class="{ 'is-favorited': isFavorite(event.id) }"
              @click="toggleFavorite(event.id)"
            >
              <font-awesome-icon :icon="isFavorite(event.id) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'" />
              {{ isFavorite(event.id) ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos' }}
            </button>
          </div>
        </div>

        <div class="event-sidebar">
          <h3>Detalhes</h3>
          <div class="detail-item">
            <strong>Categoria</strong>
            <p>{{ event.category }}</p>
          </div>
          <div class="detail-item" v-if="event.price">
            <strong>Preço</strong>
            <p>{{ event.price }}</p>
          </div>
          <div class="detail-item" v-if="event.duration">
            <strong>Duração</strong>
            <p>{{ event.duration }}</p>
          </div>
          <div class="detail-item" v-if="event.organizer">
            <strong>Organizador</strong>
            <p>{{ event.organizer }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="loading">
      <p>Carregando detalhes do evento...</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { eventService } from '@/services/eventService.js'

export default {
  setup() {
    const route = useRoute()
    const event = ref(null)
    const favoriteEvents = ref([])

    onMounted(async () => {
      const allEvents = await eventService.getAllEvents() // precisa ser async
      event.value = allEvents.find(e => e.id === parseInt(route.params.id))

      const favorites = localStorage.getItem('favoriteEvents')
      if (favorites) favoriteEvents.value = JSON.parse(favorites)
    })

    const goBack = () => window.history.back()

    const toggleFavorite = (eventId) => {
      const index = favoriteEvents.value.indexOf(eventId)
      if (index > -1) favoriteEvents.value.splice(index, 1)
      else favoriteEvents.value.push(eventId)
      localStorage.setItem('favoriteEvents', JSON.stringify(favoriteEvents.value))
    }

    const isFavorite = (eventId) => favoriteEvents.value.includes(eventId)

    const shareEvent = () => {
      if (!event.value) return
      if (navigator.share) {
        navigator.share({
          title: event.value.title,
          text: `Confira este evento: ${event.value.title}`,
          url: window.location.href
        })
      } else {
        navigator.clipboard.writeText(window.location.href).then(() => {
          alert('Link copiado para a área de transferência!')
        })
      }
    }

    const getEventDescription = (ev) => ev.description || `Participe do evento ${ev.title || 'sem título'} em ${ev.location || 'local indefinido'}.`

    return { event, favoriteEvents, goBack, toggleFavorite, isFavorite, shareEvent, getEventDescription }

    
  }
}
</script>

<style scoped>
/* Estilos Gerais */
.event-details-page {
  background-color: #f0f2f5;
}
.event-header {
  padding: 15px 20px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
.back-button {
  background: none;
  border: none;
  color: #0066cc;
  font-size: 16px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}
.back-button:hover {
  background-color: #f0f8ff;
}
.loading {
  text-align: center;
  padding: 50px;
  font-size: 18px;
  color: #555;
}

/* Layout Hero com Fundo Desfocado */
.event-hero-sympla {
  position: relative;
  overflow: hidden;
  color: white;
  padding: 40px 20px;
}
.event-hero-sympla::before {
  content: '';
  position: absolute;
  top: -20px;
  left: -20px;
  right: -20px;
  bottom: -20px;
  background-image: var(--bg-image);
  background-size: cover;
  background-position: center;
  filter: blur(25px) brightness(0.4);
  z-index: 1;
}

.hero-container {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 500px;
  gap: 40px;
  align-items: center;
  position: relative;
  z-index: 2;
}
.hero-details h1 {
  font-size: 42px;
  font-weight: 700;
  margin-bottom: 30px;
  line-height: 1.2;
}
.info-block {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 20px;
}
.info-icon {
  font-size: 20px;
  margin-top: 5px;
  color: #a0aec0;
}
.info-block p {
  margin: 0;
  line-height: 1.5;
}
.info-block p strong {
  font-size: 18px;
}
.info-block p span {
  font-size: 14px;
  color: #a0aec0;
}

.hero-image-wrapper {
  width: 100%;
  max-width: 500px;
  aspect-ratio: 16 / 9;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}
.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Corpo do Evento */
.event-body {
  max-width: 1100px;
  margin: 40px auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
}
.event-description {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.event-description h2 {
  font-size: 24px;
  color: #1a1a1a;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}
.event-description p {
  font-size: 16px;
  line-height: 1.7;
  color: #555;
  text-align: justify;
}

/* Sidebar de Detalhes */
.event-sidebar {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  align-self: flex-start;
}
.event-sidebar h3 {
  font-size: 20px;
  color: #1a1a1a;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}
.detail-item {
  margin-bottom: 15px;
}
.detail-item strong {
  display: block;
  font-size: 14px;
  color: #888;
  margin-bottom: 5px;
}
.detail-item p {
  margin: 0;
  font-size: 16px;
  color: #333;
}

/* BotÃµes de AÃ§Ã£o */
.action-buttons {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 30px;
}
.share-btn,
.favorite-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  padding: 14px 28px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}
.share-btn {
  background: transparent;
  color: #0066cc;
  border: 2px solid #0066cc;
}
.share-btn:hover {
  background: #0066cc;
  color: white;
}
.favorite-btn {
  background: transparent;
  color: #ff4d4d;
  border: 2px solid #ff4d4d;
}
.favorite-btn:hover {
  background: #ff4d4d;
  color: white;
}
.favorite-btn.is-favorited {
  background: #ff4d4d;
  color: white;
}
.favorite-btn.is-favorited:hover {
  background: #e60000;
}

/* Responsividade */
@media (max-width: 900px) {
  .hero-container {
    grid-template-columns: 1fr;
    text-align: center;
  }
  .hero-image-wrapper {
    margin: 0 auto;
  }
  .info-block {
    justify-content: center;
  }
  .event-body {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 768px) {
  .hero-details h1 {
    font-size: 32px;
  }
  .action-buttons {
    flex-direction: column;
  }
  .share-btn,
  .favorite-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
