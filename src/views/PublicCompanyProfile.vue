<template>
  <div class="public-company-profile">
    <!-- Header com Cover -->
    <div class="company-header">
      <div class="cover-image" :style="{ backgroundImage: `url(${company.cover || '/default-cover.jpg'})` }">
        <div class="cover-overlay"></div>
      </div>

      <div class="company-info-header">
        <div class="container">
          <div class="header-content">
            <div class="company-avatar-section">
              <div class="company-avatar-large">
                <img v-if="company.avatar" :src="company.avatar" :alt="company.nome_empresa" />
                <font-awesome-icon v-else icon="building" />
              </div>
            </div>

            <div class="company-main-info">
              <h1>{{ company.nome_empresa }}</h1>
              <p class="company-category">{{ company.categoria || 'Organizador de Eventos' }}</p>

              <div class="company-stats">
                <div class="stat-item">
                  <strong>{{ company.totalEvents || 0 }}</strong>
                  <span>Eventos</span>
                </div>
                <div class="stat-item">
                  <strong>{{ company.followers || 0 }}</strong>
                  <span>Seguidores</span>
                </div>
                <div class="stat-item">
                  <strong>{{ company.rating || '5.0' }}</strong>
                  <span>Avaliação</span>
                </div>
              </div>
            </div>

            <div class="company-actions" v-if="authStore.userType === 'USUARIO'">
              <button
                class="btn-follow-large"
                :class="{ 'is-following': isFollowing }"
                @click="toggleFollow"
              >
                <font-awesome-icon :icon="isFollowing ? 'check' : 'plus'" />
                {{ isFollowing ? 'Seguindo' : 'Seguir' }}
              </button>

              <button class="btn-chat-large" @click="startChat">
                <font-awesome-icon icon="comment-dots" />
                Conversar
              </button>

              <button class="btn-share-large" @click="shareCompany">
                <font-awesome-icon icon="share-nodes" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Conteúdo Principal -->
    <div class="company-content">
      <div class="container">
        <div class="content-layout">
          <!-- Navegação de Tabs -->
          <div class="tabs-navigation">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              :class="['tab-btn', { active: activeTab === tab.id }]"
              @click="activeTab = tab.id"
            >
              <font-awesome-icon :icon="tab.icon" />
              {{ tab.label }}
            </button>
          </div>

          <!-- Tab: Sobre -->
          <div v-show="activeTab === 'about'" class="tab-content">
            <div class="about-section">
              <div class="section-card">
                <h2>Sobre a empresa</h2>
                <p class="company-description">
                  {{ company.descricao || 'Esta empresa organiza eventos incríveis em Joinville!' }}
                </p>

                <div class="company-details-grid">
                  <div class="detail-item" v-if="company.cnpj">
                    <font-awesome-icon icon="id-card" />
                    <div>
                      <strong>CNPJ</strong>
                      <p>{{ formatCNPJ(company.cnpj) }}</p>
                    </div>
                  </div>

                  <div class="detail-item" v-if="company.telefone">
                    <font-awesome-icon icon="phone" />
                    <div>
                      <strong>Telefone</strong>
                      <p>{{ formatPhone(company.telefone) }}</p>
                    </div>
                  </div>

                  <div class="detail-item" v-if="company.email">
                    <font-awesome-icon icon="envelope" />
                    <div>
                      <strong>Email</strong>
                      <p>{{ company.email }}</p>
                    </div>
                  </div>

                  <div class="detail-item" v-if="company.website">
                    <font-awesome-icon icon="globe" />
                    <div>
                      <strong>Website</strong>
                      <p><a :href="company.website" target="_blank">Visitar site</a></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tab: Eventos -->
          <div v-show="activeTab === 'events'" class="tab-content">
            <div class="events-filter-bar">
              <div class="filter-group">
                <label>Ordenar por:</label>
                <select v-model="eventsFilter">
                  <option value="recent">Mais recentes</option>
                  <option value="upcoming">Próximos eventos</option>
                  <option value="popular">Mais populares</option>
                </select>
              </div>
            </div>

            <div v-if="companyEvents.length > 0" class="events-grid">
              <div
                v-for="event in filteredEvents"
                :key="event.id"
                class="event-card-mini"
                @click="goToEvent(event.id)"
              >
                <div class="event-image-mini">
                  <img :src="event.image || event.foto" :alt="event.title || event.nome" />
                  <div class="event-date-badge">{{ formatEventDate(event.date || event.data_inicio) }}</div>
                </div>
                <div class="event-info-mini">
                  <h3>{{ event.title || event.nome }}</h3>
                  <p class="event-location">
                    <font-awesome-icon icon="location-dot" />
                    {{ event.location || event.endereco }}
                  </p>
                  <div class="event-footer">
                    <span class="event-category">{{ event.category || 'Evento' }}</span>
                    <button class="btn-favorite-mini" @click.stop="toggleFavorite(event.id)">
                      <font-awesome-icon
                        :icon="isFavorite(event.id) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="empty-state">
              <font-awesome-icon icon="calendar-xmark" size="3x" />
              <h3>Nenhum evento disponível</h3>
              <p>Esta empresa ainda não publicou eventos.</p>
            </div>
          </div>

          <!-- Tab: Avaliações -->
          <div v-show="activeTab === 'reviews'" class="tab-content">
            <div class="reviews-section">
              <div class="reviews-header">
                <div class="rating-summary">
                  <div class="rating-big">
                    <span class="rating-number">{{ company.rating || '5.0' }}</span>
                    <div class="stars-large">
                      <font-awesome-icon
                        v-for="i in 5"
                        :key="i"
                        icon="star"
                        :class="{ filled: i <= Math.round(company.rating || 5) }"
                      />
                    </div>
                    <p>Baseado em {{ company.totalReviews || 0 }} avaliações</p>
                  </div>
                </div>

                <button
                  v-if="authStore.userType === 'USUARIO'"
                  class="btn-write-review"
                  @click="showReviewModal = true"
                >
                  <font-awesome-icon icon="pen" />
                  Escrever avaliação
                </button>
              </div>

              <!-- Lista de avaliações -->
              <div class="reviews-list">
                <div v-for="review in reviews" :key="review.id" class="review-card">
                  <div class="review-header">
                    <div class="reviewer-info">
                      <div class="reviewer-avatar">
                        <img v-if="review.user.avatar" :src="review.user.avatar" />
                        <font-awesome-icon v-else icon="user" />
                      </div>
                      <div>
                        <strong>{{ review.user.name }}</strong>
                        <div class="review-stars">
                          <font-awesome-icon
                            v-for="i in 5"
                            :key="i"
                            icon="star"
                            :class="{ filled: i <= review.rating }"
                          />
                        </div>
                      </div>
                    </div>
                    <span class="review-date">{{ formatDate(review.date) }}</span>
                  </div>
                  <p class="review-text">{{ review.comment }}</p>
                </div>
              </div>

              <div v-if="reviews.length === 0" class="empty-state">
                <font-awesome-icon icon="comments" size="3x" />
                <h3>Nenhuma avaliação ainda</h3>
                <p>Seja o primeiro a avaliar esta empresa!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Avaliação -->
    <div v-if="showReviewModal" class="modal-overlay" @click="showReviewModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Avaliar {{ company.nome_empresa }}</h3>
          <button @click="showReviewModal = false" class="close-btn">
            <font-awesome-icon icon="times" />
          </button>
        </div>

        <div class="modal-body">
          <div class="rating-input">
            <label>Sua avaliação:</label>
            <div class="stars-input">
              <font-awesome-icon
                v-for="i in 5"
                :key="i"
                icon="star"
                :class="{ filled: i <= reviewForm.rating }"
                @click="reviewForm.rating = i"
              />
            </div>
          </div>

          <div class="form-group">
            <label>Comentário:</label>
            <textarea
              v-model="reviewForm.comment"
              rows="4"
              placeholder="Compartilhe sua experiência com esta empresa..."
            ></textarea>
          </div>
        </div>

        <div class="modal-footer">
          <button @click="showReviewModal = false" class="btn-cancel">Cancelar</button>
          <button @click="submitReview" class="btn-submit">Enviar avaliação</button>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
      <p>Carregando perfil...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useChatStore } from '@/stores/chat'
