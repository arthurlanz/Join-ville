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
    userType: (state) => state.user?.tipo_usuario || null,

    // 🔑 NOVO GETTER: Retorna a URL do avatar (ou null se não tiver)
    userAvatarUrl: (state) => state.user?.avatar || null,

    // Auxiliar para rotas de perfil
    profileRouteName: (state) => {
        if (state.user?.tipo_usuario === 'EMPRESA') return 'CompanyProfile';
        if (state.user?.tipo_usuario === 'USUARIO') return 'UserProfile';
        return 'Home';
    },

    // Auxiliar para a Sidebar (se necessário)
    isCompany: (state) => state.user?.tipo_usuario === 'EMPRESA',
  },

  // 3. ACTIONS: Funções que alteram o estado.
  actions: {
    setAuthData(loginResponse) {
      const { access, user } = loginResponse.data;

      this.accessToken = access;
      this.user = user;

      localStorage.setItem('accessToken', access);
      localStorage.setItem('user', JSON.stringify(user));
      // Garante que o tipo de usuário seja sempre salvo em MAIÚSCULAS
      localStorage.setItem('userType', user.tipo_usuario.toUpperCase());
    },

    logout() {
      this.accessToken = null;
      this.user = null;

      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      localStorage.removeItem('userType');

      window.location.href = '/login';
    },

    async fetchUser() {
      if (this.accessToken && !this.user) {
        try {
          // Usando o endpoint 'usuarios/me/' para buscar o usuário logado
          const response = await api.getCurrentUser();
          this.user = response.data;
          localStorage.setItem('user', JSON.stringify(this.user));
          // Sincroniza o tipo de usuário no localStorage caso não esteja lá
          localStorage.setItem('userType', this.user.tipo_usuario.toUpperCase());
        } catch (error) {
          console.error('Sessão expirada. Fazendo logout...');
          this.logout();
        }
      }
    },

    // 🔑 NOVA ACTION: Atualiza a informação do usuário (usada após editar o perfil ou avatar)
    updateUser(updatedUserData) {
        // Mescla os novos dados (incluindo o novo avatar) com os antigos
        this.user = { ...this.user, ...updatedUserData };
        // Atualiza também o localStorage para persistência
        localStorage.setItem('user', JSON.stringify(this.user));
    }
  }
});
