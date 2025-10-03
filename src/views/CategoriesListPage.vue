<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api'; // Este é o seu serviço de API

const categories = ref([]);
const router = useRouter();

// Mapeamento de ícones para categorias (exemplo)
const categoryIcons = {
  'Música': 'fa-solid fa-music',
  'Tecnologia': 'fa-solid fa-laptop-code',
  'Esportes': 'fa-solid fa-futbol',
  'Arte': 'fa-solid fa-palette',
  'Gastronomia': 'fa-solid fa-utensils',
  'Negócios': 'fa-solid fa-briefcase',
  'Educação': 'fa-solid fa-book-open',
  'Saúde': 'fa-solid fa-heart-pulse',
  'Cultura': 'fa-solid fa-masks-theater',
  'Entretenimento': 'fa-solid fa-film',
};

async function fetchCategories() {
  try {
    const response = await api.getCategories(); // api.get('/categorias/')

    // CORREÇÃO CRÍTICA: Sua API (DRF) retorna { results: [...] }.
    // Você precisa acessar o array 'results' dentro do response.data.
    // Usamos response.data.results para garantir o array correto.
    categories.value = response.data.results || response.data;
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    // Fallback para uma lista estática se a API falhar ou não existir
    categories.value = [
      { id: 1, nome: 'Música' },
      { id: 2, nome: 'Tecnologia' },
      { id: 3, nome: 'Esportes' },
      { id: 4, nome: 'Arte' },
      { id: 5, nome: 'Gastronomia' },
      { id: 6, nome: 'Negócios' },
    ];
  }
}

function navigateToCategory(category) {
  // A rota CategoryPage requer o parâmetro categoryName
  router.push({ name: 'CategoryPage', params: { categoryName: category.nome } });
}

onMounted(fetchCategories);
</script>

<template>
  <div class="categories-page">
    <div class="container">
      <h1 class="page-title">Explore por Categoria</h1>
      <p class="page-subtitle">Encontre eventos que combinam com você</p>

      <div class="categories-grid">
        <div
          v-for="category in categories"
          :key="category.id"
          class="category-card"
          @click="navigateToCategory(category)"
        >
          <div class="category-icon">
            <font-awesome-icon :icon="categoryIcons[category.nome] || 'fa-solid fa-calendar-days'" />
          </div>
          <h3 class="category-name">{{ category.nome }}</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* O restante do CSS permanece o mesmo */
.categories-page {
  padding: 4rem 1rem;
  background-color: #f8f9fa;
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
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e0e0e0;
}
.category-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: #1e4d8b;
}

.category-icon {
  font-size: 2.5rem;
  color: #1e4d8b;
  margin-bottom: 1rem;
}

.category-name {
  font-size: 1.2rem;
  color: #333;
  font-weight: 600;
}
</style>
