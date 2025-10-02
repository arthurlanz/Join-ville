<template>
  <div class="chat-room-page">
    <div class="chat-header" v-if="chatStore.activeRoom">
      <router-link to="/chat" class="back-link">←</router-link>
      <img
        :src="otherParticipant.avatar || '/default-avatar.png'"
        class="header-avatar"
        alt="avatar"
      />
      <h3>{{ otherParticipant.nome_empresa || otherParticipant.username }}</h3>
    </div>

    <div class="messages-container" ref="messagesContainer">
      <div v-if="chatStore.loading" class="loading-messages">Carregando mensagens...</div>
      <div
        v-for="message in messages"
        :key="message.timestamp"
        :class="[
          'message-bubble-wrapper',
          { 'sent-wrapper': isSentByMe(message), 'received-wrapper': !isSentByMe(message) },
        ]"
      >
        <div class="message-bubble">
          <p>{{ message.content || message.message }}</p>
          <span class="timestamp">{{
            new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })
          }}</span>
        </div>
      </div>
    </div>

    <div class="message-input-area">
      <input
        type="text"
        v-model="newMessage"
        @keyup.enter="handleSendMessage"
        placeholder="Digite sua mensagem..."
      />
      <button @click="handleSendMessage" :disabled="!newMessage.trim()">Enviar</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useChatStore } from '@/stores/chat'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const chatStore = useChatStore()
const authStore = useAuthStore()

const roomId = route.params.id
const newMessage = ref('')
const messagesContainer = ref(null)

const messages = computed(() => chatStore.messages)
const currentUser = computed(() => authStore.user)

const otherParticipant = computed(() => {
  if (!chatStore.activeRoom || !currentUser.value) return {}
  const room = chatStore.activeRoom
  return currentUser.value.id === room.usuario.id ? room.empresa : room.usuario
})

const isSentByMe = (message) => {
  return message.sender.id === currentUser.value?.id
}

const scrollToBottom = () => {
  nextTick(() => {
    const container = messagesContainer.value
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  })
}

onMounted(async () => {
  await chatStore.fetchMessages(roomId)
  chatStore.connectWebSocket(roomId)
})

onUnmounted(() => {
  chatStore.clearChatState()
})

const handleSendMessage = () => {
  if (newMessage.value.trim()) {
    chatStore.sendMessage(newMessage.value)
    newMessage.value = ''
  }
}

watch(
  messages,
  () => {
    scrollToBottom()
  },
  { deep: true }
)

watch(
  () => chatStore.loading,
  (isLoading) => {
    if (!isLoading) {
      scrollToBottom()
    }
  }
)
</script>

<style scoped>
.chat-room-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f0f2f5;
  max-width: 800px;
  margin: auto;
}
.chat-header {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
.back-link {
  font-size: 1.5rem;
  text-decoration: none;
  color: #333;
  margin-right: 15px;
}
.header-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}
.messages-container {
  flex-grow: 1;
  overflow-y: auto;
  padding: 20px;
}
.message-bubble-wrapper {
  display: flex;
  margin-bottom: 15px;
}
.sent-wrapper {
  justify-content: flex-end;
}
.received-wrapper {
  justify-content: flex-start;
}
.message-bubble {
  max-width: 70%;
  padding: 10px 15px;
  border-radius: 18px;
  line-height: 1.4;
}
.sent-wrapper .message-bubble {
  background-color: #dcf8c6;
}
.received-wrapper .message-bubble {
  background-color: #ffffff;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
}
.message-bubble p {
  margin: 0;
  word-wrap: break-word;
}
.timestamp {
  font-size: 0.75em;
  color: #999;
  display: block;
  text-align: right;
  margin-top: 5px;
}
.message-input-area {
  display: flex;
  padding: 10px;
  background: white;
  border-top: 1px solid #ddd;
}
.message-input-area input {
  flex-grow: 1;
  padding: 12px;
  border-radius: 20px;
  border: 1px solid #ccc;
  background: #f0f2f5;
}
.message-input-area button {
  margin-left: 10px;
  padding: 12px 20px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 20px;
  cursor: pointer;
}
.message-input-area button:disabled {
  background-color: #a0c3e6;
}
</style>
