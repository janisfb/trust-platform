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
        <!-- <b-navbar-dropdown label="Info">
                <b-navbar-item href="#">
                    About
                </b-navbar-item>
                <b-navbar-item href="#">
                    Contact
                </b-navbar-item>
            </b-navbar-dropdown> -->
      </template>

      <template #end>
        <b-navbar-item tag="div">
          <h1 v-bind:class="{ 'has-text-primary': isAdmin }">{{username}}</h1>
          <h1 class="pl-5 pr-5">|</h1>
          <b-button class="is-light" @click="logout()">
            Logout
          </b-button>
        </b-navbar-item>
      </template>
    </b-navbar>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "Stage",
  computed: {
    username() {
      return this.$store.state.username;
    },
    isAdmin() {
      return this.$store.state.username === "admin";
    }
  },
  methods: {
    async logout() {
      console.log("Logout requested!")
      this.$store.dispatch("logout")
        .then(() => this.$router.push("/login"))
        .catch(error => console.log(error));
    },
  }
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