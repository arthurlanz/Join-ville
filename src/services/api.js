// src/services/api.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  headers: { 'Content-Type': 'application/json' },
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
  createEvent: (data) => apiClient.post('eventos/', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getEvents: () => apiClient.get('eventos/'),
  getEvent: (id) => apiClient.get(`eventos/${id}/`),
  getCategories: () => apiClient.get('categorias/'),
  // ADICIONADO: Função para buscar os eventos da empresa logada
  getCompanyEvents: () => apiClient.get('eventos/my_events/'),
   updateEvent: (id, data) => apiClient.patch(`eventos/${id}/`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteEvent: (id) => apiClient.delete(`eventos/${id}/`),

  // ---------- FAVORITOS ----------
  getFavorites: () => apiClient.get('favoritos/'),
  addFavorite: (data) => apiClient.post('favoritos/', data),
  removeFavorite: (id) => apiClient.delete(`favoritos/${id}/`),
};
