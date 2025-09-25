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
      this._categoriasCache = Object.keys(categoryMapping).map(nome => ({ nome }))
      return false
    }
  },

  _transformEventos(eventosApi) {
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
    const eventos = await this.getAllEvents()
    return eventos.filter(e => e.category?.trim().toLowerCase() === categoryName.trim().toLowerCase())
  },

  async getEventCategories() {
    if (!this._categoriasCache || await this._shouldRefreshCache()) await this._refreshCache()
    return this._categoriasCache.map(cat => cat.nome)
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
      if (favorito) await apiService.removeFavorito(favorito.id)
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
