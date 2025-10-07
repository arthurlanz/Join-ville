// services/apiService.js
import axios from 'axios'

const API_BASE_URL = 'https://join-villeapi.fabricadesoftware.ifc.edu.br/api'

// Configuração do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Interceptor para adicionar token de autenticação se existir
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor de resposta para tratar erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('userToken')
      localStorage.removeItem('userData')
      localStorage.removeItem('userType')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const apiService = {
  // ========== EMPRESAS ==========
  async getEmpresas() {
    const response = await api.get('/empresas/')
    return response.data
  },

  async getEmpresaById(id) {
    const response = await api.get(`/empresas/${id}/`)
    return response.data
  },

  async createEmpresa(empresaData) {
    const response = await api.post('/empresas/', empresaData)
    return response.data
  },

  async updateEmpresa(id, empresaData) {
    const response = await api.put(`/empresas/${id}/`, empresaData)
    return response.data
  },

  async deleteEmpresa(id) {
    await api.delete(`/empresas/${id}/`)
  },

  // ========== USUÁRIOS ==========
  async getUsuarios() {
    const response = await api.get('/usuarios/')
    return response.data
  },

  async createUsuario(userData) {
    const response = await api.post('/usuarios/', userData)
    return response.data
  },

  async updateUsuario(id, userData) {
    const response = await api.put(`/usuarios/${id}/`, userData)
    return response.data
  },

  async getUserByEmail(email) {
    const response = await api.get(`/usuarios/?email=${email}`)
    return response.data.results?.[0] || null
  },

  // ========== CATEGORIAS ==========
  async getCategorias() {
    const response = await api.get('/categorias/')
    return response.data
  },

  async createCategoria(categoriaData) {
    const response = await api.post('/categorias/', categoriaData)
    return response.data
  },

  // ========== EVENTOS ==========
 async getEventos(params = {}) {
  const response = await api.get('/eventos/', { params })
  return response.data
},

  async getEventoById(id) {
    const response = await api.get(`/eventos/${id}/`)
    return response.data
  },

  async getEventosByCategoria(categoriaId) {
    const response = await api.get(`/eventos/?categoria=${categoriaId}`)
    return response.data
  },

  async getEventosByEmpresa(empresaId) {
    const response = await api.get(`/eventos/?empresa=${empresaId}`)
    return response.data
  },

  async createEvento(eventoData) {
    const response = await api.post('/eventos/', eventoData)
    return response.data
  },

  async updateEvento(id, eventoData) {
    const response = await api.put(`/eventos/${id}/`, eventoData)
    return response.data
  },

  async deleteEvento(id) {
    await api.delete(`/eventos/${id}/`)
  },



  // ========== FAVORITOS ==========
  async getFavoritos(usuarioId) {
    const response = await api.get(`/favoritos/?usuario=${usuarioId}`)
    return response.data
  },

  async addFavorito(usuarioId, eventoId) {
    const response = await api.post('/favoritos/', {
      usuario: usuarioId,
      evento: eventoId
    })
    return response.data
  },

  async removeFavorito(favoritoId) {
    await api.delete(`/favoritos/${favoritoId}/`)
  },

  async getFavoritoByUserAndEvent(usuarioId, eventoId) {
    const response = await api.get(`/favoritos/?usuario=${usuarioId}&evento=${eventoId}`)
    return response.data.results?.[0] || null
  },

  // ========== COMENTÁRIOS ==========
  async getComentarios(eventoId) {
    const response = await api.get(`/comentarios/?evento=${eventoId}`)
    return response.data
  },

  async createComentario(comentarioData) {
    const response = await api.post('/comentarios/', comentarioData)
    return response.data
  },

  async deleteComentario(id) {
    await api.delete(`/comentarios/${id}/`)
  },

  // ========== AVALIAÇÕES ==========
  async getAvaliacoes(eventoId) {
    const response = await api.get(`/avaliacoes/?evento=${eventoId}`)
    return response.data
  },

  async createAvaliacao(avaliacaoData) {
    const response = await api.post('/avaliacoes/', avaliacaoData)
    return response.data
  },

  async updateAvaliacao(id, avaliacaoData) {
    const response = await api.put(`/avaliacoes/${id}/`, avaliacaoData)
    return response.data
  },

  // ========== FOTOS DE EVENTOS ==========
  async getFotosEvento(eventoId) {
    const response = await api.get(`/fotos-eventos/?evento=${eventoId}`)
    return response.data
  },

  async uploadFotoEvento(eventoId, fotoFile) {
    const formData = new FormData()
    formData.append('evento', eventoId)
    formData.append('foto', fotoFile)

    const response = await api.post('/fotos-eventos/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  // ========== DENÚNCIAS ==========
  async createDenuncia(denunciaData) {
    const response = await api.post('/denuncias/', denunciaData)
    return response.data
  },

  // ========== UTILITÁRIOS ==========
  async login(email, senha, tipo = 'usuario') {
    try {
      // Como não há endpoint de auth ainda, simularemos a verificação
      if (tipo === 'usuario') {
        const usuario = await this.getUserByEmail(email)
        if (usuario && usuario.senha === senha) {
          return {
            success: true,
            user: usuario,
            token: `fake-token-${usuario.id}`,
            type: 'user'
          }
        }
      } else {
        // Para empresas, você pode implementar similar
        const empresas = await this.getEmpresas()
        const empresa = empresas.results?.find(e => e.email === email)
        if (empresa) {
          return {
            success: true,
            user: empresa,
            token: `fake-token-empresa-${empresa.id}`,
            type: 'company'
          }
        }
      }

      return { success: false, message: 'Credenciais inválidas' }
    } catch (error) {
      console.error('Erro no login:', error)
      return { success: false, message: 'Erro interno do servidor' }
    }
  },

  // Método para testar conectividade
  async testConnection() {
    try {
      const response = await api.get('/categorias/')
      return { success: true, data: response.data }
    } catch (error) {
      console.error('Erro de conectividade:', error)
      return { success: false, error: error.message }
    }
  }
}
export default api
