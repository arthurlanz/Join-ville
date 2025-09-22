<template>
  <div class="company-profile-page">
    <div class="profile-header">
      <div class="container">
        <div class="header-content">
          <div class="company-logo">
            <div class="logo-circle">
              <img v-if="companyProfile.avatar" :src="companyProfile.avatar" :alt="companyProfile.name" />
              <font-awesome-icon icon="building" v-else />
            </div>
            <input
              ref="avatarInput"
              type="file"
              accept="image/*"
              @change="handleAvatarChange"
              style="display: none"
            />
            <button @click="selectAvatar" class="change-logo-btn">Alterar foto</button>
          </div>

          <div class="company-info">
            <h1>{{ companyProfile.name }}</h1>
            <p>{{ companyProfile.cnpj }}</p>
            <p>{{ companyProfile.email }}</p>
            <div class="company-stats">
              <div class="stat">
                <strong>{{ companyStats.totalEvents }}</strong>
                <span>Eventos criados</span>
              </div>
              <div class="stat">
                <strong>{{ companyStats.activeEvents }}</strong>
                <span>Eventos ativos</span>
              </div>
              <div class="stat">
                <strong>{{ companyStats.totalViews }}</strong>
                <span>Visualizações</span>
              </div>
            </div>
          </div>

          <div class="profile-actions">
            <button @click="toggleEditMode" class="btn-edit">
              <font-awesome-icon icon="edit" />
              {{ editMode ? 'Cancelar' : 'Editar perfil' }}
            </button>
            <button @click="logout" class="btn-logout">
              <font-awesome-icon icon="sign-out-alt" />
              Sair
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="profile-content">
      <div class="container">
        <div class="profile-tabs">
          <button
            :class="{ active: activeTab === 'profile' }"
            @click="activeTab = 'profile'"
            class="tab-btn"
          >
            🏢 Perfil da Empresa
          </button>
          <button
            :class="{ active: activeTab === 'events' }"
            @click="activeTab = 'events'"
            class="tab-btn"
          >
            🎉 Meus Eventos
          </button>
        </div>
        <div v-if="activeTab === 'profile'" class="tab-content">
          <div class="profile-section">
            <h2>Informações da Empresa</h2>
            <form v-if="editMode" @submit.prevent="saveProfile" class="edit-form">
              <div class="form-row">
                <div class="form-group">
                  <label>Nome da Empresa</label>
                  <input type="text" v-model="editData.name" required />
                </div>
                <div class="form-group">
                  <label>Email de Contato</label>
                  <input type="email" v-model="editData.email" required disabled />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group">
                  <label>CNPJ</label>
                  <input
                    type="text"
                    v-model="editData.cnpj"
                    required
                    @input="formatCnpj"
                  />
                </div>
                <div class="form-group">
                  <label>Telefone</label>
                  <input
                    type="text"
                    v-model="editData.phone"
                    @input="formatPhone"
                  />
                </div>
              </div>
              <div class="form-group">
                <label>Descrição</label>
                <textarea v-model="editData.description" rows="4"></textarea>
              </div>
              <div class="form-actions">
                <button type="submit" class="btn-save" :disabled="saving">
                  {{ saving ? 'Salvando...' : 'Salvar alterações' }}
                </button>
                <button type="button" @click="toggleEditMode" class="btn-cancel">
                  Cancelar
                </button>
              </div>
            </form>
            <div v-else class="profile-info">
              <div class="info-grid">
                <div class="info-item">
                  <label>Nome da Empresa</label>
                  <p>{{ companyProfile.name }}</p>
                </div>
                <div class="info-item">
                  <label>Email de Contato</label>
                  <p>{{ companyProfile.email }}</p>
                </div>
                <div class="info-item">
                  <label>CNPJ</label>
                  <p>{{ companyProfile.cnpj || 'Não informado' }}</p>
                </div>
                <div class="info-item">
                  <label>Telefone</label>
                  <p>{{ companyProfile.phone || 'Não informado' }}</p>
                </div>
              </div>
              <div class="description-section">
                <label>Descrição</label>
                <p>{{ companyProfile.description || 'Nenhuma descrição informada.' }}</p>
              </div>
            </div>
          </div>
        </div>
        <div v-if="activeTab === 'events'" class="tab-content">
          <div class="events-section">
            <div class="section-header">
                <h2>Meus Eventos</h2>
                <button @click="navigateToCreateEvent" class="btn-create-event">Criar Novo Evento</button>
            </div>
            <div v-if="events.length" class="events-list">
              <div v-for="event in events" :key="event.id" class="event-item">
                <div class="event-thumbnail">
                  <img :src="event.image" :alt="event.title" />
                </div>
                <div class="event-details">
                  <h4>{{ event.title }}</h4>
                  <p>{{ formatDate(event.date) }} - {{ event.location }}</p>
                </div>
                <div class="event-actions">
                  <button @click="editEvent(event.id)" class="btn-edit-event">Editar</button>
                  <button @click="deleteEvent(event.id)" class="btn-delete-event">Excluir</button>
                </div>
              </div>
            </div>
            <div v-else class="empty-state">
              <p>Você ainda não criou nenhum evento.</p>
              <button @click="navigateToCreateEvent" class="btn-explore">Criar meu primeiro evento</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showLogoutModal" class="modal-overlay" @click="showLogoutModal = false">
      <div class="modal" @click.stop>
        <h3>Confirmar logout</h3>
        <p>Tem certeza que deseja sair da sua conta?</p>
        <div class="modal-actions">
          <button @click="confirmLogout" class="btn-confirm">Sim, sair</button>
          <button @click="showLogoutModal = false" class="btn-cancel">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import { useToastStore } from '@/stores/toast';