import api from '@/services/api'
import { eventService } from '@/services/eventService'
import { useToast } from 'vue-toastification'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const chatStore = useChatStore()
const toast = useToast()

const company = ref({})
const companyEvents = ref([])
const reviews = ref([])
const loading = ref(true)
const activeTab = ref('about')
const eventsFilter = ref('recent')
const isFollowing = ref(false)
const favoriteEvents = ref([])
const showReviewModal = ref(false)

const reviewForm = ref({
  rating: 5,
  comment: ''
})

const tabs = [
  { id: 'about', label: 'Sobre', icon: 'info-circle' },
  { id: 'events', label: 'Eventos', icon: 'calendar-days' },
  { id: 'reviews', label: 'Avaliações', icon: 'star' }
]

const filteredEvents = computed(() => {
  let events = [...companyEvents.value]

  switch (eventsFilter.value) {
    case 'recent':
      return events.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    case 'upcoming':
      return events.filter(e => new Date(e.date || e.data_inicio) >= new Date())
    case 'popular':
      return events.sort((a, b) => (b.participants || 0) - (a.participants || 0))
    default:
      return events
  }
})

onMounted(async () => {
  await loadCompanyProfile()
  await loadCompanyEvents()
  loadFavorites()
  checkIfFollowing()
  loadReviews()
})

