<template>
  <div class="create-event-page">
    <div class="container">
      <div class="form-container">
        <h1 class="title">Criar Novo Evento</h1>
        <p class="subtitle">Preencha os detalhes abaixo para divulgar seu evento.</p>

        <form @submit.prevent="submitEvent">
          <div class="form-group">
            <label for="nome">Nome do Evento</label>
            <input type="text" id="nome" v-model="eventData.nome" required />
          </div>

          <div class="form-group">
            <label for="categoria">Categoria</label>
            <select id="categoria" v-model="eventData.categoria" required>
              <option disabled value="">Selecione uma categoria</option>
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
              <label for="data_inicio">Data de Início</label>
              <input type="date" id="data_inicio" v-model="eventData.data_inicio" required />
            </div>
            <div class="form-group">
              <label for="data_fim">Data de Fim</label>
              <input type="date" id="data_fim" v-model="eventData.data_fim" required />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="horario_inicio">Horário de Início</label>
              <input type="time" id="horario_inicio" v-model="eventData.horario_inicio" required />
            </div>
            <div class="form-group">
              <label for="horario_fim">Horário de Fim</label>
              <input type="time" id="horario_fim" v-model="eventData.horario_fim" required />
            </div>
          </div>

          <div class="form-group">
            <label for="endereco">Endereço</label>
            <input type="text" id="endereco" v-model="eventData.endereco" required />
          </div>

          <div class="form-group">
            <label for="foto">Foto de Capa</label>
            <input type="file" id="foto" @change="handleFileUpload" accept="image/*" />
          </div>

          <div class="form-actions">
            <button type="submit" class="btn-submit" :disabled="loading">
              {{ loading ? 'Publicando...' : 'Publicar Evento' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';

const router = useRouter();
const loading = ref(false);
const categories = ref([]);

const eventData = reactive({
  nome: '',
  categoria: '',
  descricao: '',
  data_inicio: '',
  data_fim: '',
  horario_inicio: '',
  horario_fim: '',
  endereco: '',
  foto: null,
});

async function fetchCategories() {
  try {
    const response = await api.getCategories();
    categories.value = response.data;
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
  }
}

function handleFileUpload(event) {
  eventData.foto = event.target.files[0];
}

async function submitEvent() {
  loading.value = true;

  const formData = new FormData();
  formData.append('nome', eventData.nome);
  formData.append('descricao', eventData.descricao);
  formData.append('endereco', eventData.endereco);
  formData.append('categoria', eventData.categoria);
  formData.append('data_inicio', eventData.data_inicio);
  formData.append('data_fim', eventData.data_fim);
  formData.append('horario_inicio', eventData.horario_inicio + ":00");
  formData.append('horario_fim', eventData.horario_fim + ":00");

  if (eventData.foto) formData.append('foto', eventData.foto);

  try {
    const response = await api.createEvent(formData);
    console.log("Evento criado:", response.data);
    router.push('/company-profile');
  } catch (error) {
    console.error("Erro ao criar evento:", error.response?.data || error.message);
    alert("Erro ao criar evento. Confira os dados.");
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchCategories();
});
</script>

<style scoped>
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