const router = useRouter();
const toastStore = useToastStore();

const avatarInput = ref(null);
const activeTab = ref('profile');
const editMode = ref(false);
const saving = ref(false);
const showLogoutModal = ref(false);
const newAvatarFile = ref(null);

const companyProfile = ref({
  id: null,
  name: '',
  email: '',
  cnpj: '',
  phone: '',
  description: '',
  avatar: null,
});

const editData = ref({});
const companyStats = ref({
  totalEvents: 0,
  activeEvents: 0,
  totalViews: 0,
});
const events = ref([]);

async function fetchCompany() {
  try {
    const res = await api.getCurrentUser(); // Reutiliza a mesma chamada de API
    const c = res.data;
    companyProfile.value = {
      id: c.id,
      name: c.nome_empresa || '',
      email: c.email,
      cnpj: c.cnpj || '',
      phone: c.telefone || '',
      description: c.descricao || '',
      avatar: c.avatar || null,
    };
    editData.value = { ...companyProfile.value };
  } catch (err) {
    console.error('Erro ao buscar dados da empresa:', err);
    toastStore.error('Erro ao carregar perfil da empresa.');
  }
}

async function fetchCompanyEvents() {
  try {
    // Esta API precisaria ser criada no seu backend.
    // Ex: uma rota /api/eventos/meus-eventos/ que filtra eventos pelo 'empresa' logado.
    const res = await api.getCompanyEvents();
    events.value = res.data;
    companyStats.value.totalEvents = events.value.length;
  } catch (err) {
    console.error('Erro ao buscar eventos da empresa:', err);
    // toastStore.error('Erro ao carregar eventos da empresa.');
  }
}

function selectAvatar() {
  avatarInput.value.click();
}

function handleAvatarChange(event) {
  const file = event.target.files[0];
  if (!file) return;
  newAvatarFile.value = file;
  const reader = new FileReader();
  reader.onload = (e) => {
    companyProfile.value.avatar = e.target.result;
  };
  reader.readAsDataURL(file);
}

function toggleEditMode() {
  editMode.value = !editMode.value;
  if (!editMode.value) {
    newAvatarFile.value = null;
    fetchCompany(); // Recarrega os dados originais do servidor
  }
}

