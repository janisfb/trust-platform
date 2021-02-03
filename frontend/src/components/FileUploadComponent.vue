<template>
  <section>
    <b-field>
      <b-upload v-model="file" drag-drop expanded>
        <section class="section">
          <div class="content has-text-centered">
            <p>
              <b-icon icon="upload" size="is-large"></b-icon>
            </p>
            <p>Datei hochladen</p>
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
          @click="uploadOrReplaceFile()"
          style="overflow: hidden; text-overflow: ellipsis;"
          class="is-primary mr-2 level-left is-fullwidth"
          icon-left="upload"
        >
          <div style="max-width: 8vw; overflow: hidden; text-overflow: ellipsis;">{{ file.name }}</div>
        </b-button>
      </div>
      <b-button
        @click="file = null"
        type="is-danger level-right"
        icon-right="delete"
      />
    </div>
    <h1 v-if="errorText != ''" class="has-text-danger pt-2">{{ errorText }}</h1>
  </section>
</template>

<script>
import axios from "axios";

export default {
  name: "UploadFile",
  data() {
    return {
      errorText: "",
      file: null,
    };
  },
  props: {
    replaceId: {
      type: String,
      default: "",
      required: false,
    }
  },
  methods: {
    uploadOrReplaceFile() {
      if(this.replaceId === "") {
        this.uploadFile();
      } else {
        this.replaceFile();
      }
    },
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
            this.errorText = "";
            this.openSuccessToast("Datei erfolgreich hochgeladen!");
            this.$store.dispatch("getFiles");
            resolve();
          })
          .catch((err) => {
            console.log("Something went wrong while uploading the file!");
            this.errorText = "Die Datei konnte nicht hochgeladen werden!"
            reject(err);
          });
      });
    },
    replaceFile() {
      console.log("replacing file")
      return new Promise((resolve, reject) => {
        let formData = new FormData();
        formData.append("uploadFile", this.file);
        axios.post(`/api/files/${this.replaceId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            }
          })
          .then((resp) => {
            console.log(resp);
            this.file = null;
            this.errorText = "";
            this.openSuccessToast("Datei erfolgreich geändert!");
            this.$store.dispatch("getFiles");
            resolve();
          })
          .catch((err) => {
            console.log("Something went wrong while uploading the file!");
            this.errorText = "Die Datei konnte nicht hochgeladen werden!"
            reject(err);
          });
      });
    },
    /**
     * Opens a toast with information about a successful login.
     * 
     * @param {String} message - Die Nachricht, die angezeigt werden soll.
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
  watch: {
    file(newV) {
      if(newV != null && (newV.name.includes("-") || newV.name.includes("/"))) {
        this.errorText = "Der Dateiname darf keines der folgenden Zeichen enthalten: -, /";
        this.file = null;
      } else if(newV != null) {
        this.errorText = "";
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
