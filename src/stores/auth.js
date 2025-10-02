// src/stores/auth.js
import { defineStore } from 'pinia';
import api from '@/services/api';

export const useAuthStore = defineStore('auth', {
  // 1. STATE: Inicializa o estado buscando dados do localStorage.
  state: () => ({
    accessToken: localStorage.getItem('accessToken') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
  }),

  // 2. GETTERS: Atalhos para dados computados.
  getters: {
    isAuthenticated: (state) => !!state.accessToken,
    // Retorna o tipo de usuário ou null se não estiver logado
    userType: (state) => state.user?.tipo_usuario || null,
  },

  // 3. ACTIONS: Funções que alteram o estado.
  actions: {
    // Ação chamada após um login bem-sucedido
    setAuthData(loginResponse) {
      // Extrai os dados da resposta da sua API de login
      const { access, user } = loginResponse.data;

      this.accessToken = access;
      this.user = user;

    // Salva no localStorage para persistir a sessão
    localStorage.setItem('accessToken', access);
    localStorage.setItem('user', JSON.stringify(user));
    // 🔑 CORREÇÃO: Salvando userType em MAIÚSCULAS
    localStorage.setItem('userType', user.tipo_usuario.toUpperCase());
},

    // Ação para fazer logout
    logout() {
      this.accessToken = null;
      this.user = null;

      // Limpa tudo do localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      localStorage.removeItem('userType');

      // Forma mais simples de redirecionar
      window.location.href = '/login';
    },

    // Ação para buscar dados do usuário se tivermos o token mas não o objeto 'user'
    async fetchUser() {
      if (this.accessToken && !this.user) {
        try {
          const response = await api.getCurrentUser();
          this.user = response.data;
          localStorage.setItem('user', JSON.stringify(this.user));
        } catch (error) {
          console.error('Sessão expirada. Fazendo logout.', error);
          this.logout();
        }
      }
    },
  },
});
