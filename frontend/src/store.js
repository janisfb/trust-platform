import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    status: "",
    token: localStorage.getItem("token") || "",
    username: localStorage.getItem("username") || "",
  },
  mutations: {
    auth_request(state) {
      state.status = "loading";
    },
    auth_success(state, { token, username }) {
      console.log("last step", username);
      state.status = "success";
      state.token = token;
      state.username = username;
    },
    auth_error(state) {
      state.status = "error";
    },
    logout(state) {
      state.status = "";
      state.token = "";
      state.user = "";
    },
  },
  actions: {
    login({ commit }, user) {
      return new Promise((resolve, reject) => {
        commit("auth_request");
        axios({
          url: "/api/login",
          auth: {
            username: user.username,
            password: user.password,
          },
          method: "post",
          responseType: "json",
          withCredentials: true,
        })
          .then((resp) => {
            const token = resp.data["token"];
            const user = resp.data["username"];
            console.log("user logged in:", user, " // ", token);

            localStorage.setItem("token", token);
            localStorage.setItem("username", user);

            axios.defaults.headers.common["Authorization"] = token;
            console.log("one step", user);
            commit("auth_success", {
              token: token,
              username: user,
            });
            resolve(resp);
          })
          .catch((err1) => {
            // Kong does not send the cookie to the upstream service on the first request.
            // If the cookie cannot be retrieved on the first try the second request below
            //  will retry to get the token from the upstream service. The internal cookie
            //  of the browser is already set at this time.
            axios({
              url: "/api/login",
              method: "post",
              withCredentials: true,
            })
              .then((resp) => {
                const token = resp.data["token"];
                const user = resp.data["username"];
                console.log("user logged in:", user, " // ", token);

                localStorage.setItem("token", token);
                localStorage.setItem("username", user);

                axios.defaults.headers.common["Authorization"] = token;
                console.log("one step", user);
                commit("auth_success", {
                  token: token,
                  username: user,
                });
                resolve(resp);
              })
              .catch((err2) => {
                console.log(
                  "something went wrong",
                  err2.message,
                  "\n first error:",
                  err1.message
                );
                commit("auth_error");
                localStorage.removeItem("token");
                reject(err2);
              });
          });
      });
    },
    logout({ commit }) {
      return new Promise((resolve) => {
        commit("logout");
        axios.post("/api/login?session_logout").catch((err) => {
          console.log("Logout failed!", err);
        });
        localStorage.removeItem("token");
        localStorage.removeItem("username");
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
