<template>
  <section>
    <b-field v-if="showSearch">
      <b-input
        placeholder="Suche nach Dateiname, Besitzer, ID oder Datum"
        v-model.lazy="searchQuery"
      />
    </b-field>
    <div v-if="this.fetchError != ''">
      <h1 class="has-text-danger">{{ fetchError }}</h1>
      <b-button @click="retryFileFetch">Dateien erneut laden</b-button>
    </div>
    <h1 class="pt-5" v-else-if="files.length == 0">Bisher wurden keine Dateien hochgeladen!</h1>
    <div v-else class="container">
      <b-table
        class="text-align-left"
        detailed
        detail-key="id"
        default-sort="user.first_name"
        :opened-detailed="defaultOpenedDetails"
        :show-detail-icon="showDetailIcon"
        :data="filter"
        :paginated="isPaginated"
        :per-page="this.computePageSize"
        :current-page.sync="currentPage"
        @details-open="(row, index) => closeOtherDetail(row)"
        @dblclick="(row, index) => closeOtherDetail(row)"
      >
        <b-table-column field="fileName" label="Datei" sortable v-slot="props">
          {{ props.row.fileName }}
        </b-table-column>

        <b-table-column
          field="creator"
          label="Besitzer"
          :width="180"
          sortable
          v-slot="props"
        >
          {{ props.row.creator }}
        </b-table-column>

        <b-table-column
          field="creationTime"
          label="Erstellt"
          :width="180"
          sortable
          v-slot="props"
        >
          {{ new Date(props.row.creationTime).toLocaleString() }}
        </b-table-column>

        <b-table-column
          field="lastModifiedTime"
          label="Geändert"
          :width="180"
          sortable
          v-slot="props"
        >
          {{ new Date(props.row.lastModifiedTime).toLocaleString() }}
        </b-table-column>

        <b-table-column
          field="fileSizeInBytes"
          label="Größe"
          :width="100"
          sortable
          v-slot="props"
        >
          {{ transformSizeFormat(props.row.fileSizeInBytes) }}
        </b-table-column>

        <b-table-column field="" centered>
          <b-tooltip
            multilined
            type="is-light"
            label="Einen Service auf dieser Datei ausführen"
          >
            <b-icon class="zoom" icon="play-circle-outline"></b-icon>
          </b-tooltip>
        </b-table-column>

        <!-- <b-table-column label="Gender" v-slot="props">
          <b-dropdown aria-role="list is-small">
            <template #trigger="{ active }">
              <b-button
                  label="Click me!"
                  type="is-primary"
                  :icon-right="active ? 'menu-up' : 'menu-down'" />
            </template>


            <b-dropdown-item aria-role="listitem" @click="doSth(props)">Action</b-dropdown-item>
            <b-dropdown-item aria-role="listitem">Another action</b-dropdown-item>
            <b-dropdown-item aria-role="listitem">Something else</b-dropdown-item>
          </b-dropdown>
        </b-table-column> -->
        <template #detail="props">
          <div class="level">
            <div class="level-left">
              <h1>ID: {{ props.row.id.split("-")[1] }}</h1>
              <b-tag
                class="ml-5"
                v-if="props.row.creator != username"
                type="is-warning"
                Colored
                tag
                label
              >
                Keine eigene Datei
              </b-tag>
            </div>
            <div class="buttons are-small">
              <b-button icon-left="file-search">Souveränitätsdaten</b-button>
              <b-button icon-left="lock-open">Zugriff simulieren</b-button>
              <b-button class="is-danger" icon-left="delete"
                >Datei löschen</b-button
              >
            </div>
          </div>
        </template>
      </b-table>
    </div>
  </section>
</template>

<script>
const data = require("@/data/sample.json");

export default {
  name: "FileExplorer",
  data() {
    return {
      // data + config for the table
      data,
      isPaginated: true,
      currentPage: 1,
      perPage: 8,
      showDetailIcon: true,
      defaultOpenedDetails: [],
      // searchQuery for filter
      searchQuery: "",
      fetchError: "",
    };
  },
  props: {
    /**
     * If only files created by the current user should be shown.
     */
    onlyOwnFiles: {
      type: Boolean,
      required: true,
    },
    /**
     * If the search bar should be shown.
     */
    showSearch: {
      type: Boolean,
      required: true,
    },
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
     * Gets the data from the vuex store.
     * 
     * @returns {any[]} A list containing all fetched data.
     */
    files() {
      return this.$store.getters.getFiles;
    },
    /**
     * Filters the data with the searchQuery.
     * Searchable: name, creator and version
     * 
     * @returns A list containing the matching data
     */
    filter() {
      var name_re = new RegExp(this.searchQuery, "i");
      var dataFiltered = [];
      for (var i in this.files) {
        if (
          (this.files[i].fileName.match(name_re) ||
            this.files[i].creator.match(name_re) ||
            new Date(this.files[i].creationTime)
              .toLocaleString()
              .match(name_re) ||
            this.files[i].id.match(name_re)) &&
          (!this.onlyOwnFiles ||
            (this.onlyOwnFiles && this.files[i].creator == this.username))
        ) {
          dataFiltered.push(this.files[i]);
        }
      }
      return dataFiltered;
    },
  },
  methods: {
    /**
     * Formats the file size to a more readable format.
     * https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
     */
    transformSizeFormat(bytes) {
      if (bytes === 0) return '0 Bytes';

      const decimals = 2;
      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

      const i = Math.floor(Math.log(bytes) / Math.log(k));

      console.log(parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i])
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    },
    /**
     * Temp.
     * @deprecated This method is only temporary!
     */
    doSth(props) {
      console.log(props);
    },
    /**
     * Closes the other detail view by setting the
     * 'opened' variable to the current row.
     */
    closeOtherDetail(row) {
      this.defaultOpenedDetails = [row.id];
    },
    retryFileFetch() {
      this.$store
        .dispatch("getFiles")
        .catch((error) => {
          this.fetchError = "Die Dateien konnten nicht geladen werden!";
          console.log(error);
        });
      this.fetchError = "";
    }
  },
  created() {
    // if(this.$store.getters.getFiles == [])
      this.$store
        .dispatch("getFiles")
        .catch((error) => {
          this.fetchError = "Die Dateien konnten nicht geladen werden!";
          console.log(error);
        });
  },
};
</script>

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

.text-align-left {
  text-align: left;
}
</style>
