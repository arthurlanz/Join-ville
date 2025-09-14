import { createApp } from "vue"
import { createRouter, createWebHistory } from "vue-router"
import App from "./App.vue"

// Importação dos componentes de página
import MainComponent from "./components/MainComponent.vue"
import EventDetails from "./components/EventDetails.vue"
import CategoryPage from "./views/CategoryPage.vue" // Novo componente de Categoria
import FavoritesPage from "./views/FavoritesPage.vue" // Novo componente de Favoritos

// Font Awesome
import { library } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import { faUser, faHome, faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons"
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons"
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons"

// Adiciona os ícones à biblioteca
library.add(faUser, faHome, faFacebook, faInstagram, faHeartSolid, faHeartRegular)

const routes = [
  {
    path: "/",
    name: "Home",
    component: MainComponent,
  },
  {
    path: "/event/:id",
    name: "EventDetails",
    component: EventDetails,
    props: true, // Permite passar o ID como prop para o componente
  },
  {
    path: "/category/:categoryName",
    name: "CategoryPage",
    component: CategoryPage,
    props: true,
  },
  {
    path: "/favorites",
    name: "FavoritesPage",
    component: FavoritesPage,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // Rola para o topo da página a cada mudança de rota
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  },
})

const app = createApp(App)

app.component("font-awesome-icon", FontAwesomeIcon)
app.use(router)
app.mount("#app")