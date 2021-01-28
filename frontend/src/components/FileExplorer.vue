<template>
  <section>   
    <b-field v-if="showSearch">
      <b-input placeholder="Suche nach Dateiname, Besitzer, ID oder Datum" v-model.lazy="searchQuery" />
    </b-field> 
    <h1 class="pt-5" v-if="data.length == 0">Keine Dateien hochgeladen!</h1>  
    <div v-else class="container">
      <b-table class="text-align-left"
        :opened-detailed="defaultOpenedDetails"
        detailed
        detail-key="id"
        @details-open="(row, index) => closeOtherDetail(row)"
        @dblclick="(row, index) => closeOtherDetail(row)"
        :show-detail-icon="showDetailIcon"
        :data="filter"
        :paginated="isPaginated"
        :per-page="this.computePageSize"
        :current-page.sync="currentPage"
        default-sort="user.first_name"
        aria-next-label="Next page"
        aria-previous-label="Previous page"
        aria-page-label="Page"
        aria-current-label="Current page">

        <!-- <b-table-column field="id" label="ID" width="40" sortable numeric v-slot="props">
            {{ props.row.id }}
        </b-table-column> -->

        <b-table-column field="fileName" label="Datei" sortable v-slot="props">
          {{ props.row.fileName }}
        </b-table-column>

        <b-table-column field="creator" label="Besitzer" :width="180" sortable v-slot="props">
          {{ props.row.creator }}
        </b-table-column>

        <b-table-column field="creationTime" label="Erstellt" :width="180" sortable v-slot="props">
          {{ new Date(props.row.creationTime).toLocaleString() }}
        </b-table-column>

        <b-table-column field="lastModifiedTime" label="Geändert" :width="180" sortable v-slot="props">
          {{ new Date(props.row.lastModifiedTime).toLocaleString() }}
        </b-table-column>

        <b-table-column field="fileSizeInBytes" label="Größe" :width="100" sortable v-slot="props">
          {{ props.row.fileSizeInBytes }} Bytes
        </b-table-column>

        <b-table-column field="" centered>
          <b-tooltip multilined type="is-light" label="Einen Service auf dieser Datei ausführen">
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
              <h1>ID: {{props.row.id.split("-")[1]}}</h1>
              <b-tag class="ml-5" v-if="props.row.creator != username"
                type="is-warning"
                Colored tag label>
                Keine eigene Datei
              </b-tag>
            </div>
            <div class="buttons are-small">
              <b-button icon-left="file-search">Souveränitätsdaten</b-button>
              <b-button icon-left="lock-open">Zugriff simulieren</b-button>
              <b-button class="is-danger" icon-left="delete">Datei löschen</b-button>
            </div>
          </div>
        </template>
      </b-table>
    </div>
  </section>
</template>

<script>
const data = require('@/data/sample.json')

export default {
  name: 'FileExplorer',
  data() {
    return {
        data,
        searchQuery: "",
        isPaginated: true,
        currentPage: 1,
        perPage: 8,
        defaultOpenedDetails: [],
        showDetailIcon: true
    }
  },
  props: {
    onlyOwnFiles: Boolean,
    showSearch: Boolean,
  },
  computed: {
    username() {
      return this.$store.state.username;
    },
    computePageSize() {
      if(window.matchMedia("(max-width: 1200px)").matches) {
        console.log("below max-width - reducing size");
        return 5;
      } else {
        return 8;
      }
    },
    filter() {
      var name_re = new RegExp(this.searchQuery, 'i')
      var dataFiltered = []
      for (var i in this.data) {
        if ((this.data[i].fileName.match(name_re) 
            || this.data[i].creator.match(name_re) 
            || new Date(this.data[i].creationTime).toLocaleString().match(name_re)
            || this.data[i].id.match(name_re)) 
            && (!this.onlyOwnFiles || (this.onlyOwnFiles && this.data[i].creator == this.username))) {
          dataFiltered.push(this.data[i])
        }
      }
      return dataFiltered
    },
  },
  methods: {
    doSth(props) {
      console.log(props);
    },

    closeOtherDetail(row) {
      this.defaultOpenedDetails = [row.id];
    },
  }
}
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

.text-align-left {
  text-align: left;
}
</style>
