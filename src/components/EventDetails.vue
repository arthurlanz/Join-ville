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
                <strong>{{ event.date }}</strong>
                <br />
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
            <button class="share-btn" @click="shareEvent">
              <font-awesome-icon icon="fa-solid fa-share" />
              Compartilhar
            </button>
            <button 
              class="favorite-btn" 
              :class="{ 'is-favorited': isFavorite(event.id) }"
              @click="toggleFavorite(event.id)"
            >
              <font-awesome-icon :icon="isFavorite(event.id) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'" />
              {{ isFavorite(event.id) ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos' }}
            </button>
          </div>
        </div>

        <div class="event-sidebar">
          <h3>Detalhes</h3>
          <div class="detail-item">
            <strong>Categoria</strong>
            <p>{{ event.category }}</p>
          </div>
          <div class="detail-item" v-if="event.price">
            <strong>PreÃ§o</strong>
            <p>{{ event.price }}</p>
          </div>
          <div class="detail-item" v-if="event.duration">
            <strong>DuraÃ§Ã£o</strong>
            <p>{{ event.duration }}</p>
          </div>
          <div class="detail-item" v-if="event.organizer">
            <strong>Organizador</strong>
            <p>{{ event.organizer }}</p>
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
import { eventService } from '@/services/eventService.js'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCalendarDays, faLocationDot, faShare } from '@fortawesome/free-solid-svg-icons'
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons'
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons'

library.add(faCalendarDays, faLocationDot, faShare, faHeartRegular, faHeartSolid)

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
      favoriteEvents: []
    }
  },
  created() {
    this.event = eventService.getEventById(this.id)
    this.loadFavorites()
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    
    loadFavorites() {
      const favorites = localStorage.getItem('favoriteEvents')
      if (favorites) {
        this.favoriteEvents = JSON.parse(favorites)
      }
    },
    
    toggleFavorite(eventId) {
      const index = this.favoriteEvents.indexOf(eventId)
      if (index > -1) {
        this.favoriteEvents.splice(index, 1)
      } else {
        this.favoriteEvents.push(eventId)
      }
      localStorage.setItem('favoriteEvents', JSON.stringify(this.favoriteEvents))
    },
    
    isFavorite(eventId) {
      return this.favoriteEvents.includes(eventId)
    },
    
    shareEvent() {
      if (navigator.share) {
        navigator.share({
          title: this.event.title,
          text: `Confira este evento: ${this.event.title}`,
          url: window.location.href
        })
      } else {
        // Fallback para navegadores que nÃ£o suportam Web Share API
        navigator.clipboard.writeText(window.location.href).then(() => {
          alert('Link copiado para a Ã¡rea de transferÃªncia!')
        })
      }
    },
    
    getEventDescription(event) {
      const descriptions = {
  // Gastronomia
  'Festa do colono': 'Uma das tradições mais queridas de Joinville, a Festa do Colono celebra a herança alemã da região com uma autêntica experiência gastronômica. Durante quatro dias, você poderá saborear pratos típicos como kassler, eisbein, chucrute e strudel, além de cervejas artesanais locais. O evento conta com apresentações de danças folclóricas alemãs, música ao vivo e atividades para toda a família. Uma oportunidade única de mergulhar na cultura alemã sem sair de Santa Catarina.',

  'Festival gastronômico de Joinville': 'O maior evento gastronômico da região reúne os melhores restaurantes, chefs e produtores locais em uma celebração de 19 dias dedicada aos sabores de Joinville. Com degustações especiais, workshops culinários, shows de gastronomia e pratos exclusivos criados especialmente para o festival. Uma jornada pelos sabores que fazem de Joinville um destino gastronômico reconhecido nacionalmente.',

  'Craft Beer': 'Festival cervejeiro que celebra a cultura artesanal com mais de 40 cervejarias participantes, oferecendo desde IPAs lupuladas até stouts cremosas. O evento conta com harmonizações gastronômicas, talks com mestres cervejeiros, concursos de chopp e shows musicais. Uma experiência completa para quem aprecia a arte da cerveja artesanal.',

  'Comida di buteco': 'Competição gastronômica que transforma bares e botecos da cidade em verdadeiros templos da culinária criativa. Cada estabelecimento apresenta um prato especial que combina tradição e inovação, competindo pelo voto popular. Uma excelente oportunidade para descobrir novos sabores e apoiar o comércio local.',

  // Clássicos de Joinville
  'Festa das flores': 'O evento mais colorido e perfumado de Joinville transforma a Expoville em um jardim gigante com mais de 120 mil flores de 300 espécies diferentes. Além da exposição floral, o evento oferece feira de artesanato, gastronomia típica alemã, apresentações culturais e atividades educativas sobre jardinagem e sustentabilidade. Uma tradição de 40 anos que encanta visitantes de todo o Brasil.',

  'Festival de dança': 'O maior festival de dança do mundo acontece em Joinville há mais de 40 anos, reunindo bailarinos, coreógrafos e companhias de dança de mais de 15 países. São 12 dias de espetáculos, workshops, mostras competitivas e não competitivas, além de atividades educativas. O Teatro Bolshoi e outros espaços da cidade se transformam em palcos para apresentações inesquecíveis de ballet clássico, dança contemporânea, folclórica e urbana.',

  'Feira do livro': 'Evento literário que democratiza o acesso à cultura, oferecendo livros com preços especiais, lançamentos, sessões de autógrafos e bate-papos com escritores renomados. A programação inclui contação de histórias para crianças, oficinas de escrita criativa e debates sobre literatura contemporânea.',

  'Festa das cores': 'Inspirada no tradicional Holi Festival indiano, a Festa das Cores de Joinville é uma celebração vibrante da diversidade cultural. Os participantes se cobrem de pós coloridos biodegradáveis enquanto dançam ao som de música eletrônica e world music. Um evento que simboliza união, alegria e respeito às diferenças.',

  // Festas e Shows
  'Armandinho': 'Show do cantor e compositor Armandinho, um dos grandes nomes do reggae nacional. Com seu estilo único que mescla reggae, rock e MPB, Armandinho promete uma noite repleta de energia positiva e grandes sucessos como "Casinha", "Desenho de Deus" e "Analua". Uma experiência musical que vai do relaxante ao dançante.',

  'Matue': 'Apresentação do rapper Matuê, fenômeno do trap brasileiro e um dos artistas mais ouvidos do país. Com hits como "Máquina do Tempo", "Kenny G" e "Gorila", Matuê traz seu flow único e letras que falam sobre superação e conquistas. Um show imperdível para os fãs do gênero urbano.',

  'Menos é Mais e Ferrugem': 'Dupla apresentação com dois dos maiores nomes do pagode romântico atual. O Menos é Mais, com seus sucessos como "Recaídas" e "Porta Retrato", divide o palco com Ferrugem, que emociona com "Pirata e Tesouro" e "Atrasadinha". Uma noite de muito romantismo e pagode de qualidade.',

  'Victor e Leo': 'A dupla sertaneja Victor e Leo apresenta seus maiores sucessos em um show acústico intimista. Com canções como "Borboletas", "Fada" e "Não Me Perdoei", os irmãos prometem emocionar o público com suas harmonias vocais perfeitas e letras que tocam o coração.',

  // Destaques da Semana
  'Festival pianístico': 'Festival que espalha pianos pela cidade, permitindo que qualquer pessoa toque e se expresse musicalmente. Durante uma semana, praças, parques e espaços públicos recebem pianos decorados por artistas locais, criando um ambiente cultural único. Além das apresentações espontâneas, há concertos profissionais e masterclasses.',

  'Festival da Vigorelli': 'Evento multidisciplinar que acontece na tradicional Vigorelli, reunindo música, arte, gastronomia e sustentabilidade. Com foco na cultura local e economia criativa, o festival apresenta bandas regionais, artistas visuais, food trucks e atividades ecológicas em um ambiente familiar e descontraído.',

  'Musicarium in Concert': 'Concerto especial da renomada Orquestra Sinfônica de Joinville na Escola SESI. Uma oportunidade única de apreciar música clássica de alta qualidade em um ambiente intimista, com repertório que vai de compositores barrocos a contemporâneos.',

  'Festival Meraki': 'Festival de música eletrônica e arte digital que acontece na Cidade das Águas. Com DJs nacionais e internacionais, instalações artísticas interativas e tecnologia de ponta, o Meraki oferece uma experiência sensorial completa para os amantes da música eletrônica.',

  // Esportes
  'JEC x Blumenau': 'Clássico regional pelo Campeonato Catarinense entre o Joinville Esporte Clube e o FC Blumenau. Rivalidade histórica que promete grandes emoções no Estádio do Sesi, com torcidas apaixonadas e futebol de qualidade. Uma tradição do futebol catarinense que movimenta toda a região.',

  'JEC x Nação': 'Partida válida pelo Campeonato Catarinense entre JEC e Nação, na Arena Joinville. O tricolor da casa busca os três pontos em casa com o apoio de sua fiel torcida. Futebol de qualidade e muita emoção garantidos neste confronto importante para a tabela do estadual.',

  'JEC x Carlos Renaux': 'Confronto histórico do futebol catarinense entre Joinville e Carlos Renaux. Duas equipes tradicionais se enfrentam na Arena Joinville em busca da vitória no Campeonato Catarinense. Um duelo que promete técnica, raça e muita tradição futebolística.',

  'JEC x Santo André': 'Partida especial entre JEC e Santo André na Arena Joinville. O time da casa recebe um adversário qualificado em um jogo que promete grande espetáculo para os amantes do futebol. Ambiente familiar e seguro para toda a família torcer.',

  // Atividades ao Ar Livre
  'Parque Zoobotânico': 'O maior zoológico de Santa Catarina oferece uma experiência educativa e divertida em meio à natureza. Com mais de 1.200 animais de 250 espécies diferentes, trilhas ecológicas, jardim botânico e atividades de educação ambiental. Um passeio perfeito para famílias que querem se conectar com a natureza e aprender sobre conservação.',

  'Corrida Pela Vida': 'Corrida solidária que une esporte e solidariedade em prol de uma causa nobre. Com percursos de 5km e 10km, a corrida arrecada fundos para instituições de saúde da região. Além da corrida, há caminhada familiar e atividades para crianças, promovendo saúde e cidadania.',

  'Parque caminho das águas': 'Complexo de lazer e esportes aquáticos que oferece piscinas, toboáguas, áreas de recreação e espaços verdes. Local perfeito para passar o dia em família, praticar esportes aquáticos ou simplesmente relaxar em contato com a natureza. Infraestrutura completa com restaurante e áreas de descanso.',

  'Corrida Halloween': 'Corrida temática de Halloween que acontece no centro da cidade. Os participantes são encorajados a correr fantasiados, criando um ambiente divertido e único. Com percursos de 5km e 10km, premiações para melhores fantasias e festa pós-corrida com música e diversão.',

  // Cultura
  'Festival Internacional de Bonecos - Animaneco': 'Festival que transforma Joinville na capital mundial do teatro de bonecos. Durante 11 dias, grupos nacionais e internacionais apresentam espetáculos de marionetes, teatro de sombras e animação para todas as idades. Oficinas, exposições e mostras competitivas complementam a programação deste evento único na América Latina.',

  'Porão Comedy Night com Irmã Selma': 'Noite de stand-up comedy com a hilária drag queen Irmã Selma no aconchegante Porão da Liga. Uma experiência de humor adulto e irreverente que garante muitas risadas em um ambiente intimista e descontraído. Bebidas especiais e petiscos completam a experiência.',

  'VivVeneto': 'Festival que celebra a cultura italiana em Joinville, com foco nas tradições da região do Vêneto. Gastronomia autêntica, vinhos especiais, música tradicional italiana e apresentações culturais transformam a cidade em um pedacinho da Itália. Oficinas de culinária e degustações completam a experiência cultural.',

  'Joinville Matsuri': 'Festival da cultura japonesa que celebra as tradições orientais com apresentações de taiko, cerimônia do chá, demonstrações de artes marciais, culinária típica e exposições de ikebana e origami. Um evento que promove o intercâmbio cultural e apresenta a rica herança japonesa presente em Santa Catarina.'
}

      
      return descriptions[event.title] || 
             `Participe do evento ${event.title} em ${event.location}. Uma experiência cultural única que promete enriquecer seu conhecimento e proporcionar momentos especiais de lazer e entretenimento em Joinville.`
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
  max-width: 500px;
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
  text-align: justify;
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

/* BotÃµes de AÃ§Ã£o */
.action-buttons {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 30px;
}
.share-btn,
.favorite-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  padding: 14px 28px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
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
.favorite-btn {
  background: transparent;
  color: #ff4d4d;
  border: 2px solid #ff4d4d;
}
.favorite-btn:hover {
  background: #ff4d4d;
  color: white;
}
.favorite-btn.is-favorited {
  background: #ff4d4d;
  color: white;
}
.favorite-btn.is-favorited:hover {
  background: #e60000;
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
  .share-btn,
  .favorite-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>