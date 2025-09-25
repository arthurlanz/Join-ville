// src/services/api.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  // Não definir Content-Type global
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

  // ---------- FAVORITOS ----------
  getFavorites: () => apiClient.get('favoritos/'),
  addFavorite: (data) => apiClient.post('favoritos/', data),
  removeFavorite: (id) => apiClient.delete(`favoritos/${id}/`),
};
