<template>
  <div class="event-details-page">
    <div class="event-header">
      <button @click="goBack" class="back-button">← Voltar</button>
    </div>

    <div v-if="event" class="main-content">
      <div class="event-hero-sympla" :style="{ '--bg-image': 'url(' + event.image + ')' }">
        <div class="hero-container">
          <div class="hero-details">
            <h1>{{ event.title }}</h1>
            <div class="info-block">
              <font-awesome-icon icon="fa-solid fa-calendar-days" class="info-icon" />
              <p>
                <strong>{{ event.date }}</strong
                ><br />
                <span>Horário a ser confirmado no local.</span>
              </p>
            </div>
            <div class="info-block">
              <font-awesome-icon icon="fa-solid fa-location-dot" class="info-icon" />
              <p>
                <strong>{{ event.location }}</strong
                ><br />
                <span>Joinville - SC</span>
              </p>
            </div>
          </div>
          <div class="hero-image-wrapper">
            <img :src="event.image" :alt="event.title" class="hero-image" />
          </div>
        </div>
      </div>

      <div class="event-body">
        <div class="event-description">
          <h2>Sobre o Evento</h2>
          <p>{{ getEventDescription(event) }}</p>
          <div class="action-buttons">
            <button class="buy-ticket-btn">Comprar Ingresso</button>
            <button class="share-btn">Compartilhar</button>
          </div>
        </div>

        <div class="event-sidebar">
          <h3>Detalhes</h3>
          <div class="detail-item">
            <strong>Categoria</strong>
            <p>{{ event.category }}</p>
          </div>
          <div class="detail-item" v-if="event.price">
            <strong>Preço</strong>
            <p>{{ event.price }}</p>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="loading">
      <p>Carregando detalhes do evento...</p>
    </div>
  </div>
</template>

<script>
// O SCRIPT CONTINUA O MESMO DA VERSÃO ANTERIOR
import { eventService } from '@/services/eventService.js'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCalendarDays, faLocationDot } from '@fortawesome/free-solid-svg-icons'

library.add(faCalendarDays, faLocationDot)

export default {
  name: 'EventDetails',
  props: {
    id: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      event: null,
    }
  },
  created() {
    this.event = eventService.getEventById(this.id)
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    getEventDescription(event) {
      const descriptions = {
        'Festa do colono':
          'Uma celebração tradicional da cultura alemã em Joinville, com comidas típicas, danças folclóricas e muita diversão para toda a família.',
        Matue:
          'Show imperdível do rapper Matue, um dos maiores nomes do trap nacional, apresentando seus maiores sucessos.',
        'Festival de dança':
          'O maior festival de dança de Joinville, reunindo companhias nacionais e internacionais em apresentações inesquecíveis.',
        'JEC x Blumenau':
          'Clássico regional entre JEC e Blumenau pelo Campeonato Catarinense. Venha torcer pelo time do coração!',
      }
      return (
        descriptions[event.title] ||
        `Venha participar do evento ${event.title} em ${event.location}. Uma experiência única que você não pode perder!`
      )
    },
  },
}
</script>

<style scoped>
/* Estilos Gerais */
.event-details-page {
  background-color: #f0f2f5;
}
.event-header {
  padding: 15px 20px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}
.back-button {
  background: none;
  border: none;
  color: #0066cc;
  font-size: 16px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}
.back-button:hover {
  background-color: #f0f8ff;
}
.loading {
  text-align: center;
  padding: 50px;
  font-size: 18px;
  color: #555;
}

/* Layout Hero com Fundo Desfocado */
.event-hero-sympla {
  position: relative;
  overflow: hidden;
  color: white;
  padding: 40px 20px;
}
.event-hero-sympla::before {
  content: '';
  position: absolute;
  top: -20px;
  left: -20px;
  right: -20px;
  bottom: -20px;
  background-image: var(--bg-image);
  background-size: cover;
  background-position: center;
  filter: blur(25px) brightness(0.4);
  z-index: 1;
}

.hero-container {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  /* ALTERADO: Aumentei a largura da coluna da imagem para acomodar o novo formato */
  grid-template-columns: 1fr 500px;
  gap: 40px;
  align-items: center;
  position: relative;
  z-index: 2;
}
.hero-details h1 {
  font-size: 42px;
  font-weight: 700;
  margin-bottom: 30px;
  line-height: 1.2;
}
.info-block {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 20px;
}
.info-icon {
  font-size: 20px;
  margin-top: 5px;
  color: #a0aec0;
}
.info-block p {
  margin: 0;
  line-height: 1.5;
}
.info-block p strong {
  font-size: 18px;
}
.info-block p span {
  font-size: 14px;
  color: #a0aec0;
}

.hero-image-wrapper {
  width: 100%;
  /* ALTERADO: Ajustado para a nova largura da coluna */
  max-width: 500px;
  /* ALTERADO: Mudei de formato poster (2/3) para paisagem (16/9) */
  aspect-ratio: 16 / 9;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
}
.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Corpo do Evento */
.event-body {
  max-width: 1100px;
  margin: 40px auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
}
.event-description {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}
.event-description h2 {
  font-size: 24px;
  color: #1a1a1a;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}
.event-description p {
  font-size: 16px;
  line-height: 1.7;
  color: #555;
}

/* Sidebar de Detalhes */
.event-sidebar {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  align-self: flex-start;
}
.event-sidebar h3 {
  font-size: 20px;
  color: #1a1a1a;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}
.detail-item {
  margin-bottom: 15px;
}
.detail-item strong {
  display: block;
  font-size: 14px;
  color: #888;
  margin-bottom: 5px;
}
.detail-item p {
  margin: 0;
  font-size: 16px;
  color: #333;
}

/* Botões de Ação */
.action-buttons {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 30px;
}
.buy-ticket-btn,
.share-btn {
  border: none;
  padding: 14px 28px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}
.buy-ticket-btn {
  background: #0066cc;
  color: white;
}
.buy-ticket-btn:hover {
  background: #0052a3;
}
.share-btn {
  background: transparent;
  color: #0066cc;
  border: 2px solid #0066cc;
}
.share-btn:hover {
  background: #0066cc;
  color: white;
}

/* Responsividade */
@media (max-width: 900px) {
  .hero-container {
    grid-template-columns: 1fr;
    text-align: center;
  }
  .hero-image-wrapper {
    margin: 0 auto;
  }
  .info-block {
    justify-content: center;
  }
  .event-body {
    grid-template-columns: 1fr;
  }
}
@media (max-width: 768px) {
  .hero-details h1 {
    font-size: 32px;
  }
  .action-buttons {
    flex-direction: column;
  }
  .buy-ticket-btn,
  .share-btn {
    width: 100%;
  }
}
</style>