const loadCompanyProfile = async () => {
  try {
    loading.value = true
    const response = await api.getCompanyPublicProfile(route.params.id)
    company.value = response.data
  } catch (error) {
    console.error('Erro ao carregar empresa:', error)
    toast.error('Erro ao carregar perfil da empresa')
  } finally {
    loading.value = false
  }
}

const loadCompanyEvents = async () => {
  try {
    const allEvents = await eventService.getAllEvents()
    // Filtrar eventos da empresa (ajustar conforme sua estrutura)
    companyEvents.value = allEvents.filter(e => e.empresa?.id == route.params.id).slice(0, 6)
  } catch (error) {
    console.error('Erro ao carregar eventos:', error)
  }
}

const loadReviews = async () => {
  try {
    const response = await api.getCompanyReviews(route.params.id)
    reviews.value = response.data.map(review => ({
      id: review.id,
      user: {
        name: review.usuario_nome,
        avatar: review.usuario_avatar
      },
      rating: review.nota,
      comment: review.comentario,
      date: review.data_avaliacao
    }))
  } catch (error) {
    console.error('Erro ao carregar avaliações:', error)
  }
}

const loadFavorites = () => {
  const favorites = localStorage.getItem('favoriteEvents')
  if (favorites) favoriteEvents.value = JSON.parse(favorites)
}

const checkIfFollowing = () => {
  if (!authStore.isAuthenticated) return

  const following = localStorage.getItem('followingCompanies')
  if (following) {
    const followingList = JSON.parse(following)
    isFollowing.value = followingList.includes(route.params.id)
  }
}

const toggleFollow = async () => {
  if (!authStore.isAuthenticated) {
    toast.warning('Faça login para seguir empresas')
    router.push('/login')
    return
  }

  try {
    if (isFollowing.value) {
      await api.unfollowCompany(route.params.id)
      isFollowing.value = false
      company.value.followers_count--
      toast.success('Deixou de seguir')
    } else {
      await api.followCompany(route.params.id)
      isFollowing.value = true
      company.value.followers_count++
      toast.success('Agora você está seguindo esta empresa!')
    }
  } catch (error) {
    console.error('Erro ao seguir/deixar de seguir:', error)
    toast.error('Erro ao processar solicitação')
  }
}

const startChat = async () => {
  if (!authStore.isAuthenticated) {
    toast.warning('Faça login para conversar')
    router.push('/login')
    return
  }

  if (authStore.userType !== 'USUARIO') {
    toast.error('Apenas usuários podem iniciar conversas')
    return
  }

  try {
    const room = await chatStore.startChatWith(route.params.id)
    if (room && room.id) {
      router.push({ name: 'ChatRoom', params: { id: room.id } })
    }
  } catch (error) {
    console.error('Erro ao iniciar chat:', error)
    toast.error('Não foi possível iniciar o chat')
  }
}

const shareCompany = () => {
  if (navigator.share) {
    navigator.share({
      title: company.value.nome_empresa,
      text: `Confira o perfil de ${company.value.nome_empresa}`,
      url: window.location.href
    })
  } else {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Link copiado!')
  }
}

const goToEvent = (eventId) => {
  router.push({ name: 'EventDetails', params: { id: eventId } })
}

const isFavorite = (eventId) => favoriteEvents.value.includes(eventId)

const toggleFavorite = (eventId) => {
  const index = favoriteEvents.value.indexOf(eventId)
  if (index > -1) {
    favoriteEvents.value.splice(index, 1)
  } else {
    favoriteEvents.value.push(eventId)
  }
  localStorage.setItem('favoriteEvents', JSON.stringify(favoriteEvents.value))
}

