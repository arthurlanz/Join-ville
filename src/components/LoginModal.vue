<template>
  <div v-if="isVisible" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <button class="close-button" @click="close">&times;</button>
      <div class="form-container">
        <h2>{{ isLoginView ? 'Entrar' : 'Cadastro' }}</h2>
        
        <button class="google-btn">
          <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google logo" />
          {{ isLoginView ? 'Entrar com Google' : 'Cadastrar com Google' }}
        </button>
        
        <div class="divider">ou</div>

        <form @submit.prevent="handleSubmit">
          <div class="input-group">
            <label for="email">Email</label>
            <input type="email" id="email" v-model="email" required placeholder="seuemail@exemplo.com">
          </div>
          <div class="input-group">
            <label for="password">Senha</label>
            <input type="password" id="password" v-model="password" required placeholder="********">
          </div>
          
          <template v-if="!isLoginView">
            <div class="input-group">
              <label for="confirm-password">Confirme a senha</label>
              <input type="password" id="confirm-password" v-model="confirmPassword" required placeholder="********">
            </div>

            <div class="account-type-box">
              <label class="group-title">Deseja criar uma conta:</label>
              <div class="radio-option">
                <input type="radio" id="empresa" value="empresa" v-model="accountType">
                <label for="empresa">
                  <strong>Empresa</strong>
                  <span>Digite um CNPJ válido</span>
                </label>
              </div>
              <div class="radio-option">
                <input type="radio" id="usuario" value="usuario" v-model="accountType">
                <label for="usuario">
                  <strong>Usuário comum</strong>
                  <span>Digite um CPF válido</span>
                </label>
              </div>
            </div>
          </template>

          <button type="submit" class="submit-btn">{{ isLoginView ? 'Entrar' : 'Criar Conta' }}</button>
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
import { ref } from 'vue';

const props = defineProps({
  isVisible: Boolean,
});

const emit = defineEmits(['close-modal']);

const isLoginView = ref(false); // Começa na tela de Cadastro por padrão
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const accountType = ref('usuario'); // 'usuario' selecionado por padrão

const close = () => {
  emit('close-modal');
};

const handleSubmit = () => {
  if (!isLoginView.value) {
    if (password.value !== confirmPassword.value) {
      alert('As senhas não coincidem!');
      return;
    }
  }
  // Lógica de login/cadastro com o backend iria aqui
  alert('Funcionalidade de exemplo! Conecte ao seu backend Django aqui.');
  close();
};
</script>

<style scoped>
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex; justify-content: center; align-items: center;
  z-index: 2000;
}
.modal-content {
  background: white; padding: 25px 40px; border-radius: 15px;
  width: 90%; max-width: 420px;
  position: relative; box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}
.close-button {
  position: absolute; top: 10px; right: 15px;
  background: none; border: none; font-size: 28px; cursor: pointer; color: #aaa;
}
.form-container h2 {
  text-align: center; margin-bottom: 20px; color: #333; font-size: 24px;
}
.google-btn {
  width: 100%; display: flex; align-items: center; justify-content: center;
  gap: 12px; padding: 10px; font-size: 15px; background: #fff;
  border: 1px solid #ddd; border-radius: 8px; cursor: pointer;
  transition: background-color 0.2s;
}
.google-btn:hover { background-color: #f7f7f7; }
.google-btn img { width: 20px; height: 20px; }
.divider {
  text-align: center; color: #aaa; font-size: 14px;
  margin: 20px 0;
}
.input-group { margin-bottom: 18px; }
.input-group label {
  display: block; margin-bottom: 6px; font-weight: 500; color: #555; font-size: 14px;
}
.input-group input {
  width: 100%; padding: 12px; border: 1px solid #ccc;
  border-radius: 8px; font-size: 16px;
}
.submit-btn {
  width: 100%; padding: 12px; background-color: #1e4d8b; color: white;
  border: none; border-radius: 8px; font-size: 16px; font-weight: bold;
  cursor: pointer; transition: background-color 0.2s; margin-top: 10px;
}
.submit-btn:hover { background-color: #164080; }
.toggle-view {
  text-align: center; margin-top: 20px; font-size: 14px;
}
.toggle-view a {
  color: #1e4d8b; font-weight: 500; text-decoration: none;
}
/* Estilos para a caixa de tipo de conta */
.account-type-box {
  background-color: #f7f7f7;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
}
.group-title {
  font-weight: 500;
  color: #333;
  margin-bottom: 15px;
  display: block;
}
.radio-option {
  display: flex;
  align-items: center;
}
.radio-option:not(:last-child) {
  margin-bottom: 10px;
}
.radio-option input[type="radio"] {
  margin-right: 12px;
  width: 18px;
  height: 18px;
}
.radio-option label {
  display: flex;
  flex-direction: column;
}
.radio-option label strong {
  font-weight: 500;
  color: #333;
}
.radio-option label span {
  font-size: 12px;
  color: #777;
}
</style>