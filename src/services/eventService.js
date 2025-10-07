// services/eventService.js
import { apiService } from './apiService.js'

const allEventsMock = [
  // ... (seu array de eventos mock permanece igual)
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
  _eventosCache: null,
  _categoriasCache: null,
  _cacheTimeout: 5 * 60 * 1000,
  _lastCacheTime: 0,

  async _shouldRefreshCache() {
    return Date.now() - this._lastCacheTime > this._cacheTimeout
  },

  async _refreshCache() {
    try {
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
      // Garante que o mock tenha id, se necessário, para evitar erros de key no Vue
      this._categoriasCache = Object.keys(categoryMapping).map((nome, index) => ({ id: index + 1, nome }))
      return false
    }
  },

  _transformEventos(eventosApi) {
    if (!eventosApi) return []
    return eventosApi.map(evento => ({
      id: evento.id,
      title: evento.nome || evento.title,
      category: evento.categoria?.nome || evento.category || 'Outros',
      location: evento.endereco || evento.location,
      date: evento.data_inicio && evento.data_fim
        ? this._formatDateRange(evento.data_inicio, evento.data_fim)
        : evento.date || 'Data não disponível',
      image: evento.foto || evento.image || '/default-event.jpg',
      description: evento.descricao || evento.description || '',
      empresa: evento.empresa || null,
      horario_inicio: evento.horario_inicio || null,
      horario_fim: evento.horario_fim || null,
      ativo: evento.ativo ?? true
    }))
  },

  _formatDateRange(dataInicio, dataFim) {
    if (!dataInicio) return 'Data não disponível'
    const inicio = new Date(dataInicio)
    const fim = dataFim ? new Date(dataFim) : inicio
    const meses = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ']
    const diaInicio = inicio.getDate()
    const diaFim = fim.getDate()
    const mesInicio = meses[inicio.getMonth()]
    const mesFim = meses[fim.getMonth()]
    if (inicio.getTime() === fim.getTime()) return `${diaInicio} ${mesInicio}`
    if (mesInicio === mesFim) return `${diaInicio} a ${diaFim} ${mesInicio}`
    return `${diaInicio} ${mesInicio} a ${diaFim} ${mesFim}`
  },

  async getAllEvents() {
    if (!this._eventosCache || await this._shouldRefreshCache()) await this._refreshCache()
    return this._eventosCache
  },

  async getEventById(id) {
    const eventos = await this.getAllEvents()
    return eventos.find(e => e.id === id) || null
  },

  async getEventsByCategory(categoryName) {
    // ADICIONADO: Cheque de segurança para evitar o TypeError
    if (!categoryName) return []
    const eventos = await this.getAllEvents()
    return eventos.filter(e => e.category?.trim().toLowerCase() === categoryName.trim().toLowerCase())
  },

  /**
   * NOVO MÉTODO: Retorna o array completo de objetos de categoria.
   */
  async getFullCategories() {
    if (!this._categoriasCache || await this._shouldRefreshCache()) await this._refreshCache()
    // Retorna o array de objetos { id: ..., nome: ... }
    return this._categoriasCache || []
  },

  async getEventCategories() {
    if (!this._categoriasCache || await this._shouldRefreshCache()) await this._refreshCache()
    return this._categoriasCache.map(cat => cat.nome)
  },

  async getUserFavorites(usuarioId) {
    try {
      const favorites = localStorage.getItem('joinville:favoriteEvents')
      const favoriteIds = favorites ? JSON.parse(favorites) : []

      const eventos = await this.getAllEvents()
      return eventos.filter(evento => favoriteIds.includes(evento.id))

    } catch (error) {
      console.error('Erro ao buscar favoritos:', error)
      return []
    }
  },

  async addToFavorites(usuarioId, eventoId) {
    try {
      const favorites = localStorage.getItem('joinville:favoriteEvents')
      const favoriteIds = favorites ? JSON.parse(favorites) : []
      if (!favoriteIds.includes(eventoId)) {
        favoriteIds.push(eventoId)
        localStorage.setItem('joinville:favoriteEvents', JSON.stringify(favoriteIds))
      }
      return true
    } catch (error) {
      console.error('Erro ao adicionar aos favoritos:', error)
      return false
    }
  },

  async removeFromFavorites(usuarioId, eventoId) {
    try {
      const favorites = localStorage.getItem('joinville:favoriteEvents')
      const favoriteIds = favorites ? JSON.parse(favorites) : []
      const index = favoriteIds.indexOf(eventoId)
      if (index > -1) {
        favoriteIds.splice(index, 1)
        localStorage.setItem('joinville:favoriteEvents', JSON.stringify(favoriteIds))
      }
      return true
    } catch (error) {
      console.error('Erro ao remover dos favoritos:', error)
      return false
    }
  },

  async testConnection() {
    try {
      if (apiService.testConnection) return await apiService.testConnection()
      return true
    } catch (error) {
      console.error('Teste de conexão falhou:', error)
      return false
    }
  }
}
