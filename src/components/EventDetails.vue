<template>
  <div class="event-details-sympla">
    <!-- Hero Section com imagem de fundo -->
    <div class="hero-section" :style="{ backgroundImage: `url(${event?.image})` }">
      <div class="hero-overlay">
        <div class="hero-container">
          <button @click="goBack" class="back-btn">
            <font-awesome-icon icon="arrow-left" /> Voltar
          </button>

          <div class="hero-content">
            <div class="hero-info">
              <span class="event-category">{{ event?.category }}</span>
              <h1 class="event-title">{{ event?.title }}</h1>

              <div class="event-quick-info">
                <div class="info-item">
                  <font-awesome-icon icon="calendar-days" />
                  <span>{{ formatEventDate(event?.date) }}</span>
                </div>
                <div class="info-item">
                  <font-awesome-icon icon="clock" />
                  <span>{{ event?.horario_inicio || '19:00' }}</span>
                </div>
                <div class="info-item">
                  <font-awesome-icon icon="location-dot" />
                  <span>{{ event?.location }}</span>
                </div>
              </div>
            </div>

            <div class="hero-card">
              <div class="event-image-card">
                <img :src="event?.image" :alt="event?.title" />
              </div>

              <div class="card-actions">
                <button
                  class="btn-favorite"
                  :class="{ 'is-favorite': isFavorite(event?.id) }"
                  @click="toggleFavorite(event?.id)"
                >
                  <font-awesome-icon :icon="isFavorite(event?.id) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'" />
                  {{ isFavorite(event?.id) ? 'Favoritado' : 'Favoritar' }}
                </button>

                <button class="btn-share" @click="shareEvent">
                  <font-awesome-icon icon="share-nodes" />
                  Compartilhar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-container">
      <div class="content-grid">
        <!-- Coluna Principal -->
        <div class="main-column">
          <!-- Sobre o Evento -->
          <section class="content-section">
            <h2 class="section-title">Sobre o evento</h2>
            <div class="event-description" v-html="formatDescription(event?.description)"></div>
          </section>

          <!-- Localização -->
          <section class="content-section">
            <h2 class="section-title">
              <font-awesome-icon icon="location-dot" />
              Localização
            </h2>
            <div class="location-info">
              <p class="location-address">
                <strong>{{ event?.location }}</strong><br>
                Joinville - SC, Brasil
              </p>
              <!-- Placeholder para mapa -->
              <div class="map-placeholder">
                <font-awesome-icon icon="map-marked-alt" size="3x" />
                <p>Mapa da localização</p>
              </div>
            </div>
          </section>

          <!-- Organizador -->
          <section class="content-section organizer-section">
            <h2 class="section-title">
              <font-awesome-icon icon="building" />
              Organizador
            </h2>
            <div class="organizer-card" @click="goToCompanyProfile">
              <div class="organizer-avatar">
                <img
                  v-if="event?.empresa?.avatar"
                  :src="event.empresa.avatar"
                  :alt="event.empresa.nome_empresa"
                />
                <font-awesome-icon v-else icon="building" />
              </div>
              <div class="organizer-info">
                <h3>{{ event?.empresa?.nome_empresa || 'Empresa Organizadora' }}</h3>
                <p>{{ event?.empresa?.descricao || 'Organizador de eventos em Joinville' }}</p>

                <div class="organizer-actions">
                  <button
                    v-if="authStore.isAuthenticated && authStore.userType === 'USUARIO'"
                    class="btn-follow"
                    :class="{ 'is-following': isFollowing }"
                    @click.stop="toggleFollow"
                  >
                    <font-awesome-icon :icon="isFollowing ? 'check' : 'plus'" />
                    {{ isFollowing ? 'Seguindo' : 'Seguir' }}
                  </button>

                  <button
                    v-if="authStore.isAuthenticated && authStore.userType === 'USUARIO'"
                    class="btn-chat"
                    @click.stop="startChat"
                  >
                    <font-awesome-icon icon="comment-dots" />
                    Conversar
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        <!-- Sidebar -->
        <aside class="sidebar-column">
          <!-- Card de Informações -->
          <div class="info-card sticky-card">
            <h3>Informações do Evento</h3>

            <div class="info-list">
              <div class="info-row">
                <span class="info-label">
                  <font-awesome-icon icon="calendar-days" />
                  Data
                </span>
                <span class="info-value">{{ formatEventDate(event?.date) }}</span>
              </div>

              <div class="info-row">
                <span class="info-label">
                  <font-awesome-icon icon="clock" />
                  Horário
                </span>
                <span class="info-value">
                  {{ event?.horario_inicio || '19:00' }}
                  <span v-if="event?.horario_fim">até {{ event.horario_fim }}</span>
                </span>
              </div>

              <div class="info-row">
                <span class="info-label">
                  <font-awesome-icon icon="ticket" />
                  Tipo
                </span>
                <span class="info-value">
                  <span class="event-type-badge" :class="event?.ativo ? 'active' : 'inactive'">
                    {{ event?.ativo ? 'Evento Ativo' : 'Evento Encerrado' }}
                  </span>
                </span>
              </div>

              <div class="info-row">
                <span class="info-label">
                  <font-awesome-icon icon="tags" />
                  Categoria
                </span>
                <span class="info-value">{{ event?.category }}</span>
              </div>
            </div>

            <div class="card-cta">
              <button
                v-if="authStore.userType !== 'EMPRESA'"
                class="btn-primary-large"
                @click="handleInterest"
              >
                <font-awesome-icon icon="check-circle" />
                Tenho Interesse
              </button>

              <p class="cta-note">
                <font-awesome-icon icon="info-circle" />
                Este é um evento gratuito. Não há venda de ingressos.
              </p>
            </div>
          </div>

          <!-- Card de Compartilhamento -->
          <div class="share-card">
            <h4>Compartilhe este evento</h4>
            <div class="social-share">
              <button class="share-btn whatsapp" @click="shareWhatsApp">
                <font-awesome-icon :icon="['fab', 'whatsapp']" />
              </button>
              <button class="share-btn facebook" @click="shareFacebook">
                <font-awesome-icon :icon="['fab', 'facebook']" />
              </button>
              <button class="share-btn twitter" @click="shareTwitter">
                <font-awesome-icon :icon="['fab', 'twitter']" />
              </button>
              <button class="share-btn link" @click="copyLink">
                <font-awesome-icon icon="link" />
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
      <p>Carregando evento...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useChatStore } from '@/stores/chat'
