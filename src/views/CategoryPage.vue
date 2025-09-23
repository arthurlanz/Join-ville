<template>
  <div class="category-page">
    <div class="container">
      <h1 class="page-title">{{ categoryName }}</h1>

      <div v-if="events.length > 0" class="events-grid">
        <div
          v-for="event in events"
          :key="event.id"
          class="event-card"
          @click="openEvent(event)"
        >
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
                :aria-label="isFavorite(event.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'"
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

<script>
import { eventService } from "@/services/eventService.js";
import { useToastStore } from "@/stores/toast";

export default {
  name: "CategoryPage",
  props: {
    categoryName: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      events: [],
      isLoading: false,
      favoriteEvents: [],
    };
  },
  watch: {
    categoryName: {
      immediate: true,
      async handler(newCategoryName) {
        this.isLoading = true;
        const toast = useToastStore();

        try {
          this.events = await eventService.getEventsByCategory(newCategoryName);

          if (this.events.length > 0) {
            toast.info(`Eventos da categoria "${newCategoryName}" carregados!`);
          } else {
            toast.info(`Nenhum evento encontrado em "${newCategoryName}".`);
          }

          this.loadFavorites();
        } catch (error) {
          console.error(error);
          this.events = [];
          toast.error("Erro ao carregar eventos. Tente novamente mais tarde.");
        } finally {
          this.isLoading = false;
        }
      },
    },
  },
  methods: {
    openEvent(event) {
      this.$router.push(`/evento/${event.id}`);
    },
    loadFavorites() {
      const favorites = localStorage.getItem("favoriteEvents");
      this.favoriteEvents = favorites ? JSON.parse(favorites) : [];
    },
    toggleFavorite(eventId) {
      const index = this.favoriteEvents.indexOf(eventId);
      if (index > -1) this.favoriteEvents.splice(index, 1);
      else this.favoriteEvents.push(eventId);
      localStorage.setItem("favoriteEvents", JSON.stringify(this.favoriteEvents));
    },
    isFavorite(eventId) {
      return this.favoriteEvents.includes(eventId);
    },
  },
};
</script>

<style scoped>
/* Reaproveite os estilos do event-card da página inicial */
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
</style>
