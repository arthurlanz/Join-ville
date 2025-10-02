// src/plugins/axios.js
import axios from 'axios';

axios.defaults.baseURL = 'https://join-villeapi.fabricadesoftware.ifc.edu.br/api/';

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Exporta como default para poder importar facilmente
export default axios;