import { eventService } from '@/services/eventService'
import { useToast } from 'vue-toastification'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const chatStore = useChatStore()
const toast = useToast()

const event = ref(null)
const loading = ref(true)
const favoriteEvents = ref([])
const isFollowing = ref(false)

onMounted(async () => {
  await loadEvent()
  loadFavorites()
  checkIfFollowing()
})

const loadEvent = async () => {
  try {
    loading.value = true
    const allEvents = await eventService.getAllEvents()
    event.value = allEvents.find(e => e.id === parseInt(route.params.id))

    if (!event.value) {
      toast.error('Evento não encontrado')
      router.push('/')
    }
  } catch (error) {
    console.error('Erro ao carregar evento:', error)
    toast.error('Erro ao carregar evento')
  } finally {
    loading.value = false
  }
}

const loadFavorites = () => {
  const favorites = localStorage.getItem('favoriteEvents')
  if (favorites) favoriteEvents.value = JSON.parse(favorites)
}

const checkIfFollowing = () => {
  if (!authStore.isAuthenticated || !event.value?.empresa?.id) return

  const following = localStorage.getItem('followingCompanies')
  if (following) {
    const followingList = JSON.parse(following)
    isFollowing.value = followingList.includes(event.value.empresa.id)
  }
}

const isFavorite = (eventId) => favoriteEvents.value.includes(eventId)

const toggleFavorite = (eventId) => {
  const index = favoriteEvents.value.indexOf(eventId)
  if (index > -1) {
    favoriteEvents.value.splice(index, 1)
    toast.success('Removido dos favoritos')
  } else {
    favoriteEvents.value.push(eventId)
    toast.success('Adicionado aos favoritos')
  }
  localStorage.setItem('favoriteEvents', JSON.stringify(favoriteEvents.value))
}

