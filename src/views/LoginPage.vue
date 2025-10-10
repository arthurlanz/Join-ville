<template>
  <div class="login-modal-overlay" @click.self="closeModal">
    <div class="login-modal">
      <button class="close-modal" @click="closeModal">×</button>

      <div class="login-header">
        <div class="logo-section">
          <img src="/logotipo.png" alt="JoinVille" class="modal-logo" />
        </div>
        <h1>{{ isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta' }}</h1>
        <p>
          {{
            isLogin
              ? 'Faça login para gerenciar seus eventos'
              : 'Junte-se à nossa comunidade de eventos'
          }}
        </p>
      </div>

      <div class="auth-tabs">
        <button :class="{ active: isLogin }" @click="isLogin = true" class="tab-btn">Entrar</button>
        <button :class="{ active: !isLogin }" @click="isLogin = false" class="tab-btn">
          Cadastrar
        </button>
      </div>

      <div class="auth-toggle" v-if="!isLogin">
        <button
          :class="{ active: userType === 'user' }"
          @click="userType = 'user'"
          class="toggle-btn"
        >
          👤 Usuário
        </button>
        <button
          :class="{ active: userType === 'company' }"
          @click="userType = 'company'"
          class="toggle-btn"
        >
          🏢 Empresa
        </button>
      </div>

      <div class="social-login">
        </div>

      <div class="divider">
        <span>ou</span>
      </div>

      <form @submit.prevent="handleSubmit" class="login-form">
        <div v-if="!isLogin && userType === 'user'" class="form-group">
          <label>Nome completo</label>
          <input type="text" v-model="formData.name" required placeholder="Seu nome completo" />
        </div>

        <template v-if="!isLogin && userType === 'company'">
          <div class="form-group">
            <label>Nome da empresa</label>
            <input
              type="text"
              v-model="formData.companyName"
              required
              placeholder="Nome da sua empresa"
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>CNPJ</label>
              <input
                type="text"
                v-model="formData.cnpj"
                required
                placeholder="00.000.000/0000-00"
                @input="formatCNPJ"
              />
            </div>

            <div class="form-group">
              <label>Telefone</label>
              <input
                type="text"
                v-model="formData.phone"
                required
                placeholder="(47) 99999-9999"
                @input="formatPhone"
              />
            </div>
          </div>
        </template>

        <div class="form-group">
          <label>Email</label>
          <input type="email" v-model="formData.email" required placeholder="seu@email.com" />
        </div>

        <div class="form-group">
          <label>Senha</label>
          <div class="password-input-wrapper">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="formData.password"
              required
              placeholder="Sua senha"
            />
            <button type="button" @click="showPassword = !showPassword" class="toggle-password">
              {{ showPassword ? '👁️' : '👁️‍🗨️' }}
            </button>
          </div>
        </div>

        <div v-if="!isLogin" class="form-group">
          <label>Confirmar senha</label>
          <div class="password-input-wrapper">
            <input
              :type="showConfirmPassword ? 'text' : 'password'"
              v-model="formData.confirmPassword"
              required
              placeholder="Confirme sua senha"
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="toggle-password"
            >
              {{ showConfirmPassword ? '👁️' : '👁️‍🗨️' }}
            </button>
          </div>
        </div>

        <button type="submit" class="btn-submit" :disabled="loading">
          <span v-if="loading" class="spinner"></span>
          {{ loading ? 'Processando...' : isLogin ? 'Entrar' : 'Criar conta' }}
        </button>
      </form>

      <div class="form-footer">
        <p>
          {{ isLogin ? 'Ainda não tem conta?' : 'Já tem uma conta?' }}
          <button @click="toggleMode" class="link-btn">
            {{ isLogin ? 'Cadastre-se' : 'Faça login' }}
          </button>
        </p>
      </div>

      <transition name="fade">
        <div v-if="message" :class="['message', messageType]">
          {{ message }}
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
// --- PASSO 1: Importar a store de autenticação ---
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
// --- PASSO 2: Instanciar a store ---
const authStore = useAuthStore();

const isLogin = ref(true);
const userType = ref('user');
const loading = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const message = ref('');
const messageType = ref('success');

const formData = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  name: '',
  companyName: '',
  cnpj: '',
  phone: '',
});

