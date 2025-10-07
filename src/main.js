import { createApp } from "vue"
import { createRouter, createWebHistory } from "vue-router"
import { createPinia } from "pinia"
import App from "./App.vue"
import "@/plugins/axios"
import Toast, { POSITION } from "vue-toastification";
import "vue-toastification/dist/index.css";
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
import ChatListView from './views/ChatListView.vue';
import ChatRoomView from './views/ChatRoomView.vue';
import CategoriesListPage from './views/CategoriesListPage.vue';
import { library } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"
import {
  faUser, faHome, faHeart as faHeartSolid, faCalendarDays, faLocationDot, faTrash,
  faCheckCircle, faEdit, faBuilding, faCog, faSignOutAlt, faEye, faPlus, faUsers,
  faChartLine, faBars, faTimes, faMusic, faLaptopCode, faFutbol, faPalette,
  faUtensils, faBriefcase, faBookOpen, faHeartPulse, faMasksTheater, faFilm,
  faSearch, faCommentDots, faComment, faSignInAlt, faSun
} from "@fortawesome/free-solid-svg-icons"
import { faHeart } from "@fortawesome/free-regular-svg-icons"
import { faInstagram, faFacebook } from "@fortawesome/free-brands-svg-icons"

library.add(
  faUser, faHome, faHeartSolid, faCalendarDays, faLocationDot, faTrash, faCheckCircle,
  faEdit, faBuilding, faCog, faSignOutAlt, faEye, faPlus, faUsers, faChartLine,
  faHeart, faBars, faTimes, faMusic, faLaptopCode, faFutbol, faPalette, faUtensils,
  faBriefcase, faBookOpen, faHeartPulse, faMasksTheater, faFilm, faSearch,
  faCommentDots, faComment, faSignInAlt,
  faInstagram, faFacebook, faSun
)

// --- Guarda de Rota ---
import { useAuthStore } from './stores/auth';

const requiresAuth = (to, from, next) => {
  const authStore = useAuthStore();
  if (!authStore.isAuthenticated) {
    next({ name: 'LoginPage' });
  } else {
    next();
  }
};

const requiresCompany = (to, from, next) => {
  const authStore = useAuthStore();
  if (!authStore.isAuthenticated || authStore.userType !== 'EMPRESA') {
    next({ name: 'Home' }); // Redireciona para a Home ou outra página
  } else {
    next();
  }
};


// --- Definição de Rotas ---
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

// Adicionado para que os guards possam usar a store
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  // CORREÇÃO: Chamando fetchUser() ao invés de initializeAuth()
  if (!authStore.isAuthenticated && localStorage.getItem('accessToken')) {
    authStore.fetchUser();
  }
  next();
});


const app = createApp(App)

app.component("font-awesome-icon", FontAwesomeIcon)
app.use(createPinia()) // ← Ativa Pinia antes de usar stores
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
});

app.mount("#app")
