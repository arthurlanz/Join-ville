<template>
  <div class="chat-list-page">
    <div class="container">
      <h1>Minhas Conversas</h1>
      <div v-if="chatStore.loading" class="loading-state">Carregando...</div>
      <div v-else-if="chatStore.error" class="error-state">{{ chatStore.error }}</div>
      <div v-else-if="chatRooms.length" class="chat-list">
        <div v-for="room in chatRooms" :key="room.id" class="chat-item" @click="goToRoom(room.id)">
          <img
            :src="getOtherParticipant(room).avatar || '/default-avatar.png'"
            alt="avatar"
            class="avatar"
          />
          <div class="chat-item-details">
            <span class="participant-name">{{
              getOtherParticipant(room).nome_empresa || getOtherParticipant(room).username
            }}</span>
            <p class="last-message">
              {{
                room.last_message
                  ? truncate(room.last_message.content, 40)
                  : 'Nenhuma mensagem ainda.'
              }}
            </p>
          </div>
        </div>
      </div>
      <div v-else class="empty-state">
        <p>Você ainda não iniciou nenhuma conversa.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useChatStore } from '@/stores/chat'
import { useAuthStore } from '@/stores/auth' // Você precisa ter uma authStore

const chatStore = useChatStore()
const authStore = useAuthStore()
const router = useRouter()

const chatRooms = computed(() => chatStore.chatRooms)
const currentUser = computed(() => authStore.user) // Ajuste para pegar o usuário logado da sua store

onMounted(() => {
  chatStore.fetchChatRooms()
})

const getOtherParticipant = (room) => {
  if (!currentUser.value) return room.empresa // Fallback
  return currentUser.value.id === room.usuario.id ? room.empresa : room.usuario
}

const goToRoom = (roomId) => {
  router.push({ name: 'ChatRoom', params: { id: roomId } })
}

const truncate = (text, length) => {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}
.chat-list-page h1 {
  margin-bottom: 2rem;
}
.chat-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: box-shadow 0.2s;
}
.chat-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 1rem;
  object-fit: cover;
}
.participant-name {
  font-weight: bold;
}
.last-message {
  color: #555;
  font-size: 0.9em;
  margin: 0.25rem 0 0;
}
.empty-state,
.loading-state,
.error-state {
  text-align: center;
  padding: 2rem;
  color: #666;
}
</style>
