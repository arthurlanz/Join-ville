<script setup>
</script>

<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="logo">
        <img src="/logotipo.png" alt="JoinVille" />
        <p>Explore, avalie e viva Joinville de verdade</p>
      </div>

      <div class="links">
        <h3>Categorias</h3>
        <ul>
          <li><a href="">Gastronomia</a></li>
          <li><a href="#">Clássicos de Joinville</a></li>
          <li><a href="#">Festas e Shows</a></li>
          <li><a href="#">Esportes</a></li>
          <li><a href="#">Atividades ao ar livre</a></li>
          <li><a href="#">Cultura</a></li>
        </ul>
      </div>

      <div class="contato">
        <h3>Contato</h3>
        <p>Email: contato@joinville.com</p>
        <p>Telefone: (47) 0000-0000</p>
        <div class="social">
          <a href=""><img src="" alt="Facebook" /></a>
          <a href=""><img src="" alt="Instagram" /></a>
          <a href=""><img src="" alt="Youtube" /></a>
        </div>
      </div>
    </div>

    <div class="copy">
      <p>© 2025 Joinville Eventos. Todos os direitos reservados.</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: #11508E;
  color: #FFFCEE;
  padding: 3rem 2rem 1rem;
  margin-top: 4rem;
}

.footer-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.footer .logo img {
  height: 50px;
  margin-bottom: 1rem;
}

.footer .logo p {
  font-size: 0.9rem;
  line-height: 1.4;
}

.footer h3 {
  margin-bottom: 1rem;
  font-weight: 700;
  font-size: 1.1rem;
}

.footer ul {
  list-style: none;
  padding: 0;
}

.footer ul li {
  margin-bottom: 0.5rem;
}

.footer ul li a {
  color: #FFFCEE;
  text-decoration: none;
  transition: color 0.2s ease;
}

.contato p {
  margin-bottom: 0.5rem;
}

.social {
  margin-top: 0.8rem;
  display: flex;
  gap: 1rem;
}

.social img {
  width: 24px;
  height: 24px;
  filter: brightness(0) invert(1);
}

.copy {
  text-align: center;
  margin-top: 2rem;
  border-top: 1px solid rgba(255, 252, 238, 0.2);
  padding-top: 1rem;
  font-size: 0.85rem;
}
</style>
