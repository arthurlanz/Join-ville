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
            <button @click="createEvent" class="btn-create">
              <font-awesome-icon icon="plus" />
              Criar evento
            </button>
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
            :class="{ active: activeTab === 'company' }" 
            @click="activeTab = 'company'"
            class="tab-btn"
          >
            🏢 Empresa
          </button>
          <button 
            :class="{ active: activeTab === 'events' }" 
            @click="activeTab = 'events'"
            class="tab-btn"
          >
            📅 Meus Eventos
          </button>
          <button 
            :class="{ active: activeTab === 'analytics' }" 
            @click="activeTab = 'analytics'"
            class="tab-btn"
          >
            📊 Estatísticas
          </button>
          <button 
            :class="{ active: activeTab === 'settings' }" 
            @click="activeTab = 'settings'"
            class="tab-btn"
          >
            ⚙️ Configurações
          </button>
        </div>

        <!-- Aba Empresa -->
        <div v-if="activeTab === 'company'" class="tab-content">
          <div class="company-section">
            <h2>Informações da Empresa</h2>
            
            <form v-if="editMode" @submit.prevent="saveProfile" class="edit-form">
              <div class="form-row">
                <div class="form-group">
                  <label>Nome da empresa</label>
                  <input 
                    type="text" 
                    v-model="editData.name" 
                    required 
                  />
                </div>
                
                <div class="form-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    v-model="editData.email" 
                    required 
                  />
                </div>
              </div>
              
              <div class="form-row">
                <div class="form-group">
                  <label>CNPJ</label>
                  <input 
                    type="text" 
                    v-model="editData.cnpj" 
                    required 
                    disabled
                  />
                  <small>CNPJ não pode ser alterado</small>
                </div>
                
                <div class="form-group">
                  <label>Telefone</label>
                  <input 
                    type="text" 
                    v-model="editData.phone" 
                    placeholder="(47) 99999-9999"
                    @input="formatPhone"
                  />
                </div>
              </div>
              
              <div class="form-group">
                <label>Endereço</label>
                <input 
                  type="text" 
                  v-model="editData.address" 
                  placeholder="Endereço completo"
                />
              </div>
              
              <div class="form-group">
                <label>Descrição da empresa</label>
                <textarea 
                  v-model="editData.description" 
                  rows="4"
                  placeholder="Conte mais sobre sua empresa..."
                ></textarea>
              </div>
              
              <div class="form-group">
                <label>Website</label>
                <input 
                  type="url" 
                  v-model="editData.website" 
                  placeholder="https://www.suaempresa.com.br"
                />
              </div>
              
              <div class="form-actions">
                <button type="submit" class="btn-save" :disabled="saving">
                  {{ saving ? 'Salvando...' : 'Salvar alterações' }}
                </button>
                <button type="button" @click="cancelEdit" class="btn-cancel">
                  Cancelar
                </button>
              </div>
            </form>
            
            <div v-else class="company-info-display">
              <div class="info-grid">
                <div class="info-item">
                  <label>Nome da empresa</label>
                  <p>{{ companyProfile.name }}</p>
                </div>
                
                <div class="info-item">
                  <label>Email</label>
                  <p>{{ companyProfile.email }}</p>
                </div>
                
                <div class="info-item">
                  <label>CNPJ</label>
                  <p>{{ companyProfile.cnpj }}</p>
                </div>
                
                <div class="info-item">
                  <label>Telefone</label>
                  <p>{{ companyProfile.phone || 'Não informado' }}</p>
                </div>
              </div>
              
              <div class="description-section">
                <label>Descrição</label>
                <p class="description-text">
                  {{ companyProfile.description || 'Nenhuma descrição cadastrada.' }}
                </p>
              </div>
              
              <div class="contact-info" v-if="companyProfile.website || companyProfile.address">
                <div v-if="companyProfile.address" class="contact-item">
                  <strong>Endereço:</strong> {{ companyProfile.address }}
                </div>
                <div v-if="companyProfile.website" class="contact-item">
                  <strong>Website:</strong> 
                  <a :href="companyProfile.website" target="_blank">{{ companyProfile.website }}</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Aba Eventos -->
        <div v-if="activeTab === 'events'" class="tab-content">
          <div class="events-section">
            <div class="section-header">
              <h2>Meus Eventos</h2>
              <button @click="createEvent" class="btn-create-small">
                <font-awesome-icon icon="plus" />
                Criar novo evento
              </button>
            </div>
            
            <div class="events-filter">
              <select v-model="eventsFilter">
                <option value="all">Todos os eventos</option>
                <option value="active">Ativos</option>
                <option value="draft">Rascunhos</option>
                <option value="ended">Finalizados</option>
              </select>
            </div>
            
            <div v-if="filteredEvents.length" class="events-grid">
              <div v-for="event in filteredEvents" :key="event.id" class="event-card-company">
                <div class="event-image">
                  <img :src="event.image" :alt="event.title" />
                  <div :class="['event-status', event.status]">
                    {{ getStatusText(event.status) }}
                  </div>
                </div>
                <div class="event-info">
                  <h3>{{ event.title }}</h3>
                  <p class="event-date">📅 {{ formatDate(event.date) }}</p>
                  <p class="event-location">📍 {{ event.location }}</p>
                  <div class="event-metrics">
                    <span><font-awesome-icon icon="eye" /> {{ event.views }} visualizações</span>
                    <span><font-awesome-icon icon="users" /> {{ event.interested }} interessados</span>
                  </div>
                  <div class="event-actions">
                    <button @click="editEvent(event.id)" class="btn-edit-event">
                      <font-awesome-icon icon="edit" />
                      Editar
                    </button>
                    <button @click="viewEvent(event.id)" class="btn-view-event">
                      <font-awesome-icon icon="eye" />
                      Ver
                    </button>
                    <button @click="deleteEvent(event.id)" class="btn-delete-event">
                      <font-awesome-icon icon="trash" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-else class="empty-state">
              <h3>Nenhum evento encontrado</h3>
              <p>Você ainda não criou nenhum evento. Comece agora!</p>
              <button @click="createEvent" class="btn-create-first">
                <font-awesome-icon icon="plus" />
                Criar meu primeiro evento
              </button>
            </div>
          </div>
        </div>

        <!-- Aba Estatísticas -->
        <div v-if="activeTab === 'analytics'" class="tab-content">
          <div class="analytics-section">
            <h2>Estatísticas dos Eventos</h2>
            
            <div class="metrics-grid">
              <div class="metric-card">
                <div class="metric-icon">👥</div>
                <div class="metric-info">
                  <h3>{{ companyStats.totalViews }}</h3>
                  <p>Visualizações totais</p>
                </div>
              </div>
              
              <div class="metric-card">
                <div class="metric-icon">❤️</div>
                <div class="metric-info">
                  <h3>{{ companyStats.totalInterested }}</h3>
                  <p>Total de interessados</p>
                </div>
              </div>
              
              <div class="metric-card">
                <div class="metric-icon">📈</div>
                <div class="metric-info">
                  <h3>{{ companyStats.avgRating }}</h3>
                  <p>Avaliação média</p>
                </div>
              </div>
              
              <div class="metric-card">
                <div class="metric-icon">🎯</div>
                <div class="metric-info">
                  <h3>{{ companyStats.conversionRate }}%</h3>
                  <p>Taxa de interesse</p>
                </div>
              </div>
            </div>
            
            <div class="chart-placeholder">
              <h3>Desempenho dos Eventos</h3>
              <div class="chart-info">
                <p>📊 Gráficos e estatísticas detalhadas serão implementados aqui</p>
                <p>• Visualizações por período</p>
                <p>• Eventos mais populares</p>
                <p>• Análise de público-alvo</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Aba Configurações -->
        <div v-if="activeTab === 'settings'" class="tab-content">
          <div class="settings-section">
            <h2>Configurações</h2>
            
            <div class="setting-group">
              <h3>Notificações</h3>
              <div class="setting-item">
                <label class="switch">
                  <input type="checkbox" v-model="settings.emailNotifications">
                  <span class="slider"></span>
                </label>
                <div class="setting-text">
                  <strong>Notificações por email</strong>
                  <p>Receba atualizações sobre seus eventos</p>
                </div>
              </div>
              
              <div class="setting-item">
                <label class="switch">
                  <input type="checkbox" v-model="settings.eventReminders">
                  <span class="slider"></span>
                </label>
                <div class="setting-text">
                  <strong>Lembretes de eventos</strong>
                  <p>Receba lembretes antes dos seus eventos</p>
                </div>
              </div>
            </div>
            
            <div class="setting-group">
              <h3>Privacidade</h3>
              <div class="setting-item">
                <label class="switch">
                  <input type="checkbox" v-model="settings.publicProfile">
                  <span class="slider"></span>
                </label>
                <div class="setting-text">
                  <strong>Perfil público</strong>
                  <p>Permitir que outros usuários vejam informações da empresa</p>
                </div>
              </div>
            </div>
            
            <div class="setting-group danger-zone">
              <h3>Zona de Perigo</h3>
              <div class="danger-actions">
                <button class="btn-danger" @click="showDeleteModal = true">
                  Excluir conta da empresa
                </button>
                <p>Esta ação não pode ser desfeita. Todos os eventos serão removidos.</p>
              </div>
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

    <!-- Modal de exclusão de conta -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="showDeleteModal = false">
      <div class="modal" @click.stop>
        <h3>Excluir conta da empresa</h3>
        <p>Esta ação é irreversível. Todos os seus eventos serão removidos permanentemente.</p>
        <div class="modal-actions">
          <button @click="confirmDelete" class="btn-danger">Sim, excluir</button>
          <button @click="showDeleteModal = false" class="btn-cancel">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CompanyProfile',
  data() {
    return {
      activeTab: 'company',
      editMode: false,
      saving: false,
      showLogoutModal: false,
      showDeleteModal: false,
      eventsFilter: 'all',
      
      companyProfile: {
        name: 'Empresa Exemplo Ltda',
        email: 'contato@empresaexemplo.com.br',
        cnpj: '12.345.678/0001-90',
        phone: '(47) 3333-4444',
        address: 'Rua das Empresas, 123 - Centro, Joinville - SC',
        description: 'Somos uma empresa especializada em eventos corporativos e culturais em Joinville.',
        website: 'https://www.empresaexemplo.com.br',
        avatar: null
      },
      
      editData: {},
      
      companyStats: {
        totalEvents: 15,
        activeEvents: 8,
        totalViews: 12500,
        totalInterested: 850,
        avgRating: 4.7,
        conversionRate: 6.8
      },
      
      companyEvents: [
        {
          id: 1,
          title: 'Workshop de Marketing Digital',
          date: '2025-10-15',
          location: 'Centro de Convenções',
          image: '/gastronomia/festivalgastronomicobanner.jpg',
          status: 'active',
          views: 1250,
          interested: 85
        },
        {
          id: 2,
          title: 'Feira de Empreendedorismo',
          date: '2025-11-20',
          location: 'Expoville',
          image: '/classicosdejoinville/festivaldancabanner.jpeg',
          status: 'draft',
          views: 320,
          interested: 12
        },
        {
          id: 3,
          title: 'Conferência Tech Joinville',
          date: '2024-08-10',
          location: 'Centreventos Cau Hansen',
          image: '/festaseshows/matuebanner.png',
          status: 'ended',
          views: 3200,
          interested: 280
        }
      ],
      
      settings: {
        emailNotifications: true,
        eventReminders: true,
        publicProfile: true
      }
    }
  },
  
  computed: {
    filteredEvents() {
      if (this.eventsFilter === 'all') {
        return this.companyEvents
      }
      return this.companyEvents.filter(event => event.status === this.eventsFilter)
    }
  },
  
  created() {
    // Carregar dados da empresa do localStorage
    const userData = JSON.parse(localStorage.getItem('userData') || '{}')
    if (userData.name) {
      this.companyProfile.name = userData.name
      this.companyProfile.email = userData.email
    }
    const savedAvatar = localStorage.getItem('userAvatar')
    if (savedAvatar) {
      this.companyProfiler.avatar = savedAvatar
    }
    
    // Copia dados para edição
    this.editData = { ...this.companyProfile }
  },
  
  methods: {
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
          this.companyProfile.avatar = e.target.result
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
      
      // Redirecionar para home
      this.$router.push('/')
    },
    
    confirmDelete() {
      // TODO: Implementar exclusão da conta via API
      localStorage.removeItem('userToken')
      localStorage.removeItem('userType')
      localStorage.removeItem('userData')
      
      this.$router.push('/')
    },
    
    cancelEdit() {
      this.editMode = false
      this.editData = { ...this.companyProfile }
    },
    
    saveProfile() {
      this.saving = true
      
      // TODO: Integrar com API Django
      setTimeout(() => {
        this.companyProfile = { ...this.editData }
        
        // Atualizar localStorage
        const userData = JSON.parse(localStorage.getItem('userData') || '{}')
        userData.name = this.companyProfile.name
        userData.email = this.companyProfile.email
        localStorage.setItem('userData', JSON.stringify(userData))
        
        this.editMode = false
        this.saving = false
      }, 1000)
    },
    
    formatPhone(event) {
      let value = event.target.value.replace(/\D/g, '')
      value = value.replace(/^(\d{2})(\d)/, '($1) $2')
      value = value.replace(/(\d{4})(\d{4})$/, '$1-$2')
      this.editData.phone = value
    },
    
    formatDate(date) {
      if (!date) return ''
      return new Date(date).toLocaleDateString('pt-BR')
    },
    
    getStatusText(status) {
      const statusMap = {
        active: 'Ativo',
        draft: 'Rascunho',
        ended: 'Finalizado'
      }
      return statusMap[status] || status
    },
    
    createEvent() {
      // TODO: Implementar criação de evento
      alert('Funcionalidade de criação de eventos será implementada em breve!')
    },
    
    editEvent(eventId) {
      // TODO: Implementar edição de evento
      console.log('Editar evento:', eventId)
    },
    
    viewEvent(eventId) {
      this.$router.push(`/event/${eventId}`)
    },
    
    deleteEvent(eventId) {
      if (confirm('Tem certeza que deseja excluir este evento?')) {
        this.companyEvents = this.companyEvents.filter(event => event.id !== eventId)
        this.companyStats.totalEvents--
        if (this.companyEvents.find(e => e.id === eventId)?.status === 'active') {
          this.companyStats.activeEvents--
        }
      }
    }
  }
}
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