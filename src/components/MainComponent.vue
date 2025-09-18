<template>
  <main class="main-content">
    <!-- Loading state -->
    <div v-if="isLoading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Carregando eventos...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="hasError" class="error-container">
      <div class="error-icon">⚠️</div>
      <h3>Erro ao carregar eventos</h3>
      <p>{{ errorMessage }}</p>
      <button @click="retryLoad" class="retry-btn">Tentar novamente</button>
    </div>

    <!-- Content -->
    <div v-else class="content-wrapper">
      <div class="events-column">
        <!-- Cabeçalho com contador de resultados -->
        <div class="results-header" v-if="hasFiltersApplied">
          <p>
            <strong>{{ totalFilteredEvents }}</strong> evento(s) encontrado(s)
            <button @click="clearFilters" class="clear-filters-btn">Limpar filtros</button>
          </p>
        </div>

        <!-- Mostrar apenas categorias que têm eventos quando filtros estão aplicados -->
        <section
          v-for="category in visibleCategories"
          :key="category"
          class="events-section"
        >
          <div class="section-header">
            <h2>{{ category }} <span class="category-count">({{ getEventsForCategory(category).length }})</span></h2>
            <div class="section-actions">
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
                <img :src="event.image" :alt="event.title" loading="lazy" @error="handleImageError" />
                <div class="event-date-badge">{{ formatDate(event.date) }}</div>
              </div>
              <div class="event-info">
                 <div class="info-header">
                    <h3 @click="openEvent(event)" :title="event.title">{{ event.title }}</h3>
                    <button
                      @click="toggleFavorite(event.id)"
                      class="favorite-btn"
                      :class="{ 'is-favorited': isFavorite(event.id) }"
                      :aria-label="isFavorite(event.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'"
                    >
                      <font-awesome-icon :icon="isFavorite(event.id) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'" />
                    </button>
                 </div>
                <p class="event-location">{{ event.location }}</p>
                <div class="event-rating" v-if="event.rating">
                  <span class="stars">{{ getStars(event.rating) }}</span>
                  <span class="rating-value">({{ event.rating.toFixed(1) }})</span>
                </div>
                <div class="event-price" v-if="event.price">{{ event.price }}</div>
              </div>
            </div>
          </div>
        </section>

        <!-- Mensagem quando não há eventos -->
        <div v-if="visibleCategories.length === 0 && !isLoading" class="no-events">
          <div class="no-events-icon">🔍</div>
          <h3>Nenhum evento encontrado</h3>
          <p>Tente ajustar os filtros ou explore outras categorias.</p>
          <button @click="clearFilters" class="btn-explore">Mostrar todos os eventos</button>
        </div>
      </div>

      <!-- Sidebar de Filtros -->
      <aside :class="['filter-sidebar', { 'is-open': isFilterVisible }]">
        <!-- ... resto do código da sidebar permanece igual ... -->
      </aside>
    </div>

    <!-- Overlay -->
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
      isLoading: true,
      hasError: false,
      errorMessage: '',
      filters: {
        sortBy: 'Novidades',
        selectedCategories: [],
        dateFilter: 'all'
      },
      sortedEvents: [],

      sortOptions: [
        { value: 'Novidades', label: 'Mais recentes' },
        { value: 'Melhor avaliado', label: 'Melhor avaliados' },
        { value: 'A-Z', label: 'A → Z' },
        { value: 'Z-A', label: 'Z → A' }
      ],

      dateOptions: [
        { value: 'all', label: 'Qualquer data' },
        { value: 'today', label: 'Hoje' },
        { value: 'week', label: 'Esta semana' },
        { value: 'month', label: 'Este mês' },
        { value: 'future', label: 'Próximos eventos' }
      ]
    }
  },

  computed: {
    visibleCategories() {
      if (this.filters.selectedCategories.length > 0) {
        return this.filters.selectedCategories.filter(category => {
          return this.getEventsForCategory(category).length > 0;
        });
      } else {
        return this.categories.filter(category => {
          return this.getEventsForCategory(category).length > 0;
        });
      }
    },

    totalFilteredEvents() {
      return this.sortedEvents.length;
    },

    hasFiltersApplied() {
      return this.filters.sortBy !== 'Novidades' ||
             this.filters.selectedCategories.length > 0 ||
             this.filters.dateFilter !== 'all';
    },

    hasChanges() {
      return true;
    }
  },

  async created() {
    await this.loadInitialData();
  },

  methods: {
    async loadInitialData() {
      try {
        this.isLoading = true;
        this.hasError = false;

        console.log('Iniciando carregamento dos dados...');

        // Testar conectividade primeiro
        const connectionTest = await eventService.testConnection();
        console.log('Teste de conectividade:', connectionTest);

        // Carregar dados
        const [events, categories] = await Promise.all([
          eventService.getAllEvents(),
          eventService.getEventCategories()
        ]);

        console.log('Eventos carregados:', events?.length || 0);
        console.log('Categorias carregadas:', categories?.length || 0);

        this.allEvents = events || [];
        this.categories = categories || [];

        this.loadFavorites();
        this.applySorting();

      } catch (error) {
        console.error('Erro ao carregar dados iniciais:', error);
        this.hasError = true;
        this.errorMessage = error.message || 'Erro desconhecido ao carregar eventos';
      } finally {
        this.isLoading = false;
      }
    },

    async retryLoad() {
      await this.loadInitialData();
    },

    handleImageError(event) {
      event.target.src = '/default-event.jpg';
    },

    openEvent(event) {
      this.$router.push({ name: 'EventDetails', params: { id: event.id } });
    },

    loadFavorites() {
      try {
        const favorites = localStorage.getItem('favoriteEvents');
        if (favorites) {
          this.favoriteEvents = JSON.parse(favorites);
        }
      } catch (error) {
        console.error('Erro ao carregar favoritos do localStorage:', error);
        this.favoriteEvents = [];
      }
    },

    toggleFavorite(eventId) {
      try {
        const index = this.favoriteEvents.indexOf(eventId);
        if (index > -1) {
          this.favoriteEvents.splice(index, 1);
        } else {
          this.favoriteEvents.push(eventId);
        }
        localStorage.setItem('favoriteEvents', JSON.stringify(this.favoriteEvents));
      } catch (error) {
        console.error('Erro ao salvar favoritos:', error);
      }
    },

    isFavorite(eventId) {
      return this.favoriteEvents.includes(eventId);
    },

    getEventsForCategory(category) {
      return this.sortedEvents.filter(event => event.category === category);
    },

    getEventCountByCategory(category) {
      return this.allEvents.filter(event => event.category === category).length;
    },

    toggleFilterSidebar() {
      this.isFilterVisible = !this.isFilterVisible;
    },

    removeCategoryFilter(category) {
      const index = this.filters.selectedCategories.indexOf(category);
      if (index > -1) {
        this.filters.selectedCategories.splice(index, 1);
        this.applySorting();
      }
    },

    getSortLabel(sortBy) {
      const option = this.sortOptions.find(opt => opt.value === sortBy);
      return option ? option.label : sortBy;
    },

    getDateLabel(dateFilter) {
      const option = this.dateOptions.find(opt => opt.value === dateFilter);
      return option ? option.label : dateFilter;
    },

    applySorting() {
      let events = [...this.allEvents];

      // Filtrar por categoria
      if (this.filters.selectedCategories.length > 0) {
        events = events.filter(event =>
          this.filters.selectedCategories.includes(event.category)
        );
      }

      // Filtrar por data
      if (this.filters.dateFilter !== 'all') {
        events = this.filterByDate(events);
      }

      // Aplicar ordenação
      switch (this.filters.sortBy) {
        case 'A-Z':
          events.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'Z-A':
          events.sort((a, b) => b.title.localeCompare(a.title));
          break;
        case 'Melhor avaliado':
          events.sort((a, b) => {
            const ratingA = a.rating || 0;
            const ratingB = b.rating || 0;
            if (ratingB !== ratingA) {
              return ratingB - ratingA;
            }
            const reviewsA = a.reviewCount || 0;
            const reviewsB = b.reviewCount || 0;
            return reviewsB - reviewsA;
          });
          break;
        case 'Novidades':
        default:
          // Manter ordem original
          break;
      }

      this.sortedEvents = events;
    },

    filterByDate(events) {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      return events.filter(event => {
        const eventDates = this.parseEventDate(event.date);
        if (!eventDates) return true; // Se não conseguir parsear, mostra o evento

        switch (this.filters.dateFilter) {
          case 'today':
            return this.isToday(eventDates, today);
          case 'week':
            return this.isThisWeek(eventDates, today);
          case 'month':
            return this.isThisMonth(eventDates, today);
          case 'future':
            return this.isFutureEvent(eventDates, today);
          default:
            return true;
        }
      });
    },

    parseEventDate(dateStr) {
      if (!dateStr || dateStr.toLowerCase().includes('permanente')) {
        return null; // Eventos permanentes sempre aparecem
      }

      const currentYear = new Date().getFullYear();
      const monthMap = {
        'JAN': 0, 'FEV': 1, 'MAR': 2, 'ABR': 3,
        'MAI': 4, 'JUN': 5, 'JUL': 6, 'AGO': 7,
        'SET': 8, 'OUT': 9, 'NOV': 10, 'DEZ': 11
      };

      // Formato: "17 a 20 JUL" ou "06 a 24 AGO" ou "12 OUT"
      const rangeMatch = dateStr.match(/(\d{1,2})\s+a\s+(\d{1,2})\s+([A-Z]{3})/);
      if (rangeMatch) {
        const startDay = parseInt(rangeMatch[1]);
        const endDay = parseInt(rangeMatch[2]);
        const monthIndex = monthMap[rangeMatch[3]];

        if (monthIndex !== undefined) {
          return {
            start: new Date(currentYear, monthIndex, startDay),
            end: new Date(currentYear, monthIndex, endDay),
            isRange: true
          };
        }
      }

      // Formato: "12 OUT" (data única)
      const singleMatch = dateStr.match(/(\d{1,2})\s+([A-Z]{3})/);
      if (singleMatch) {
        const day = parseInt(singleMatch[1]);
        const monthIndex = monthMap[singleMatch[2]];

        if (monthIndex !== undefined) {
          const eventDate = new Date(currentYear, monthIndex, day);
          return {
            start: eventDate,
            end: eventDate,
            isRange: false
          };
        }
      }

      return null;
    },

    isToday(eventDates, today) {
      if (!eventDates) return false;

      const todayTime = today.getTime();
      const startTime = eventDates.start.getTime();
      const endTime = eventDates.end.getTime();

      return todayTime >= startTime && todayTime <= endTime;
    },

    isThisWeek(eventDates, today) {
      if (!eventDates) return false;

      // Calcular início e fim da semana (domingo a sábado)
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      // Verificar se há sobreposição entre o evento e a semana
      return this.dateRangesOverlap(eventDates, {
        start: startOfWeek,
        end: endOfWeek
      });
    },

    isThisMonth(eventDates, today) {
      if (!eventDates) return false;

      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      return this.dateRangesOverlap(eventDates, {
        start: startOfMonth,
        end: endOfMonth
      });
    },

    isFutureEvent(eventDates, today) {
      if (!eventDates) return false;

      // Evento é futuro se a data de início é depois de hoje
      return eventDates.start.getTime() > today.getTime();
    },

    dateRangesOverlap(range1, range2) {
      return range1.start <= range2.end && range2.start <= range1.end;
    },

    applyFiltersAndClose() {
      this.applySorting();
      this.toggleFilterSidebar();
    },

    clearFilters() {
      this.filters.sortBy = 'Novidades';
      this.filters.selectedCategories = [];
      this.filters.dateFilter = 'all';
      this.applySorting();
    },

    formatDate(date) {
      if (!date) return 'Data não disponível';

      const monthMap = {
        'JAN': '01', 'FEV': '02', 'MAR': '03', 'ABR': '04',
        'MAI': '05', 'JUN': '06', 'JUL': '07', 'AGO': '08',
        'SET': '09', 'OUT': '10', 'NOV': '11', 'DEZ': '12'
      };

      if (date.toLowerCase().includes('permanente')) {
        return '∞';
      }

      const match = date.match(/(\d{1,2})(?:\s+a\s+\d{1,2})?\s+([A-Z]{3})/);

      if (match) {
        const day = match[1].padStart(2, '0');
        const monthAbbr = match[2];
        const month = monthMap[monthAbbr];

        if (month) {
          return `${day}/${month}`;
        }
      }

      return date;
    },

    getStars(rating) {
      const fullStars = Math.floor(rating);
      const hasHalfStar = rating % 1 >= 0.5;
      let stars = '';

      for (let i = 0; i < fullStars; i++) {
        stars += '★';
      }
      if (hasHalfStar) {
        stars += '☆';
      }

      return stars;
    }
  }
}
</script>

