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
    <div v-if="file == null">
      <b-button disabled class="is-primary is-fullwidth" icon-left="upload">
        <span style="overflow: hidden; text-overflow: ellipsis;">{{ "Bitte wähle eine Datei aus" }}</span>
      </b-button>
    </div>
    <div v-else class="level">
      <div style="max-width: 80%; min-width: 80%">
        <b-button
          @click="uploadFile()"
          style="overflow: hidden; text-overflow: ellipsis;"
          class="is-primary mr-2 level-left is-fullwidth"
          icon-left="upload"
        >
          <div style="max-width: 8vw; overflow: hidden; text-overflow: ellipsis;">{{ file.name }}</div>
        </b-button>
      </div>
      <b-button
        @click="file = {}"
        type="is-danger level-right"
        icon-right="delete"
      />
    </div>
    <h1 v-if="fetchError != ''" class="has-text-danger pt-2">Die Datei konnte nicht hochgeladen werden!</h1>
  </section>
</template>

<script>
import axios from "axios";

export default {
  name: "UploadFile",
  data() {
    return {
      fetchError: "",
      file: null,
    };
  },
  methods: {
    uploadFile() {
      return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append("uploadFile", this.file);
        axios.post("/api/files",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            }
          })
          .then((resp) => {
            console.log(resp);
            this.file = null;
            this.fetchError = "";
            this.openSuccessToast();
            this.$store.dispatch("getFiles");
            resolve();
          })
          .catch((err) => {
            console.log("Something went wrong while uploading the file!");
            this.fetchError = "Die Datei konnte nicht hochgeladen werden!"
            reject(err);
          });
      });
    },
    /**
     * Opens a toast with information about a failed login.
     */
    openSuccessToast() {
      this.$buefy.toast.open({
        duration: 4000,
        message: "Datei erfolgreich hochgeladen!",
        position: "is-top",
        type: "is-success",
        queue: false,
      });
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
