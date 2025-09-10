<template>
  <div class="event-details">
    <div class="event-header">
      <button @click="goBack" class="back-button">
        ← Voltar
      </button>
    </div>
    
    <div class="event-content" v-if="event">
      <div class="event-hero">
        <img :src="event.image" :alt="event.title" class="hero-image" />
        <div class="hero-overlay">
          <div class="hero-info">
            <h1>{{ event.title }}</h1>
            <div class="event-meta">
              <span class="event-date">📅 {{ event.date }}</span>
              <span class="event-location">📍 {{ event.location }}</span>
              <span class="event-price" v-if="event.price">💰 {{ event.price }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="event-body">
        <div class="event-description">
          <h2>Sobre o Evento</h2>
          <p>
            {{ getEventDescription(event) }}
          </p>
          
          <div class="event-details-grid">
            <div class="detail-item">
              <h3>Data e Horário</h3>
              <p>{{ event.date }} - 19:00</p>
            </div>
            <div class="detail-item">
              <h3>Local</h3>
              <p>{{ event.location }}</p>
            </div>
            <div class="detail-item" v-if="event.price">
              <h3>Preço</h3>
              <p>{{ event.price }}</p>
            </div>
            <div class="detail-item">
              <h3>Categoria</h3>
              <p>{{ getEventCategory(event.id) }}</p>
            </div>
          </div>
          
          <div class="action-buttons">
            <button class="buy-ticket-btn">Comprar Ingresso</button>
            <button class="share-btn">Compartilhar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EventDetails',
  data() {
    return {
      event: null
    }
  },
  created() {
    const eventData = this.$route.query.event;
    if (eventData) {
      this.event = JSON.parse(eventData);
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    getEventDescription(event) {
      const descriptions = {
        'Festa do colono': 'Uma celebração tradicional da cultura alemã em Joinville, com comidas típicas, danças folclóricas e muita diversão para toda a família.',
        'Matue': 'Show imperdível do rapper Matue, um dos maiores nomes do trap nacional, apresentando seus maiores sucessos.',
        'Festival de dança': 'O maior festival de dança de Joinville, reunindo companhias nacionais e internacionais em apresentações inesquecíveis.',
        'JEC x Blumenau': 'Clássico regional entre JEC e Blumenau pelo Campeonato Catarinense. Venha torcer pelo time do coração!'
      };
      return descriptions[event.title] || `Venha participar do evento ${event.title} em ${event.location}. Uma experiência única que você não pode perder!`;
    },
    getEventCategory(eventId) {
      if (eventId <= 4) return 'Gastronomia';
      if (eventId <= 8) return 'Clássicos de Joinville';
      if (eventId <= 12) return 'Festas e Shows';
      if (eventId <= 16) return 'Destaques da Semana';
      if (eventId <= 20) return 'Esportes';
      if (eventId <= 24) return 'Atividades ao Ar Livre';
      return 'Cultura';
    }
  }
}
</script>

<style scoped>
.event-details {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.event-header {
  padding: 20px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.back-button {
  background: none;
  border: none;
  color: #0066cc;
  font-size: 16px;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 8px;
  transition: background-color 0.2s ease;
}

.back-button:hover {
  background-color: #f0f8ff;
}

.event-hero {
  position: relative;
  height: 400px;
  overflow: hidden;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  padding: 40px;
  color: white;
}

.hero-info h1 {
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 16px 0;
}

.event-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  font-size: 16px;
}

.event-body {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.event-description h2 {
  font-size: 28px;
  color: #1a1a1a;
  margin: 0 0 20px 0;
}

.event-description p {
  font-size: 16px;
  line-height: 1.6;
  color: #555;
  margin-bottom: 40px;
}

.event-details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.detail-item h3 {
  font-size: 18px;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.detail-item p {
  color: #666;
  margin: 0;
}

.action-buttons {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.buy-ticket-btn {
  background: #0066cc;
  color: white;
  border: none;
  padding: 16px 32px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.buy-ticket-btn:hover {
  background: #0052a3;
}

.share-btn {
  background: white;
  color: #0066cc;
  border: 2px solid #0066cc;
  padding: 14px 32px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.share-btn:hover {
  background: #0066cc;
  color: white;
}

@media (max-width: 768px) {
  .hero-info h1 {
    font-size: 28px;
  }
  
  .event-meta {
    flex-direction: column;
    gap: 8px;
  }
  
  .event-body {
    padding: 20px 16px;
  }
  
  .event-details-grid {
    grid-template-columns: 1fr;
    gap: 20px;
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
