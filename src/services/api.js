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
  updateUser: (id, data) => apiClient.put(`usuarios/${id}/`, data),
  changePassword: (data) => apiClient.post('usuarios/change_password/', data),

  // ---------- EVENTOS ----------
  getEvents: () => apiClient.get('eventos/'),
  getEvent: (id) => apiClient.get(`eventos/${id}/`),

  // ---------- FAVORITOS ----------
  getFavorites: () => apiClient.get('favoritos/'),
  addFavorite: (data) => apiClient.post('favoritos/', data),
  removeFavorite: (id) => apiClient.delete(`favoritos/${id}/`),

  // ---------- HISTÓRICO (se existir no back) ----------
  getHistory: () => apiClient.get('historico/'), // <- ajuste se a sua rota for diferente
};
