<template>
  <main class="main-content">
    <!-- Gastronomia Section -->
    <section class="events-section">
      <div class="section-header">
        <h2>Gastronomia</h2>
        <div class="section-actions">
          <span class="filter-link">Filtrar</span>
          <span class="view-all">Ver Tudo</span>
        </div>
      </div>
      <div class="events-grid">
        <div 
          v-for="event in gastronomiaEvents" 
          :key="event.id"
          class="event-card"
          @click="openEvent(event)"
        >
          <div class="event-image">
            <img :src="event.image" :alt="event.title" />
            <div class="event-date-badge">{{ event.date }}</div>
          </div>
          <div class="event-info">
            <h3>{{ event.title }}</h3>
            <p class="event-location">{{ event.location }}</p>
            <div class="event-price" v-if="event.price">{{ event.price }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Clássicos de Joinville Section -->
    <section class="events-section">
      <div class="section-header">
        <h2>Clássicos de Joinville</h2>
        <div class="section-actions">
          <span class="filter-link">Filtrar</span>
          <span class="view-all">Ver Tudo</span>
        </div>
      </div>
      <div class="events-grid">
        <div 
          v-for="event in classicosEvents" 
          :key="event.id"
          class="event-card"
          @click="openEvent(event)"
        >
          <div class="event-image">
            <img :src="event.image" :alt="event.title" />
            <div class="event-date-badge">{{ event.date }}</div>
          </div>
          <div class="event-info">
            <h3>{{ event.title }}</h3>
            <p class="event-location">{{ event.location }}</p>
            <div class="event-price" v-if="event.price">{{ event.price }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Festas e Shows Section -->
    <section class="events-section">
      <div class="section-header">
        <h2>Festas e Shows</h2>
        <div class="section-actions">
          <span class="filter-link">Filtrar</span>
          <span class="view-all">Ver Tudo</span>
        </div>
      </div>
      <div class="events-grid">
        <div 
          v-for="event in festasEvents" 
          :key="event.id"
          class="event-card"
          @click="openEvent(event)"
        >
          <div class="event-image">
            <img :src="event.image" :alt="event.title" />
            <div class="event-date-badge">{{ event.date }}</div>
          </div>
          <div class="event-info">
            <h3>{{ event.title }}</h3>
            <p class="event-location">{{ event.location }}</p>
            <div class="event-price" v-if="event.price">{{ event.price }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Destaques da Semana Section -->
    <section class="events-section">
      <div class="section-header">
        <h2>Destaques da semana</h2>
        <div class="section-actions">
          <span class="filter-link">Filtrar</span>
          <span class="view-all">Ver Tudo</span>
        </div>
      </div>
      <div class="events-grid">
        <div 
          v-for="event in destaquesEvents" 
          :key="event.id"
          class="event-card"
          @click="openEvent(event)"
        >
          <div class="event-image">
            <img :src="event.image" :alt="event.title" />
            <div class="event-date-badge">{{ event.date }}</div>
          </div>
          <div class="event-info">
            <h3>{{ event.title }}</h3>
            <p class="event-location">{{ event.location }}</p>
            <div class="event-price" v-if="event.price">{{ event.price }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Esportes Section -->
    <section class="events-section">
      <div class="section-header">
        <h2>Esportes</h2>
        <div class="section-actions">
          <span class="filter-link">Filtrar</span>
          <span class="view-all">Ver Tudo</span>
        </div>
      </div>
      <div class="events-grid">
        <div 
          v-for="event in esportesEvents" 
          :key="event.id"
          class="event-card"
          @click="openEvent(event)"
        >
          <div class="event-image">
            <img :src="event.image" :alt="event.title" />
            <div class="event-date-badge">{{ event.date }}</div>
          </div>
          <div class="event-info">
            <h3>{{ event.title }}</h3>
            <p class="event-location">{{ event.location }}</p>
            <div class="event-price" v-if="event.price">{{ event.price }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Atividades ao Ar Livre Section -->
    <section class="events-section">
      <div class="section-header">
        <h2>Atividades ao Ar Livre</h2>
        <div class="section-actions">
          <span class="filter-link">Filtrar</span>
          <span class="view-all">Ver Tudo</span>
        </div>
      </div>
      <div class="events-grid">
        <div 
          v-for="event in atividadesEvents" 
          :key="event.id"
          class="event-card"
          @click="openEvent(event)"
        >
          <div class="event-image">
            <img :src="event.image" :alt="event.title" />
            <div class="event-date-badge">{{ event.date }}</div>
          </div>
          <div class="event-info">
            <h3>{{ event.title }}</h3>
            <p class="event-location">{{ event.location }}</p>
            <div class="event-price" v-if="event.price">{{ event.price }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Cultura Section -->
    <section class="events-section">
      <div class="section-header">
        <h2>Cultura</h2>
        <div class="section-actions">
          <span class="filter-link">Filtrar</span>
          <span class="view-all">Ver Tudo</span>
        </div>
      </div>
      <div class="events-grid">
        <div 
          v-for="event in culturaEvents" 
          :key="event.id"
          class="event-card"
          @click="openEvent(event)"
        >
          <div class="event-image">
            <img :src="event.image" :alt="event.title" />
            <div class="event-date-badge">{{ event.date }}</div>
          </div>
          <div class="event-info">
            <h3>{{ event.title }}</h3>
            <p class="event-location">{{ event.location }}</p>
            <div class="event-price" v-if="event.price">{{ event.price }}</div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
export default {
  name: 'MainComponent',
  data() {
    return {
      gastronomiaEvents: [
        {
          id: 1,
          title: 'Festa do colono',
          location: 'Joinville - SC',
          date: '15 SET',
          image: '/placeholder.svg?height=200&width=300'
        },
        {
          id: 2,
          title: 'Festival gastronômico de Joinville',
          location: 'Centro de Eventos',
          date: '20 SET',
          image: '/placeholder.svg?height=200&width=300'
        },
        {
          id: 3,
          title: 'Craft Beer',
          location: 'Cervejaria Local',
          date: '25 SET',
          image: '/placeholder.svg?height=200&width=300'
        },
        {
          id: 4,
          title: 'Comida di buteco',
          location: 'Vários locais',
          date: '30 SET',
          image: '/placeholder.svg?height=200&width=300'        
        }
      ],
      classicosEvents: [
        {
          id: 5,
          title: 'Festa das flores',
          location: 'Parque da Cidade',
          date: '10 OUT',
          image: '/placeholder.svg?height=200&width=300'
        },
        {
          id: 6,
          title: 'Festival de dança',
          location: 'Teatro Bolshoi',
          date: '15 OUT',
          image: '/placeholder.svg?height=200&width=300'
        },
        {
          id: 7,
          title: 'Feira do livro',
          location: 'Centro Cultural',
          date: '20 OUT',
          image: '/placeholder.svg?height=200&width=300'
        },
        {
          id: 8,
          title: 'Festa das cores',
          location: 'Praça Central',
          date: '25 OUT',
          image: '/placeholder.svg?height=200&width=300'
        }
      ],
      festasEvents: [
        {
          id: 9,
          title: 'Armandinho',
          location: 'Arena Joinville',
          date: '05 NOV',
          image: '/placeholder.svg?height=200&width=300'
        },
        {
          id: 10,
          title: 'Matue',
          location: 'Estádio da Ressacada',
          date: '10 NOV',
          image: '/placeholder.svg?height=200&width=300'
        },
        {
          id: 11,
          title: 'Menos é Mais e Ferrugem',
          location: 'Centro de Eventos',
          date: '15 NOV',
          image: '/placeholder.svg?height=200&width=300'
        },
        {
          id: 12,
          title: 'Victor e Leo',
          location: 'Teatro Municipal',
          date: '20 NOV',
          image: '/placeholder.svg?height=200&width=300'
        }
      ],
      destaquesEvents: [
        {
          id: 13,
          title: 'Festival pianístico',
          location: 'Conservatório',
          date: '12 NOV',
          image: '/placeholder.svg?height=200&width=300'
        },
        {
          id: 14,
          title: 'Festival da Vigorelli',
          location: 'Vigorelli',
          date: '18 NOV',
          image: '/placeholder.svg?height=200&width=300'
        },
        {
          id: 15,
          title: 'Musicarium in Concert',
          location: 'Sala de Concertos',
          date: '22 NOV',
          image: '/placeholder.svg?height=200&width=300'
        },
        {
          id: 16,
          title: 'Festival Meraki',
          location: 'Parque Zoobotânico',
          date: '28 NOV',
          image: '/placeholder.svg?height=200&width=300'
        }
      ],
      esportesEvents: [
        {
          id: 17,
          title: 'JEC x Blumenau',
          location: 'Arena Joinville',
          date: '14 NOV',
          image: '/placeholder.svg?height=200&width=300'
        },
        {
          id: 18,
          title: 'JEC x Nação',
          location: 'Arena Joinville',
          date: '21 NOV',
          image: '/placeholder.svg?height=200&width=300'
        },
        {
          id: 19,
          title: 'JEC x Carlos Renaux',
          location: 'Arena Joinville',
          date: '28 NOV',
          image: '/placeholder.svg?height=200&width=300'
        },
        {
          id: 20,
          title: 'JEC x Chapecoense',
          location: 'Arena Joinville',
          date: '05 DEZ',
          image: '/placeholder.svg?height=200&width=300'
        }
      ],
      atividadesEvents: [
        {
          id: 21,
          title: 'Parque Zoobotânico',
          location: 'Zona Sul',
          date: 'Permanente',
          image: '/placeholder.svg?height=200&width=300'
        },
        {
          id: 22,
          title: 'Corrida Pela Vida',
          location: 'Parque da Cidade',
          date: '16 NOV',
          image: '/placeholder.svg?height=200&width=300'
        },
        {
          id: 23,
          title: 'Parque caminho das Águas',
          location: 'Pirabeiraba',
          date: 'Permanente',
          image: '/placeholder.svg?height=200&width=300'
        },
        {
          id: 24,
          title: 'Corrida Halloween',
          location: 'Centro',
          date: '31 OUT',
          image: '/placeholder.svg?height=200&width=300'
        }
      ],
      culturaEvents: [
        {
          id: 25,
          title: 'Animameco',
          location: 'Centro de Convenções',
          date: '18 NOV',
          image: '/placeholder.svg?height=200&width=300'
        },
        {
          id: 26,
          title: 'Portão Comedy Night com Irmã Selma',
          location: 'Teatro Portão',
          date: '25 NOV',
          image: '/placeholder.svg?height=200&width=300'
        },
        {
          id: 27,
          title: 'VivVeneto',
          location: 'Museu da Imigração',
          date: '02 DEZ',
          image: '/placeholder.svg?height=200&width=300'
        },
        {
          id: 28,
          title: 'Joinville Matsuri',
          location: 'Parque da Cidade',
          date: '09 DEZ',
          image: '/placeholder.svg?height=200&width=300'
        }
      ]
    }
  },
  methods: {
    openEvent(event) {
      this.$router.push({
        name: 'EventDetails',
        params: { id: event.id },
        query: { event: JSON.stringify(event) }
      });
    }
  }
}
</script>

<style scoped>
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.events-section {
  margin-bottom: 60px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e9ecef;
}

.section-header h2 {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.section-actions {
  display: flex;
  gap: 20px;
}

.filter-link,
.view-all {
  color: #0066cc;
  font-weight: 500;
  cursor: pointer;
  font-size: 14px;
  transition: color 0.2s ease;
}

.filter-link:hover,
.view-all:hover {
  color: #0052a3;
  text-decoration: underline;
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.event-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid #f0f0f0;
}

.event-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: #e0e0e0;
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
  transition: transform 0.3s ease;
}

.event-card:hover .event-image img {
  transform: scale(1.05);
}

.event-date-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.event-info {
  padding: 20px;
}

.event-info h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.event-location {
  color: #666;
  font-size: 14px;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
}

.event-location::before {
  content: "📍";
  margin-right: 6px;
}

.event-price {
  color: #0066cc;
  font-weight: 600;
  font-size: 16px;
}

/* Responsive Design */
@media (max-width: 768px) {
  .main-content {
    padding: 20px 16px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .section-header h2 {
    font-size: 24px;
  }
  
  .events-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
  }
  
  .event-card {
    border-radius: 8px;
  }
  
  .event-image {
    height: 160px;
  }
  
  .event-info {
    padding: 16px;
  }
  
  .event-info h3 {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .events-grid {
    grid-template-columns: 1fr;
  }
  
  .section-actions {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
