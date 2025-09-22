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
    // ATUALIZADO: Não precisa mais do ID, a API sabe quem você é pelo token.
  updateUser: (data) => apiClient.patch('usuarios/me/', data),
  // ADICIONADO: Função específica para upload de foto.
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

  // ---------- FAVORITOS ----------
  getFavorites: () => apiClient.get('favoritos/'),
  addFavorite: (data) => apiClient.post('favoritos/', data),
  removeFavorite: (id) => apiClient.delete(`favoritos/${id}/`),
};
