// src/services/api.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://join-villeapi.fabricadesoftware.ifc.edu.br/api/',
});

apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  },
  error => Promise.reject(error)
);

export default {
  // ---------- AUTH ----------
  login: (credentials) => apiClient.post('auth/login/', credentials),
  registerUser: (data) => apiClient.post('auth/register/user/', data),
  registerCompany: (data) => apiClient.post('auth/register/company/', data),

  // ---------- USUÁRIO ----------
  getCurrentUser: () => apiClient.get('usuarios/me/'),
  updateUser: (data) => apiClient.patch('usuarios/me/', data),
  updateUserAvatar: (formData) => apiClient.patch('usuarios/me/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),

  // ---------- EVENTOS ----------
  createEvent: (formData) => apiClient.post('eventos/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getEvents: () => apiClient.get('eventos/'),
  getEvent: (id) => apiClient.get(`eventos/${id}/`),
  getCategories: () => apiClient.get('categorias/'),
  getCompanyEvents: () => apiClient.get('eventos/my_events/'),
  updateEvent: (id, formData) => apiClient.patch(`eventos/${id}/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteEvent: (id) => apiClient.delete(`eventos/${id}/`),

  // 🆕 INTERESSE EM EVENTOS
  showInterestInEvent: (eventId) => apiClient.post(`eventos/${eventId}/show_interest/`),

  // ---------- CHAT ----------
  getChatRooms: () => apiClient.get('chat/'),
  startChat: (empresaId) => apiClient.post('chat/', { empresa_id: empresaId }),
  getChatRoomDetails: (roomId) => apiClient.get(`chat/${roomId}/`),
  getChatMessages: (roomId) => apiClient.get(`chat/${roomId}/messages/`),
  getChatUnreadCount: () => apiClient.get('chat/unread_count/'),

  // ---------- FAVORITOS ----------
  getFavorites: () => apiClient.get('favoritos/'),
  addFavorite: (data) => apiClient.post('favoritos/', data),
  removeFavorite: (id) => apiClient.delete(`favoritos/${id}/`),

  // 🆕 PERFIL PÚBLICO DE EMPRESA
  getCompanyPublicProfile: (id) => apiClient.get(`usuarios/${id}/public_profile/`),

  // 🆕 FOLLOW/UNFOLLOW
  followCompany: (id) => apiClient.post(`usuarios/${id}/follow/`),
  unfollowCompany: (id) => apiClient.delete(`usuarios/${id}/unfollow/`),
  getFollowingCompanies: () => apiClient.get('usuarios/following/'),

  // 🆕 DASHBOARD ANALYTICS (EMPRESAS)
  getDashboardAnalytics: () => apiClient.get('usuarios/dashboard_analytics/'),

  // 🆕 AVALIAÇÕES DE EMPRESAS
  getCompanyReviews: (empresaId) => apiClient.get(`avaliacoes-empresas/?empresa=${empresaId}`),
  createCompanyReview: (data) => apiClient.post('avaliacoes-empresas/', data),
  getMyReviews: () => apiClient.get('avaliacoes-empresas/my_reviews/'),
};