const closeModal = () => {
  // Redireciona para a página de perfil correta após o login
  if (authStore.isAuthenticated) {
    if (authStore.userType === 'EMPRESA') {
      router.push('/company-profile');
    } else {
      router.push('/user-profile');
    }
  } else {
    router.push('/');
  }
};

const toggleMode = () => {
  isLogin.value = !isLogin.value;
  clearForm();
  message.value = '';
};

const clearForm = () => {
  Object.keys(formData).forEach(key => (formData[key] = ''));
};

const showMessage = (text, type, duration = 5000) => {
  message.value = text;
  messageType.value = type;
  if (duration) {
    setTimeout(() => (message.value = ''), duration);
  }
};

const getErrorMessage = (error) => {
  if (!error.response || !error.response.data) {
    return 'Erro de conexão. Tente novamente mais tarde.';
  }
  const data = error.response.data;
  const firstErrorKey = Object.keys(data)[0];
  return Array.isArray(data[firstErrorKey]) ? data[firstErrorKey][0] : data[firstErrorKey];
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  loading.value = true;
  message.value = '';

  try {
    if (isLogin.value) {
      await handleLogin();
    } else {
      await handleRegister();
    }
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    showMessage(errorMessage, 'error');
  } finally {
    loading.value = false;
  }
};

const validateForm = () => {
  if (!isLogin.value && formData.password !== formData.confirmPassword) {
    showMessage('As senhas não coincidem!', 'error');
    return false;
  }
  return true;
};

const handleLogin = async () => {
  try {
    const response = await api.login({
      email: formData.email,
      password: formData.password,
    });

    // --- PASSO 3: Centralizar a lógica na store ---
    // Em vez de manipular o localStorage aqui, chamamos a action da store.
    // A store será responsável por salvar o estado e o localStorage.
    authStore.setAuthData(response);

    showMessage('Login realizado com sucesso!', 'success');
    setTimeout(() => closeModal(), 1500);

  } catch (err) {
    console.error('Erro de login:', err);
    // Sua API de login retorna um 'detail' em caso de erro 401
    const errorMessage = err.response?.data?.detail || 'Erro ao fazer login. Verifique email e senha.';
    showMessage(errorMessage, 'error');
  }
};

// A função de registro continua a mesma, está ótima!
const handleRegister = async () => {
  if (userType.value === 'user') {
    const userData = {
      email: formData.email,
      password: formData.password,
      username: formData.email.split('@')[0],
      first_name: formData.name,
    };
    await api.registerUser(userData);
  } else {
    const companyData = {
      email: formData.email,
      password: formData.password,
      username: formData.companyName.replace(/\s+/g, ''),
      nome_empresa: formData.companyName,
      cnpj: formData.cnpj.replace(/\D/g, ''),
      telefone: formData.phone.replace(/\D/g, ''),
    };
    await api.registerCompany(companyData);
  }
  showMessage('Conta criada com sucesso! Redirecionando para o login...', 'success');
  setTimeout(() => {
    isLogin.value = true;
    clearForm();
  }, 2000);
};

// --- formatações (sem alterações) ---
const formatCNPJ = (event) => {
  let value = event.target.value.replace(/\D/g, '');
  value = value.slice(0, 14);
  value = value.replace(/^(\d{2})(\d)/, '$1.$2');
  value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
  value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
  value = value.replace(/(\d{4})(\d)/, '$1-$2');
  formData.cnpj = value;
};