async function saveProfile() {
  saving.value = true;
  const formData = new FormData();

  formData.append('nome_empresa', editData.value.name);
  formData.append('cnpj', (editData.value.cnpj || '').replace(/\D/g, ''));
  formData.append('telefone', editData.value.phone || '');
  formData.append('descricao', editData.value.description || '');

  if (newAvatarFile.value) {
    formData.append('avatar', newAvatarFile.value);
  }

  try {
    const res = await api.updateCurrentUser(formData);
    const c = res.data;
    companyProfile.value = {
      id: c.id,
      name: c.nome_empresa || '',
      email: c.email,
      cnpj: c.cnpj || '',
      phone: c.telefone || '',
      description: c.descricao || '',
      avatar: c.avatar || null,
    };
    editMode.value = false;
    newAvatarFile.value = null;
    toastStore.success('Perfil da empresa atualizado com sucesso!');
  } catch (err) {
    console.error('Erro ao salvar perfil da empresa:', err);
    toastStore.error('Erro ao salvar perfil da empresa.');
  } finally {
    saving.value = false;
  }
}

function logout() {
  showLogoutModal.value = true;
}

function confirmLogout() {
  localStorage.clear();
  router.push('/');
  toastStore.info('Logout realizado com sucesso.');
}

function formatCnpj(event) {
    let value = event.target.value.replace(/\D/g, '');
    value = value.substring(0, 14);
    value = value.replace(/^(\d{2})(\d)/, '$1.$2');
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
    value = value.replace(/(\d{4})(\d)/, '$1-$2');
    editData.value.cnpj = value;
}

function formatPhone(event) {
    let value = event.target.value.replace(/\D/g, '');
    value = value.substring(0, 11);
    if (value.length > 10) {
        value = value.replace(/^(\d\d)(\d{5})(\d{4}).*/, '($1) $2-$3');
    } else if (value.length > 5) {
        value = value.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, '($1) $2-$3');
    } else if (value.length > 2) {
        value = value.replace(/^(\d\d)(\d{0,5}).*/, '($1) $2');
    } else {
        value = value.replace(/^(\d*)/, '($1');
    }
    editData.value.phone = value;
}

function formatDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
}

function navigateToCreateEvent() {
  router.push('/create-event');
}

async function editEvent(eventId) {
  router.push(`/edit-event/${eventId}`);
}

async function deleteEvent(eventId) {
  if (confirm('Tem certeza que deseja excluir este evento?')) {
    try {
      await api.deleteEvent(eventId);
      events.value = events.value.filter(e => e.id !== eventId);
      toastStore.success('Evento excluído com sucesso!');
    } catch (err) {
      console.error('Erro ao excluir evento:', err);
      toastStore.error('Erro ao excluir evento.');
    }
  }
}

onMounted(async () => {
  await fetchCompany();
  await fetchCompanyEvents();
});
</script>


<style scoped>
.company-profile-page {
  min-height: 100vh;
  background: #f8f9fa;
}

.profile-header {
  background: linear-gradient(135deg, #1e4d8b 0%, #2d5aa0 100%);
  color: white;
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.company-logo {
  text-align: center;
}

.logo-circle {
  width: 100px;
  height: 100px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  margin-bottom: 1rem;
  overflow: hidden;
}
.logo-circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.change-logo-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}
.change-logo-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.company-info {
  flex: 1;
}

.company-info h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.company-info p {
  opacity: 0.9;
  margin-bottom: 0.5rem;
}

.company-stats {
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
}

.stat {
  text-align: center;
}

.stat strong {
  display: block;
  font-size: 1.5rem;
  margin-bottom: 0.2rem;
}

.stat span {
  font-size: 0.9rem;
  opacity: 0.9;
}

.profile-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.btn-create, .btn-edit, .btn-logout {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.btn-create:hover {
  background: rgba(40, 167, 69, 0.8);
}

.btn-edit:hover {
  background: rgba(255, 255, 255, 0.2);
}

.btn-logout:hover {
  background: rgba(220, 53, 69, 0.8);
}

.profile-content {
  padding: 2rem 0;
}

.profile-tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e9ecef;
}

.tab-btn {
  background: none;
  border: none;
  padding: 1rem 1.5rem;
  cursor: pointer;
  font-size: 1rem;
  color: #666;
  border-bottom: 3px solid transparent;
  transition: all 0.3s;
}

.tab-btn.active {
  color: #1e4d8b;
  border-bottom-color: #1e4d8b;
}

.tab-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
}

