import { createApp } from "vue"
import { createRouter, createWebHistory } from "vue-router"
import { createPinia } from "pinia"
import App from "./App.vue"
import "@/plugins/axios"


import Toast, { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";
// Importação dos componentes de página
import MainComponent from "./components/MainComponent.vue"
import EventDetails from "./components/EventDetails.vue"
import CategoryPage from "./views/CategoryPage.vue"
import FavoritesPage from "./views/FavoritesPage.vue"

// Novas páginas de autenticação e perfis
import LoginPage from "./views/LoginPage.vue"
import UserProfile from "./views/UserProfile.vue"
import CompanyProfile from "./views/CompanyProfile.vue"
import TutorialPage from "./views/TutorialPage.vue"
import CreateEvent from "./views/CreateEvent.vue"
import EditEvent from "./views/EditEvent.vue"
import ChatListView from './views/ChatListView.vue';
import ChatRoomView from './views/ChatRoomView.vue';
// Font Awesome
import { library } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import { faUser, faHome, faHeart as faHeartSolid, faCalendarDays, faLocationDot, faTrash, faCheckCircle, faEdit, faBuilding, faCog, faSignOutAlt, faEye, faPlus, faUsers, faChartLine} from "@fortawesome/free-solid-svg-icons"
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons"
import { faFacebook, faInstagram } from "@fortawesome/free-brands-svg-icons"
import { faShare } from "@fortawesome/free-solid-svg-icons"

// Adiciona os ícones à biblioteca
library.add(
  faUser, faHome, faFacebook, faInstagram, faHeartSolid, faHeartRegular,
  faCalendarDays, faLocationDot, faTrash, faCheckCircle, faEdit,
  faBuilding, faCog, faSignOutAlt, faEye, faPlus, faUsers, faChartLine, faShare
)

// Auth Guard para rotas protegidas
const requiresAuth = (to, from, next) => {
  // CORREÇÃO: Lendo 'accessToken'
  const isAuthenticated = localStorage.getItem('accessToken')
  if (isAuthenticated) {
    next()
  } else {
    next('/login')
  }
}

// Guard para empresas
const requiresCompany = (to, from, next) => {
  const userType = localStorage.getItem('userType')
  // CORREÇÃO: Lendo 'accessToken'
  const isAuthenticated = localStorage.getItem('accessToken')

  // CORREÇÃO: Comparando com 'EMPRESA' em MAIÚSCULAS
  if (isAuthenticated && userType === 'EMPRESA') {
    next()
  } else if (isAuthenticated) {
    next('/user-profile')
  } else {
    next('/login')
  }
}

// ROTAS CORRIGIDAS
const routes = [
  {
    path: "/",
    name: "Home",
    component: MainComponent,
  },
  {
    path: "/evento/:id",
    name: "EventDetails",
    component: EventDetails,
    props: true,
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
  {
    path: "/login",
    name: "LoginPage",
    component: LoginPage,
  },
  {
    path: "/user-profile",
    name: "UserProfile",
    component: UserProfile,
    beforeEnter: requiresAuth,
  },
  {
    path: "/company-profile",
    name: "CompanyProfile",
    component: CompanyProfile,
    beforeEnter: requiresCompany,
  },
  {
    path: "/tutorial",
    name: "TutorialPage",
    component: TutorialPage,
  },
  {
     path: "/create-event",
    name: "CreateEvent",
    component: CreateEvent,
    beforeEnter: requiresCompany,
  },
  {
    path: "/edit-event/:id",
    name: "EditEvent",
    component: EditEvent,
    props: true,
    beforeEnter: requiresCompany,
  },
  {
    path: "/chat",
    name: "ChatList",
    component: ChatListView,
    beforeEnter: requiresAuth, // Protege a rota
  },
  {
    path: "/chat/:id",
    name: "ChatRoom",
    component: ChatRoomView,
    props: true,
    beforeEnter: requiresAuth, // Protege a rota
  },
  {
  path: "/search",
  name: "SearchResultsView",
  component: () => import("./views/SearchResultsView.vue"),
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

const app = createApp(App)

app.component("font-awesome-icon", FontAwesomeIcon)
app.use(createPinia()) // ← Ativa Pinia antes de usar stores
app.use(router)
  // Configuração global do Toast
  app.use(Toast, {
    transition: "Vue-Toastification__bounce",
    maxToasts: 20,
    newestOnTop: true,
    position: POSITION.TOP_RIGHT,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: false,
    draggable: false,
    hideProgressBar: true,
  });
app.mount("#app")
