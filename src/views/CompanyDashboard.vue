<template>
  <div class="company-dashboard">
    <!-- Sidebar de Navegação -->
    <aside class="dashboard-sidebar">
      <div class="sidebar-header">
        <div class="company-logo">
          <img v-if="companyData.avatar" :src="companyData.avatar" :alt="companyData.nome_empresa" />
          <font-awesome-icon v-else icon="building" />
        </div>
        <h2>{{ companyData.nome_empresa }}</h2>
        <p>Painel de Controle</p>
      </div>

      <nav class="sidebar-nav">
        <button
          v-for="item in navItems"
          :key="item.id"
          :class="['nav-item', { active: activeView === item.id }]"
          @click="activeView = item.id"
        >
          <font-awesome-icon :icon="item.icon" />
          <span>{{ item.label }}</span>
          <span v-if="item.badge" class="badge">{{ item.badge }}</span>
        </button>
      </nav>

      <div class="sidebar-footer">
        <button @click="logout" class="btn-logout-sidebar">
          <font-awesome-icon icon="sign-out-alt" />
          Sair
        </button>
      </div>
    </aside>

    <!-- Conteúdo Principal -->
    <main class="dashboard-content">
      <!-- Header -->
      <header class="dashboard-header">
        <div class="header-left">
          <button class="mobile-menu-btn" @click="showMobileSidebar = true">
            <font-awesome-icon icon="bars" />
          </button>
          <h1>{{ currentViewTitle }}</h1>
        </div>

        <div class="header-actions">
          <button class="btn-notifications" @click="showNotifications = !showNotifications">
            <font-awesome-icon icon="bell" />
            <span v-if="unreadNotifications > 0" class="notification-badge">{{ unreadNotifications }}</span>
          </button>

          <div class="user-menu">
            <div class="user-avatar" @click="showUserMenu = !showUserMenu">
              <img v-if="companyData.avatar" :src="companyData.avatar" />
              <font-awesome-icon v-else icon="user-circle" />
            </div>
          </div>
        </div>
      </header>

      <!-- View: Overview -->
      <div v-show="activeView === 'overview'" class="view-content">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon events">
              <font-awesome-icon icon="calendar-days" />
            </div>
            <div class="stat-info">
              <span class="stat-label">Eventos Ativos</span>
              <span class="stat-value">{{ stats.activeEvents }}</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon participants">
              <font-awesome-icon icon="users" />
            </div>
            <div class="stat-info">
              <span class="stat-label">Total de Participantes</span>
              <span class="stat-value">{{ stats.totalParticipants }}</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon followers">
              <font-awesome-icon icon="user-plus" />
            </div>
            <div class="stat-info">
              <span class="stat-label">Seguidores</span>
              <span class="stat-value">{{ stats.followers }}</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon rating">
              <font-awesome-icon icon="star" />
            </div>
            <div class="stat-info">
              <span class="stat-label">Avaliação Média</span>
              <span class="stat-value">{{ stats.avgRating }}</span>
            </div>
          </div>
        </div>

        <div class="content-row">
          <!-- Eventos Recentes -->
          <div class="dashboard-card recent-events">
            <div class="card-header">
              <h3>Eventos Recentes</h3>
              <router-link to="/criar-evento" class="btn-link">
                <font-awesome-icon icon="plus" /> Novo Evento
              </router-link>
            </div>
            <div class="events-list-compact">
              <div v-for="event in recentEvents" :key="event.id" class="event-item-compact">
                <div class="event-thumb">
                  <img :src="event.foto" :alt="event.nome" />
                </div>
                <div class="event-details-compact">
                  <h4>{{ event.nome }}</h4>
                  <p>{{ formatDate(event.data_inicio) }} • {{ event.endereco }}</p>
                </div>
                <div class="event-stats-compact">
                  <span class="participants">
                    <font-awesome-icon icon="users" />
                    {{ event.participants || 0 }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Atividades Recentes -->
          <div class="dashboard-card activities">
            <div class="card-header">
              <h3>Atividades Recentes</h3>
            </div>
            <div class="activity-list">
              <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
                <div class="activity-icon" :class="activity.type">
                  <font-awesome-icon :icon="activity.icon" />
                </div>
                <div class="activity-content">
                  <p>{{ activity.message }}</p>
                  <span class="activity-time">{{ formatTimeAgo(activity.time) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- View: Meus Eventos -->
      <div v-show="activeView === 'events'" class="view-content">
        <div class="toolbar">
          <div class="search-bar">
            <font-awesome-icon icon="search" />
            <input
              type="text"
              v-model="eventsSearch"
              placeholder="Buscar eventos..."
            />
          </div>

          <router-link to="/criar-evento" class="btn-primary">
            <font-awesome-icon icon="plus" />
            Criar Novo Evento
          </router-link>
        </div>

        <div class="events-table-container">
          <table class="events-table">
            <thead>
              <tr>
                <th>Evento</th>
                <th>Data</th>
                <th>Local</th>
                <th>Participantes</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="event in filteredEvents" :key="event.id">
                <td>
                  <div class="event-cell">
                    <img :src="event.foto" :alt="event.nome" class="event-thumbnail" />
                    <div>
                      <strong>{{ event.nome }}</strong>
                      <p>{{ event.categoria?.nome }}</p>
                    </div>
                  </div>
                </td>
                <td>{{ formatDate(event.data_inicio) }}</td>
                <td>{{ event.endereco }}</td>
                <td>
                  <span class="participants-count">
                    <font-awesome-icon icon="users" />
                    {{ event.participants || 0 }}
                  </span>
                </td>
                <td>
                  <span class="status-badge" :class="event.ativo ? 'active' : 'inactive'">
                    {{ event.ativo ? 'Ativo' : 'Inativo' }}
                  </span>
                </td>
                <td>
                  <div class="action-buttons">
                    <button class="btn-icon" @click="viewEvent(event.id)" title="Visualizar">
                      <font-awesome-icon icon="eye" />
                    </button>
                    <button class="btn-icon" @click="editEvent(event.id)" title="Editar">
                      <font-awesome-icon icon="edit" />
                    </button>
                    <button class="btn-icon danger" @click="confirmDelete(event.id)" title="Excluir">
                      <font-awesome-icon icon="trash" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- View: Mensagens -->
      <div v-show="activeView === 'messages'" class="view-content">
        <div class="messages-container">
          <div class="chat-list">
            <div class="chat-list-header">
              <h3>Conversas</h3>
              <button class="btn-icon">
                <font-awesome-icon icon="plus" />
              </button>
            </div>

            <div class="chat-items">
              <div
                v-for="chat in chatRooms"
                :key="chat.id"
                class="chat-item"
                :class="{ active: selectedChat === chat.id }"
                @click="selectChat(chat.id)"
              >
                <div class="chat-avatar">
                  <img v-if="chat.user.avatar" :src="chat.user.avatar" />
                  <font-awesome-icon v-else icon="user" />
                </div>
                <div class="chat-info">
                  <div class="chat-header-row">
                    <strong>{{ chat.user.name }}</strong>
                    <span class="chat-time">{{ formatTime(chat.lastMessage.time) }}</span>
                  </div>
                  <p class="chat-preview">{{ chat.lastMessage.text }}</p>
                </div>
                <span v-if="chat.unread" class="unread-badge">{{ chat.unread }}</span>
              </div>
            </div>
          </div>

          <div class="chat-window">
            <div v-if="selectedChat" class="chat-messages">
              <div class="chat-window-header">
                <div class="chat-user-info">
                  <div class="chat-avatar-small">
                    <img v-if="currentChat.user.avatar" :src="currentChat.user.avatar" />
                    <font-awesome-icon v-else icon="user" />
                  </div>
                  <div>
                    <strong>{{ currentChat.user.name }}</strong>
                    <p>{{ currentChat.user.status }}</p>
                  </div>
                </div>
                <button class="btn-icon" @click="router.push({ name: 'ChatRoom', params: { id: selectedChat } })">
                  <font-awesome-icon icon="expand" />
                </button>
              </div>

              <div class="messages-area">
                <div
                  v-for="message in currentMessages"
                  :key="message.id"
                  :class="['message-bubble', message.sender === 'me' ? 'sent' : 'received']"
                >
                  <p>{{ message.text }}</p>
                  <span class="message-time">{{ formatTime(message.time) }}</span>
                </div>
              </div>

              <div class="message-input-area">
                <input
                  type="text"
                  v-model="newMessage"
                  placeholder="Digite sua mensagem..."
                  @keyup.enter="sendMessage"
                />
                <button class="btn-send" @click="sendMessage">
                  <font-awesome-icon icon="paper-plane" />
                </button>
              </div>
            </div>

            <div v-else class="no-chat-selected">
              <font-awesome-icon icon="comments" size="3x" />
              <p>Selecione uma conversa</p>
            </div>
          </div>
        </div>
      </div>

      <!-- View: Configurações -->
      <div v-show="activeView === 'settings'" class="view-content">
        <div class="settings-container">
          <div class="settings-card">
            <h3>Informações da Empresa</h3>
            <form @submit.prevent="saveSettings" class="settings-form">
              <div class="form-row">
                <div class="form-group">
                  <label>Nome da Empresa</label>
                  <input type="text" v-model="settingsForm.nome_empresa" />
                </div>
                <div class="form-group">
                  <label>CNPJ</label>
                  <input type="text" v-model="settingsForm.cnpj" disabled />
                </div>
              </div>

              <div class="form-group">
                <label>Descrição</label>
                <textarea v-model="settingsForm.descricao" rows="4"></textarea>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Telefone</label>
                  <input type="text" v-model="settingsForm.telefone" />
                </div>
                <div class="form-group">
                  <label>Website</label>
                  <input type="url" v-model="settingsForm.website" />
                </div>
              </div>

              <div class="form-actions">
                <button type="submit" class="btn-primary">
                  <font-awesome-icon icon="save" />
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>

    <!-- Mobile Sidebar Overlay -->
    <div v-if="showMobileSidebar" class="mobile-sidebar-overlay" @click="showMobileSidebar = false">
      <aside class="dashboard-sidebar mobile" @click.stop>
        <button class="close-sidebar" @click="showMobileSidebar = false">
          <font-awesome-icon icon="times" />
        </button>
        <!-- Mesmo conteúdo da sidebar -->
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'
import { useToast } from 'vue-toastification'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const activeView = ref('overview')
const showMobileSidebar = ref(false)
const showNotifications = ref(false)
const showUserMenu = ref(false)
const eventsSearch = ref('')
const selectedChat = ref(null)
const newMessage = ref('')

const companyData = ref({
  id: null,
  nome_empresa: '',
  avatar: null,
  descricao: ''
})

const stats = ref({
  activeEvents: 0,
  totalParticipants: 0,
  followers: 0,
  avgRating: 0
})

const recentEvents = ref([])
const recentActivities = ref([])
const unreadNotifications = ref(0)
const chatRooms = ref([])

const navItems = [
  { id: 'overview', label: 'Visão Geral', icon: 'chart-line' },
  { id: 'events', label: 'Meus Eventos', icon: 'calendar-days' },
  { id: 'messages', label: 'Mensagens', icon: 'comment-dots', badge: 3 },
  { id: 'settings', label: 'Configurações', icon: 'cog' }
]

const settingsForm = ref({
  nome_empresa: '',
  cnpj: '',
  descricao: '',
  telefone: '',
  website: ''
})

const currentViewTitle = computed(() => {
  const item = navItems.find(i => i.id === activeView.value)
  return item ? item.label : ''
})

const filteredEvents = computed(() => {
  if (!eventsSearch.value) return recentEvents.value

  const search = eventsSearch.value.toLowerCase()
  return recentEvents.value.filter(event =>
    event.nome.toLowerCase().includes(search) ||
    event.endereco.toLowerCase().includes(search)
  )
})

const currentChat = computed(() => {
  return chatRooms.value.find(chat => chat.id === selectedChat.value) || {}
})

const currentMessages = computed(() => {
  // Mock de mensagens
  return [
    { id: 1, sender: 'user', text: 'Olá! Gostaria de mais informações sobre o evento', time: '10:30' },
    { id: 2, sender: 'me', text: 'Olá! Claro, em que posso ajudar?', time: '10:32' },
  ]
})

onMounted(async () => {
  await loadCompanyData()
  await loadDashboardStats()
  loadRecentEvents()
  loadRecentActivities()
  loadChatRooms()
})

const loadCompanyData = async () => {
  try {
    const response = await api.getCurrentUser()
    companyData.value = response.data
    settingsForm.value = {
      nome_empresa: response.data.nome_empresa || '',
      cnpj: response.data.cnpj || '',
      descricao: response.data.descricao || '',
      telefone: response.data.telefone || '',
      website: response.data.website || ''
    }
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
  }
}

const loadDashboardStats = async () => {
  try {
    const response = await api.getDashboardAnalytics()
    stats.value = {
      activeEvents: response.data.active_events,
      totalParticipants: response.data.total_participants,
      followers: response.data.total_followers,
      avgRating: response.data.avg_rating.toFixed(1)
    }

    // Carrega atividades recentes
    recentActivities.value = response.data.recent_activities
  } catch (error) {
    console.error('Erro ao carregar estatísticas:', error)
  }
}

const loadRecentEvents = async () => {
  try {
    const response = await api.getCompanyEvents()
    recentEvents.value = response.data
  } catch (error) {
    console.error('Erro ao carregar eventos:', error)
  }
}

const loadRecentActivities = () => {
  recentActivities.value = [
    {
      id: 1,
      type: 'join',
      icon: 'user-plus',
      message: 'João Silva se inscreveu no evento "Festival de Música"',
      time: '2025-01-08T10:30:00'
    },
    {
      id: 2,
      type: 'review',
      icon: 'star',
      message: 'Maria Santos avaliou seu evento com 5 estrelas',
      time: '2025-01-08T09:15:00'
    },
    {
      id: 3,
      type: 'message',
      icon: 'comment',
      message: 'Nova mensagem de Pedro Costa',
      time: '2025-01-07T18:45:00'
    }
  ]
}

const loadChatRooms = () => {
  chatRooms.value = [
    {
      id: 1,
      user: { name: 'João Silva', avatar: null, status: 'Online' },
      lastMessage: { text: 'Obrigado pelas informações!', time: '10:45' },
      unread: 2
    },
    {
      id: 2,
      user: { name: 'Maria Santos', avatar: null, status: 'Offline' },
      lastMessage: { text: 'Qual o horário do evento?', time: '09:30' },
      unread: 1
    }
  ]
}

const selectChat = (chatId) => {
  selectedChat.value = chatId
}

const sendMessage = () => {
  if (!newMessage.value.trim()) return

  // Aqui você implementaria o envio real
  toast.success('Mensagem enviada!')
  newMessage.value = ''
}

const viewEvent = (eventId) => {
  router.push({ name: 'EventDetails', params: { id: eventId } })
}

const editEvent = (eventId) => {
  router.push({ name: 'EditEvent', params: { id: eventId } })
}

const confirmDelete = (eventId) => {
  if (confirm('Tem certeza que deseja excluir este evento?')) {
    deleteEvent(eventId)
  }
}

const deleteEvent = async (eventId) => {
  try {
    await api.deleteEvent(eventId)
    recentEvents.value = recentEvents.value.filter(e => e.id !== eventId)
    toast.success('Evento excluído com sucesso!')
  } catch (error) {
    toast.error('Erro ao excluir evento')
  }
}

const saveSettings = async () => {
  try {
    await api.updateUser(settingsForm.value)
    toast.success('Configurações salvas com sucesso!')
  } catch (error) {
    toast.error('Erro ao salvar configurações')
  }
}

const logout = () => {
  authStore.logout()
  router.push('/')
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('pt-BR')
}

const formatTime = (timeStr) => {
  if (!timeStr) return ''
  return timeStr
}

const formatTimeAgo = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diff = Math.floor((now - date) / 1000)

  if (diff < 60) return 'Agora'
  if (diff < 3600) return `${Math.floor(diff / 60)}m atrás`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h atrás`
  return `${Math.floor(diff / 86400)}d atrás`
}
</script>

<style scoped>
.company-dashboard {
  display: flex;
  min-height: 100vh;
  background: #f5f7fa;
}

/* Sidebar */
.dashboard-sidebar {
  width: 280px;
  background: #1a1f36;
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  overflow-y: auto;
  z-index: 100;
}

.sidebar-header {
  padding: 2rem;
  text-align: center;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.company-logo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  overflow: hidden;
}

.company-logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.company-logo svg {
  font-size: 2rem;
  color: #0066cc;
}

.sidebar-header h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.2rem;
}

.sidebar-header p {
  margin: 0;
  color: rgba(255,255,255,0.6);
  font-size: 0.9rem;
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
}

.nav-item {
  width: 100%;
  background: none;
  border: none;
  color: rgba(255,255,255,0.7);
  padding: 1rem 2rem;
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s;
  position: relative;
}

.nav-item:hover {
  background: rgba(255,255,255,0.05);
  color: white;
}

.nav-item.active {
  background: rgba(0,102,204,0.15);
  color: #0066cc;
  border-left: 3px solid #0066cc;
}

.nav-item svg {
  width: 20px;
  height: 20px;
}

.nav-item .badge {
  margin-left: auto;
  background: #dc3545;
  color: white;
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 600;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.btn-logout-sidebar {
  width: 100%;
  background: rgba(220,53,69,0.2);
  color: #dc3545;
  border: 1px solid rgba(220,53,69,0.3);
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-logout-sidebar:hover {
  background: #dc3545;
  color: white;
}

/* Main Content */
.dashboard-content {
  margin-left: 280px;
  flex: 1;
  min-height: 100vh;
}

.dashboard-header {
  background: white;
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  position: sticky;
  top: 0;
  z-index: 50;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #333;
}

.dashboard-header h1 {
  margin: 0;
  font-size: 1.75rem;
  color: #1a1f36;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-notifications {
  position: relative;
  background: none;
  border: none;
  font-size: 1.3rem;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
}

.notification-badge {
  position: absolute;
  top: 0;
  right: 0;
  background: #dc3545;
  color: white;
  border-radius: 10px;
  padding: 0.15rem 0.4rem;
  font-size: 0.7rem;
  font-weight: 600;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  background: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-avatar svg {
  font-size: 1.5rem;
  color: #666;
}

/* View Content */
.view-content {
  padding: 2rem;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  color: white;
}

.stat-icon.events { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.stat-icon.participants { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.stat-icon.followers { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.stat-icon.rating { background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); }

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  color: #666;
  font-size: 0.9rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1f36;
}

/* Content Row */
.content-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
}

.dashboard-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.card-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #1a1f36;
}

.btn-link {
  color: #0066cc;
  text-decoration: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.btn-link:hover {
  text-decoration: underline;
}

/* Events List Compact */
.events-list-compact {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.event-item-compact {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  transition: all 0.3s;
  cursor: pointer;
}

.event-item-compact:hover {
  background: #e9ecef;
}

.event-thumb {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.event-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.event-details-compact {
  flex: 1;
}

.event-details-compact h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  color: #1a1f36;
}

.event-details-compact p {
  margin: 0;
  font-size: 0.85rem;
  color: #666;
}

.event-stats-compact {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

/* Activities */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  gap: 1rem;
  align-items: start;
}

.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: white;
}

.activity-icon.join { background: #28a745; }
.activity-icon.review { background: #ffa500; }
.activity-icon.message { background: #0066cc; }

.activity-content p {
  margin: 0 0 0.25rem 0;
  color: #333;
  font-size: 0.9rem;
}

.activity-time {
  color: #999;
  font-size: 0.8rem;
}

/* Toolbar */
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.search-bar {
  flex: 1;
  max-width: 400px;
  position: relative;
  display: flex;
  align-items: center;
}

.search-bar svg {
  position: absolute;
  left: 1rem;
  color: #999;
}

.search-bar input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
}

.search-bar input:focus {
  outline: none;
  border-color: #0066cc;
}

.btn-primary {
  background: #0066cc;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  transition: all 0.3s;
}

.btn-primary:hover {
  background: #0052a3;
  transform: translateY(-2px);
}

/* Events Table */
.events-table-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.events-table {
  width: 100%;
  border-collapse: collapse;
}

.events-table thead {
  background: #f8f9fa;
}

.events-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #666;
  font-size: 0.9rem;
  border-bottom: 2px solid #e9ecef;
}

.events-table td {
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.event-cell {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.event-thumbnail {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  object-fit: cover;
}

.event-cell strong {
  display: block;
  margin-bottom: 0.25rem;
  color: #1a1f36;
}

.event-cell p {
  margin: 0;
  color: #999;
  font-size: 0.85rem;
}

.participants-count {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
}

.status-badge {
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.status-badge.active {
  background: #d4edda;
  color: #155724;
}

.status-badge.inactive {
  background: #f8d7da;
  color: #721c24;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  background: none;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  color: #666;
}

.btn-icon:hover {
  background: #f8f9fa;
  color: #0066cc;
}

.btn-icon.danger:hover {
  background: #f8d7da;
  color: #dc3545;
}

/* Messages */
.messages-container {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 1.5rem;
  height: calc(100vh - 180px);
}

.chat-list,
.chat-window {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
}

.chat-list-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-list-header h3 {
  margin: 0;
  font-size: 1.25rem;
}

.chat-items {
  flex: 1;
  overflow-y: auto;
}

.chat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.chat-item:hover,
.chat-item.active {
  background: #f8f9fa;
}

.chat-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  background: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.chat-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.chat-avatar svg {
  font-size: 1.5rem;
  color: #999;
}

.chat-info {
  flex: 1;
  min-width: 0;
}

.chat-header-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.25rem;
}

.chat-header-row strong {
  color: #1a1f36;
}

.chat-time {
  color: #999;
  font-size: 0.8rem;
}

.chat-preview {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.unread-badge {
  position: absolute;
  right: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: #0066cc;
  color: white;
  border-radius: 10px;
  padding: 0.2rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.chat-window {
  position: relative;
}

.chat-window-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.chat-avatar-small {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  overflow: hidden;
  background: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat-avatar-small img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.chat-avatar-small svg {
  font-size: 1.25rem;
  color: #999;
}

.chat-user-info strong {
  display: block;
  color: #1a1f36;
}

.chat-user-info p {
  margin: 0;
  font-size: 0.85rem;
  color: #28a745;
}

.messages-area {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.message-bubble {
  max-width: 70%;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  position: relative;
}

.message-bubble.sent {
  align-self: flex-end;
  background: #0066cc;
  color: white;
}

.message-bubble.received {
  align-self: flex-start;
  background: #f8f9fa;
  color: #333;
}

.message-bubble p {
  margin: 0 0 0.25rem 0;
}

.message-time {
  font-size: 0.75rem;
  opacity: 0.7;
}

.message-input-area {
  padding: 1.5rem;
  border-top: 1px solid #e9ecef;
  display: flex;
  gap: 1rem;
}

.message-input-area input {
  flex: 1;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
}

.message-input-area input:focus {
  outline: none;
  border-color: #0066cc;
}

.btn-send {
  background: #0066cc;
  color: white;
  border: none;
  width: 45px;
  height: 45px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.btn-send:hover {
  background: #0052a3;
}

.no-chat-selected {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
  gap: 1rem;
}

/* Settings */
.settings-container {
  max-width: 800px;
}

.settings-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.settings-card h3 {
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  color: #1a1f36;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.settings-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #555;
}

.form-group input,
.form-group textarea {
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #0066cc;
}

.form-group input:disabled {
  background: #f8f9fa;
  color: #999;
  cursor: not-allowed;
}

.form-group textarea {
  resize: vertical;
  font-family: inherit;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

/* Responsive */
@media (max-width: 1200px) {
  .content-row {
    grid-template-columns: 1fr;
  }

  .messages-container {
    grid-template-columns: 1fr;
  }

  .chat-list {
    display: none;
  }
}

@media (max-width: 768px) {
  .dashboard-sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s;
  }

  .dashboard-sidebar.mobile {
    transform: translateX(0);
  }

  .dashboard-content {
    margin-left: 0;
  }

  .mobile-menu-btn {
    display: block;
  }

  .dashboard-header h1 {
    font-size: 1.25rem;
  }

  .view-content {
    padding: 1rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .toolbar {
    flex-direction: column;
  }

  .search-bar {
    max-width: none;
  }

  .events-table-container {
    overflow-x: auto;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}

.mobile-sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 999;
}

.close-sidebar {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
}
</style>