<style scoped>
/* Estados de loading e erro */
.loading-container, .error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #0066cc;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.retry-btn {
  background: #0066cc;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 1rem;
}

/* Resto dos estilos permanecem iguais */
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.results-header {
  background: #f8f9fa;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.clear-filters-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
}

.category-count {
  color: #666;
  font-size: 0.8rem;
  font-weight: normal;
}

.filter-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #0066cc;
  cursor: pointer;
  font-size: 14px;
}

.no-events {
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
}

.no-events-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.btn-explore {
  background: #0066cc;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 1rem;
}

/* Filtros melhorados */
.filter-sidebar {
  position: fixed;
  top: 0;
  right: -400px;
  width: 400px;
  height: 100vh;
  background: white;
  box-shadow: -4px 0 20px rgba(0,0,0,0.15);
  padding: 0;
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
  padding: 1.5rem;
  border-bottom: 2px solid #f0f0f0;
  background: #f8f9fa;
}

.filter-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-group {
  padding: 1.5rem;
  border-bottom: 1px solid #f0f0f0;
}

.filter-group h4 {
  font-size: 1rem;
  margin-bottom: 1rem;
  color: #333;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-count {
  background: #0066cc;
  color: white;
  font-size: 0.8rem;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-weight: normal;
}

.radio-option, .checkbox-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background 0.2s;
}

