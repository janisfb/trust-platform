<template>
  <section>
    <div class="level">
      <div class="column">
        <b-field>
          <b-input
            placeholder="Suche nach Nutzer, Kategorie, Aktion, Datei usw."
            v-model.lazy="searchQuery"
            icon-right="close-circle"
            icon-right-clickable
            @icon-right-click="clearSearchInput"
          />
        </b-field>
      </div>
      <h1 class="pr-3">|</h1>
      <div class="pr-2">
        <b-tooltip 
          size="is-large"
          multilined dashed>
          <template v-slot:content>
            <p class="pb-2">Aktionen wird automatisch ein Schweregrad zugewiesen (oben->unten =^ links->rechts):</p>
            <ul style="text-align: left;">
              <li><b class="list-border-right mr-2">B</b>Unerwartete Ereignisse / Fehler.</li>
              <li><b class="list-border-right mr-2">1</b>Niedriges Risiko für Datensouveränität.</li>
              <li><b class="list-border-right mr-2">2</b>Mittleres Risiko für Datensouveränität.</li>
              <li><b class="list-border-right mr-2">3</b>Hohes Risiko für Datensouveränität.</li>
              <li><b class="list-border-right mr-2">4</b>Sehr hohes Risiko für Datensouveränität.</li>
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
    <h1 class="pt-5" v-if="logs.length == 0">Keine Logs verfügbar!</h1>
    <div v-else class="container">
      <b-table
        hoverable
        detailed
        detail-key="_id"
        default-sort="_source.priority"
        default-sort-direction="desc"
        aria-next-label="Next page"
        aria-previous-label="Previous page"
        aria-page-label="Page"
        aria-current-label="Current page"
        :data="filter"
        :paginated="true"
        :per-page="this.computePageSize"
        :current-page.sync="currentPage"
        :opened-detailed="defaultOpenedDetails"
        :pagination-position="paginationPosition"
        @details-open="(row, index) => closeOtherDetail(row)"
      >
        <b-table-column
          class="ta"
          field="_source.priority"
          label="P"
          sortable
          v-slot="props"
          :width="10"        
        >
          <div class="ta" v-bind:class="formatByPriority(props.row)">
            {{ props.row._source.priority }}
          </div>
        </b-table-column>

        <b-table-column
          field="_source.time"
          label="Zeitstempel"
          sortable
          v-slot="props"
          :width="180"
        >
          <div v-bind:class="formatByPriority(props.row)">
            {{ new Date(props.row._source.time).toLocaleString() }}
          </div>
        </b-table-column>

        <b-table-column
          class="ta"
          field="_source.user_name"
          label="Nutzer"
          v-slot="props"
          :width="120"
        >
          <div class="ta" v-bind:class="formatByPriority(props.row)">
            {{ props.row._source.user_name }}
          </div>
        </b-table-column>

        <b-table-column
          field="_source.category"
          label="Kategorie"
          v-slot="props"
          :width="120"
        >
          <div class="ta" v-bind:class="formatByPriority(props.row)">
            {{ props.row._source.category }}
          </div>
        </b-table-column>

        <b-table-column
          field="_source.reason"
          label="Aktion"
          v-slot="props"
        >
          <div class="ta ta-truncate-reason" v-bind:class="formatByPriority(props.row)">
            {{ props.row._source.reason }}
          </div>
        </b-table-column>

        <b-table-column
          field="_source.data_name"
          label="Datei"
          v-slot="props"
        >
          <div class="ta ta-truncate-file" v-bind:class="formatByPriority(props.row)">            
            {{ props.row._source.data_name }}
          </div>
        </b-table-column>

        <b-table-column
          field="_source.data_name"
          label="Besitzer"
          v-slot="props"
          :width="120"
        >
          <div class="ta" v-bind:class="formatByPriority(props.row)">
            {{ props.row._source.data_owner }}
          </div>
        </b-table-column>

        <b-table-column
          label="Filter"
          v-slot="props"
          :width="40"          
        >
          <div style="display:flex; flex-direction: row; justify-content: center; align-items: center">
            <div v-if="props.row._source.data_name != '-'" v-on:click="searchFor(props.row._source.data_id)">
              <b-tooltip
                multilined
                type="is-light"
                label="Logs nach dieser Datei filtern"
              >
                <b-icon class="zoom" icon="file-search-outline"></b-icon>
              </b-tooltip>
            </div>
            <div v-on:click="searchFor(props.row._source.session)">
              <b-tooltip
                multilined
                type="is-light"
                label="Logs nach dieser Session filtern"
              >
                <b-icon class="zoom" icon="layers-search-outline"></b-icon>
              </b-tooltip>
            </div>
            <div v-on:click="validateLog(props.row._id)">
              <b-tooltip
                multilined
                type="is-light"
                label="Diesen Eintrag validieren."
              >
                <b-icon class="zoom" icon="link-lock"></b-icon>
              </b-tooltip>
            </div>
          </div>
        </b-table-column>

        <template #detail="props">
          <div class="level">
            <div class="level-left">
              <b-tag
                class="ml-5"
                v-if="!props.row._source.status"
                type="is-warning"
                Colored
                tag
                label
              >
                Fehlschlag
              </b-tag>
              <b-tag
                class="ml-5"
                v-else
                type="is-success"
                Colored
                tag
                label
              >
                Erfolgreich
              </b-tag>
              <b class="p-1">|</b>
              <h1><b>Dienst:</b> {{ props.row._source.source_name }}</h1>
              <b class="p-1">|</b>
              <h1><b>Log-ID:</b> {{ props.row._id }}</h1>
              <b class="p-1">|</b>
              <h1><b>Nutzer-IP:</b> {{ props.row._source.user_ip }}</h1>
              <b class="p-1">|</b>
              <h1><b>Dienst-IP:</b> {{ props.row._source.source_ip }}</h1> 
              <b class="p-1">|</b>
              <h1><b>Session-ID:</b> {{ props.row._source.session }}</h1>          
            </div>
          </div>            
        </template>   

        <b-modal v-model="isValidationModalActive" :width="600">
          <div class="box" style="padding: 0px">
            <section class="hero is-light">
              <div class="hero-body">
                <h1 class="title">Validierung</h1>
              </div>
            </section>
            <section style="padding: 1.5rem; padding-left: 3em;">
              <p>{{ validationResult }}</p>
            </section>
          </div> 
        </b-modal>
      </b-table>
    </div>
  </section>
