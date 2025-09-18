// services/eventService.js
import { apiService } from './apiService.js'

// Dados mock para fallback (manter temporariamente)
const allEventsMock = [
  {
    id: 1,
    category: 'Gastronomia',
    title: 'Festa do colono',
    location: 'Sociedade Rio da Prata - Pirabeiraba',
    date: '17 a 20 JUL',
    image:'/gastronomia/festadocolono.jpg',
  },
  {
    id: 2,
    category: 'Gastronomia',
    title: 'Festival gastronômico de Joinville',
    location: 'Joinville - SC',
    date: '06 a 24 AGO',
    image: '/gastronomia/festivalgastronomicobanner.jpg',
  },
  {
    id: 3,
    category: 'Gastronomia',
    title: 'Craft Beer',
    location: 'Expocentro Edmundo Doubrawa',
    date: '26 a 27 ABR',
    image:'/gastronomia/craftbeer.jpg',
  },
  {
    id: 4,
    category: 'Gastronomia',
    title: 'Comida di buteco',
    location: 'Joinville - SC',
    date: '11 ABR a 04 MAI',
    image:
      '/gastronomia/comidadibuteco.webp',
  },
  // Clássicos de Joinville
  {
    id: 5,
    category: 'Clássicos de Joinville',
    title: 'Festa das flores',
    location: 'Expoville - Centro de Convenções e Exposições',
    date: '18 a 23 NOV',
    image:
      '/classicosdejoinville/festadasflores.png',
  },
  {
    id: 6,
    category: 'Clássicos de Joinville',
    title: 'Festival de dança',
    location: 'Teatro Bolshoi',
    date: '20 JUL a 01 AGO',
    image:'/classicosdejoinville/festivaldancabanner.jpeg',
  },
  {
    id: 7,
    category: 'Clássicos de Joinville',
    title: 'Feira do livro',
    location: 'Centreventos Cau Hansen',
    date: '20 OUT',
    image:
      '/classicosdejoinville/feiradolivro.png',
  },
  {
    id: 8,
    category: 'Clássicos de Joinville',
    title: 'Festa das cores',
    location: 'Praça Central',
    date: '25 OUT',
    image:
      '/classicosdejoinville/festadascores.png',
  },
  // Festas e Shows
  {
    id: 9,
    category: 'Festas e Shows',
    title: 'Armandinho',
    location: 'Arena Joinville',
    date: '05 NOV',
    image:
      '/festaseshows/armandinho.png',
  },
  {
    id: 10,
    category: 'Festas e Shows',
    title: 'Matue',
    location: 'SQUARE GARDEN - Joinville',
    date: '31 OUT',
    image: '/festaseshows/matuebanner.png',
  },
  {
    id: 11,
    category: 'Festas e Shows',
    title: 'Menos é Mais e Ferrugem',
    location: 'SQUARE GARDEN - Joinville',
    date: '19 SET',
    image: '/festaseshows/menosemaisbanner.png',
  },
  {
    id: 12,
    category: 'Festas e Shows',
    title: 'Victor e Leo',
    location: 'SQUARE GARDEN - Joinville',
    date: '24 OUT',
    image:
      '/festaseshows/victoreleo.jpg',
  },
  // Destaques da Semana
  {
    id: 13,
    category: 'Destaques da Semana',
    title: 'Festival pianístico',
    location: 'Pianos Pela Cidade',
    date: '23 a 28 SET',
    image:'/destaquesdasemana/festivalpianistico.webp',
  },
  {
    id: 14,
    category: 'Destaques da Semana',
    title: 'Festival da Vigorelli',
    location: 'Vigorelli',
    date: '14 a 17 AGO',
    image:'/destaquesdasemana/festivalvigorelli.jpg',
  },
  {
    id: 15,
    category: 'Destaques da Semana',
    title: 'Musicarium in Concert',
    location: 'Escola SESI',
    date: '09 AGO',
    image:'/destaquesdasemana/concertomusical.png',
  },
  {
    id: 16,
    category: 'Destaques da Semana',
    title: 'Festival Meraki',
    location: 'Cidade das Águas',
    date: '09 AGO',
    image:'/destaquesdasemana/festivalmeraki.webp',
  },
  // Esportes
  {
    id: 17,
    category: 'Esportes',
    title: 'JEC x Blumenau',
    location: 'Estádio do Sesi',
    date: '07 SET',
    image:
      '/esportes/jeceblumenau.jpg',
  },
  {
    id: 18,
    category: 'Esportes',
    title: 'JEC x Nação',
    location: 'Arena Joinville',
    date: '14 SET',
    image:
      '/esportes/jecenacao.jpg',
  },
  {
    id: 19,
    category: 'Esportes',
    title: 'JEC x Carlos Renaux',
    location: 'Arena Joinville',
    date: '21 SET',
    image:
      '/esportes/jececarlos.jpg',
  },
  {
    id: 20,
    category: 'Esportes',
    title: 'JEC x Santo André',
    location: 'Arena Joinville',
    date: '06 SET',
    image: '/esportes/jecbanner.jpeg',
  },
  // Atividades ao Ar Livre
  {
    id: 21,
    category: 'Atividades ao Ar Livre',
    title: 'Parque Zoobotânico',
    location: 'Bairro Saguaçu',
    date: 'Permanente',
    image:'/atividadesaoarlivre/zoobotanico.webp',
  },
  {
    id: 22,
    category: 'Atividades ao Ar Livre',
    title: 'Corrida Pela Vida',
    location: 'Shopping Mueller',
    date: '12 OUT',
    image:'/atividadesaoarlivre/corridapelavida.png',
  },
  {
    id: 23,
    category: 'Atividades ao Ar Livre',
    title: 'Parque caminho das Águas',
    location: 'Bairro Vila Nova',
    date: 'Permanente',
    image:'/atividadesaoarlivre/caminhodasaguas.png',
  },
  {
    id: 24,
    category: 'Atividades ao Ar Livre',
    title: 'Corrida Halloween',
    location: 'Centro',
    date: '31 OUT',
    image:'/atividadesaoarlivre/corridahallowen.png',
  },
  // Cultura
  {
    id: 25,
    category: 'Cultura',
    title: 'Festival Internacional de Bonecos - Animaneco',
    location: 'Joinville - SC',
    date: '14 a 24 AGO',
    image:'/cultura/animaneco.webp',
  },
  {
    id: 26,
    category: 'Cultura',
    title: 'Porão Comedy Night com Irmã Selma',
    location: 'Porão da Liga',
    date: '21 AGO',
    image:'/cultura/comedia.png',
  },
  {
    id: 27,
    category: 'Cultura',
    title: 'VivVeneto',
    location: 'ExpoCentro Edmundo Doubrawa',
    date: '28 a 31 AGO',
    image:'/cultura/vinveneto.webp',
  },
  {
    id: 28,
    category: 'Cultura',
    title: 'Joinville Matsuri',
    location: 'Expocentro Edmundo Doubrawa',
    date: '16 a 18 MAI',
    image:'/cultura/matsuri.jpg',
  },
]

