// src/services/api.js

import axios from 'axios';

// Cria uma instância do Axios com a URL base da sua API Django
const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/', // Garanta que a porta está correta
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token de autenticação em todas as requisições
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default {
  // --- Funções de Autenticação ---
  login(credentials) {
    // A rota é 'auth/login/' pois o baseURL já tem '/api/'
    return apiClient.post('auth/login/', credentials);
  },
  registerUser(data) {
    return apiClient.post('auth/register/user/', data);
  },
  registerCompany(data) {
    return apiClient.post('auth/register/company/', data);
  },

  // Você pode adicionar outras funções aqui depois
  // Ex: getEvents() { return apiClient.get('/events/'); }
};