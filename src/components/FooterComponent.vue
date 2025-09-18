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
          <li><router-link :to="{ name: 'CategoryPage', params: { categoryName: 'Gastronomia' } }">Gastronomia</router-link></li>
          <li><router-link :to="{ name: 'CategoryPage', params: { categoryName: 'Clássicos de Joinville' } }">Clássicos de Joinville</router-link></li>
          <li><router-link :to="{ name: 'CategoryPage', params: { categoryName: 'Festas e Shows' } }">Festas e Shows</router-link></li>
          <li><router-link :to="{ name: 'CategoryPage', params: { categoryName: 'Esportes' } }">Esportes</router-link></li>
          <li><router-link :to="{ name: 'CategoryPage', params: { categoryName: 'Atividades ao Ar Livre' } }">Atividades ao ar livre</router-link></li>
          <li><router-link :to="{ name: 'CategoryPage', params: { categoryName: 'Cultura' } }">Cultura</router-link></li>
        </ul>
      </div>

      <div class="contato">
        <h3>Contato</h3>
        <p>Email: joinvilleventos@gmail.com</p>
        <p>Telefone: (47) 9 9951-8848</p>
        <div class="social">
          <a href="https://www.instagram.com/joinville_eventos">
            <font-awesome-icon :icon="['fab', 'instagram']" size="2x" style="color:#FFFCEE;" />
          </a>
          <a href="https://www.facebook.com/profile.php?id=61581158812680">
            <font-awesome-icon :icon="['fab', 'facebook']" size="2x" style="color:#FFFCEE;" />
          </a>
        </div>
      </div>
    </div>

    <div class="copy">
      <p>© 2025 Joinville Eventos. Todos os direitos reservados. | Este site foi desenvolvido exclusivamente para fins educacionais
      como parte de um trabalho escolar. Sem fins comerciais.</p>
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
  position: relative;
  padding-bottom: 2px;
  transition: color 0.3s ease;
}
.footer ul li a::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 0;
  height: 2px;
  background: #fffcee;
  transition: width 0.3s ease;
}
.footer ul li a:hover {
  color: #fffcee;
}
.footer ul li a:hover::after {
  width: 50%;
}
.contato p {
  margin-bottom: 0.5rem;
}
.social {
  margin-top: 0.8rem;
  display: flex;
  gap: 1rem;
}
.copy {
  text-align: center;
  margin-top: 2rem;
  border-top: 1px solid rgba(255, 252, 238, 0.2);
  padding-top: 1rem;
  font-size: 0.85rem;
}
</style>