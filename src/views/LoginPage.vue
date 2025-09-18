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

      <div class="auth-toggle">
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

      <!-- Login com Redes Sociais -->
      <div class="social-login">
        <button @click="loginWithGoogle" class="social-btn google-btn">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width="20" />
          <span>{{ isLogin ? 'Entrar' : 'Cadastrar' }} com Google</span>
        </button>

      </div>

      <div class="divider">
        <span>ou</span>
      </div>

      <form @submit.prevent="handleSubmit" class="login-form">
        <!-- Campos para Cadastro de Usuário -->
        <div v-if="!isLogin && userType === 'user'" class="form-group">
          <label>Nome completo</label>
          <input type="text" v-model="formData.name" required placeholder="Seu nome completo" />
        </div>

        <!-- Campos para Cadastro de Empresa -->
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

        <!-- Campos comuns -->
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

        <!-- Confirmar senha para cadastro -->
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

        <!-- Lembrar de mim / Esqueceu senha -->
        <div v-if="isLogin" class="form-options">
          <label class="remember-me">
            <input type="checkbox" v-model="rememberMe" />
            <span>Lembrar de mim</span>
          </label>
          <button type="button" @click="showForgotPassword" class="forgot-link">
            Esqueceu sua senha?
          </button>
        </div>

        <button type="submit" class="btn-submit" :disabled="loading || (!isLogin && !acceptTerms)">
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

      <!-- Mensagem de erro/sucesso -->
      <transition name="fade">
        <div v-if="message" :class="['message', messageType]">
          {{ message }}
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      isLogin: true,
      userType: 'user',
      loading: false,
      showPassword: false,
      showConfirmPassword: false,
      acceptTerms: false,
      rememberMe: false,
      message: '',
      messageType: 'success',
      formData: {
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        companyName: '',
        cnpj: '',
        phone: '',
      },
    }
  },
  methods: {
    closeModal() {
      this.$router.push('/')
    },

    toggleMode() {
      this.isLogin = !this.isLogin
      this.clearForm()
      this.message = ''
    },

    clearForm() {
      this.formData = {
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        companyName: '',
        cnpj: '',
        phone: '',
      }
      this.acceptTerms = false
    },

    formatCNPJ(event) {
      let value = event.target.value.replace(/\D/g, '')
      value = value.replace(/^(\d{2})(\d)/, '$1.$2')
      value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      value = value.replace(/\.(\d{3})(\d)/, '.$1/$2')
      value = value.replace(/(\d{4})(\d)/, '$1-$2')
      this.formData.cnpj = value
    },

    formatPhone(event) {
      let value = event.target.value.replace(/\D/g, '')
      value = value.replace(/^(\d{2})(\d)/, '($1) $2')
      value = value.replace(/(\d{5})(\d{4})$/, '$1-$2')
      this.formData.phone = value
    },

    async loginWithGoogle() {
      this.loading = true
      this.showMessage('Conectando com Google...', 'info')

      // Simulação de login com Google
      setTimeout(() => {
        this.showMessage('Login com Google realizado com sucesso!', 'success')
        this.loading = false
        setTimeout(() => {
          this.handleSuccessfulLogin({
            name: 'Usuário Google',
            email: 'user@gmail.com',
            type: this.userType,
          })
        }, 1000)
      }, 1500)
    },

    async loginWithFacebook() {
      this.loading = true
      this.showMessage('Conectando com Facebook...', 'info')

      // Simulação de login com Facebook
      setTimeout(() => {
        this.showMessage('Login com Facebook realizado com sucesso!', 'success')
        this.loading = false
        setTimeout(() => {
          this.handleSuccessfulLogin({
            name: 'Usuário Facebook',
            email: 'user@facebook.com',
            type: this.userType,
          })
        }, 1000)
      }, 1500)
    },

    showForgotPassword() {
      this.showMessage('Um email de recuperação foi enviado!', 'info')
    },

    showTerms() {
      alert('Termos de uso serão exibidos aqui')
    },

    showPrivacy() {
      alert('Política de privacidade será exibida aqui')
    },

    async handleSubmit() {
      if (!this.validateForm()) return

      this.loading = true

      try {
        if (this.isLogin) {
          await this.login()
        } else {
          await this.register()
        }
      } catch (error) {
        this.showMessage('Erro ao processar solicitação', 'error')
      } finally {
        this.loading = false
      }
    },

    validateForm() {
      if (!this.isLogin && this.formData.password !== this.formData.confirmPassword) {
        this.showMessage('As senhas não coincidem', 'error')
        return false
      }

      if (!this.isLogin && this.formData.password.length < 6) {
        this.showMessage('A senha deve ter no mínimo 6 caracteres', 'error')
        return false
      }

      if (!this.isLogin && this.userType === 'company' && this.formData.cnpj.length < 18) {
        this.showMessage('CNPJ inválido', 'error')
        return false
      }

      return true
    },

    async login() {
      const loginData = {
        email: this.formData.email,
        password: this.formData.password,
        userType: this.userType,
        rememberMe: this.rememberMe,
      }

      console.log('Login:', loginData)

      return new Promise((resolve) => {
        setTimeout(() => {
          const userData = {
            id: 1,
            email: this.formData.email,
            name: this.userType === 'user' ? 'João Silva' : 'Empresa Exemplo',
            type: this.userType,
            token: 'fake-jwt-token-123',
          }

          this.handleSuccessfulLogin(userData)
          resolve(userData)
        }, 1000)
      })
    },

    async register() {
      const registerData = {
        email: this.formData.email,
        password: this.formData.password,
        userType: this.userType,
        ...(this.userType === 'user'
          ? { name: this.formData.name }
          : {
              companyName: this.formData.companyName,
              cnpj: this.formData.cnpj,
              phone: this.formData.phone,
            }),
      }

      console.log('Register:', registerData)

      return new Promise((resolve) => {
        setTimeout(() => {
          const userData = {
            id: 1,
            email: this.formData.email,
            name: this.userType === 'user' ? this.formData.name : this.formData.companyName,
            type: this.userType,
            token: 'fake-jwt-token-123',
          }

          this.showMessage('Conta criada com sucesso!', 'success')

          setTimeout(() => {
            this.handleSuccessfulLogin(userData)
          }, 1500)

          resolve(userData)
        }, 1000)
      })
    },

    handleSuccessfulLogin(userData) {
      localStorage.setItem('userToken', userData.token)
      localStorage.setItem('userType', userData.type)
      localStorage.setItem('userData', JSON.stringify(userData))

      this.showMessage('Login realizado com sucesso!', 'success')

      setTimeout(() => {
        if (this.userType === 'company') {
          this.$router.push('/company-profile')
        } else {
          this.$router.push('/user-profile')
        }
      }, 1000)
    },

    showMessage(text, type) {
      this.message = text
      this.messageType = type

      setTimeout(() => {
        this.message = ''
      }, 5000)
    },
  },
}
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