const toggleFollow = () => {
  if (!authStore.isAuthenticated) {
    toast.warning('Faça login para seguir empresas')
    router.push('/login')
    return
  }

  const following = localStorage.getItem('followingCompanies')
  let followingList = following ? JSON.parse(following) : []

  const companyId = event.value.empresa.id
  const index = followingList.indexOf(companyId)

  if (index > -1) {
    followingList.splice(index, 1)
    isFollowing.value = false
    toast.success('Deixou de seguir')
  } else {
    followingList.push(companyId)
    isFollowing.value = true
    toast.success('Agora você está seguindo esta empresa')
  }

  localStorage.setItem('followingCompanies', JSON.stringify(followingList))
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
    const empresaId = event.value.empresa?.id
    if (!empresaId) {
      toast.error('Empresa não encontrada')
      return
    }

    const room = await chatStore.startChatWith(empresaId)
    if (room && room.id) {
      router.push({ name: 'ChatRoom', params: { id: room.id } })
    }
  } catch (error) {
    console.error('Erro ao iniciar chat:', error)
    toast.error('Não foi possível iniciar o chat')
  }
}

const goToCompanyProfile = () => {
  if (!event.value?.empresa?.id) return
  router.push({
    name: 'PublicCompanyProfile',
    params: { id: event.value.empresa.id }
  })
}

const handleInterest = async () => {
  if (!authStore.isAuthenticated) {
    toast.warning('Faça login para demonstrar interesse')
    router.push('/login')
    return
  }

  try {
    await api.showInterestInEvent(route.params.id)
    toast.success('Interesse registrado! A empresa pode entrar em contato.')
  } catch (error) {
    console.error('Erro ao registrar interesse:', error)
    const errorMsg = error.response?.data?.message ||
                     error.response?.data?.detail ||
                     'Erro ao registrar interesse'
    toast.info(errorMsg)
  }
}

const shareWhatsApp = () => {
  const text = `Confira este evento: ${event.value.title} - ${window.location.href}`
  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
}

const shareFacebook = () => {
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')
}