</template>

<script>
import axios from "axios";

export default {
  name: "ServiceExplorer",
  data() {
    return {
      // table data + settings
      paginationPosition: "bottom",
      currentPage: 1,
      defaultOpenedDetails: [],
      perPage: 8,

      checkboxValues: ["bug", 1, 2, 3, 4],
      prioCheckboxDynamic: ["bug", 1, 2, 3, 4],

      // modal config + search query
      searchQuery: "",

      // fetchError text when fetch of logs failed
      fetchError: "",

      isValidationModalActive: false,
      validationResult: null,
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
     * Gets the data (in this case the logs) from the vuex store.
     * 
     * @returns {any[]} A list containing all fetched data.
     */
    logs() {
      return this.$store.getters.getLogs;
    },
    /**
     * Filters the data with the searchQuery and the prioCheckBox.
     * Searchable: source_name, source_ip, user_name, user_ip, session,
     *  category, status, data_owner, data_id, data_name, reason
     * Prios: 1-4
     *
     * @returns A list containing the matching data
     */
    filter() {
      var name_re = new RegExp(this.searchQuery, "i");
      var dataFiltered = [];
      for (var i in this.logs) {
        var log = this.logs[i]._source;
        console.log("filter:",log)
        if (
          (new Date(log.time)
              .toLocaleString()
              .match(name_re) ||
          (this.logs[i]._id.match(name_re)) ||
          (log.source_name != null && log.source_name.match(name_re)) ||
          (log.source_ip != null && log.source_ip.match(name_re)) ||
          (log.user_name != null && log.user_name.match(name_re)) ||
          (log.user_ip != null && log.user_ip.match(name_re)) ||
          (log.session != null && log.session.match(name_re)) ||
          (log.category != null && log.category.match(name_re)) ||
          (log.status != null && log.status.match(name_re)) ||
          (log.data_owner != null && log.data_owner.match(name_re)) ||
          (log.data_id != null && log.data_id.match(name_re)) ||
          (log.data_name != null && log.data_name.match(name_re)) ||
          (log.reason != null && log.reason.match(name_re))) &&
          (this.prioCheckboxDynamic.indexOf(log.priority) >= 0 ||
          (log.status != "success" && this.prioCheckboxDynamic.indexOf("bug") >= 0))
        ) {
          dataFiltered.push(this.logs[i]);
        }
      }
      console.log("filter:",dataFiltered)
      return dataFiltered;
    },
  },
  methods: {
    formatByPriority(row) {
      return {
        'has-text-orange': row._source.priority == 3,
        'has-text-red': row._source.priority == 4,
      };
    },
    /**
     * Tries to refetch the logs.
     */
    retryLogFetch() {
      this.$store
        .dispatch("getLogs")
        .catch((error) => {
          this.fetchError = "Die Logs konnten nicht geladen werden!";
          console.log(error);
        });
      this.fetchError = "";
    },
    /**
     * Closes the other detail view by setting the
     * 'opened' variable to the current row.
     * 
     * @param {*} row - The row that should be closed. 
     */
    closeOtherDetail(row) {
      this.defaultOpenedDetails = [row._id];
    },
    /**
     * Searches the logs for a given string.
     * 
     * @param {string} searchQuery - The search string.
     */
    searchFor(searchQuery) {
      this.searchQuery = searchQuery;
    },
    /**
     * Clears the searchQuery.
     */
    clearSearchInput() {
      this.searchQuery = "";
    },
    /**
     * Launches the validation modal.
     */
    launchValidationModal() {
      this.isValidationModalActive = true;
    },
    /**
     * Performs the execution of the service.
     * 
     * @param {String} serviceId - The id of the service that should be executed.
     * @param {String} fileId - The id of the file that the service should be executed with.
     */
    validateLog(logId) {
      this.validationResult = null;
      return new Promise((resolve, reject) => {
        axios.get(`/api/proofs/verify/${logId}`)
          .then((resp) => {
            this.validationResult = `Dieser Log konnte ${resp.data.valid ? "erfolgreich validiert werden!" : "nicht validiert werden!"}`;         
            this.launchValidationModal();
            resolve();
          })
          .catch((err) => {
            console.log("Something went wrong while validating the log.");
            this.openFailedToast("Die Validierung konnte nicht durchgeführt werden!");
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
  },
  /**
   * When the logsComponent is created the logs have to get loaded.
   */
  created() {
    // if(this.$store.getters.getFiles == [])
    this.$store
      .dispatch("getLogs")
      .catch((error) => {
        this.fetchError = "Die Logs konnten nicht geladen werden!";
        console.log(error);
      });

    var paramsQuery = this.$route.params.query;
    if(paramsQuery != "" || paramsQuery != null) {
      this.searchQuery = paramsQuery;
    }
  },
};
</script>

<style lang="scss" scoped>
.b-table .level:not(.top) {
  padding-bottom: 0rem;
}

@mixin ta-truncate {
  white-space: nowrap; 
  text-overflow: ellipsis; 
  overflow: hidden; 

  &:hover {
    text-overflow:clip;
    width:auto;
    white-space: normal;
  }
}

.ta-truncate-file {
  @include ta-truncate;

  max-width: 250px;
}

.ta-truncate-reason {
  @include ta-truncate;

  max-width: 300px;
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

.has-text-orange {
  color: orangered;
}

.has-text-red {
  color: red;
  font-weight: bold;
}

</style>
