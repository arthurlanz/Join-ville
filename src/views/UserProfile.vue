<template>
  <div class="profile-page">
    <div class="profile-header">
      <div class="container">
        <div class="header-content">
          <div class="user-avatar">
            <div class="avatar-circle">
              <img v-if="userProfile.avatar" :src="userProfile.avatar" :alt="userProfile.name" />
              <font-awesome-icon v-else icon="user" />
            </div>
            <input 
              ref="avatarInput" 
              type="file" 
              accept="image/*" 
              @change="handleAvatarChange" 
              style="display: none"
            />
            <button @click="selectAvatar" class="change-avatar-btn">Alterar foto</button>
          </div>

          <div class="user-info">
            <h1>{{ userProfile.name }}</h1>
            <p>{{ userProfile.email }}</p>
            <div class="user-stats">
              <div class="stat">
                <strong>{{ userStats.favoritedEvents }}</strong>
                <span>Eventos favoritados</span>
              </div>
              <div class="stat">
                <strong>{{ userStats.attendedEvents }}</strong>
                <span>Eventos participados</span>
              </div>
            </div>
          </div>

          <div class="profile-actions">
            <button @click="editMode = !editMode" class="btn-edit">
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
            👤 Meu Perfil
          </button>
          <button
            :class="{ active: activeTab === 'favorites' }"
            @click="activeTab = 'favorites'"
            class="tab-btn"
          >
            ❤️ Favoritos
          </button>
          <button
            :class="{ active: activeTab === 'history' }"
            @click="activeTab = 'history'"
            class="tab-btn"
          >
            📅 Histórico
          </button>
        </div>

        <!-- Aba Perfil -->
        <div v-if="activeTab === 'profile'" class="tab-content">
          <div class="profile-section">
            <h2>Informações Pessoais</h2>

            <form v-if="editMode" @submit.prevent="saveProfile" class="edit-form">
              <div class="form-row">
                <div class="form-group">
                  <label>Nome completo</label>
                  <input type="text" v-model="editData.name" required />
                </div>

                <div class="form-group">
                  <label>Email</label>
                  <input type="email" v-model="editData.email" required />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Telefone</label>
                  <input
                    type="text"
                    v-model="editData.phone"
                    placeholder="(47) 99999-9999"
                    @input="formatPhone"
                  />
                </div>

                <div class="form-group">
                  <label>Data de nascimento</label>
                  <input type="date" v-model="editData.birthDate" />
                </div>
              </div>

              <div class="form-group">
                <label>Interesses</label>
                <div class="interests-grid">
                  <label
                    v-for="interest in availableInterests"
                    :key="interest"
                    class="interest-checkbox"
                  >
                    <input type="checkbox" :value="interest" v-model="editData.interests" />
                    <span>{{ interest }}</span>
                  </label>
                </div>
              </div>

              <div class="form-actions">
                <button type="submit" class="btn-save" :disabled="saving">
                  {{ saving ? 'Salvando...' : 'Salvar alterações' }}
                </button>
                <button type="button" @click="cancelEdit" class="btn-cancel">Cancelar</button>
              </div>
            </form>

            <div v-else class="profile-info">
              <div class="info-grid">
                <div class="info-item">
                  <label>Nome completo</label>
                  <p>{{ userProfile.name }}</p>
                </div>

                <div class="info-item">
                  <label>Email</label>
                  <p>{{ userProfile.email }}</p>
                </div>

                <div class="info-item">
                  <label>Telefone</label>
                  <p>{{ userProfile.phone || 'Não informado' }}</p>
                </div>

                <div class="info-item">
                  <label>Data de nascimento</label>
                  <p>{{ formatDate(userProfile.birthDate) || 'Não informado' }}</p>
                </div>
              </div>

              <div class="interests-section">
                <label>Interesses</label>
                <div class="interests-tags">
                  <span
                    v-for="interest in userProfile.interests"
                    :key="interest"
                    class="interest-tag"
                  >
                    {{ interest }}
                  </span>
                  <span v-if="!userProfile.interests.length" class="no-interests">
                    Nenhum interesse cadastrado
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Aba Favoritos -->
        <div v-if="activeTab === 'favorites'" class="tab-content">
          <div class="favorites-section">
            <h2>Eventos Favoritados</h2>

            <div v-if="favoriteEvents.length" class="events-grid">
              <div v-for="event in favoriteEvents" :key="event.id" class="event-card">
                <div class="event-image" @click="viewEvent(event.id)">
                  <img :src="event.image" :alt="event.title" />
                </div>
                <div class="event-info">
                  <h3 @click="viewEvent(event.id)">{{ event.title }}</h3>
                  <p class="event-date">📅 {{ formatDate(event.date) }}</p>
                  <p class="event-location">📍 {{ event.location }}</p>
                  <div class="event-actions">
                    <button @click="viewEvent(event.id)" class="btn-view">
                      <font-awesome-icon icon="eye" />
                      Ver evento
                    </button>
                    <button @click="removeFromFavorites(event.id)" class="btn-remove">
                      ❤️ Remover
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="empty-state">
              <p>Você ainda não favoritou nenhum evento.</p>
              <button @click="$router.push('/')" class="btn-explore">Explorar eventos</button>
            </div>
          </div>
        </div>

        <!-- Aba Histórico -->
        <div v-if="activeTab === 'history'" class="tab-content">
          <div class="history-section">
            <h2>Histórico de Eventos</h2>

            <div class="filter-options">
              <select v-model="historyFilter">
                <option value="all">Todos os eventos</option>
                <option value="attended">Participei</option>
                <option value="interested">Interesse marcado</option>
              </select>
            </div>

            <div v-if="filteredHistory.length" class="history-list">
              <div v-for="event in filteredHistory" :key="event.id" class="history-item">
                <div class="event-thumbnail">
                  <img :src="event.image" :alt="event.title" />
                </div>
                <div class="event-details">
                  <h4>{{ event.title }}</h4>
                  <p>{{ formatDate(event.date) }} - {{ event.location }}</p>
                  <span :class="['status', event.status]">{{ getStatusText(event.status) }}</span>
                </div>
                <div class="history-actions">
                  <button @click="viewEvent(event.id)" class="btn-view-small">Ver</button>
                </div>
              </div>
            </div>

            <div v-else class="empty-state">
              <p>Nenhum evento encontrado no histórico.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de confirmação de logout -->
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

