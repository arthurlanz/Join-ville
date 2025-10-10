<template>
  <div class="category-page">
    <div class="container">
      <h1 class="page-title">{{ categoryName }}</h1>

      <div v-if="isLoading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Carregando eventos da categoria...</p>
      </div>

      <div v-else-if="events.length > 0" class="events-grid">
        <div v-for="event in events" :key="event.id" class="event-card" @click="openEvent(event)">
          <div class="event-image">
            <img :src="event.image" :alt="event.title" />
            <div class="event-date-badge">{{ event.date }}</div>
          </div>
          <div class="event-info">
            <div class="info-header">
              <h3 @click.stop="openEvent(event)">{{ event.title }}</h3>
              <button
                @click.stop="toggleFavorite(event.id)"
                class="favorite-btn"
                :class="{ 'is-favorited': isFavorite(event.id) }"
                :aria-label="
                  isFavorite(event.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'
                "
              >
                <font-awesome-icon
                  :icon="isFavorite(event.id) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"
                />
              </button>
            </div>
            <p class="event-location">{{ event.location }}</p>
            <div class="event-price" v-if="event.price">{{ event.price }}</div>
          </div>
        </div>
      </div>

      <div v-else class="no-events">
        <p>Não há eventos nesta categoria no momento.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { eventService } from '@/services/eventService.js'
import { useToastStore } from '@/stores/toast'

// Props
const props = defineProps({
  categoryName: {
    type: String,
    required: true,
  },
})

// Router
const router = useRouter()

// Toast store
const toast = useToastStore()

// Refs
const events = ref([])
const isLoading = ref(false) // Adicionado state de loading
const favoriteEvents = ref([])

// Watcher para categoria (executa imediatamente ao montar)
watch(
  () => props.categoryName,
  async (newCategoryName) => {
    // NOVO: Cheque de segurança para sair imediatamente se a prop estiver faltando
    if (!newCategoryName) {
      console.warn('CategoryPage renderizada sem categoryName.')
      isLoading.value = false
      events.value = []
      return
    }

    isLoading.value = true

    try {
      events.value = await eventService.getEventsByCategory(newCategoryName)

      if (events.value.length > 0) {
        toast.info(`Eventos da categoria "${newCategoryName}" carregados!`)
      } else {
        toast.info(`Nenhum evento encontrado em "${newCategoryName}".`)
      }

      loadFavorites()
    } catch (error) {
      console.error('Erro ao buscar eventos por categoria:', error)
      events.value = []
      toast.error('Erro ao carregar eventos. Tente novamente mais tarde.')
    } finally {
      isLoading.value = false
    }
  },
  { immediate: true }
)

// Métodos
function openEvent(event) {
  router.push(`/evento/${event.id}`)
}

function loadFavorites() {
  // Use uma chave consistente
  const favorites = localStorage.getItem('joinville:favoriteEvents')
  favoriteEvents.value = favorites ? JSON.parse(favorites) : []
}

function toggleFavorite(eventId) {
  const index = favoriteEvents.value.indexOf(eventId)
  if (index > -1) {
    favoriteEvents.value.splice(index, 1)
  } else {
    favoriteEvents.value.push(eventId)
  }
  localStorage.setItem('joinville:favoriteEvents', JSON.stringify(favoriteEvents.value))
}

function isFavorite(eventId) {
  return favoriteEvents.value.includes(eventId)
}
</script>

<style scoped>
/* ... (Seus estilos existentes) ... */
.category-page {
  padding: 40px 20px;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
}
.page-title {
  font-size: 32px;
  margin-bottom: 30px;
  border-bottom: 2px solid #0066cc;
  padding-bottom: 10px;
  color: #1a1a1a;
}
.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}
.event-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
}
.event-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: #e0e0e0;
}
.event-image {
  position: relative;
  height: 180px;
  overflow: hidden;
}
.event-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}
.event-card:hover .event-image img {
  transform: scale(1.05);
}
.event-date-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}
.event-info {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.info-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
}
.info-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px 0;
  line-height: 1.3;
  cursor: pointer;
  flex-grow: 1;
}
.favorite-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-size: 20px;
  color: #ff4d4d;
  transition: transform 0.2s;
}
.favorite-btn:hover {
  transform: scale(1.1);
}
.favorite-btn.is-favorited {
  animation: heartbeat 0.6s ease-in-out;
}
@keyframes heartbeat {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
.event-location {
  color: #666;
  font-size: 14px;
  margin: 0 0 12px 0;
}
.event-price {
  color: #0066cc;
  font-weight: 600;
  font-size: 16px;
  margin-top: auto;
}

/* Estilos para Loading */
.loading-container {
  margin-top: 4rem;
  text-align: center;
  color: #666;
}
.loading-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #0066cc;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
