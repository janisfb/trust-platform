<template>
  <div class="home mt-5">
    <section>
      <div class="columns">
        <div class="column is-narrow">
          <div class="box fill-height" style="width: 15vw;">
            <file-upload-component></file-upload-component>
            <section>
              <hr />
              <div class="control pl-4" style="text-align: left;">
                <b-switch v-if="isAdmin" v-model="onlyOwnFiles">Nur eigene Dateien</b-switch>
                <b-switch class="pt-3" v-model="showSearch">
                  Suchleiste anzeigen
                </b-switch>
              </div>
            </section>
          </div>
        </div>
        <div class="column">
          <div class="box fill-height">
            <file-list-component
              :only-own-files="onlyOwnFiles"
              :show-search="showSearch"
            >
            </file-list-component>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import FileUploadComponent from "@/components/FileUploadComponent.vue";
import FileListComponent from "@/components/FileListComponent";

export default {
  name: "FileView",
  components: {
    FileUploadComponent,
    FileListComponent,
  },
  data() {
    return {
      onlyOwnFiles: false,
      showSearch: true,
    };
  },
  computed: {
    /**
     * Returns if the user is admin or not
     *
     * @returns {Boolean} True if the current user is admin.
     */
    isAdmin() {
      return this.$store.getters.isAdmin;
    },
  }
};
</script>

<style lang="scss" scoped>
.fill-height {
  height: 72vh;
}
</style>
