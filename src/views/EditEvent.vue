<template>
  <div class="create-event-page">
    <div class="container">
      <div class="form-container">
        <h1 class="title">Editar Evento</h1>
        <p class="subtitle">Ajuste os detalhes do seu evento abaixo.</p>

        <form @submit.prevent="submitEvent">
          <div class="form-group">
            <label for="nome">Nome do Evento</label>
            <input type="text" id="nome" v-model="eventData.nome" required />
          </div>
          <div class="form-group">
            <label for="categoria">Categoria</label>
            <select id="categoria" v-model="eventData.categoria" required>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.nome }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="descricao">Descrição</label>
            <textarea id="descricao" v-model="eventData.descricao" rows="5" required></textarea>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Data de Início</label
              ><input type="date" v-model="eventData.data_inicio" required />
            </div>
            <div class="form-group">
              <label>Data de Fim</label><input type="date" v-model="eventData.data_fim" required />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Horário de Início</label
              ><input type="time" v-model="eventData.horario_inicio" required />
            </div>
            <div class="form-group">
              <label>Horário de Fim</label
              ><input type="time" v-model="eventData.horario_fim" required />
            </div>
          </div>
          <div class="form-group">
            <label for="endereco">Endereço</label>
            <input type="text" id="endereco" v-model="eventData.endereco" required />
          </div>
          <div class="form-group">
            <label for="foto">Alterar Foto de Capa (opcional)</label>
            <input type="file" id="foto" @change="handleFileUpload" accept="image/*" />
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-submit" :disabled="loading">
              {{ loading ? 'Salvando...' : 'Salvar Alterações' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '@/services/api'

const router = useRouter()
const route = useRoute() // Para pegar o ID da URL
const loading = ref(false)
const categories = ref([])

const eventData = reactive({
  nome: '',
  categoria: null, // Inicia como null
  descricao: '',
  data_inicio: '',
  data_fim: '',
  horario_inicio: '',
  horario_fim: '',
  endereco: '',
  foto: null,
})

// Busca as categorias para o dropdown
async function fetchCategories() {
  try {
    const response = await api.getCategories()
    categories.value = response.data
  } catch (error) {
    console.error('Erro ao buscar categorias:', error)
  }
}

// Busca os dados do evento existente para preencher o formulário
async function fetchEventData() {
  const eventId = route.params.id
  try {
    const response = await api.getEvent(eventId)
    const data = response.data
    // Preenche o formulário com os dados da API
    eventData.nome = data.nome
    eventData.categoria = data.categoria.id // Pega o ID da categoria
    eventData.descricao = data.descricao
    eventData.data_inicio = data.data_inicio
    eventData.data_fim = data.data_fim
    eventData.horario_inicio = data.horario_inicio
    eventData.horario_fim = data.horario_fim
    eventData.endereco = data.endereco
  } catch (error) {
    console.error('Erro ao buscar dados do evento:', error)
    router.push('/company-profile') // Se der erro, volta para o perfil
  }
}

function handleFileUpload(event) {
  eventData.foto = event.target.files[0]
}

async function submitEvent() {
  loading.value = true
  const eventId = route.params.id

  const formData = new FormData()
  Object.keys(eventData).forEach((key) => {
    // Só adiciona ao FormData se o campo não for nulo (para não apagar a foto existente sem querer)
    if (eventData[key] !== null) {
      formData.append(key, eventData[key])
    }
  })

  try {
    // Chama a nova função da API para ATUALIZAR
    await api.updateEvent(eventId, formData)
    router.push('/company-profile') // Redireciona de volta
  } catch (error) {
    console.error('Erro ao atualizar evento:', error)
  } finally {
    loading.value = false
  }
}

// Roda as funções quando a página é carregada
onMounted(async () => {
  await fetchCategories()
  await fetchEventData()
})
</script>

<style scoped>
/* Pode usar os mesmos estilos do CreateEvent.vue */
.create-event-page {
  background-color: #f8f9fa;
  padding: 3rem 1rem;
  min-height: 100vh;
}
.container {
  max-width: 800px;
  margin: 0 auto;
}
.form-container {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}
.title {
  text-align: center;
  font-size: 2.25rem;
  color: #1e4d8b;
  margin-bottom: 0.5rem;
}
.subtitle {
  text-align: center;
  color: #666;
  margin-bottom: 2.5rem;
}
.form-group {
  margin-bottom: 1.5rem;
}
.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}
.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;
}
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #1e4d8b;
  box-shadow: 0 0 0 3px rgba(30, 77, 139, 0.1);
}
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}
.form-actions {
  text-align: center;
  margin-top: 2.5rem;
}
.btn-submit {
  background: #1e4d8b;
  color: white;
  padding: 0.875rem 2.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}
.btn-submit:hover:not(:disabled) {
  background: #164080;
  transform: translateY(-2px);
}
.btn-submit:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
