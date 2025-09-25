<template>
  <main class="main-content">
    <!-- Cabeçalho -->
    <div class="page-header">
      <h1 class="page-title">Meus Favoritos</h1>
      <div class="underline"></div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Carregando favoritos...</p>
    </div>

    <!-- Conteúdo -->
    <div v-else>
      <!-- Sem favoritos -->
      <div v-if="favoriteEvents.length === 0" class="no-events">
        <div class="no-events-icon">🔍</div>
        <h3>Você ainda não tem favoritos</h3>
        <p>Adicione eventos aos favoritos para vê-los aqui.</p>
      </div>

      <!-- Grid de favoritos -->
      <div class="events-grid" v-else>
        <div
          v-for="eventId in favoriteEvents"
          :key="eventId"
          class="event-card"
        >
          <div class="event-image" @click="openEvent(getEventById(eventId))">
            <img
              :src="getEventById(eventId)?.image || '/default-event.jpg'"
              :alt="getEventById(eventId)?.title"
              loading="lazy"
            />
            <div class="event-date-badge">
              {{ formatDate(getEventById(eventId)?.date) }}
            </div>
          </div>
          <div class="event-info">
            <div class="info-header">
              <h3 @click="openEvent(getEventById(eventId))">
                {{ getEventById(eventId)?.title }}
              </h3>
              <button
                @click="toggleFavorite(eventId)"
                class="favorite-btn is-favorited"
                aria-label="Remover dos favoritos"
              >
                <font-awesome-icon icon="fa-solid fa-heart" />
              </button>
            </div>
            <p class="event-location">
              {{ getEventById(eventId)?.location }}
            </p>
            <div class="event-rating" v-if="getEventById(eventId)?.rating">
              <span class="stars">{{ getStars(getEventById(eventId).rating) }}</span>
              <span class="rating-value">
                ({{ getEventById(eventId).rating.toFixed(1) }})
              </span>
            </div>
            <div class="event-price" v-if="getEventById(eventId)?.price">
              {{ getEventById(eventId).price }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { eventService } from '@/services/eventService.js';

// Refs
const allEvents = ref([]);
const favoriteEvents = ref([]);
const isLoading = ref(true);

// Router
const router = useRouter();

// Lifecycle
onMounted(async () => {
  loadFavorites();
  await loadAllEvents();
});

// Funções
async function loadAllEvents() {
  try {
    const events = await eventService.getAllEvents();
    allEvents.value = events || [];
  } catch (error) {
    console.error('Erro ao carregar eventos:', error);
  } finally {
    isLoading.value = false;
  }
}

function loadFavorites() {
  try {
    const favorites = localStorage.getItem('favoriteEvents');
    if (favorites) favoriteEvents.value = JSON.parse(favorites);
  } catch (error) {
    favoriteEvents.value = [];
  }
}

function toggleFavorite(eventId) {
  const index = favoriteEvents.value.indexOf(eventId);
  if (index > -1) {
    favoriteEvents.value.splice(index, 1);
  }
  localStorage.setItem('favoriteEvents', JSON.stringify(favoriteEvents.value));
}

function getEventById(id) {
  return allEvents.value.find(ev => ev.id === id) || {};
}

function openEvent(event) {
  if (event?.id) {
    router.push({ name: 'EventDetails', params: { id: event.id } });
  }
}

function formatDate(date) {
  if (!date) return 'Data não disponível';
  const monthMap = {
    'JAN': '01', 'FEV': '02', 'MAR': '03', 'ABR': '04',
    'MAI': '05', 'JUN': '06', 'JUL': '07', 'AGO': '08',
    'SET': '09', 'OUT': '10', 'NOV': '11', 'DEZ': '12'
  };
  const m = date.match(/(\d{1,2})(?:\s+a\s+\d{1,2})?\s+([A-Z]{3})/);
  if (m) return `${m[1].padStart(2, '0')}/${monthMap[m[2]]}`;
  return date;
}

function getStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let s = '';
  for (let i = 0; i < full; i++) s += '★';
  if (half) s += '☆';
  return s;
}
</script>


<style scoped>
/* --- Header --- */
.page-header {
  max-width: 1100px;
  margin: 0 auto 30px auto;
}
.page-title {
  font-size: 32px;
  margin: 0;
  color: #1a1a1a;
  padding-bottom: 10px;
}
.underline {
  border-bottom: 2px solid #0066cc;
  width: 100%;
  margin-top: 5px;
}

/* --- Grid de eventos --- */
.events-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  max-width: 1100px;
  margin: 0 auto;
}

@media (max-width: 1024px) {
  .events-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 700px) {
  .events-grid {
    grid-template-columns: 1fr;
  }
}

/* --- Cards --- */
.event-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  cursor: pointer;
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
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
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

/* --- Sem eventos --- */
.no-events {
  text-align: center;
  padding: 50px;
  font-size: 18px;
  color: #555;
}
.main-content {
  padding-bottom: 60px;
  padding-top: 60px;
}
</style>
