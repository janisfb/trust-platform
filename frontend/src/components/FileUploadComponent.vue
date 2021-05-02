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
import toastHelpers from '../helpers/toastHelpers.js';

export default {
  name: "UploadFile",
  data() {
    return {
      errorText: "",
      file: null,
    };
  },
  props: {
    /**
     * If this component should be used to replace a file on the server
     * the replaceId needs to be set to the id of the soon to be replaced
     * file on the server.
     */
    replaceId: {
      type: String,
      default: "",
      required: false,
    },
    /**
     * If only files created by the current user should be shown.
     */
    onlyOwnFiles: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    /**
     * If the replaceId prop is set, this component is used to
     * post a file to the replace-endpoint. If not a normal post
     * request will be issued.
     */
    uploadOrReplaceFile() {
      if(this.replaceId === "") {
        this.uploadFile();
      } else {
        this.replaceFile();
      }
    },
    /**
     * Upload a file to the directory on the server.
     */
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
            this.$store.dispatch(this.onlyOwnFiles ? "getFiles" : "getAllFiles");
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
     * Replace a file on the server by providing the id of the soon to be
     * replaced file.
     */
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
            this.$store.dispatch(this.onlyOwnFiles ? "getFiles" : "getAllFiles");
            resolve();
          })
          .catch((err) => {
            console.log("Something went wrong while uploading the file!");
            this.errorText = "Die Datei konnte nicht hochgeladen werden!"
            reject(err);
          });
      });
    },
    ...toastHelpers
  },
  watch: {
    /**
     * Everytime a file is put into to upload it will be checked for forbidden
     * characters in the name. "-" is forbidden because it is used as a delimiter
     * on the servers directory.
     */
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

<style lang="scss" scoped></style>