const shareTwitter = () => {
  const text = `Confira: ${event.value.title}`
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`, '_blank')
}

const copyLink = () => {
  navigator.clipboard.writeText(window.location.href)
  toast.success('Link copiado!')
}

const formatEventDate = (dateStr) => {
  if (!dateStr) return 'Data a definir'

  // Se já estiver formatado (ex: "15 a 20 DEZ")
  if (dateStr.match(/\d{1,2}\s+[A-Z]{3}/)) {
    const meses = {
      'JAN': 'Janeiro', 'FEV': 'Fevereiro', 'MAR': 'Março',
      'ABR': 'Abril', 'MAI': 'Maio', 'JUN': 'Junho',
      'JUL': 'Julho', 'AGO': 'Agosto', 'SET': 'Setembro',
      'OUT': 'Outubro', 'NOV': 'Novembro', 'DEZ': 'Dezembro'
    }

    return dateStr.replace(/([A-Z]{3})/g, (match) => meses[match] || match)
  }

  return dateStr
}

const formatDescription = (desc) => {
  if (!desc) return 'Descrição não disponível'
  return desc.replace(/\n/g, '<br>')
}

const goBack = () => router.go(-1)
</script>

<style scoped>
.event-details-sympla {
  min-height: 100vh;
  background: #f8f9fa;
}

/* Hero Section */
.hero-section {
  position: relative;
  min-height: 450px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.9) 100%);
}

.hero-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
  z-index: 2;
  height: 100%;
  min-height: 450px;
  display: flex;
  flex-direction: column;
}

.back-btn {
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.3);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  cursor: pointer;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  align-self: flex-start;
  transition: all 0.3s;
}

.back-btn:hover {
  background: rgba(255,255,255,0.3);
  transform: translateX(-4px);
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 3rem;
  align-items: start;
  margin-top: 2rem;
}

.hero-info {
  color: white;
}

.event-category {
  display: inline-block;
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(10px);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 1rem;
}

.event-title {
  font-size: 3rem;
  font-weight: 700;
  margin: 0 0 2rem 0;
  line-height: 1.2;
}

.event-quick-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.1rem;
}

.info-item svg {
  width: 20px;
  opacity: 0.8;
}

.hero-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

.event-image-card {
  width: 100%;
  height: 300px;
  overflow: hidden;
}

.event-image-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-actions {
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
}

.btn-favorite,
.btn-share {
  flex: 1;
  padding: 1rem;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.3s;
}

.btn-favorite:hover {
  border-color: #ff4757;
  color: #ff4757;
}

.btn-favorite.is-favorite {
  background: #ff4757;
  border-color: #ff4757;
  color: white;
}

.btn-share:hover {
  border-color: #0066cc;
  color: #0066cc;
}

/* Main Container */
.main-container {
  max-width: 1200px;
  margin: -80px auto 0;
  padding: 0 2rem 4rem;
  position: relative;
  z-index: 3;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 2rem;
  align-items: start;
}

/* Main Column */
.main-column {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.content-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.section-title {
  font-size: 1.5rem;
  margin: 0 0 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #1a1a1a;
}

.event-description {
  line-height: 1.8;
  color: #555;
  font-size: 1.05rem;
}

.location-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.location-address {
  font-size: 1.1rem;
  color: #333;
  line-height: 1.6;
}

.map-placeholder {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 3rem;
  text-align: center;
  color: #999;
}

/* Organizer Section */
.organizer-card {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.organizer-card:hover {
  background: #e9ecef;
  transform: translateY(-2px);
}

.organizer-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.organizer-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.organizer-avatar svg {
  font-size: 2rem;
  color: #0066cc;
}

.organizer-info h3 {
  margin: 0 0 0.5rem 0;
  color: #1a1a1a;
  font-size: 1.2rem;
}

.organizer-info p {
  color: #666;
  margin: 0 0 1rem 0;
  line-height: 1.5;
}

.organizer-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-follow,
.btn-chat {
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s;
}

.btn-follow {
  background: white;
  border: 2px solid #0066cc;
  color: #0066cc;
}

.btn-follow:hover {
  background: #0066cc;
  color: white;
}

.btn-follow.is-following {
  background: #0066cc;
  color: white;
  border-color: #0066cc;
}

.btn-chat {
  background: #28a745;
  border: 2px solid #28a745;
  color: white;
}

.btn-chat:hover {
  background: #218838;
  border-color: #218838;
}

/* Sidebar */
.sidebar-column {
  position: sticky;
  top: 100px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-card,
.share-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.info-card h3 {
  margin: 0 0 1.5rem 0;
  font-size: 1.3rem;
  color: #1a1a1a;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-bottom: 2rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 1rem;
}

.info-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-weight: 500;
  font-size: 0.95rem;
}

.info-label svg {
  width: 16px;
  color: #0066cc;
}

.info-value {
  text-align: right;
  font-weight: 600;
  color: #1a1a1a;
}

.event-type-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.event-type-badge.active {
  background: #d4edda;
  color: #155724;
}

.event-type-badge.inactive {
  background: #f8d7da;
  color: #721c24;
}

.card-cta {
  border-top: 1px solid #e9ecef;
  padding-top: 1.5rem;
}

.btn-primary-large {
  width: 100%;
  padding: 1.25rem;
  background: linear-gradient(135deg, #0066cc 0%, #004a99 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  transition: all 0.3s;
  margin-bottom: 1rem;
}

.btn-primary-large:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0,102,204,0.3);
}

.cta-note {
  text-align: center;
  color: #666;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 0;
}

/* Share Card */
.share-card h4 {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
}

.social-share {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
}

.share-btn {
  aspect-ratio: 1;
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  transition: all 0.3s;
}

.share-btn.whatsapp { background: #25D366; }
.share-btn.facebook { background: #1877F2; }
.share-btn.twitter { background: #1DA1F2; }
.share-btn.link { background: #6c757d; }

.share-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 15px rgba(0,0,0,0.2);
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
  .hero-content {
    grid-template-columns: 1fr;
  }

  .hero-card {
    max-width: 500px;
    margin: 0 auto;
  }

  .content-grid {
    grid-template-columns: 1fr;
  }

  .sidebar-column {
    position: static;
  }
}

@media (max-width: 768px) {
  .event-title {
    font-size: 2rem;
  }

  .main-container {
    margin-top: -40px;
    padding: 0 1rem 2rem;
  }

  .content-section,
  .info-card,
  .share-card {
    padding: 1.5rem;
  }

  .organizer-card {
    flex-direction: column;
    text-align: center;
  }

  .organizer-avatar {
    margin: 0 auto;
  }

  .organizer-actions {
    justify-content: center;
  }
}
</style>