.company-section h2, .events-section h2, .analytics-section h2, .settings-section h2 {
  color: #1a1a1a;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

.form-group input, .form-group textarea, .form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
}

.form-group input:focus, .form-group textarea:focus {
  outline: none;
  border-color: #1e4d8b;
}

.form-group input:disabled {
  background: #f8f9fa;
  color: #6c757d;
}

.form-group small {
  display: block;
  margin-top: 0.25rem;
  color: #6c757d;
  font-size: 0.875rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-save, .btn-cancel {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
}

.btn-save {
  background: #1e4d8b;
  color: white;
  border: none;
}

.btn-cancel {
  background: transparent;
  color: #666;
  border: 1px solid #ccc;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.info-item label {
  display: block;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.info-item p {
  font-size: 1rem;
  color: #333;
  margin: 0;
}

.description-section {
  margin-bottom: 2rem;
}

.description-text {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 6px;
  line-height: 1.6;
  color: #333;
}

.contact-info {
  margin-top: 2rem;
}

.contact-item {
  margin-bottom: 0.5rem;
  color: #333;
}

.contact-item a {
  color: #1e4d8b;
  text-decoration: none;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.btn-create-small {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #28a745;
  color: white;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.events-filter {
  margin-bottom: 2rem;
}

.events-filter select {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.event-card-company {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.event-card-company:hover {
  transform: translateY(-4px);
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
}

.event-status {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.event-status.active {
  background: #28a745;
  color: white;
}

.event-status.draft {
  background: #ffc107;
  color: #212529;
}

.event-status.ended {
  background: #6c757d;
  color: white;
}

.event-info {
  padding: 1.5rem;
}

.event-info h3 {
  margin-bottom: 0.5rem;
  color: #1a1a1a;
}

.event-date, .event-location {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.event-metrics {
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
  font-size: 0.9rem;
  color: #666;
}

.event-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.btn-edit-event, .btn-view-event, .btn-delete-event {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-edit-event {
  background: #17a2b8;
  color: white;
}

.btn-view-event {
  background: #1e4d8b;
  color: white;
}

.btn-delete-event {
  background: #dc3545;
  color: white;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
}

.empty-state h3 {
  margin-bottom: 1rem;
  color: #1a1a1a;
}

.btn-create-first {
  background: #28a745;
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.metric-card {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.metric-icon {
  font-size: 3rem;
}

.metric-info h3 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #1a1a1a;
}

.metric-info p {
  color: #666;
  margin: 0;
}

.chart-placeholder {
  background: #f8f9fa;
  padding: 3rem;
  border-radius: 12px;
  text-align: center;
  margin-top: 2rem;
}

.chart-info {
  color: #666;
  line-height: 1.8;
}

.setting-group {
  margin-bottom: 3rem;
}

.setting-group h3 {
  color: #1a1a1a;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e9ecef;
}

.setting-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #1e4d8b;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.setting-text {
  flex: 1;
}

.setting-text strong {
  display: block;
  margin-bottom: 0.25rem;
  color: #1a1a1a;
}

.setting-text p {
  color: #666;
  margin: 0;
  font-size: 0.9rem;
}

.danger-zone {
  border: 2px solid #dc3545;
  border-radius: 8px;
  padding: 2rem;
  background: #fff5f5;
}

.danger-zone h3 {
  color: #dc3545;
}

.btn-danger {
  background: #dc3545;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 1rem;
}

.danger-actions p {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  max-width: 400px;
  width: 90%;
  text-align: center;
}

.modal h3 {
  margin-bottom: 1rem;
  color: #1a1a1a;
}

.modal p {
  margin-bottom: 2rem;
  color: #666;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-confirm {
  background: #dc3545;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
  }

  .profile-tabs {
    flex-direction: column;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .events-grid {
    grid-template-columns: 1fr;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .company-stats {
    justify-content: center;
  }
}
</style>
