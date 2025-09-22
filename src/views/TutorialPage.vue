<template>
  <div class="tutorial-page">
    <div class="tutorial-hero">
      <div class="container">
        <h1>Como Funciona</h1>
        <p>Aprenda como divulgar seus eventos em Joinville de forma fácil e gratuita</p>
        <router-link to="/" class="back-link">← Voltar para a página inicial</router-link>
      </div>
    </div>

    <div class="tutorial-content">
      <div class="container">
        <!-- Passos principais -->
        <section class="steps-section">
          <h2>Divulgue seu evento em 4 passos simples</h2>

          <div class="steps-grid">
            <div class="step-card">
              <div class="step-number">1</div>
              <div class="step-icon">📝</div>
              <h3>Cadastre sua empresa</h3>
              <p>Crie uma conta gratuita com CNPJ válido para começar a divulgar seus eventos em Joinville.</p>
            </div>

            <div class="step-card">
              <div class="step-number">2</div>
              <div class="step-icon">📸</div>
              <h3>Crie seu evento</h3>
              <p>Adicione informações, fotos, data, local e descrição do seu evento. Tudo de forma intuitiva.</p>
            </div>

            <div class="step-card">
              <div class="step-number">3</div>
              <div class="step-icon">🌟</div>
              <h3>Publique gratuitamente</h3>
              <p>Seu evento será publicado na plataforma sem nenhum custo. Sem taxas ocultas ou mensalidades.</p>
            </div>

            <div class="step-card">
              <div class="step-number">4</div>
              <div class="step-icon">👥</div>
              <h3>Alcance seu público</h3>
              <p>Conecte-se com a comunidade de Joinville e acompanhe o interesse no seu evento.</p>
            </div>
          </div>
        </section>

        <!-- Recursos -->
        <section class="features-section">
          <h2>O que você pode fazer</h2>

          <div class="steps-grid2">
            <div class="step-card">
              <div class="step-icon">🎯</div>
              <h3>Público segmentado</h3>
              <p>Seus eventos chegam diretamente às pessoas interessadas em atividades em Joinville</p>
            </div>

            <div class="step-card">
              <div class="step-icon">📊</div>
              <h3>Acompanhe o desempenho</h3>
              <p>Veja quantas pessoas visualizaram e demonstraram interesse nos seus eventos</p>
            </div>

            <div class="step-card">
              <div class="step-icon">📱</div>
              <h3>Responsivo</h3>
              <p>Seus eventos ficam acessíveis em computadores, tablets e celulares</p>
            </div>

            <div class="step-card">
              <div class="step-icon">🔄</div>
              <h3>Fácil atualização</h3>
              <p>Edite as informações dos seus eventos a qualquer momento</p>
            </div>

            <div class="step-card">
              <div class="step-icon">🏆</div>
              <h3>Destaque para empresas locais</h3>
              <p>Priorizamos empresas com CNPJ de Joinville para fortalecer a economia local</p>
            </div>

            <div class="step-card">
              <div class="step-icon">💬</div>
              <h3>Suporte dedicado</h3>
              <p>Nossa equipe está pronta para ajudar com dúvidas sobre a plataforma</p>
            </div>
          </div>
        </section>

        <!-- FAQ -->
        <section class="faq-section">
          <h2>Perguntas Frequentes</h2>

          <div class="faq-list">
            <div class="faq-item" v-for="(faq, index) in faqs" :key="index">
              <div class="faq-question" @click="toggleFaq(index)">
                <h3>{{ faq.question }}</h3>
                <span class="faq-toggle">{{ openFaq === index ? '−' : '+' }}</span>
              </div>
              <div v-if="openFaq === index" class="faq-answer">
                <p>{{ faq.answer }}</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Requisitos -->
        <section class="requirements-section">
          <h2>Requisitos para cadastro</h2>

          <div class="requirements-content">
            <div class="requirement-card">
              <div class="requirement-icon">🏢</div>
              <h3>CNPJ Válido</h3>
              <p>Sua empresa precisa ter um CNPJ ativo para garantir a confiabilidade dos eventos publicados.</p>
            </div>

            <div class="requirement-card">
              <div class="requirement-icon">📍</div>
              <h3>Localização em Joinville</h3>
              <p>Priorizamos empresas sediadas em Joinville-SC para fortalecer a economia local.</p>
            </div>

            <div class="requirement-card">
              <div class="requirement-icon">📧</div>
              <h3>Email Válido</h3>
              <p>Precisamos de um email válido para comunicações importantes sobre seus eventos.</p>
            </div>
          </div>
        </section>

        <!-- Call to Action -->
        <section class="cta-section">
          <div class="cta-content">
            <h2>Pronto para começar?</h2>
            <p>Cadastre sua empresa agora e comece a divulgar seus eventos gratuitamente!</p>

            <div class="cta-buttons">
  <button class="btn-primary" @click="handleCTAClick('register')">
    Criar conta gratuita
  </button>
  <button class="btn-secondary" @click="handleCTAClick('view-events')">
    Ver eventos
  </button>
</div>

          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useToastStore } from '@/stores/toast'; // importando a store do toast
import { useRouter } from 'vue-router';

const router = useRouter();
const toastStore = useToastStore();

