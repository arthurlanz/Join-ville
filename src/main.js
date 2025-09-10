import { createApp } from "vue"
import { createRouter, createWebHistory } from "vue-router"
import App from "./App.vue"
import MainComponent from "./components/MainComponent.vue"
import EventDetails from "./components/EventDetails.vue"

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
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const app = createApp(App)
app.use(router)
app.mount("#app")
