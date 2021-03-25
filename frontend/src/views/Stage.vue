<template>
  <div id="main-panel">
    <b-navbar class="p-3">

      <template #brand>
        <b-navbar-item tag="router-link" :to="{ path: '/' }">
          <b-icon class="rotated" icon="cctv" size="is-medium"> </b-icon>
        </b-navbar-item>
      </template>

      <template #start>
        <b-navbar-item tag="router-link" :to="{ path: '/' }">
          Dateien
        </b-navbar-item>
        <b-navbar-item tag="router-link" :to="{ path: '/services' }">
          Services
        </b-navbar-item>
        <b-navbar-item tag="router-link" :to="{ path: '/logs' }">
          Souveränität
        </b-navbar-item>
        <b-navbar-dropdown v-if="isAdmin" label="Debug">
            <b-navbar-item target="_blank" href="http://localhost:9100/">
              Kafdrop
            </b-navbar-item>
            <b-navbar-item target="_blank" href="http://localhost:5601/">
              Kibana
            </b-navbar-item>
            <b-navbar-item @click="confirmDeleteLogs()">
              Logs löschen
            </b-navbar-item>
        </b-navbar-dropdown>
      </template>

      <template #end>
        <b-navbar-item tag="div">
          <h1 v-bind:class="{ 'has-text-primary': isAdmin }">{{ username }}</h1>
          <h1 class="pl-5 pr-5">|</h1>
          <b-button class="is-light" @click="logout()">
            Logout
          </b-button>
        </b-navbar-item>
      </template>

    </b-navbar>
    
    <!-- Show the content of the page -->
    <router-view />
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Stage",
  computed: {
    /**
     * Returns the username of the current user.
     *
     * @returns {String} The username.
     */
    username() {
      return this.$store.state.username;
    },
    /**
     * Returns if the current user is admin.
     *
     * @returns {Boolean} True if the current user is admin.
     */
    isAdmin() {
      return this.$store.getters.isAdmin;
    },
  },
  methods: {
    /**
     * Performs a logout.
     */
    async logout() {
      console.log("Logout requested!");
      this.$store
        .dispatch("logout")
        .then(() => this.$router.push("/login"))
        .catch((error) => console.log(error));
    },
    /**
     * Prompts for a confirm before deleting the logs.
     */
    confirmDeleteLogs() {
      this.$buefy.dialog.confirm({
        title: "Logs löschen",
        message: `Mit dieser Aktion werden alle in Elasticsearch gespeicherten Log-Nachrichten gelöscht!
          Wirklich fortfahren?`,
        cancelText: "Abbrechen",
        confirmText: "Logs löschen",
        type: "is-danger",
        hasIcon: true,
        onConfirm: () => this.deleteLogs()
      });
    },
    /**
     * Deletes all logs.
     */
    deleteLogs() {
      return new Promise((resolve, reject) => {
        axios.delete("/logs-*")
          .then((resp) => {
            console.log(resp);      
            if(!resp.data.acknowledged)
              throw new Error("Delete event was not acked!");      
            this.openSuccessToast("Logs wurden erfolgreich gelöscht!");
            this.$store.dispatch("getLogs");
            resolve();
          })
          .catch((err) => {
            console.log("Something went wrong while deleting the file!");
            this.openFailedToast("Logs konnten nicht gelöscht werden!");
            reject(err);
          });
      });
    },
    /**
     * Opens error toast.
     * 
     * @param {string} message The message that should be shown.
     */
    openFailedToast(message) {
      this.$buefy.toast.open({
        duration: 4000,
        message: message,
        position: "is-bottom",
        type: "is-danger",
        queue: false,
      });
    },
    /**
     * Opens success toast.
     * 
     * @param {string} message The message that should be shown.
     */
    openSuccessToast(message) {
      this.$buefy.toast.open({
        duration: 4000,
        message: message,
        position: "is-top",
        type: "is-success",
        queue: false,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.nav-panel {
  padding-top: 5vh !important;
}

#main-panel {
  padding: 6vh 15% !important;
}

.bg-light {
  background-color: lightgrey;
}

.rotated {
  transform: scaleX(-1);
  -moz-transform: scaleX(-1);
  -webkit-transform: scaleX(-1);
  -ms-transform: scaleX(-1);
}

.router-link-exact-active {
  font-weight: bold;
}
</style>
