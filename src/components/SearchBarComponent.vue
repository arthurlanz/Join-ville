<template>
  <div class="search-bar-component">
    <form @submit.prevent="handleSubmit">
      <div class="search-wrapper">
        <font-awesome-icon icon="fa-solid fa-search" class="search-icon" />
        <input
          type="text"
          v-model="query"
          placeholder="O que você está procurando em Joinville?"
          class="search-input"
          ref="searchInput"
        />
      </div>
    </form>

    <div v-if="filteredEventos.length > 0" class="results-wrapper">
      <div
        v-for="evento in filteredEventos"
        :key="evento.id"
        class="result-item"
        @click="openEvent(evento)"
      >
        <span>{{ evento.nome }}</span>
        <span class="result-category">{{ evento.categoria?.nome || 'Evento' }}</span>
      </div>
    </div>
    <div v-else-if="query.length > 2 && showNoResults" class="no-results">
      <p>Nenhum resultado rápido encontrado para "{{ query }}"</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const query = ref('')
const eventos = ref([])
const showNoResults = ref(false)
const router = useRouter()
const searchInput = ref(null)

onMounted(() => {
  searchInput.value?.focus()
})

const normalize = (str) =>
  (str || '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()

let debounceTimer;
watch(query, (newValue) => {
  clearTimeout(debounceTimer);
  showNoResults.value = false;
  if (newValue.trim().length < 2) {
    eventos.value = [];
    return;
  }
  debounceTimer = setTimeout(async () => {
    try {
      const response = await api.get('/eventos/')
      eventos.value = response.data
      if (filteredEventos.value.length === 0) {
        showNoResults.value = true;
      }
    } catch (err) {
      console.error('Erro ao buscar eventos:', err)
      eventos.value = []
    }
  }, 300); // Debounce de 300ms para não fazer requisições a cada tecla
})

const filteredEventos = computed(() => {
  if (!query.value.trim() || !eventos.value) return []
  const text = normalize(query.value)
  return eventos.value.filter(e =>
    normalize(e.nome).includes(text)
  ).slice(0, 5);
})

// Função para abrir um evento específico (ao clicar na sugestão)
function openEvent(evento) {
  router.push({ path: `/evento/${evento.id}` })
  query.value = ''
}

// NOVA FUNÇÃO: Chamada ao pressionar Enter
function handleSubmit() {
  if (query.value.trim().length === 0) return;

  // Redireciona para a página de resultados de busca
  router.push({
    name: 'SearchResultsView',
    query: { q: query.value }
  });
  // O modal de busca fechará automaticamente por causa do watch na rota no HeaderComponent
}
</script>

<style scoped>
.search-bar-component {
  padding: 1rem;
}

.search-wrapper {
  display: flex;
  align-items: center;
  border-bottom: 2px solid #ccc;
  padding-bottom: 0.5rem;
  transition: border-color 0.3s ease;
}
.search-wrapper:focus-within {
  border-color: #1e4d8b;
}

.search-icon {
  font-size: 1.2rem;
  color: #888;
  margin-right: 1rem;
}

.search-input {
  border: none;
  outline: none;
  flex: 1;
  font-size: 1.2rem; /* Tamanho maior para destaque no modal */
  width: 100%;
  background: transparent;
}

.results-wrapper {
  margin-top: 1rem;
  max-height: 300px;
  overflow-y: auto;
}

.result-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}
.result-item:hover {
  background: #f7f7f7;
}

.result-category {
  font-size: 0.8rem;
  color: #888;
  background: #f0f0f0;
  padding: 4px 8px;
  border-radius: 12px;
}

.no-results {
  padding: 1rem;
  text-align: center;
  color: #888;
}
</style>