const formatPhone = (event) => {
  let value = event.target.value.replace(/\D/g, '');
  value = value.slice(0, 11);
  if (value.length > 2) {
    value = `(${value.substring(0, 2)}) ${value.substring(2)}`;
  }
  if (value.length > 9) {
    value = `${value.substring(0, 10)}-${value.substring(10)}`;
  }
  formData.phone = value;
};
</script>

<style scoped>
.login-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 1rem;
  overflow-y: auto;
}

.login-modal {
  background: white;
  border-radius: 24px;
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 2.5rem;
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.close-modal {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: none;
  border: none;
  font-size: 2rem;
  color: #999;
  cursor: pointer;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.close-modal:hover {
  background: #f5f5f5;
  color: #333;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-section {
  margin-bottom: 1rem;
}

.modal-logo {
  height: 40px;
}

.login-header h1 {
  color: #1e4d8b;
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.login-header p {
  color: #666;
  font-size: 0.95rem;
}

.auth-tabs {
  display: flex;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 1.5rem;
}

.auth-tabs .tab-btn {
  flex: 1;
  background: transparent;
  border: none;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  color: #666;
  transition: all 0.3s;
}

.auth-tabs .tab-btn.active {
  background: white;
  color: #1e4d8b;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.auth-toggle {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.toggle-btn {
  flex: 1;
  background: #f8f9fa;
  border: 2px solid transparent;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
  color: #666;
}

.toggle-btn.active {
  background: #e8f0fe;
  border-color: #1e4d8b;
  color: #1e4d8b;
}

.social-login {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  font-weight: 500;
  color: #333;
  transition: all 0.3s;
}

.social-btn:hover {
  background: #f8f9fa;
  border-color: #999;
  transform: translateY(-1px);
}

.divider {
  text-align: center;
  margin: 1.5rem 0;
  position: relative;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e0e0e0;
}

.divider span {
  background: white;
  padding: 0 1rem;
  position: relative;
  color: #999;
  font-size: 0.9rem;
}

.login-form {
  margin-bottom: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
  font-size: 0.9rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #1e4d8b;
  background: #f8f9fa;
}

.password-input-wrapper {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  opacity: 0.6;
  transition: opacity 0.3s;
}

.toggle-password:hover {
  opacity: 1;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.remember-me {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 0.9rem;
  color: #666;
}

.remember-me input {
  width: auto;
  margin-right: 0.5rem;
}

.forgot-link {
  background: none;
  border: none;
  color: #1e4d8b;
  cursor: pointer;
  font-size: 0.9rem;
  text-decoration: none;
}

.forgot-link:hover {
  text-decoration: underline;
}

.btn-submit {
  width: 100%;
  background: linear-gradient(135deg, #1e4d8b 0%, #2d5aa0 100%);
  color: white;
  padding: 0.875rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-submit:hover:not(:disabled) {
  background: linear-gradient(135deg, #164080 0%, #1e4d8b 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(30, 77, 139, 0.3);
}

.btn-submit:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid #ffffff30;
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.form-footer {
  text-align: center;
  color: #666;
}

.link-btn {
  background: none;
  border: none;
  color: #1e4d8b;
  cursor: pointer;
  text-decoration: none;
  font-weight: 600;
}

.link-btn:hover {
  text-decoration: underline;
}

.message {
  padding: 0.75rem;
  border-radius: 8px;
  margin-top: 1rem;
  text-align: center;
  font-size: 0.9rem;
  animation: fadeIn 0.3s ease;
}

.message.success {
  background: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.message.error {
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.message.info {
  background: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsividade */
@media (max-width: 768px) {
  .login-modal {
    padding: 2rem;
    margin: 1rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .login-header h1 {
    font-size: 1.5rem;
  }

  .close-modal {
    top: 1rem;
    right: 1rem;
  }
}

@media (max-width: 480px) {
  .login-modal {
    padding: 1.5rem;
  }

  .auth-toggle {
    flex-direction: column;
  }

  .form-options {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>