<script>
export default {
  name: 'UserProfile',
  data() {
    return {
      activeTab: 'profile',
      editMode: false,
      saving: false,
      showLogoutModal: false,
      historyFilter: 'all',

      userProfile: {
        name: 'João Silva',
        email: 'joao@email.com',
        phone: '(47) 99999-9999',
        birthDate: '1990-05-15',
        interests: ['Música', 'Tecnologia', 'Esportes'],
        avatar: null
      },

      editData: {},

      userStats: {
        favoritedEvents: 12,
        attendedEvents: 8,
      },

      availableInterests: [
        'Música',
        'Tecnologia',
        'Esportes',
        'Arte',
        'Gastronomia',
        'Negócios',
        'Educação',
        'Saúde',
        'Cultura',
        'Entretenimento',
      ],

      favoriteEvents: [
        {
          id: 1,
          title: 'Festival de Inverno de Joinville',
          date: '2025-07-15',
          location: 'Centro de Joinville',
          image: '/classicosdejoinville/festivaldancabanner.jpeg',
        },
        {
          id: 2,
          title: 'Tech Conference 2025',
          date: '2025-08-20',
          location: 'Centreventos Cau Hansen',
          image: '/gastronomia/festivalgastronomicobanner.jpg',
        },
      ],

      eventHistory: [
        {
          id: 1,
          title: 'Festival de Inverno de Joinville',
          date: '2025-07-15',
          location: 'Centro de Joinville',
          image: '/classicosdejoinville/festivaldancabanner.jpeg',
          status: 'interested',
        },
        {
          id: 3,
          title: 'Expo Joinville 2024',
          date: '2024-10-10',
          location: 'Expoville',
          image: '/gastronomia/festivalgastronomicobanner.jpg',
          status: 'attended',
        },
      ],
    }
  },

  computed: {
    filteredHistory() {
      if (this.historyFilter === 'all') {
        return this.eventHistory
      }
      return this.eventHistory.filter((event) => event.status === this.historyFilter)
    },
  },

  created() {
    // Carregar dados do usuário do localStorage
    const userData = JSON.parse(localStorage.getItem('userData') || '{}')
    if (userData.name) {
      this.userProfile.name = userData.name
      this.userProfile.email = userData.email
    }

    // Carregar avatar do localStorage se existir
    const savedAvatar = localStorage.getItem('userAvatar')
    if (savedAvatar) {
      this.userProfile.avatar = savedAvatar
    }

    // Copia dados para edição
    this.editData = { ...this.userProfile }

    // Carrega estatísticas dos favoritos
    this.loadUserStats()
  },

  methods: {
    loadUserStats() {
      const favorites = JSON.parse(localStorage.getItem('favoriteEvents') || '[]')
      this.userStats.favoritedEvents = favorites.length
    },

    selectAvatar() {
      this.$refs.avatarInput.click()
    },

    handleAvatarChange(event) {
      const file = event.target.files[0]
      if (file) {
        // Validar tipo de arquivo
        if (!file.type.startsWith('image/')) {
          alert('Por favor, selecione apenas arquivos de imagem.')
          return
        }

        // Validar tamanho do arquivo (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert('A imagem deve ter no máximo 5MB.')
          return
        }

        // Ler o arquivo e converter para base64
        const reader = new FileReader()
        reader.onload = (e) => {
          this.userProfile.avatar = e.target.result
          // Salvar no localStorage
          localStorage.setItem('userAvatar', e.target.result)
          
          // Mostrar mensagem de sucesso
          alert('Foto alterada com sucesso!')
        }
        reader.onerror = () => {
          alert('Erro ao carregar a imagem. Tente novamente.')
        }
        reader.readAsDataURL(file)
      }
    },

    logout() {
      this.showLogoutModal = true
    },

    confirmLogout() {
      // Limpar dados de autenticação
      localStorage.removeItem('userToken')
      localStorage.removeItem('userType')
      localStorage.removeItem('userData')
      localStorage.removeItem('userAvatar')

      // Redirecionar para home
      this.$router.push('/')
    },

    cancelEdit() {
      this.editMode = false
      this.editData = { ...this.userProfile }
    },

    saveProfile() {
      this.saving = true

      // TODO: Integrar com API Django
      setTimeout(() => {
        this.userProfile = { ...this.editData }

        // Atualizar localStorage
        const userData = JSON.parse(localStorage.getItem('userData') || '{}')
        userData.name = this.userProfile.name
        userData.email = this.userProfile.email
        localStorage.setItem('userData', JSON.stringify(userData))

        this.editMode = false
        this.saving = false
        alert('Perfil atualizado com sucesso!')
      }, 1000)
    },

    formatPhone(event) {
      let value = event.target.value.replace(/\D/g, '')
      value = value.replace(/^(\d{2})(\d)/, '($1) $2')
      value = value.replace(/(\d{5})(\d{4})$/, '$1-$2')
      this.editData.phone = value
    },

    formatDate(date) {
      if (!date) return ''
      return new Date(date).toLocaleDateString('pt-BR')
    },

    getStatusText(status) {
      const statusMap = {
        attended: 'Participei',
        interested: 'Interesse marcado',
        cancelled: 'Cancelado',
      }
      return statusMap[status] || status
    },

    viewEvent(eventId) {
      this.$router.push(`/event/${eventId}`)
    },

    removeFromFavorites(eventId) {
      // Remover do localStorage
      let favorites = JSON.parse(localStorage.getItem('favoriteEvents') || '[]')
      favorites = favorites.filter((id) => id !== eventId)
      localStorage.setItem('favoriteEvents', JSON.stringify(favorites))

      // Remover da lista local
      this.favoriteEvents = this.favoriteEvents.filter((event) => event.id !== eventId)
      this.userStats.favoritedEvents--
    },
  },
}
</script>

