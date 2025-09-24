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

        <!-- Mostrar apenas categorias que têm eventos -->
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
              v-for="event in getEventsForCategory(category).slice(0, 3)"
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
        <!-- ... aqui vai o conteúdo da sidebar ... -->
      </aside>
    </div>

    <!-- Overlay -->
    <div v-if="isFilterVisible" @click="toggleFilterSidebar" class="overlay"></div>
  </main>
</template>


<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { eventService } from '@/services/eventService.js';

// Refs e estados reativos
const allEvents = ref([]);
const categories = ref([]);
const favoriteEvents = ref([]);
const sortedEvents = ref([]);

const isFilterVisible = ref(false);
const isLoading = ref(true);
const hasError = ref(false);
const errorMessage = ref('');

const filters = reactive({
  sortBy: 'Novidades',
  selectedCategories: [],
  dateFilter: 'all',
});

// Router
const router = useRouter();

// Computed
const visibleCategories = computed(() => {
  if (filters.selectedCategories.length > 0) {
    return filters.selectedCategories.filter(category =>
      getEventsForCategory(category).length > 0
    );
  }
  return categories.value.filter(category => getEventsForCategory(category).length > 0);
});

const totalFilteredEvents = computed(() => sortedEvents.value.length);

const hasFiltersApplied = computed(() =>
  filters.sortBy !== 'Novidades' ||
  filters.selectedCategories.length > 0 ||
  filters.dateFilter !== 'all'
);

// Lifecycle
onMounted(async () => {
  await loadInitialData();
});

// Métodos
async function loadInitialData() {
  try {
    isLoading.value = true;
    hasError.value = false;

    console.log('Iniciando carregamento dos dados...');

    if (eventService.testConnection) {
      const connectionTest = await eventService.testConnection();
      console.log('Teste de conectividade:', connectionTest);
    }

    const [events, cats] = await Promise.all([
      eventService.getAllEvents(),
      eventService.getEventCategories()
    ]);

    allEvents.value = events || [];
    categories.value = cats || [];

    loadFavorites();
    applySorting();

  } catch (error) {
    console.error('Erro ao carregar dados iniciais:', error);
    hasError.value = true;
    errorMessage.value = error.message || 'Erro desconhecido ao carregar eventos';
  } finally {
    isLoading.value = false;
  }
}

function retryLoad() {
  loadInitialData();
}

function handleImageError(event) {
  event.target.src = '/default-event.jpg';
}

function openEvent(event) {
  router.push({ name: 'EventDetails', params: { id: event.id } });
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
  } else {
    favoriteEvents.value.push(eventId);
  }
  localStorage.setItem('favoriteEvents', JSON.stringify(favoriteEvents.value));
}

function isFavorite(eventId) {
  return favoriteEvents.value.includes(eventId);
}

function getEventById(id) {
  return allEvents.value.find(ev => ev.id === id) || {};
}

function getEventsForCategory(category) {
  return sortedEvents.value.filter(event => event.category === category);
}

function toggleFilterSidebar() {
  isFilterVisible.value = !isFilterVisible.value;
}

function applySorting() {
  let events = [...allEvents.value];

  if (filters.selectedCategories.length) {
    events = events.filter(ev => filters.selectedCategories.includes(ev.category));
  }

  if (filters.dateFilter !== 'all') {
    events = filterByDate(events);
  }

  switch (filters.sortBy) {
    case 'A-Z':
      events.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'Z-A':
      events.sort((a, b) => b.title.localeCompare(a.title));
      break;
    case 'Melhor avaliado':
      events.sort((a, b) => {
        const ratingB = b.rating || 0;
        const ratingA = a.rating || 0;
        if (ratingB !== ratingA) return ratingB - ratingA;

        const reviewsB = b.reviewCount || 0;
        const reviewsA = a.reviewCount || 0;
        return reviewsB - reviewsA;
      });
      break;
    default:
      break;
  }

  sortedEvents.value = events;
}

function filterByDate(events) {
  const today = new Date();
  const dayZero = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  return events.filter(ev => {
    const dates = parseEventDate(ev.date);
    if (!dates) return true;

    switch (filters.dateFilter) {
      case 'today':
        return isToday(dates, dayZero);
      case 'week':
        return isThisWeek(dates, dayZero);
      case 'month':
        return isThisMonth(dates, dayZero);
      case 'future':
        return isFutureEvent(dates, dayZero);
      default:
        return true;
    }
  });
}

function parseEventDate(dateStr) {
  if (!dateStr || dateStr.toLowerCase().includes('permanente')) return null;

  const year = new Date().getFullYear();
  const monthMap = {
    'JAN': 0, 'FEV': 1, 'MAR': 2, 'ABR': 3, 'MAI': 4, 'JUN': 5,
    'JUL': 6, 'AGO': 7, 'SET': 8, 'OUT': 9, 'NOV': 10, 'DEZ': 11
  };

  const rangeMatch = dateStr.match(/(\d{1,2})\s+a\s+(\d{1,2})\s+([A-Z]{3})/);
  if (rangeMatch) {
    const start = new Date(year, monthMap[rangeMatch[3]], parseInt(rangeMatch[1]));
    const end = new Date(year, monthMap[rangeMatch[3]], parseInt(rangeMatch[2]));
    return { start, end, isRange: true };
  }

  const singleMatch = dateStr.match(/(\d{1,2})\s+([A-Z]{3})/);
  if (singleMatch) {
    const d = new Date(year, monthMap[singleMatch[2]], parseInt(singleMatch[1]));
    return { start: d, end: d, isRange: false };
  }

  return null;
}

function isToday(dates, today) {
  return today.getTime() >= dates.start.getTime() && today.getTime() <= dates.end.getTime();
}

function isThisWeek(dates, today) {
  const s = new Date(today);
  s.setDate(today.getDate() - today.getDay());
  const e = new Date(s);
  e.setDate(s.getDate() + 6);
  return dateRangesOverlap(dates, { start: s, end: e });
}

function isThisMonth(dates, today) {
  const s = new Date(today.getFullYear(), today.getMonth(), 1);
  const e = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return dateRangesOverlap(dates, { start: s, end: e });
}

function isFutureEvent(dates, today) {
  return dates.start.getTime() > today.getTime();
}

function dateRangesOverlap(r1, r2) {
  return r1.start <= r2.end && r2.start <= r1.end;
}

function applyFiltersAndClose() {
  applySorting();
  toggleFilterSidebar();
}

function clearFilters() {
  filters.sortBy = 'Novidades';
  filters.selectedCategories = [];
  filters.dateFilter = 'all';
  applySorting();
}

function formatDate(date) {
  if (!date) return 'Data não disponível';
  const monthMap = {
    'JAN': '01', 'FEV': '02', 'MAR': '03', 'ABR': '04',
    'MAI': '05', 'JUN': '06', 'JUL': '07', 'AGO': '08',
    'SET': '09', 'OUT': '10', 'NOV': '11', 'DEZ': '12'
  };
  if (date.toLowerCase().includes('permanente')) return '∞';
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
