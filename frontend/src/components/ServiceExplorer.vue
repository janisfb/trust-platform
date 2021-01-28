<template>
  <section>    
    <div class="level">
      <div class="column">
        <b-field>
          <b-input placeholder="Suche nach Service, Anbieter oder Version" v-model.lazy="searchQuery" />
        </b-field>
      </div>
      <h1 v-if="isAdmin" class="pr-3">|</h1>
      <b-button v-if="isAdmin" icon-left="upload" @click="launchCreatorModal()">Neuen Service hinzufügen</b-button>
    </div>
    <h1 class="pt-5" v-if="data.length == 0">Keine Services verfügbar!</h1>  
    <div v-else class="container">
      <b-table
        hoverable
        :data="filter"
        :paginated="true"
        :per-page="this.computePageSize"
        :current-page.sync="currentPage"
        :pagination-position="paginationPosition"
        @click="(row) => launchInfoModal(row)"
        aria-next-label="Next page"
        aria-previous-label="Previous page"
        aria-page-label="Page"
        aria-current-label="Current page">

        <b-table-column class="ta" field="name" label="Service" v-slot="props" :width="550">
          <div class="ta">{{ props.row.name }}</div>
        </b-table-column>

        <b-table-column field="creator" label="Anbieter" v-slot="props">
          <div class="ta">{{ props.row.creator }}</div>
        </b-table-column>

        <b-table-column field="version" label="Version" centered v-slot="props" :width="100">
          <b-tag type="is-info">{{ props.row.version }}</b-tag>
        </b-table-column>

        <b-table-column field="" centered v-slot="props" :width="50">
          <div v-on:click="launchInfoModal(props.row)">
            <b-tooltip multilined type="is-light" label="Mehr über diesen Service erfahren">
              <b-icon class="zoom" icon="information-outline"></b-icon>
            </b-tooltip>
          </div>
        </b-table-column>

        <b-modal v-model="isDVModalActive" :width="600">
          <ServiceDetailView v-bind:serviceElement="modalInformation"></ServiceDetailView>
        </b-modal>

        <b-modal v-model="isCreatorModalActive" :width="600">
          <ServiceCreator></ServiceCreator>
        </b-modal>
      </b-table>
    </div>
  </section>
</template>

<script>
const data = require('@/data/sampleService.json')
import ServiceDetailView from "@/components/ServiceDetailView"
import ServiceCreator from "@/components/ServiceCreator"

export default {
  name: 'ServiceExplorer',
  data() {
    return {
        data,   
        isDVModalActive: false,
        isCreatorModalActive: false,
        paginationPosition: 'bottom',
        currentPage: 1,
        perPage: 8,
        modalInformation: {},
        searchQuery: "",
    }
  },
  components: {
    ServiceDetailView,
    ServiceCreator,
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
        if (this.data[i].name.match(name_re) || this.data[i].creator.match(name_re) || this.data[i].version.match(name_re)) {
          dataFiltered.push(this.data[i])
        }
      }
      return dataFiltered
    },
    isAdmin() {
      return this.$store.state.username === "admin";
    },
  },
  methods: {
    launchInfoModal(row) {
      this.modalInformation = row;
      this.isDVModalActive = true;
    },
    launchCreatorModal() {
      this.isCreatorModalActive = true;
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

.ta {
  text-align: left;
}
</style>