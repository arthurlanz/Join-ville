<template>
  <section class="cadastro-section">
    <div class="container">
      <div class="cadastro-content">
        <div class="cadastro-text">
          <h2>Crie, divulgue e conecte seus eventos com a maior cidade de SC</h2>
          
          <div class="features">
            <div class="feature">
              <div class="feature-icon">📝</div>
              <div class="feature-text">
                <strong>Publicação grátis:</strong> sem taxa de adesão ou mensalidade.
              </div>
            </div>
            
            <div class="feature">
              <div class="feature-icon">🏢</div>
              <div class="feature-text">
                <strong>Para quem faz Joinville acontecer:</strong> exclusivo para empresas com CNPJ válido.
              </div>
            </div>
          </div>
          
          <div class="cadastro-buttons">
            <button class="btn-primary">Cadastre seu evento</button>
            <button class="btn-secondary">Veja como funciona</button>
          </div>
        </div>
        
        <div class="cadastro-illustration">
          <img src="/pessoastrabalhando.png" alt="Ilustração de pessoas trabalhando" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cadastro-section {
  background: #c2d9e4;
  padding: 4rem 2rem 2rem ;
  border-radius: 20px;
  margin: 4rem 20rem 0 20rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.cadastro-content {
  display: flex;
  align-items: center;
  gap: 4rem;
}

.cadastro-text {
  flex: 1;
}

.cadastro-text h2 {
  font-size: 2.5rem;
  color: #1e4d8b;
  margin-bottom: 2rem;
  line-height: 1.2;
  font-weight: bold;
}

.features {
  margin-bottom: 2rem;
}

.feature {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.feature-icon {
  font-size: 2rem;
  flex-shrink: 0;
}

.feature-text {
  color: #333;
  line-height: 1.5;
}

.cadastro-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-primary {
  background-color: #1e4d8b;
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background-color: #164080;
}

.btn-secondary {
  background-color: transparent;
  color: #1e4d8b;
  padding: 1rem 2rem;
  border: 2px solid #1e4d8b;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-secondary:hover {
  background-color: #1e4d8b;
  color: white;
}

.cadastro-illustration {
  flex: 1;
  text-align: center;
}

.cadastro-illustration img {
  max-width: 100%;
  height: auto;
}

@media (max-width: 768px) {
  .cadastro-content {
    flex-direction: column;
    text-align: center;
  }
  
  .cadastro-text h2 {
    font-size: 2rem;
  }
  
  .cadastro-buttons {
    justify-content: center;
  }
}
</style>