import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Buefy from 'buefy'
import Axios from 'axios'
import store from './store'
import './assets/scss/app.scss'
import "@mdi/font/css/materialdesignicons.css";

Vue.use(Buefy)

Vue.prototype.$http = Axios;
const token = localStorage.getItem("token");
if (token) {
  console.log("using token")
  Vue.prototype.$http.defaults.headers.common["Authorization"] = token;
}

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
