<template>
  <main class="main-content">
    <div class="content-wrapper">
      <div class="events-column">
        <section v-for="category in categories" :key="category" class="events-section">
          <div class="section-header">
            <h2>{{ category }}</h2>
            <div class="section-actions">
              <span @click="toggleFilterSidebar" class="filter-link">Filtrar</span>
              <router-link :to="{ name: 'CategoryPage', params: { categoryName: category } }" class="view-all">Ver Tudo</router-link>
            </div>
          </div>
          <div class="events-grid">
            <div 
              v-for="event in getEventsForCategory(category).slice(0, 4)" 
              :key="event.id"
              class="event-card"
            >
              <div class="event-image" @click="openEvent(event)">
                <img :src="event.image" :alt="event.title" />
                <div class="event-date-badge">{{ event.date }}</div>
              </div>
              <div class="event-info">
                 <div class="info-header">
                    <h3 @click="openEvent(event)">{{ event.title }}</h3>
                    <button @click="toggleFavorite(event.id)" class="favorite-btn">
                      <font-awesome-icon :icon="isFavorite(event.id) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'" />
                    </button>
                 </div>
                <p class="event-location">{{ event.location }}</p>
                <div class="event-price" v-if="event.price">{{ event.price }}</div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <aside :class="['filter-sidebar', { 'is-open': isFilterVisible }]">
        <div class="filter-header">
          <h3>Filtrar e ordenar</h3>
          <button @click="toggleFilterSidebar" class="close-btn">&times;</button>
        </div>
        <div class="filter-group">
          <h4>Ordenar</h4>
          <div class="order-options">
            <button :class="{ active: filters.sortBy === 'Novidades' }" @click="setSortBy('Novidades')">Novidades</button>
            <button :class="{ active: filters.sortBy === 'Melhor avaliado' }" @click="setSortBy('Melhor avaliado')">Melhor avaliado</button>
            <button :class="{ active: filters.sortBy === 'A-Z' }" @click="setSortBy('A-Z')">A-Z</button>
            <button :class="{ active: filters.sortBy === 'Z-A' }" @click="setSortBy('Z-A')">Z-A</button>
          </div>
        </div>
        <div class="filter-group">
            <h4>Categoria</h4>
            <div class="category-options">
                <button 
                  v-for="cat in categories" 
                  :key="cat"
                  :class="{ active: filters.selectedCategories.includes(cat) }"
                  @click="toggleCategoryFilter(cat)"
                >
                  {{ cat }}
                </button>
            </div>
        </div>
         <div class="filter-actions">
            <button class="apply-btn" @click="applyFilters">Aplicar Filtros</button>
            <button class="clear-btn" @click="clearFilters">Limpar Filtros</button>
        </div>
      </aside>
    </div>
    <div v-if="isFilterVisible" @click="toggleFilterSidebar" class="overlay"></div>
  </main>
</template>

<script>
import { eventService } from '@/services/eventService.js';

export default {
  name: 'MainComponent',
  data() {
    return {
      allEvents: [],
      categories: [],
      favoriteEvents: [],
      isFilterVisible: false,
      filters: {
          sortBy: 'Novidades',
          selectedCategories: []
      },
      filteredEvents: []
    }
  },
  created() {
    this.allEvents = eventService.getAllEvents();
    this.categories = eventService.getEventCategories();
    this.loadFavorites();
    this.applyFilters();
  },
  methods: {
    openEvent(event) {
      this.$router.push({ name: 'EventDetails', params: { id: event.id } });
    },
    loadFavorites() {
        const favorites = localStorage.getItem('favoriteEvents');
        if (favorites) {
            this.favoriteEvents = JSON.parse(favorites);
        }
    },
    toggleFavorite(eventId) {
        const index = this.favoriteEvents.indexOf(eventId);
        if (index > -1) {
            this.favoriteEvents.splice(index, 1);
        } else {
            this.favoriteEvents.push(eventId);
        }
        localStorage.setItem('favoriteEvents', JSON.stringify(this.favoriteEvents));
    },
    isFavorite(eventId) {
        return this.favoriteEvents.includes(eventId);
    },
    getEventsForCategory(category) {
        // Retorna os eventos filtrados para a categoria específica
        return this.filteredEvents.filter(event => event.category === category);
    },
    toggleFilterSidebar() {
        this.isFilterVisible = !this.isFilterVisible;
    },
    setSortBy(criteria) {
        this.filters.sortBy = criteria;
    },
    toggleCategoryFilter(category) {
        const index = this.filters.selectedCategories.indexOf(category);
        if (index > -1) {
            this.filters.selectedCategories.splice(index, 1);
        } else {
            this.filters.selectedCategories.push(category);
        }
    },
    applyFilters() {
        let events = [...this.allEvents];

        // Filtro por categoria
        if (this.filters.selectedCategories.length > 0) {
            events = events.filter(event => this.filters.selectedCategories.includes(event.category));
        }

        // Ordenação
        switch (this.filters.sortBy) {
            case 'A-Z':
                events.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'Z-A':
                events.sort((a, b) => b.title.localeCompare(a.title));
                break;
            // Adicionar mais lógicas de ordenação se necessário
        }

        this.filteredEvents = events;
        if(this.isFilterVisible) this.toggleFilterSidebar();
    },
    clearFilters() {
        this.filters.sortBy = 'Novidades';
        this.filters.selectedCategories = [];
        this.applyFilters();
    }
  }
}
</script>

<style scoped>
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}
.content-wrapper {
  display: flex;
  position: relative;
}
.events-column {
  flex-grow: 1;
  transition: margin-right 0.3s ease;
}
.events-section {
  margin-bottom: 60px;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e9ecef;
}
.section-header h2 {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}
.section-actions {
  display: flex;
  gap: 20px;
}
.filter-link,
.view-all {
  color: #0066cc;
  font-weight: 500;
  cursor: pointer;
  font-size: 14px;
  transition: color 0.2s ease;
  text-decoration: none;
}
.filter-link:hover,
.view-all:hover {
  color: #0052a3;
  text-decoration: underline;
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
  cursor: pointer;
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
/* Estilos da Sidebar de Filtro */
.filter-sidebar {
  position: fixed;
  top: 0;
  right: -350px; /* Começa fora da tela */
  width: 350px;
  height: 100vh;
  background: white;
  box-shadow: -4px 0 15px rgba(0,0,0,0.1);
  padding: 20px;
  transition: right 0.3s ease-in-out;
  z-index: 1001;
  overflow-y: auto;
}
.filter-sidebar.is-open {
  right: 0;
}
.filter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eee;
    padding-bottom: 15px;
    margin-bottom: 20px;
}
.filter-header h3 {
    margin: 0;
    font-size: 20px;
}
.close-btn {
    background: none;
    border: none;
    font-size: 28px;
    cursor: pointer;
    color: #888;
}
.filter-group {
    margin-bottom: 25px;
}
.filter-group h4 {
    font-size: 16px;
    margin-bottom: 12px;
    color: #333;
}
.order-options, .category-options {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}
.order-options button, .category-options button {
    background: #f0f0f0;
    border: 1px solid transparent;
    border-radius: 20px;
    padding: 8px 15px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 14px;
}
.order-options button.active, .category-options button.active {
    background: #e0efff;
    color: #0066cc;
    border-color: #0066cc;
    font-weight: 500;
}
.filter-actions {
    margin-top: 30px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.apply-btn {
    background: #0066cc;
    color: white;
    padding: 12px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
}
.clear-btn {
    background: transparent;
    color: #555;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  z-index: 1000;
}
</style>