<template>
  <div v-if="isVisible" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <button class="close-button" @click="close">&times;</button>
      <div class="form-container">
        <h2>{{ isLoginView ? 'Entrar' : 'Cadastrar' }}</h2>
        <form @submit.prevent="handleSubmit">
          <div v-if="!isLoginView" class="input-group">
            <label for="name">Nome</label>
            <input type="text" id="name" required>
          </div>
          <div class="input-group">
            <label for="email">Email</label>
            <input type="email" id="email" required>
          </div>
          <div class="input-group">
            <label for="password">Senha</label>
            <input type="password" id="password" required>
          </div>
          <button type="submit" class="submit-btn">{{ isLoginView ? 'Login' : 'Criar Conta' }}</button>
        </form>
        <p class="toggle-view">
          {{ isLoginView ? 'Não tem uma conta?' : 'Já tem uma conta?' }}
          <a href="#" @click.prevent="isLoginView = !isLoginView">
            {{ isLoginView ? 'Cadastre-se' : 'Faça login' }}
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  isVisible: Boolean,
});

const emit = defineEmits(['close-modal']);

const isLoginView = ref(true);

const close = () => {
  emit('close-modal');
};

const handleSubmit = () => {
  // Aqui iria a lógica de login/cadastro com o backend
  alert('Funcionalidade de exemplo! Conecte ao seu backend Django aqui.');
  close();
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}
.modal-content {
  background: white;
  padding: 40px;
  border-radius: 10px;
  width: 90%;
  max-width: 400px;
  position: relative;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}
.close-button {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #888;
}
.form-container h2 {
  text-align: center;
  margin-bottom: 25px;
  color: #333;
}
.input-group {
  margin-bottom: 20px;
}
.input-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}
.input-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
}
.submit-btn {
  width: 100%;
  padding: 12px;
  background-color: #0066cc;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
}
.submit-btn:hover {
  background-color: #0052a3;
}
.toggle-view {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
}
.toggle-view a {
  color: #0066cc;
  font-weight: 500;
  text-decoration: none;
}
</style>