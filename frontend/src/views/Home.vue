<template>
  <div class="home mt-5">
    <section>
      <div class="columns">
        <div class="column is-narrow">
          <div class="box fill-height" style="width: 15vw;">
            <Upload-File></Upload-File>
            <section>
              <hr>
              <div class="control pl-4" style="text-align: left;">
                <b-switch v-model="onlyOwnFiles">Nur eigene Dateien</b-switch>
                <b-switch class="pt-3" v-model="showSearch">Suchleiste anzeigen</b-switch>
              </div>
            </section>
          </div>
        </div>
        <div class="column">
          <div class="box fill-height">
            <File-Explorer 
              :onlyOwnFiles="onlyOwnFiles"
              :showSearch="showSearch"></File-Explorer>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import UploadFile from "@/components/UploadFile.vue"
import FileExplorer from "@/components/FileExplorer"

export default {
  name: 'Home',
  components: {
    UploadFile,
    FileExplorer
  },
  data() {
    return {
      onlyOwnFiles: false,
      showSearch: true
    }
  }
}
</script>

<style lang="scss" scoped>
.fill-height {
  height: 72vh;
}
</style>
