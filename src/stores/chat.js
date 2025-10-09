// src/stores/chat.js
import { defineStore } from 'pinia';
import api from '@/services/api';
import { useAuthStore } from './auth'; // Assumindo que você tenha uma authStore. Se não, adaptaremos.

export const useChatStore = defineStore('chat', {
  state: () => ({
    chatRooms: [],      // Lista de todas as conversas do usuário
    activeRoom: null,   // Objeto da sala de chat ativa
    messages: [],       // Array de mensagens da sala ativa
    socket: null,       // Instância do WebSocket
    loading: false,
    error: null,
  }),

  actions: {
    async fetchChatRooms() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.getChatRooms();
        this.chatRooms = response.data;
      } catch (e) {
        this.error = 'Não foi possível carregar suas conversas.';
        console.error(e);
      } finally {
        this.loading = false;
      }
    },

    async startChatWith(empresaId) {
      this.loading = true
      try {
        // ✅ Envia corretamente como objeto
        const response = await api.startChat(empresaId)

        const existingRoom = this.chatRooms.find(room => room.id === response.data.id)
        if (!existingRoom) {
          this.chatRooms.unshift(response.data)
        }
        return response.data
      } catch (error) {
        console.error("Erro ao iniciar chat:", error.response?.data)
        this.error = "Não foi possível iniciar o chat."
        return null
      } finally {
        this.loading = false
      }
    },

    async fetchMessages(roomId) {
      this.loading = true;
      try {
        const [messagesResponse, roomResponse] = await Promise.all([
          api.getChatMessages(roomId),
          api.getChatRoomDetails(roomId)
        ]);
        this.messages = messagesResponse.data;
        this.activeRoom = roomResponse.data;
      } catch (e) {
        console.error(e);
        this.error = 'Não foi possível carregar as mensagens.';
      } finally {
        this.loading = false;
      }
    },

    connectWebSocket(roomId) {
  if (this.socket) {
    this.socket.close()
  }

  const token = localStorage.getItem('accessToken')
  if (!token) {
    console.error("Token não encontrado")
    return
  }

  // ✅ URL corrigida
  const wsUrl = `ws://localhost:8000/ws/chat/${roomId}/?token=${token}`

  // Em produção, use:
  // const wsUrl = `wss://join-villeapi.fabricadesoftware.ifc.edu.br/ws/chat/${roomId}/?token=${token}`

  this.socket = new WebSocket(wsUrl)

  this.socket.onopen = () => console.log("WebSocket conectado!")

  this.socket.onmessage = (event) => {
    const data = JSON.parse(event.data)
    this.messages.push(data)
  }

  this.socket.onclose = () => console.log("WebSocket desconectado")
  this.socket.onerror = (error) => console.error("Erro WebSocket:", error)
},

    sendMessage(messageContent) {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.socket.send(JSON.stringify({ 'message': messageContent }));
      } else {
        console.error("Socket não está conectado ou pronto.");
      }
    },

    clearChatState() {
      if (this.socket) {
        this.socket.close();
      }
      this.activeRoom = null;
      this.messages = [];
      this.socket = null;
    }
  },
});