const submitReview = async () => {
  if (!reviewForm.value.comment.trim()) {
    toast.warning('Por favor, escreva um comentário')
    return
  }

  try {
    await api.createCompanyReview({
      empresa: route.params.id,
      nota: reviewForm.value.rating,
      comentario: reviewForm.value.comment
    })

    toast.success('Avaliação enviada com sucesso!')
    showReviewModal.value = false
    reviewForm.value = { rating: 5, comment: '' }

    // Recarrega as avaliações
    await loadReviews()
    await loadCompanyProfile()
  } catch (error) {
    console.error('Erro ao enviar avaliação:', error)
    toast.error(error.response?.data?.detail || 'Erro ao enviar avaliação')
  }
}

const formatCNPJ = (cnpj) => {
  if (!cnpj) return ''
  return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
}

const formatPhone = (phone) => {
  if (!phone) return ''
  return phone.replace(/^(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3')
}

const formatEventDate = (dateStr) => {
  if (!dateStr) return ''
  // Reutilizar a lógica que você já tem
  return dateStr
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('pt-BR')
}
</script>

<style scoped>
.public-company-profile {
  min-height: 100vh;
  background: #f8f9fa;
}

/* Header */
.company-header {
  position: relative;
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.cover-image {
  height: 300px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.cover-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.3) 100%);
}

.company-info-header {
  margin-top: -100px;
  position: relative;
  z-index: 2;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.header-content {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 2rem;
  align-items: end;
  padding-bottom: 2rem;
}

.company-avatar-large {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 5px solid white;
  overflow: hidden;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.company-avatar-large img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.company-avatar-large svg {
  font-size: 4rem;
  color: #0066cc;
}

.company-main-info h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  color: #1a1a1a;
}

.company-category {
  color: #666;
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
}

.company-stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-item strong {
  font-size: 1.5rem;
  color: #1a1a1a;
}

.stat-item span {
  color: #666;
  font-size: 0.9rem;
}

.company-actions {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.btn-follow-large,
.btn-chat-large,
.btn-share-large {
  padding: 0.875rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s;
  border: 2px solid;
}

.btn-follow-large {
  background: white;
  border-color: #0066cc;
  color: #0066cc;
}

.btn-follow-large:hover {
  background: #0066cc;
  color: white;
}

.btn-follow-large.is-following {
  background: #0066cc;
  color: white;
}

.btn-chat-large {
  background: #28a745;
  border-color: #28a745;
  color: white;
}

.btn-chat-large:hover {
  background: #218838;
}

.btn-share-large {
  background: white;
  border-color: #e0e0e0;
  color: #666;
  padding: 0.875rem;
}

.btn-share-large:hover {
  border-color: #0066cc;
  color: #0066cc;
}

/* Tabs */
.company-content {
  padding: 2rem 0;
}

.tabs-navigation {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #e9ecef;
}

.tab-btn {
  background: none;
  border: none;
  padding: 1rem 1.5rem;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  color: #666;
  border-bottom: 3px solid transparent;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tab-btn:hover {
  color: #0066cc;
}

.tab-btn.active {
  color: #0066cc;
  border-bottom-color: #0066cc;
}

/* Tab Content */
.tab-content {
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.section-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.section-card h2 {
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  color: #1a1a1a;
}

.company-description {
  line-height: 1.8;
  color: #555;
  font-size: 1.05rem;
  margin-bottom: 2rem;
}

.company-details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.detail-item {
  display: flex;
  gap: 1rem;
  align-items: start;
}

.detail-item svg {
  font-size: 1.5rem;
  color: #0066cc;
  margin-top: 0.25rem;
}

.detail-item strong {
  display: block;
  margin-bottom: 0.25rem;
  color: #666;
  font-size: 0.9rem;
}

.detail-item p {
  margin: 0;
  color: #1a1a1a;
  font-size: 1rem;
}

.detail-item a {
  color: #0066cc;
  text-decoration: none;
}

.detail-item a:hover {
  text-decoration: underline;
}

/* Events Grid */
.events-filter-bar {
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.filter-group label {
  font-weight: 600;
  color: #555;
}

.filter-group select {
  padding: 0.5rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.event-card-mini {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  cursor: pointer;
  transition: all 0.3s;
}

.event-card-mini:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
}

.event-image-mini {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.event-image-mini img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.event-date-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0,0,0,0.8);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.event-info-mini {
  padding: 1.5rem;
}

.event-info-mini h3 {
  margin: 0 0 0.75rem 0;
  font-size: 1.1rem;
  color: #1a1a1a;
}

.event-location {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.event-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.event-category {
  background: #e3f2fd;
  color: #0066cc;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.btn-favorite-mini {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #ff4757;
  cursor: pointer;
  transition: transform 0.2s;
}

.btn-favorite-mini:hover {
  transform: scale(1.2);
}

/* Reviews */
.reviews-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.reviews-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e9ecef;
}

.rating-summary {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.rating-big {
  text-align: center;
}

.rating-number {
  font-size: 3rem;
  font-weight: 700;
  color: #1a1a1a;
  display: block;
  margin-bottom: 0.5rem;
}

.stars-large {
  display: flex;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
}

.stars-large svg {
  color: #ddd;
}

.stars-large svg.filled {
  color: #ffa500;
}

.rating-big p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.btn-write-review {
  background: #0066cc;
  color: white;
  border: none;
  padding: 0.875rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s;
}

.btn-write-review:hover {
  background: #0052a3;
  transform: translateY(-2px);
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.review-card {
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 1rem;
}

.reviewer-info {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.reviewer-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.reviewer-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.reviewer-avatar svg {
  font-size: 1.5rem;
  color: #0066cc;
}

.reviewer-info strong {
  display: block;
  margin-bottom: 0.25rem;
  color: #1a1a1a;
}

.review-stars {
  display: flex;
  gap: 0.15rem;
  font-size: 1rem;
}

.review-stars svg {
  color: #ddd;
}

.review-stars svg.filled {
  color: #ffa500;
}

.review-date {
  color: #999;
  font-size: 0.9rem;
}

.review-text {
  margin: 0;
  line-height: 1.6;
  color: #555;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #999;
}

.empty-state svg {
  margin-bottom: 1rem;
  color: #ccc;
}

.empty-state h3 {
  margin: 0 0 0.5rem 0;
  color: #666;
}

.empty-state p {
  margin: 0;
  color: #999;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.5rem;
  color: #1a1a1a;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #999;
  cursor: pointer;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.close-btn:hover {
  background: #f5f5f5;
  color: #333;
}

.modal-body {
  padding: 2rem;
}

.rating-input {
  margin-bottom: 1.5rem;
}

.rating-input label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: #333;
}

.stars-input {
  display: flex;
  gap: 0.5rem;
  font-size: 2rem;
}

.stars-input svg {
  color: #ddd;
  cursor: pointer;
  transition: all 0.2s;
}

.stars-input svg:hover,
.stars-input svg.filled {
  color: #ffa500;
  transform: scale(1.1);
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

.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  font-family: inherit;
  box-sizing: border-box;
}

.form-group textarea:focus {
  outline: none;
  border-color: #0066cc;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #e9ecef;
}

.btn-cancel,
.btn-submit {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-cancel {
  background: white;
  border: 2px solid #e0e0e0;
  color: #666;
}

.btn-cancel:hover {
  border-color: #999;
}

.btn-submit {
  background: #0066cc;
  border: 2px solid #0066cc;
  color: white;
}

.btn-submit:hover {
  background: #0052a3;
}

/* Loading */
.loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(255,255,255,0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #0066cc;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 1024px) {
  .header-content {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 1.5rem;
  }

  .company-avatar-section {
    display: flex;
    justify-content: center;
  }

  .company-stats {
    justify-content: center;
  }

  .company-actions {
    justify-content: center;
  }

  .events-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }

  .cover-image {
    height: 200px;
  }

  .company-info-header {
    margin-top: -60px;
  }

  .company-avatar-large {
    width: 100px;
    height: 100px;
  }

  .company-main-info h1 {
    font-size: 1.5rem;
  }

  .company-stats {
    flex-wrap: wrap;
  }

  .company-actions {
    flex-direction: column;
    width: 100%;
  }

  .btn-follow-large,
  .btn-chat-large {
    width: 100%;
    justify-content: center;
  }

  .tabs-navigation {
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .tabs-navigation::-webkit-scrollbar {
    display: none;
  }

  .tab-btn {
    white-space: nowrap;
  }

  .events-grid {
    grid-template-columns: 1fr;
  }

  .company-details-grid {
    grid-template-columns: 1fr;
  }

  .reviews-header {
    flex-direction: column;
    gap: 1.5rem;
    align-items: flex-start;
  }

  .btn-write-review {
    width: 100%;
    justify-content: center;
  }
}
</style>
