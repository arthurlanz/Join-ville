<template>
  <div class="favorites-page">
    <div class="container">
      <h1 class="page-title">Meus Favoritos</h1>
      <div v-if="favoriteEventsDetails.length > 0" class="events-grid">
         <div 
            v-for="event in favoriteEventsDetails" 
            :key="event.id"
            class="event-card"
            @click="openEvent(event)"
          >
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
import { eventService } from '@/services/eventService.js';

export default {
  name: 'FavoritesPage',
  data() {
    return {
      favoriteEventsDetails: [],
    };
  },
  created() {
    this.loadFavoriteEvents();
  },
  methods: {
    loadFavoriteEvents() {
      const favoriteIds = JSON.parse(localStorage.getItem('favoriteEvents') || '[]');
      const allEvents = eventService.getAllEvents();
      this.favoriteEventsDetails = allEvents.filter(event => favoriteIds.includes(event.id));
    },
    openEvent(event) {
        this.$router.push({ name: 'EventDetails', params: { id: event.id } });
    }
  }
};
</script>

<style scoped>
/* Estilos são idênticos aos da CategoryPage para manter a consistência */
.favorites-page {
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
}
.event-info h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px 0;
  line-height: 1.3;
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