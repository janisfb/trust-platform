import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    status: "",
    token: localStorage.getItem("token") || "",
    user: {},
  },
  mutations: {
    auth_request(state) {
      state.status = "loading";
    },
    auth_success(state, token, user) {
      state.status = "success";
      state.token = token;
      state.user = user;
    },
    auth_error(state) {
      state.status = "error";
    },
    logout(state) {
      state.status = "";
      state.token = "";
    },
  },
  actions: {
    login({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit("auth_request");
        axios
          .get("/api/files", {
            auth: {
              username: user.username,
              password: user.password,
            },
            responseType: "json",
          })
          .catch((err) => {
            console.log("something went wrong", err.message);
            console.log(err.response);
            commit("auth_error");
            localStorage.removeItem("token");
            reject(err);
          });
        // axios({
        //   url: "http://localhost:8000/api/files",
        //   auth: {
        //     username: user.username,
        //     password: user.password,
        //   },
        //   method: "get",
        //   responseType: "json"
        // })
        //   .then((resp) => {
        //     console.log("got here");
        //     const token = resp.data.cookie;
        //     const user = resp.headers["x-consumer-username"];
        //     localStorage.setItem("token", token);
        //     axios.defaults.headers.common["Authorization"] = token;
        //     commit("auth_success", token, user);
        //     resolve(resp);
        //   })
        //   .catch((err) => {
        //     console.log("something went wrong", err.message);
        //     console.log(err.request);
        //     commit("auth_error");
        //     localStorage.removeItem("token");
        //     reject(err);
        //   });
      });
    },
    logout({ commit }) {
      return new Promise((resolve) => {
        commit("logout");
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
        resolve();
      });
    },
  },
  getters: {
    isLoggedIn: (state) => !!state.token,
    authStatus: (state) => state.status,
  },
});
