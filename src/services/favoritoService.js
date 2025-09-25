import api from './api'

export const favoritoService = {
  getFavoritos: () => api.get('/favoritos/'),
  addFavorito: (data) => api.post('/favoritos/', data),
  removeFavorito: (id) => api.delete(`/favoritos/${id}/`),
  getFavoritoByEvento: async (eventoId) => {
    const response = await api.get('/favoritos/');
    return response.data.find(f => f.evento === eventoId);
  }
}
