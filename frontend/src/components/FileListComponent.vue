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
          <div style="max-width: 270px; overflow: hidden; text-overflow: ellipsis;">
            {{ props.row.fileName }}
          </div>
        </b-table-column>

        <b-table-column
          field="creator"
          label="Besitzer"
          :width="140"
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

        <template #detail="props">
          <div class="level">
            <div class="level-left">
              <h1>ID: {{ props.row.id }}</h1>
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
              <b-button 
                @click="launchReplaceModal()"
                icon-left="file-replace"
              >
                Datei ersetzen
              </b-button>
              <b-button 
                @click="confirmDelete(props.row)"
                class="is-danger" 
                icon-left="delete"
              >
                Datei löschen
              </b-button
              >
            </div>
          </div>

          <b-modal v-model="isReplaceModalActive" :width="400">
            <div class="box" style="padding: 0px">
              <section class="hero is-light">
                <div class="hero-body">
                  <h1 class="title">Datei ersetzen</h1>
                  <h2 class="subtitle">{{ props.row.fileName }} [{{props.row.id}}]</h2>
                </div>
              </section>
              <section style="padding: 1.5rem">
                <div v-if="props.row.creator != username" class="has-text-danger pb-2">Dies ist keine eigene Datei!</div>
                <file-upload-component :replaceId="props.row.id"></file-upload-component>
              </section>
            </div>
          </b-modal>
        </template>       
      </b-table>
    </div>
  </section>
</template>

<script>
import axios from "axios";
import FileUploadComponent from './FileUploadComponent.vue';

export default {
  components: { FileUploadComponent },
  name: "FileExplorer",
  data() {
    return {
      // data + config for the table
      data: [],
      isPaginated: true,
      currentPage: 1,
      perPage: 8,
      showDetailIcon: true,
      defaultOpenedDetails: [],
      isReplaceModalActive: false,
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
      if (bytes === 0) return "0 Bytes";

      const decimals = 2;
      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    },
    /**
     * Closes the other detail view by setting the
     * 'opened' variable to the current row.
     */
    closeOtherDetail(row) {
      this.defaultOpenedDetails = [row.id];
    },
    /**
     * Launches the file replace modal.
     */
    launchReplaceModal() {
      this.isReplaceModalActive = true;
    },
    /**
     * Tries to refetch the files.
     */
    retryFileFetch() {
      this.$store
        .dispatch("getFiles")
        .catch((error) => {
          this.fetchError = "Die Dateien konnten nicht geladen werden!";
          console.log(error);
        });
      this.fetchError = "";
    },
    /**
     * Prompts for a confirm before deleting the file.
     * Will delete the file when the dialog gets confirmed!
     * 
     * @param {*} row - The row of the file.
     */
    confirmDelete(row) {
      if(row.creator != this.username) {
        this.$buefy.dialog.confirm({
        title: "Datei löschen",
        message: `Die Datei wird <b>unwideruflich</b> gelöscht! Eine Bestätigung ist erforderlich.
            <p class="pt-2"><b class="has-text-danger pt-2">Dies ist keine eigene Datei!</b></p>`,
        cancelText: "Abbrechen",
        confirmText: "Datei löschen",
        type: "is-danger",
        hasIcon: true,
        onConfirm: () => this.deleteFile(row.id)
      })
      }
      else {
        this.$buefy.dialog.confirm({
          title: "Datei löschen",
          message: `Die Datei wird <b>unwideruflich</b> gelöscht! Eine Bestätigung ist erforderlich.`,
          cancelText: "Abbrechen",
          confirmText: "Datei löschen",
          type: "is-danger",
          hasIcon: true,
          onConfirm: () => this.deleteFile(row.id)
        })
      }
    },
    /**
     * Deletes a file.
     * 
     * @param {string} id The id of the file that should be deleted.
     */
    deleteFile(id) {
      return new Promise((resolve, reject) => {
        axios.delete(`/api/files/${id}`)
          .then((resp) => {
            console.log(resp);            
            this.openSuccessToast("Die Datei wurde erfolgreich gelöscht!");
            this.$store.dispatch("getFiles");
            resolve();
          })
          .catch((err) => {
            console.log("Something went wrong while deleting the file!");
            this.openFailedToast("Die Datei konnte nicht gelöscht werden!");
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
