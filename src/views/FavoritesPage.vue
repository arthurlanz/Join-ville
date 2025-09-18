<template>
  <div class="favorites-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">Meus Favoritos</h1>
        <div class="actions" v-if="favoriteEventsDetails.length > 0">
          <button @click="toggleSelectionMode" class="select-btn">
            {{ isSelectionModeActive ? 'Cancelar' : 'Selecionar' }}
          </button>
          <button
            v-if="isSelectionModeActive && selectedFavorites.length > 0"
            @click="deleteSelectedFavorites"
            class="delete-btn"
          >
            <font-awesome-icon icon="fa-solid fa-trash" />
          </button>
        </div>
      </div>

      <div v-if="favoriteEventsDetails.length > 0" class="events-grid">
        <div
          v-for="event in favoriteEventsDetails"
          :key="event.id"
          class="event-card"
          :class="{ 'is-selected': isSelected(event.id), 'selection-mode': isSelectionModeActive }"
          @click="handleCardClick(event)"
        >
          <div class="selection-indicator">
            <font-awesome-icon v-if="isSelected(event.id)" icon="fa-solid fa-check-circle" />
          </div>
          <div class="event-image">
            <img :src="event.image" :alt="event.title" />
            <div class="event-date-badge">{{ event.date }}</div>
          </div>
          <div class="event-info">
            <h3>{{ event.title }}</h3>
            <p class="event-location">{{ event.location }}</p>
            <div class="event-price" v-if="event.price">{{ event.price }}</div>
          </div>
        </div>
      </div>
      <div v-else class="no-events">
        <p>Você ainda não favoritou nenhum evento. Explore a página inicial e clique no coração!</p>
      </div>
    </div>
  </div>
</template>

<script>
import { eventService } from '@/services/eventService.js'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTrash, faCheckCircle } from '@fortawesome/free-solid-svg-icons'

library.add(faTrash, faCheckCircle)

export default {
  name: 'FavoritesPage',
  data() {
    return {
      favoriteEventsDetails: [],
      isSelectionModeActive: false,
      selectedFavorites: [],
    }
  },
  created() {
    this.loadFavoriteEvents()
  },
  methods: {
    async loadFavoriteEvents() {
      const favoriteIds = JSON.parse(localStorage.getItem('favoriteEvents') || '[]')

      const allEvents = await eventService.getAllEvents()

      this.favoriteEventsDetails = allEvents.filter(event => favoriteIds.includes(event.id))
    },
    openEvent(event) {
      this.$router.push({ name: 'EventDetails', params: { id: event.id } })
    },
    toggleSelectionMode() {
      this.isSelectionModeActive = !this.isSelectionModeActive
      // Limpa a seleção ao sair do modo de seleção
      if (!this.isSelectionModeActive) {
        this.selectedFavorites = []
      }
    },
    handleCardClick(event) {
      if (this.isSelectionModeActive) {
        this.toggleSelection(event.id)
      } else {
        this.openEvent(event)
      }
    },
    toggleSelection(eventId) {
      const index = this.selectedFavorites.indexOf(eventId)
      if (index > -1) {
        this.selectedFavorites.splice(index, 1)
      } else {
        this.selectedFavorites.push(eventId)
      }
    },
    isSelected(eventId) {
      return this.selectedFavorites.includes(eventId)
    },
    deleteSelectedFavorites() {
      // Pega os favoritos atuais do localStorage
      let favoriteIds = JSON.parse(localStorage.getItem('favoriteEvents') || '[]')

      // Filtra, mantendo apenas os que NÃO foram selecionados para exclusão
      const newFavoriteIds = favoriteIds.filter((id) => !this.selectedFavorites.includes(id))

      // Salva a nova lista no localStorage
      localStorage.setItem('favoriteEvents', JSON.stringify(newFavoriteIds))

      // Atualiza a lista de eventos na tela
      this.loadFavoriteEvents()

      // Sai do modo de seleção
      this.isSelectionModeActive = false
      this.selectedFavorites = []
    },
  },
}
</script>

<style scoped>
.favorites-page {
  padding: 40px 20px;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  border-bottom: 2px solid #0066cc;
  padding-bottom: 10px;
}
.page-title {
  font-size: 32px;
  color: #1a1a1a;
  margin: 0;
}
.actions {
  display: flex;
  gap: 15px;
}
.select-btn,
.delete-btn {
  background: none;
  border: 1px solid #0066cc;
  color: #0066cc;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}
.select-btn:hover {
  background-color: #e0efff;
}
.delete-btn {
  border-color: #d9534f;
  color: #d9534f;
}
.delete-btn:hover {
  background-color: #fbeae9;
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
  border: 2px solid transparent;
  position: relative;
}
.event-card.selection-mode {
  cursor: pointer;
}
.event-card:not(.selection-mode):hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}
.event-card.is-selected {
  border-color: #0066cc;
  box-shadow: 0 4px 15px rgba(0, 102, 204, 0.3);
}

.selection-indicator {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
  font-size: 28px;
  color: #0066cc;
  background-color: white;
  border-radius: 50%;
  display: flex;
  opacity: 0;
  transition: opacity 0.2s ease;
}
.event-card.is-selected .selection-indicator {
  opacity: 1;
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
.event-card:not(.selection-mode):hover .event-image img {
  transform: scale(1.05);
}

.event-date-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}
.event-info {
  padding: 20px;
}
.event-info h3 {
  font-size: 18px;
  margin: 0 0 8px 0;
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
}

.no-events {
  text-align: center;
  padding: 50px;
  font-size: 18px;
  color: #555;
}
</style>