const openFaq = ref(null);
const faqs = ref([
  {
    question: 'É realmente gratuito?',
    answer: 'Sim! Não cobramos taxa de adesão, mensalidade ou comissão. Nossa plataforma é 100% gratuita para empresas que queiram divulgar eventos em Joinville.'
  },
  {
    question: 'Preciso ter CNPJ para cadastrar eventos?',
    answer: 'Sim, é obrigatório ter CNPJ válido para garantir a confiabilidade e segurança dos eventos publicados na plataforma.'
  },
  {
    question: 'Posso editar meu evento depois de publicado?',
    answer: 'Claro! Você pode editar informações do seu evento a qualquer momento através do seu painel de controle.'
  },
  {
    question: 'Como as pessoas encontram meus eventos?',
    answer: 'Seus eventos aparecem na página inicial, nas categorias específicas e nos resultados de busca. Também podem ser favoritados pelos usuários.'
  },
  {
    question: 'Existe limite de eventos que posso cadastrar?',
    answer: 'Não há limite! Você pode cadastrar quantos eventos quiser, todos gratuitamente.'
  },
  {
    question: 'Como faço para entrar em contato se precisar de ajuda?',
    answer: 'Você pode nos contatar pelo email joinvilleventos@gmail.com ou WhatsApp (47) 99951-8848.'
  },
  {
    question: 'Minha empresa não é de Joinville, posso me cadastrar?',
    answer: 'Aceitamos empresas de toda região, mas priorizamos empresas sediadas em Joinville para fortalecer a economia local.'
  },
  {
    question: 'Como funciona a moderação dos eventos?',
    answer: 'Todos os eventos passam por uma verificação para garantir que estão de acordo com nossas diretrizes antes de serem publicados.'
  }
]);

const toggleFaq = (index) => {
  openFaq.value = openFaq.value === index ? null : index;
};

const handleCTAClick = (action) => {
  if (action === 'register') {
    toastStore.info('Você será redirecionado para criar uma conta');
    router.push('/login');
  } else if (action === 'view-events') {
    toastStore.info('Você será redirecionado para ver os eventos');
    router.push('/');
  }
};
</script>


<style scoped>
.tutorial-page {
  min-height: 100vh;
  background: #f8f9fa;
}

.tutorial-hero {
  background: linear-gradient(135deg, #1e4d8b 0%, #2d5aa0 100%);
  color: white;
  padding: 4rem 0 2rem;
  text-align: center;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.tutorial-hero h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-weight: bold;
}

.tutorial-hero p {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.back-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 1rem;
  transition: color 0.3s;
}

.back-link:hover {
  color: white;
  text-decoration: underline;
}

.tutorial-content {
  padding: 4rem 0;
}

.steps-section, .features-section, .faq-section, .requirements-section {
  margin-bottom: 5rem;
}

.steps-section h2, .features-section h2, .faq-section h2, .requirements-section h2 {
  text-align: center;
  font-size: 2.5rem;
  color: #1a1a1a;
  margin-bottom: 3rem;
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(28px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}
.steps-grid2 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.step-card {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  position: relative;
  transition: transform 0.3s;
}

.step-card:hover {
  transform: translateY(-8px);
}

.step-number {
  position: absolute;
  top: -15px;
  left: 50%;
  transform: translateX(-50%);
  background: #1e4d8b;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.25rem;
}

.step-icon {
  font-size: 4rem;
  margin: 1rem 0;
}

.step-card h3 {
  color: #1a1a1a;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.step-card p {
  color: #666;
  line-height: 1.6;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.faq-list {
  max-width: 800px;
  margin: 0 auto;
}

.faq-item {
  background: white;
  margin-bottom: 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.faq-question {
  padding: 1.5rem 2rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.3s;
}

.faq-question:hover {
  background-color: #f8f9fa;
}

.faq-question h3 {
  color: #1a1a1a;
  margin: 0;
  font-size: 1.1rem;
}

.faq-toggle {
  font-size: 1.5rem;
  color: #1e4d8b;
  font-weight: bold;
}

.faq-answer {
  padding: 0 2rem 1.5rem;
  border-top: 1px solid #e9ecef;
}

.faq-answer p {
  color: #666;
  line-height: 1.6;
  margin: 1rem 0 0;
}

.requirements-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.requirement-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  border-left: 4px solid #1e4d8b;
}

.requirement-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.requirement-card h3 {
  color: #1a1a1a;
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.requirement-card p {
  color: #666;
  line-height: 1.6;
}

.cta-section {
  background: linear-gradient(135deg, #c2d9e4 0%, #a8c8e0 100%);
  border-radius: 20px;
  padding: 4rem 2rem;
  margin: 4rem 0;
}

.cta-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.cta-content h2 {
  font-size: 2.5rem;
  color: #1e4d8b;
  margin-bottom: 1rem;
  font-weight: bold;
}

.cta-content p {
  font-size: 1.25rem;
  color: #333;
  margin-bottom: 2rem;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary, .btn-secondary {
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  text-decoration: none;
  transition: all 0.3s;
  display: inline-block;
}

.btn-primary {
  background: #1e4d8b;
  color: white;
}

.btn-primary:hover {
  background: #164080;
  transform: translateY(-2px);
}

.btn-secondary {
  background: transparent;
  color: #1e4d8b;
  border: 2px solid #1e4d8b;
}

.btn-secondary:hover {
  background: #1e4d8b;
  color: white;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .tutorial-hero h1 {
    font-size: 2rem;
  }

  .tutorial-hero p {
    font-size: 1rem;
  }

  .steps-section h2, .features-section h2, .faq-section h2, .requirements-section h2 {
    font-size: 2rem;
  }

  .steps-grid {
    grid-template-columns: 1fr;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .feature-item {
    flex-direction: column;
    text-align: center;
  }

  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }

  .btn-primary, .btn-secondary {
    width: 100%;
    max-width: 300px;
  }
}
</style>