// Mapeamento entre categorias do front e back
const categoryMapping = {
  'Gastronomia': 'Gastronomia',
  'Clássicos de Joinville': 'Clássicos de Joinville',
  'Festas e Shows': 'Festas e shows',
  'Esportes': 'Esportes',
  'Atividades ao Ar Livre': 'Atividades ao ar livre',
  'Cultura': 'Cultura'
}


export const eventService = {
  // Cache para melhorar performance
  _eventosCache: null,
  _categoriasCache: null,
  _cacheTimeout: 5 * 60 * 1000, // 5 minutos
  _lastCacheTime: 0,

  async _shouldRefreshCache() {
    return Date.now() - this._lastCacheTime > this._cacheTimeout
  },

  async _refreshCache() {
    try {
      console.log('Carregando eventos da API...')
      const [eventosResponse, categoriasResponse] = await Promise.all([
        apiService.getEventos(),
        apiService.getCategorias()
      ])

      this._eventosCache = this._transformEventos(eventosResponse.results || eventosResponse)
      this._categoriasCache = categoriasResponse.results || categoriasResponse
      this._lastCacheTime = Date.now()

      return true
    } catch (error) {
      console.error('Erro ao carregar da API, usando dados mock:', error)
      this._eventosCache = allEventsMock
      this._categoriasCache = Object.keys(categoryMapping).map(name => ({ nome: name }))
      return false
    }
  },

  _transformEventos(eventosApi) {
    return eventosApi.map(evento => ({
      id: evento.id,
      title: evento.nome,
      category: evento.categoria?.nome || 'Outros',
      location: evento.endereco,
      date: this._formatDateRange(evento.data_inicio, evento.data_fim),
      image: evento.foto ? `${evento.foto}` : '/default-event.jpg',
      description: evento.descricao,
      empresa: evento.empresa,
      horario_inicio: evento.horario_inicio,
      horario_fim: evento.horario_fim,
      ativo: evento.ativo
    }))
  },

  _formatDateRange(dataInicio, dataFim) {
    if (!dataInicio) return 'Data não disponível'

    const inicio = new Date(dataInicio)
    const fim = dataFim ? new Date(dataFim) : inicio

    const meses = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN',
                   'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ']

    const diaInicio = inicio.getDate()
    const diaFim = fim.getDate()
    const mesInicio = meses[inicio.getMonth()]
    const mesFim = meses[fim.getMonth()]

    if (inicio.getTime() === fim.getTime()) {
      return `${diaInicio} ${mesInicio}`
    } else if (mesInicio === mesFim) {
      return `${diaInicio} a ${diaFim} ${mesInicio}`
    } else {
      return `${diaInicio} ${mesInicio} a ${diaFim} ${mesFim}`
    }
  },

  async getAllEvents() {
    if (!this._eventosCache || await this._shouldRefreshCache()) {
      await this._refreshCache()
    }
    return this._eventosCache
  },

  async getEventById(id) {
    try {
      return await apiService.getEventoById(id)
    } catch (error) {
      console.error("Erro ao buscar evento por ID:", error)
      return null
    }
  },

  async getEventsByCategory(categoryName) {
    const eventos = await this.getAllEvents()
    return eventos.filter(event =>
      event.category?.trim().toLowerCase() === categoryName.trim().toLowerCase()
    )
  },

  async getEventCategories() {
    if (!this._categoriasCache || await this._shouldRefreshCache()) {
      await this._refreshCache()
    }
    return this._categoriasCache.map(cat => cat.nome)
  },

  // Métodos para interação com favoritos
  async addToFavorites(usuarioId, eventoId) {
    try {
      await apiService.addFavorito(usuarioId, eventoId)
      return true
    } catch (error) {
      console.error('Erro ao adicionar aos favoritos:', error)
      return false
    }
  },

  async removeFromFavorites(usuarioId, eventoId) {
    try {
      const favorito = await apiService.getFavoritoByUserAndEvent(usuarioId, eventoId)
      if (favorito) {
        await apiService.removeFavorito(favorito.id)
      }
      return true
    } catch (error) {
      console.error('Erro ao remover dos favoritos:', error)
      return false
    }
  },

  async getUserFavorites(usuarioId) {
    try {
      const favoritos = await apiService.getFavoritos(usuarioId)
      const eventos = await this.getAllEvents()

      return eventos.filter(evento =>
        favoritos.results?.some(fav => fav.evento === evento.id) ||
        favoritos.some?.(fav => fav.evento === evento.id)
      )
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error)
      return []
    }
  },

  // Métodos para empresas
  async getEventsByCompany(empresaId) {
    try {
      const eventos = await apiService.getEventosByEmpresa(empresaId)
      return this._transformEventos(eventos.results || eventos)
    } catch (error) {
      console.error('Erro ao buscar eventos da empresa:', error)
      return []
    }
  },

  async createEvent(eventoData) {
    try {
      const novoEvento = await apiService.createEvento(eventoData)
      // Limpar cache para forçar atualização
      this._eventosCache = null
      return this._transformEventos([novoEvento])[0]
    } catch (error) {
      console.error('Erro ao criar evento:', error)
      throw error
    }
  },

  async updateEvent(eventoId, eventoData) {
    try {
      const eventoAtualizado = await apiService.updateEvento(eventoId, eventoData)
      // Limpar cache para forçar atualização
      this._eventosCache = null
      return this._transformEventos([eventoAtualizado])[0]
    } catch (error) {
      console.error('Erro ao atualizar evento:', error)
      throw error
    }
  },

  async deleteEvent(eventoId) {
    try {
      await apiService.deleteEvento(eventoId)
      // Limpar cache para forçar atualização
      this._eventosCache = null
      return true
    } catch (error) {
      console.error('Erro ao deletar evento:', error)
      return false
    }
  },

  // Método utilitário para testar conectividade
  async testConnection() {
    return await apiService.testConnection()
  }
}