<style scoped>
.profile-page {
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

.user-avatar {
  text-align: center;
}

.avatar-circle {
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

.avatar-circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.change-avatar-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.change-avatar-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.user-info {
  flex: 1;
}

.user-info h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.user-info p {
  opacity: 0.9;
  margin-bottom: 1rem;
}

.user-stats {
  display: flex;
  gap: 2rem;
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

.btn-edit,
.btn-logout {
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
  overflow-x: auto;
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
  white-space: nowrap;
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

.profile-section h2 {
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

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #1e4d8b;
}

.interests-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.5rem;
}

.interest-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-save {
  background: #1e4d8b;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-cancel {
  background: transparent;
  color: #666;
  padding: 0.75rem 1.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
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

.interests-section {
  margin-top: 2rem;
}

.interests-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.interest-tag {
  background: #e3f2fd;
  color: #1565c0;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.event-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.event-card:hover {
  transform: translateY(-4px);
}

.event-image {
  height: 180px;
  overflow: hidden;
  cursor: pointer;
}

.event-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.event-info {
  padding: 1.5rem;
}

.event-info h3 {
  margin-bottom: 0.5rem;
  cursor: pointer;
  color: #1a1a1a;
}

.event-date,
.event-location {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.event-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.btn-view,
.btn-remove {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-view {
  background: #1e4d8b;
  color: white;
}

.btn-remove {
  background: #f8f9fa;
  color: #dc3545;
  border: 1px solid #dc3545;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.btn-explore {
  background: #1e4d8b;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 1rem;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.event-thumbnail {
  width: 80px;
  height: 60px;
  border-radius: 6px;
  overflow: hidden;
}

.event-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.event-details {
  flex: 1;
}

.event-details h4 {
  margin-bottom: 0.5rem;
  color: #1a1a1a;
}

.event-details p {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.status {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status.attended {
  background: #d4edda;
  color: #155724;
}

.status.interested {
  background: #cce5ff;
  color: #0066cc;
}

.btn-view-small {
  background: #1e4d8b;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.filter-options {
  margin-bottom: 1.5rem;
}

.filter-options select {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
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
}
</style>