.radio-option:hover, .checkbox-option:hover {
  background: #f8f9fa;
}

.radio-label, .checkbox-label {
  flex: 1;
  font-size: 0.95rem;
}

.category-event-count {
  color: #666;
  font-size: 0.8rem;
  background: #f0f0f0;
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
}

.filter-actions {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.apply-btn, .clear-btn {
  padding: 0.875rem 1.25rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.apply-btn {
  background: #0066cc;
  color: white;
  border: none;
}

.apply-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.clear-btn {
  background: white;
  color: #666;
  border: 2px solid #e0e0e0;
}

.clear-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.active-filters {
  padding: 1.5rem;
  background: #f8f9fa;
}

.active-filters h5 {
  margin: 0 0 0.75rem 0;
  font-size: 0.9rem;
  color: #666;
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-tag {
  background: #e3f2fd;
  color: #1976d2;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
}

.filter-tag.removable {
  cursor: pointer;
  background: #fff3e0;
  color: #f57c00;
}

.filter-tag.removable:hover {
  background: #ffe0b2;
}

.favorite-btn.is-favorited {
  color: #ff4757;
  animation: heartbeat 0.6s ease-in-out;
}

@keyframes heartbeat {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

/* Continuar com estilos existentes... */
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

.view-all {
  color: #0066cc;
  font-weight: 500;
  cursor: pointer;
  font-size: 14px;
  transition: color 0.2s ease;
  text-decoration: none;
}

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
  transition: transform 0.2s;
}

.favorite-btn:hover {
  transform: scale(1.1);
}

.event-location {
  color: #666;
  font-size: 14px;
  margin: 0 0 12px 0;
}

.event-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.stars {
  color: #ffa500;
  font-size: 16px;
}

.rating-value {
  color: #666;
  font-size: 14px;
}

.event-price {
  color: #0066cc;
  font-weight: 600;
  font-size: 16px;
  margin-top: auto;
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
/* Responsividade */
@media (max-width: 1024px) {
  .events-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 20px 15px;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .section-header h2 {
    font-size: 24px;
  }

  .events-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
  }

  .filter-sidebar {
    width: 100%;
    right: -100%;
  }

  .event-info {
    padding: 15px;
  }

  .info-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .favorite-btn {
    align-self: flex-end;
    margin-top: -10px;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 15px 10px;
  }

  .events-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .event-card {
    max-width: 100%;
  }

  .section-actions {
    flex-direction: column;
    gap: 10px;
  }

  .filter-sidebar {
    padding: 15px;
  }

  .no-events {
    padding: 40px 15px;
  }
}
</style>
