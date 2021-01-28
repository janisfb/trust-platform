<template>
  <section>   
    <b-field>
      <b-upload v-model="file" drag-drop expanded>
        <section class="section">
          <div class="content has-text-centered">
            <p>
              <b-icon icon="upload" size="is-large"></b-icon>
            </p>
            <p>Dateien hochladen</p>
          </div>
        </section>
      </b-upload>
    </b-field>
    <div v-if="file.name == null">
      <b-button
        disabled
        class="is-primary is-fullwidth"
        icon-left="upload">
        <span>{{ file.name || "Bitte wähle eine Datei aus"}}</span>
      </b-button>
    </div>
    <div v-else class="level">
      <b-button 
        @click="uploadFile()"
        style="max-width: 80%;"
        class="is-primary mr-2 level-left is-fullwidth"
        icon-left="upload">
        <span>{{ file.name }}</span>
      </b-button>
      <b-button 
        @click="file = {}"
        type="is-danger level-right"
        icon-right="delete" />
    </div>
  </section>
</template>

<script>
export default {
  name: 'UploadFile',
  data() {
    return {
      file: {},
    };
  },
  methods: {
    uploadFile() {
      
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
