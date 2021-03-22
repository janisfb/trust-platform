import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import config from "./config/config"

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    status: "",
    fileStatus: "",
    serviceStatus: "",
    logStatus: "",
    token: localStorage.getItem("token") || "",
    username: localStorage.getItem("username") || "",
    files: [],
    services: [],
    logs: [],
    // isAdmin: localStorage.getItem("username") != null ? localStorage.getItem("username") === "admin" : false,
  },

  mutations: {
    /**
     * Sets the status to the pending state.
     * @param {*} state
     */
    auth_request(state) {
      state.status = "loading";
    },
    /**
     * Sets the status to the success state.
     * @param {*} state
     * @param {{String, String}} param1 Obj containing token and username
     */
    auth_success(state, { token, username }) {
      console.log("last step", username);
      state.status = "success";
      state.token = token;
      state.username = username;
      // state.isAdmin = username == "admin";
    },
    /**
     * Sets the status to the error state.
     * @param {*} state
     */
    auth_error(state) {
      state.status = "error";
    },
    /**
     * Sets the status to the initial state (logged out).
     * @param {*} state
     */
    logout(state) {
      state.status = "";
      state.token = "";
      state.user = "";
    },

    /**
     * Sets the status of file requests to the pending state.
     * @param {*} state
     */
    file_request(state) {
      state.fileStatus = "loading";
    },
    /**
     * Sets the status of file requests to the error state.
     * @param {*} state
     */
    file_error(state) {
      state.fileStatus = "error";
    },
    /**
     * Sets the status of file requests to the success state.
     * @param {*} state
     * @param {any[]} param1 List containing the file obj.
     */
    file_success(state, files) {
      state.files = files;
      state.fileStatus = "success";
    },

    /**
     * Sets the status of service requests to the pending state.
     * @param {*} state
     */
    service_request(state) {
      state.serviceStatus = "loading";
    },
    /**
     * Sets the status of service requests to the error state.
     * @param {*} state
     */
    service_error(state) {
      state.serviceStatus = "error";
    },
    /**
     * Sets the status of service requests to the success state.
     * @param {*} state
     * @param {any[]} param1 List containing the service obj.
     */
    service_success(state, services) {
      state.services = services;
      state.serviceStatus = "success";
    },

    /**
     * Sets the status of log requests to the pending state.
     * @param {*} state
     */
    log_request(state) {
      state.logStatus = "loading";
    },
    /**
     * Sets the status of log requests to the error state.
     * @param {*} state
     */
    log_error(state) {
      state.logStatus = "error";
    },
    /**
     * Sets the status of log requests to the success state.
     * @param {*} state
     * @param {any[]} param1 List containing the log obj.
     */
    log_success(state, logs) {
      state.logs = logs;
      state.logStatus = "success";
    },
  },

  actions: {
    /**
     * Performs the login at the Kong Gateway.
     *
     * @param {*} param0
     * @param {{String, String}} user The credentials of the user.
     * @returns
     */
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
            if (config.CONSOLE_LOGGING)
              console.log("user logged in:", user, " // ", token);

            localStorage.setItem("token", token);
            localStorage.setItem("username", user);

            axios.defaults.headers.common["Authorization"] = token;

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
                if (config.CONSOLE_LOGGING)
                  console.log("user logged in:", user, " // ", token);

                localStorage.setItem("token", token);
                localStorage.setItem("username", user);

                axios.defaults.headers.common["Authorization"] = token;

                commit("auth_success", {
                  token: token,
                  username: user,
                });
                resolve(resp);
              })
              .catch((err2) => {
                if (config.CONSOLE_LOGGING)
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

    /**
     * Performs the logout at the Kong Gateway.
     *
     * @param {*} param0
     * @returns
     */
    logout({ commit }) {
      return new Promise((resolve) => {
        commit("logout");
        axios.post("/api/login?session_logout").catch((err) => {
          if (config.CONSOLE_LOGGING) console.log("Logout failed!", err);
        });
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        delete axios.defaults.headers.common["Authorization"];
        resolve();
      });
    },

    /**
     * Gets the files from the data_management service
     *
     * @param {*} param0
     * @returns A list containing the file information.
     */
    getFiles({ commit }) {
      return new Promise((resolve, reject) => {
        commit("file_request");
        axios({
          url: "/api/files",
          method: "get",
          responseType: "json",
          withCredentials: true,
        })
          .then((resp) => {
            if (config.CONSOLE_LOGGING) console.log(resp);
            commit("file_success", resp.data);
          })
          .catch((err) => {
            if (config.CONSOLE_LOGGING)
              console.log("Something went wrong while fetching the files!");
            commit("file_error");
            reject(err);
          });
      });
    },

    /**
     * Tries to get all files from the data_management service.
     * This also includes files that are not owned by the current user.
     * Only possible for user "admin"
     *
     * @param {*} param0
     * @returns A list containing the file information.
     */
    getAllFiles({ commit }) {
      return new Promise((resolve, reject) => {
        commit("file_request");
        axios({
          url: "/api/files/all",
          method: "get",
          responseType: "json",
          withCredentials: true,
        })
          .then((resp) => {
            if (config.CONSOLE_LOGGING)
              console.log("requested all files:", resp);
            commit("file_success", resp.data);
          })
          .catch((err) => {
            if (config.CONSOLE_LOGGING)
              console.log("Something went wrong while fetching the files!");
            commit("file_error");
            reject(err);
          });
      });
    },

    /**
     * Gets the services from the service_management service
     *
     * @param {*} param0
     * @returns A list containing the service information.
     */
    getServices({ commit }) {
      return new Promise((resolve, reject) => {
        commit("service_request");
        axios({
          url: "/api/services",
          method: "get",
          responseType: "json",
          withCredentials: true,
        })
          .then((resp) => {
            // console.log(resp);
            commit("service_success", resp.data);
          })
          .catch((err) => {
            if (config.CONSOLE_LOGGING)
              console.log("Something went wrong while fetching the files!");
            commit("service_error");
            reject(err);
          });
      });
    },

    /**
     * Gets the logs from the log_management service
     *
     * @param {*} param0
     * @returns A list containing the logs.
     */
    getLogs({ commit }) {
      return new Promise((resolve, reject) => {
        commit("log_request");
        axios({
          url: "/api/logs",
          method: "get",
          responseType: "json",
          withCredentials: true,
        })
          .then((resp) => {
            // console.log(resp);
            commit("log_success", resp.data.logs);
          })
          .catch((err) => {
            if (config.CONSOLE_LOGGING)
              console.log("Something went wrong while fetching the logs!");
            commit("log_error");
            reject(err);
          });
      });
    },
  },

  getters: {
    /**
     * Retrieves if the user is logged in.
     * @param {*} state
     * @returns true if the user is logged in.
     */
    isLoggedIn: (state) => !!state.token,
    /**
     * Retrieves the current status of the auth process.
     * @param {*} state
     * @returns The current status.
     */
    authStatus: (state) => state.status,
    /**
     * Retrieves if the user is the admin.
     * @param {*} state
     * @returns true if the user is the admin.
     */
    isAdmin: (state) => state.username === "admin",

    /**
     * Retrieves the files.
     * @param {*} state
     * @returns A list containing the files.
     */
    getFiles: (state) => state.files,

    /**
     * Retrieves the services.
     * @param {*} state
     * @returns A list containing the services.
     */
    getServices: (state) => state.services,

    /**
     * Retrieves the logs.
     * @param {*} state
     * @returns A list containing the logs.
     */
    getLogs: (state) => state.logs,
  },
});
