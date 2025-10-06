<template>
  <div class="categories-list-page">
    <div class="container">
      <h1 class="page-title">Explore as Categorias de Eventos</h1>
      <p class="page-subtitle">Encontre o evento perfeito para você.</p>

      <div v-if="isLoading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Carregando categorias...</p>
      </div>

      <div v-else-if="categories.length" class="categories-grid">
        <div
          v-for="category in categories"
          :key="category.id || category.nome"
          class="category-card"
          @click="navigateToCategory(category)"
        >
          <div class="category-icon">
            <font-awesome-icon icon="fa-solid fa-calendar-days" />
          </div>
          <h3 class="category-name">{{ category.nome }}</h3>
        </div>
      </div>

      <div v-else class="empty-state">
        <p>Nenhuma categoria encontrada no momento.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { eventService } from '@/services/eventService.js'
import { useToastStore } from '@/stores/toast'

const categories = ref([])
const router = useRouter()
const toast = useToastStore()
const isLoading = ref(true)

async function fetchCategories() {
  isLoading.value = true
  try {
    // Chama o novo método do eventService para buscar todas as categorias
    const fetchedCategories = await eventService.getFullCategories()
    categories.value = fetchedCategories
  } catch (error) {
    console.error('Erro ao buscar categorias:', error)
    toast.error('Erro ao carregar a lista de categorias.')
    categories.value = []
  } finally {
    isLoading.value = false
  }
}

function navigateToCategory(category) {
  // Navega para a rota de detalhe de categoria, que está em /category/:categoryName
  router.push({ name: 'CategoryPage', params: { categoryName: category.nome } })
}

onMounted(() => {
  fetchCategories()
})
</script>

<style scoped>
/* Estilos simplificados para a lista de categorias */
.categories-list-page {
  padding: 4rem 1rem;
  min-height: 80vh;
}
.container {
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
}
.page-title {
  font-size: 2.5rem;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}
.page-subtitle {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 3rem;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
}

.category-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.category-icon {
  font-size: 3rem;
  color: #1e4d8b; /* Cor principal */
  margin-bottom: 1rem;
}

.category-name {
  font-size: 1.2rem;
  color: #333;
  margin: 0;
  font-weight: 600;
}

.loading-container,
.empty-state {
  margin-top: 4rem;
  color: #666;
  text-align: center;
}
.loading-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #1e4d8b;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
