import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Stage from "../views/Stage.vue"
import Logs from "../views/Logs.vue"
import Login from "../views/Login.vue"

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    component: Stage,
    children: [
      {
        path: "",
        name: "Home",
        component: Home,
        auth: true,
      },
      {
        path: "logs",
        name: "Logs",
        component: Logs,
        auth: true,
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

// router.beforeEach(function(to, from, next) {
//   console.log(
//     "beforeEach",
//     to.path + " - Auth: " + this.$store.getters.isLoggedIn
//   );
//   if (
//     to.path !== "/login" &&
//     to.path !== "login" &&
//     !this.$store.getters.isLoggedIn
//   ) {
//     next({ path: "/login" });
//   } else if (
//     (to.path === "/login" || to.path === "login") &&
//     this.$store.getters.isLoggedIn
//   ) {
//     next({ path: "/" });
//   } else {
//     next();
//   }
// });

// // Whenerver Server Gives 401 Status Code, it logouts and redirect to login page
// Vue.http.interceptors.push(function (request, next) {
//   next(function (response) {
//     if (response.status === 401) {
//       let msg = response.body.returnMessage
//       localStorage.setItem('logoutReason', msg)
//       auth.logout()
//     }
//   })
// })

export default router
