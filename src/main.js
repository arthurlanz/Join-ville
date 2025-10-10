import { createApp } from "vue"
import { createRouter, createWebHistory } from "vue-router"
import { createPinia } from "pinia"
import App from "./App.vue"
import "@/plugins/axios"
import Toast, { POSITION } from "vue-toastification"
import "vue-toastification/dist/index.css"

// Componentes
import MainComponent from "./components/MainComponent.vue"
import EventDetails from "./components/EventDetails.vue"
import CategoryPage from "./views/CategoryPage.vue"
import FavoritesPage from "./views/FavoritesPage.vue"
import LoginPage from "./views/LoginPage.vue"
import UserProfile from "./views/UserProfile.vue"
import CompanyProfile from "./views/CompanyProfile.vue"
import TutorialPage from "./views/TutorialPage.vue"
import CreateEvent from "./views/CreateEvent.vue"
import EditEvent from "./views/EditEvent.vue"
import ChatListView from './views/ChatListView.vue'
import ChatRoomView from './views/ChatRoomView.vue'
import CategoriesListPage from './views/CategoriesListPage.vue'
import PublicCompanyProfile from './views/PublicCompanyProfile.vue'
import CompanyDashboard from './views/CompanyDashboard.vue'

// Font Awesome
import { library } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"

// ✅ ÍCONES SÓLIDOS (fas)
import {
  faUser, faHome, faHeart as faHeartSolid, faCalendarDays, faLocationDot, faTrash,
  faCheckCircle, faEdit, faBuilding, faCog, faSignOutAlt, faEye, faPlus, faUsers,
  faChartLine, faBars, faTimes, faMusic, faLaptopCode, faFutbol, faPalette,
  faUtensils, faBriefcase, faBookOpen, faHeartPulse, faMasksTheater, faFilm,
  faSearch, faCommentDots, faComment, faSignInAlt, faSun, faArrowLeft, faClock,
  faTicket, faTags, faShareNodes, faMapMarkedAlt, faInfoCircle, faLink, faCheck,
  faStar, faPen, faEnvelope, faPhone, faGlobe, faIdCard, faUserPlus, faCalendarXmark,
  faComments, faCheckCircle as faCheckCircleSolid, faPaperPlane, faExpand, faBell,
  faUserCircle, faSave
} from "@fortawesome/free-solid-svg-icons"

// ✅ ÍCONES REGULARES (far)
import { faHeart } from "@fortawesome/free-regular-svg-icons"

// ✅ ÍCONES DE MARCAS (fab)
import {
  faInstagram, faFacebook, faWhatsapp, faTwitter
} from "@fortawesome/free-brands-svg-icons"

// Adicionar todos os ícones à biblioteca
library.add(
  // Sólidos
  faUser, faHome, faHeartSolid, faCalendarDays, faLocationDot, faTrash, faCheckCircle,
  faEdit, faBuilding, faCog, faSignOutAlt, faEye, faPlus, faUsers, faChartLine,
  faBars, faTimes, faMusic, faLaptopCode, faFutbol, faPalette, faUtensils,
  faBriefcase, faBookOpen, faHeartPulse, faMasksTheater, faFilm, faSearch,
  faCommentDots, faComment, faSignInAlt, faSun, faArrowLeft, faClock, faTicket,
  faTags, faShareNodes, faMapMarkedAlt, faInfoCircle, faLink, faCheck, faStar,
  faPen, faEnvelope, faPhone, faGlobe, faIdCard, faUserPlus, faCalendarXmark,
  faComments, faCheckCircleSolid, faPaperPlane, faExpand, faBell, faUserCircle,
  faSave,
  // Regulares
  faHeart,
  // Marcas
  faInstagram, faFacebook, faWhatsapp, faTwitter
)

// Guarda de Rota
import { useAuthStore } from './stores/auth'

const requiresAuth = (to, from, next) => {
  const authStore = useAuthStore()
  if (!authStore.isAuthenticated) {
    next({ name: 'LoginPage' })
  } else {
    next()
  }
}

const requiresCompany = (to, from, next) => {
  const authStore = useAuthStore()
  if (!authStore.isAuthenticated || authStore.userType !== 'EMPRESA') {
    next({ name: 'Home' })
  } else {
    next()
  }
}

// Rotas
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
    props: route => ({ categoryName: route.params.categoryName })
  },
  {
    path: "/favorites",
    name: "FavoritesPage",
    component: FavoritesPage,
    beforeEnter: requiresAuth,
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
    path: "/company/:id",
    name: "PublicCompanyProfile",
    component: PublicCompanyProfile,
    props: true
  },
  {
    path: "/company-dashboard",
    name: "CompanyDashboard",
    component: CompanyDashboard,
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
    beforeEnter: requiresAuth,
  },
  {
    path: "/chat/:id",
    name: "ChatRoom",
    component: ChatRoomView,
    props: true,
    beforeEnter: requiresAuth,
  },
  {
    path: "/categories",
    name: "CategoriesListPage",
    component: CategoriesListPage,
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

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  if (!authStore.isAuthenticated && localStorage.getItem('accessToken')) {
    authStore.fetchUser()
  }
  next()
})

const app = createApp(App)

app.component("font-awesome-icon", FontAwesomeIcon)
app.use(createPinia())
app.use(router)
app.use(Toast, {
    position: POSITION.TOP_RIGHT,
    timeout: 3000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.66,
    showCloseButtonOnHover: false,
    hideProgressBar: true,
    closeButton: "button",
    icon: true,
    rtl: false
})

app.mount("#app")
