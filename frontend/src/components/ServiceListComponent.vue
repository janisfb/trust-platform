<template>
  <section>
    <div class="level">
      <div class="column">
        <b-field>
          <b-input
            placeholder="Suche nach Service, Anbieter oder Version"
            v-model.lazy="searchQuery"
          />
        </b-field>
      </div>
      <h1 v-if="isAdmin" class="pr-3">|</h1>
      <b-button v-if="isAdmin" icon-left="upload" @click="launchServiceCreatorModal()"
        >Neuen Service hinzufügen</b-button
      >
    </div>
    <div v-if="this.fetchError != ''">
      <h1 class="has-text-danger">{{ fetchError }}</h1>
      <b-button @click="retryServiceFetch">Services erneut laden</b-button>
    </div>
    <h1 class="pt-5" v-else-if="services.length == 0">Keine Services verfügbar!</h1>   
    <div v-else class="container">
      <b-table
        hoverable
        aria-next-label="Next page"
        aria-previous-label="Previous page"
        aria-page-label="Page"
        aria-current-label="Current page"
        :data="filter"
        :paginated="true"
        :per-page="this.computePageSize"
        v-bind:selected.sync="selected"
        :current-page.sync="currentPage"
        :pagination-position="paginationPosition"
        @click="(row) => {if(!this.selectable) launchServiceInfoModal(row);}"
      >
        <b-table-column
          field="serviceMeta.name"
          label="Service"
          v-slot="props"
          :width="550"
        >
          <div class="ta">{{ props.row.serviceMeta.name }}</div>
        </b-table-column>

        <b-table-column field="contact.company" label="Anbieter" v-slot="props">
          <div class="ta">{{ props.row.contact.company }}</div>
        </b-table-column>

        <b-table-column
          field="serviceMeta.version"
          label="Version"
          centered
          v-slot="props"
          :width="100"
        >
          <b-tag type="is-info">{{ props.row.serviceMeta.version }}</b-tag>
        </b-table-column>

        <b-table-column field="" centered v-slot="props" :width="50">
          <div v-on:click="launchServiceInfoModal(props.row)">
            <b-tooltip
              multilined
              type="is-light"
              label="Mehr über diesen Service erfahren"
            >
              <b-icon class="zoom" icon="information-outline"></b-icon>
            </b-tooltip>
          </div>
        </b-table-column>

        <b-modal v-model="isCreatorModalActive" :width="600">
          <service-creator-component></service-creator-component>
        </b-modal>
      </b-table>
    </div>
    <b-modal v-model="isInfoModalActive" :width="600">
      <service-info-component v-bind:service-element="modalInformation">
      </service-info-component>
    </b-modal>
  </section>
</template>

<script>
import ServiceInfoComponent from "@/components/ServiceInfoComponent";
import ServiceCreatorComponent from "./ServiceCreatorComponent.vue";

export default {
  name: "ServiceExplorer",
  data() {
    return {
      // settings
      paginationPosition: "bottom",
      currentPage: 1,
      perPage: 8,

      // modal config + search query
      isCreatorModalActive: false,
      isInfoModalActive: false,
      modalInformation: {},
      searchQuery: "",

      // fetchError text when fetch of services failed
      fetchError: "",

      // selected.sync var of table
      selected: null,
    };
  },
  components: {
    ServiceInfoComponent,
    ServiceCreatorComponent,
  },
  props: {
    /**
     * Enforces different behaviour when table should be selectable:
     *  Info will not open on row-click.
     */
    selectable: {
      type: Boolean,
      required: true,
    },
    /**
     * Set the number of rows for the table manually.
     */
    rowsperpage: {
      type: Number,
      required: false,
    }
  },
  watch: {
    /**
     * Emits the selected value to the parent 
     * - in this case the execution modal in FileListComponent.
     */
    selected(newValue) {
      if(newValue != null) {
        this.$emit("selected", newValue);
      }
    }
  },
  computed: {
    /**
     * Returns the username.
     *
     * @returns {String} The username.
     */
    username() {
      return this.$store.state.username;
    },
    /**
     * Returns if the user is admin or not
     *
     * @returns {Boolean} True if the current user is admin.
     */
    isAdmin() {
      return this.$store.getters.isAdmin;
    },
    /**
     * Computes the per-page for the table depending on the screen size.
     *
     * @returns {5|8} The per-page num that should be used.
     */
    computePageSize() {
      if (window.matchMedia("(max-width: 1200px)").matches) {
        console.log("below max-width - reducing size");
        return (this.rowsperpage/2) || 4;
      } else {
        return this.rowsperpage || 8;
      }
    },
    /**
     * Gets the data (in this case the services) from the vuex store.
     * 
     * @returns {any[]} A list containing all fetched data.
     */
    services() {
      return this.$store.getters.getServices;
    },
    /**
     * Filters the data with the searchQuery.
     * Searchable: name, creator and version
     *
     * @returns A list containing the matching data
     */
    filter() {
      var name_re = new RegExp(this.searchQuery, "i");
      var servicesFiltered = [];
      for (var i in this.services) {
        if (
          this.services[i].serviceMeta.name.match(name_re) ||
          this.services[i].contact.company.match(name_re) ||
          this.services[i].serviceMeta.version.match(name_re)
        ) {
          servicesFiltered.push(this.services[i]);
        }
      }
      return servicesFiltered;
    },
  },
  methods: {
    /**
     * Launches the service info modal.
     */
    launchServiceInfoModal(row) {
      this.modalInformation = row;
      this.isInfoModalActive = true;
    },
    /**
     * Launches the service creator modal.
     */
    launchServiceCreatorModal() {
      this.isCreatorModalActive = true;
    },
    /**
     * Tries to refetch the services.
     */
    retryServiceFetch() {
      this.$store
        .dispatch("getServices")
        .catch((error) => {
          this.fetchError = "Die Services konnten nicht geladen werden!";
          console.log(error);
        });
      this.fetchError = "";
    },
  },
  /**
   * When the service is created the services have to get loaded.
   */
  created() {
    // if(this.$store.getters.getFiles == [])
    this.$store
      .dispatch("getServices")
      .catch((error) => {
        this.fetchError = "Die Services konnten nicht geladen werden!";
        console.log(error);
      });
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.b-table .level:not(.top) {
  padding-bottom: 0rem;
}

.zoom {
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    transform: scale(1.07);
  }
}

.ta {
  text-align: left;
}
</style>
