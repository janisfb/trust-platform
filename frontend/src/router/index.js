import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "./../store.js";
import FileView from "../views/FileView.vue";
import Stage from "../views/Stage.vue"
import ServicesView from "../views/ServicesView.vue";
import LogsView from "../views/LogsView.vue";
import Login from "../views/LoginView.vue"
import config from "../config/config"

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    component: Stage,
    children: [
      {
        path: "",
        name: "Home",
        component: FileView,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "services",
        name: "Services",
        component: ServicesView,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "logs",
        name: "Logs",
        component: LogsView,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "logs/filter/:query",
        name: "Logs",
        component: LogsView,
        meta: {
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
  linkActiveClass: "is-active",
});

/**
 * Guard for every requiresAuth meta entry.
 * -> Re-Route to /login if no user is currently logged in.
 */
router.beforeEach((to, from, next) => {
  if (config.CONSOLE_LOGGING) console.log("checking route:", to.path);
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (config.CONSOLE_LOGGING)
      console.log("Login required! Logged in?", store.getters.isLoggedIn);
    if (store.getters.isLoggedIn) {
      next();
      return;
    } else {
      next("/login");
    }
  } else {
    next();
  }
})

export default router