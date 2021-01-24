<template>
  <div class="home mt-5">
    <section>
      <div class="columns">
        <div class="column is-narrow">
          <div class="box fill-height" style="width: 15vw;">
            <Upload-File></Upload-File>
          </div>
        </div>
        <div class="column">
          <div class="box fill-height">
            <File-Explorer></File-Explorer>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import UploadFile from "@/components/UploadFile.vue"
import FileExplorer from "@/components/FileExplorer"

export default {
  name: 'Home',
  components: {
    UploadFile,
    FileExplorer
  }
}
</script>

<style lang="scss" scoped>
.fill-height {
  height: 70vh;
}
</style>
