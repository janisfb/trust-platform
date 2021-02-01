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
      <h1 class="pr-3">|</h1>
      <div class="pr-2">
        <b-tooltip 
          size="is-large"
          multilined dashed>
          <template v-slot:content>
            <p class="pb-2">Systemereignissen wird automatisch ein Schweregrad zugewiesen:</p>
            <ul style="text-align: left;">
              <li><b class="list-border-right mr-2">1</b>Im Standardablauf erwartbare Ereignisse.</li>
              <li><b class="list-border-right mr-2">2</b>Unerwartete, aber harmlose Ereignisse.</li>
              <li><b class="list-border-right mr-2">3</b>Potentiell gefährliche Ereignisse.</li>
              <li><b class="list-border-right mr-2">4</b>Sicherheitsrisiken.</li>
            </ul>
          </template>
          <h1>Schwere:</h1>
        </b-tooltip>
      </div>
      <b-field>
        <b-checkbox-button v-if="isAdmin" v-model="prioCheckboxDynamic"
          :native-value="checkboxValues[0]">
          <b-icon icon="bug-outline"></b-icon>
        </b-checkbox-button>

        <b-checkbox-button v-model="prioCheckboxDynamic"
          :native-value="checkboxValues[1]">
          <b-icon icon="information-outline"></b-icon>
          <span>1</span>
        </b-checkbox-button>

        <b-checkbox-button v-model="prioCheckboxDynamic"
          :native-value="checkboxValues[2]">
          <b-icon icon="bell-alert-outline"></b-icon>
          <span>2</span>
        </b-checkbox-button>

        <b-checkbox-button v-model="prioCheckboxDynamic"
          :native-value="checkboxValues[3]">
          <b-icon icon="alert-outline"></b-icon>
          <span>3</span>
        </b-checkbox-button>

        <b-checkbox-button v-model="prioCheckboxDynamic"
          :native-value="checkboxValues[4]">
          <b-icon icon="alarm-light-outline"></b-icon>
          <span>4</span>
        </b-checkbox-button>
      </b-field>
    </div>
    <h1 class="pt-5" v-if="data.length == 0">Keine Services verfügbar!</h1>
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
        :current-page.sync="currentPage"
        :pagination-position="paginationPosition"
      >
        <b-table-column
          class="ta"
          field="severity"
          label="Schwere"
          sortable
          v-slot="props"
          :width="110"
        >
          <div class="ta">{{ `${checkboxValues.indexOf(props.row.severity)} - ${props.row.severity}` }}</div>
        </b-table-column>

        <b-table-column
          field="time"
          label="Zeitstempel"
          sortable
          v-slot="props"
          :width="180"
        >
          {{ new Date(props.row.time).toLocaleString() }}
        </b-table-column>

        <b-table-column
          class="ta"
          field="user"
          label="Nutzer"
          v-slot="props"
          :width="180"
        >
          <div class="ta">{{ props.row.user }}</div>
        </b-table-column>

        <b-table-column
          field="category"
          label="Kategorie"
          v-slot="props"
          :width="180"
        >
          <div class="ta">{{ props.row.category }}</div>
        </b-table-column>

        <b-table-column
          field="action"
          label="Aktion"
          v-slot="props"
        >
          <div class="ta">{{ props.row.action }}</div>
        </b-table-column>

        <b-table-column
          field="object"
          label="Betroffene Datei"
          v-slot="props"
        >
          <div class="ta">{{ props.row.object }}</div>
        </b-table-column>
      </b-table>
    </div>
  </section>
</template>

<script>
const data = require("@/data/logs.json");

export default {
  name: "ServiceExplorer",
  data() {
    return {
      // table data + settings
      data,
      paginationPosition: "bottom",
      currentPage: 1,
      perPage: 8,

      checkboxValues: ["bug", "info", "warning", "error", "alarm"],
      prioCheckboxDynamic: ["bug", "info", "warning", "error", "alarm"],

      // modal config + search query
      isCreatorModalActive: false,
      isInfoModalActive: false,
      modalInformation: {},
      searchQuery: "",
    };
  },
  components: {
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
        return 5;
      } else {
        return 8;
      }
    },
    /**
     * Filters the data with the searchQuery and the prioCheckBox.
     * Searchable: name, creator and version
     * Prios: debug, info, warn, error, alarm
     *
     * @returns A list containing the matching data
     */
    filter() {
      var name_re = new RegExp(this.searchQuery, "i");
      var dataFiltered = [];
      for (var i in this.data) {
        if (
          (this.data[i].time.match(name_re) ||
          this.data[i].category.match(name_re) ||
          this.data[i].action.match(name_re) ||
          this.data[i].user.match(name_re)) &&
          (this.prioCheckboxDynamic.indexOf(this.data[i].severity) >= 0)
        ) {
          dataFiltered.push(this.data[i]);
        }
      }
      return dataFiltered;
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

.list-border-right {
  border: 1px solid aqua;
  padding: 1px;
}
</style>
