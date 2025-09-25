<template>
  <div class="search-results-page">
    <h2>Resultados da pesquisa: "{{ q }}"</h2>

    <div v-if="eventos.length" class="events-grid">
      <div v-for="evento in eventos" :key="evento.id" class="event-card">
        <div class="event-image" @click="openEvent(evento)">
          <img :src="evento.image || '/default-event.jpg'" :alt="evento.title" @error="handleImageError" />
          <div class="event-date-badge">{{ formatDate(evento.date) }}</div>
        </div>
        <div class="event-info">
          <h3 @click="openEvent(evento)">{{ evento.title }}</h3>
          <p>{{ evento.location }}</p>
        </div>
      </div>
    </div>

    <div v-else class="no-results">
      <p>Nenhum evento encontrado.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { eventService } from '@/services/eventService.js'

const route = useRoute()
const router = useRouter()
const q = route.query.q || ''
const eventos = ref([])

const fetchResults = async () => {
  if (!q) return
  try {
    const all = await eventService.getAllEvents()
    eventos.value = all.filter(ev =>
      ev.title.toLowerCase().includes(q.toLowerCase()) ||
      ev.location.toLowerCase().includes(q.toLowerCase())
    )
  } catch (err) {
    console.error(err)
    eventos.value = []
  }
}

function openEvent(evento) {
  router.push({ name: 'EventDetails', params: { id: evento.id } })
}

function handleImageError(event) {
  event.target.src = '/default-event.jpg'
}

function formatDate(date) {
  if (!date) return 'Data não disponível'
  return date
}

onMounted(() => {
  fetchResults()
})
</script>

<style scoped>
.search-results-page {
  padding: 2rem;
  min-height: 80vh;
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  margin-top: 1rem;
}

.event-card {
  background: #f7f7f7;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
}

.event-image img {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.event-info {
  padding: 1rem;
}

.no-results {
  text-align: center;
  margin-top: 2rem;
  color: #666;
  font-size: 1.2rem;
}
</style>
