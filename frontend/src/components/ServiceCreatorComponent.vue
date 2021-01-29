<template>
  <div class="box no-padding">
    <section class="hero is-light">
      <div class="hero-body">
        <h1 class="title">Neuen Service erstellen</h1>
      </div>
    </section>
    <section class="add-padding">
      <section>
        <b-field label="Kontaktinformation">
          <b-input
            icon="card-account-details-outline"
            placeholder="Herausgebende Firma"
          ></b-input>
        </b-field>

        <b-field>
          <b-input icon="email" placeholder="Email" type="email"></b-input>
        </b-field>

        <b-field>
          <b-input
            icon="phone"
            placeholder="Telefon"
            pattern="^[0-9-+\s()]*$"
            maxlength="12"
          ></b-input>
        </b-field>

        <b-field label="Metadaten">
          <b-input placeholder="Name des Services" icon="cog" min="3" max="50">
          </b-input>
        </b-field>

        <b-field>
          <b-input placeholder="Version" icon="image-filter-none"> </b-input>
        </b-field>

        <b-field>
          <b-input
            type="textarea"
            minlength="10"
            maxlength="280"
            placeholder="Beschreibung"
          >
          </b-input>
        </b-field>

        <div class="level">
          <div style="width: 75%;">
            <b-field class="file">
              <b-upload v-model="file" expanded>
                <a class="button is-primary is-fullwidth">
                  <b-icon icon="upload"></b-icon>
                  <span style="overflow: hidden; text-overflow: ellipsis;">{{
                    file != null ? file.name : ".js-Code hochladen"
                  }}</span>
                </a>
              </b-upload>
            </b-field>
          </div>
          |
          <div>
            <b-field>
              <b-button>Hochladen</b-button>
            </b-field>
          </div>
        </div>
      </section>
    </section>
  </div>
</template>

<script>
export default {
  name: "ServiceCreatorComponent",
  data() {
    return {
      file: null,
    };
  },
  props: {},
};
</script>

<style>
.no-padding {
  padding: 0px;
}

.add-padding {
  padding: 1.25rem;
}
</style>
