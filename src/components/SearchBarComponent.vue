<template>
  <div class="search-bar-component" style="background: #f7f7f7; padding: 1rem;">
    <div class="search">
      <span class="icon">🔍</span>
      <input
        type="text"
        v-model="query"
        placeholder="Buscar eventos..."
      />
    </div>

    <div v-if="filteredEventos.length" class="results">
      <div
        v-for="evento in filteredEventos"
        :key="evento.id"
        class="result-item"
        @click="openEvent(evento)"
      >
        {{ evento.nome }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/apiService'

const query = ref('')
const eventos = ref([])
const router = useRouter()


const normalize = (str) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()


watch(query, async (newValue) => {
  if (!newValue.trim()) {
    eventos.value = []
    return
  }

  try {

    const response = await api.get('/eventos')
    eventos.value = response.data
  } catch (err) {
    console.error('Erro ao buscar eventos:', err)
    eventos.value = []
  }
})

const filteredEventos = computed(() => {
  if (!query.value.trim()) return []
  const text = normalize(query.value)
  return eventos.value.filter(e =>
    normalize(e.nome).startsWith(text)
  )
})

const openEvent = (evento) => {
  router.push({ path: `/evento/${evento.id}` })
  query.value = ''
}
</script>

<style scoped>
.search {
  display: flex;
  align-items: center;
  max-width: 400px;
  margin: 0 auto;
  border: 2px solid #0051a3c9;
  border-radius: 30px;
  padding: 0.5rem;
  background: #f7f7f7;
}
.search input {
  border: none;
  outline: none;
  flex: 1;
  margin-left: 0.5rem;
  background: #f7f7f7;
}

.results {
  max-width: 400px;
  margin: 0.5rem auto 0;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}
.result-item {
  padding: 0.5rem 1rem;
  cursor: pointer;
}
.result-item:hover {
  background: #f0f0f0;
}
</style>
