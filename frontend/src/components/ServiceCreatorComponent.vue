<template>
  <div style="height: 80vh; overflow-x: auto" class="box no-padding">
    <section class="hero is-light">
      <div class="hero-body">
        <h1 class="title">Neuen Service erstellen</h1>
      </div>
    </section>
    <section class="add-padding">
      <b-steps
        v-model="activeStep"
        :has-navigation="false"
        :mobile-mode="mobileMode"
      >
        <b-step-item step="1" label="Kontakt" :clickable="isStepsClickable">
          <ValidationObserver ref="observer" v-slot="{ handleSubmit }">
            <h1 class="title has-text-centered">Kontaktinformation</h1>
            <ValidationProvider rules="required|min:3|max:50" name="company" v-slot="{ errors, valid }">
              <b-field
                :type="{ 'is-danger': errors[0], 'is-success': valid }"
                :message="errors"
              >
                <b-input
                  placeholder="Herausgebende Firma"
                  icon="card-account-details-outline"
                  v-model="contact.company"
                ></b-input>
              </b-field>
            </ValidationProvider>
            
            <ValidationProvider rules="required|url|min:3" name="url" v-slot="{ errors, valid }">
              <b-field
                :type="{ 'is-danger': errors[0], 'is-success': valid }"
                :message="errors"
              >
                <b-input
                  placeholder="url"
                  icon="link"
                  v-model="contact.url"
                ></b-input>
              </b-field>
            </ValidationProvider>

            <ValidationProvider rules="required|email" name="email" v-slot="{ errors, valid }">
              <b-field
                :type="{ 'is-danger': errors[0], 'is-success': valid }"
                :message="errors"
              >
                <b-input 
                  placeholder="Email"
                  icon="email" 
                  v-model="contact.email"
                ></b-input>
              </b-field>
            </ValidationProvider>

            <ValidationProvider rules="required|tel" name="tel" v-slot="{ errors, valid }">
              <b-field
                :type="{ 'is-danger': errors[0], 'is-success': valid }"
                :message="errors"
              >
                <b-input
                  placeholder="Telefon"
                  icon="phone"
                  v-model="contact.tel"
                ></b-input>
              </b-field>   
            </ValidationProvider> 

            <div class="next-btn">
              <b-button @click="handleSubmit(nextStep)">Weiter</b-button>
            </div>
          </ValidationObserver>
        </b-step-item>

        <b-step-item step="2" label="Metadaten" :clickable="isStepsClickable">
          <ValidationObserver ref="observer" v-slot="{ handleSubmit }">
            <h1 class="title has-text-centered">Metadaten des Services</h1>
            <ValidationProvider rules="required|min:3|max:50" name="name" v-slot="{ errors, valid }">
              <b-field
                :type="{ 'is-danger': errors[0], 'is-success': valid }"
                :message="errors"
              >
                <b-input 
                  placeholder="Name des Services" 
                  icon="cog" 
                  v-model="serviceMeta.name"
                ></b-input>
              </b-field>
            </ValidationProvider>

            <ValidationProvider rules="required|min:3|max:50" name="version" v-slot="{ errors, valid }">
              <b-field
                :type="{ 'is-danger': errors[0], 'is-success': valid }"
                :message="errors"
              >
                <b-input 
                  placeholder="Version" 
                  icon="image-filter-none"
                  v-model="serviceMeta.version"  
                ></b-input>
              </b-field>
            </ValidationProvider>

            <ValidationProvider rules="required|min:10|max:280" name="description" v-slot="{ errors, valid }">
              <b-field
                :type="{ 'is-danger': errors[0], 'is-success': valid }"
                :message="errors"
              >
                <b-input
                  placeholder="Beschreibung"
                  type="textarea"
                  maxlength="280"
                  v-model="serviceMeta.description"
                ></b-input>
              </b-field>
            </ValidationProvider>

            <div class="next-btn columns">
              <b-button class="mr-1" @click="prevStep()">Zurück</b-button>
              <b-button class="ml-1" @click="handleSubmit(nextStep)">Weiter</b-button>
            </div>
          </ValidationObserver>
        </b-step-item>

        <b-step-item step="3" label="Souveränität" :clickable="isStepsClickable">
          <h1 class="title has-text-centered">Souveränitätsdaten</h1>
          <ValidationObserver ref="observer" v-slot="{ handleSubmit }">
            <div style="text-align: left;">
              <div v-bind:class="{ 'box': sovereignty.needsFullAccess }">
                <b-switch                   
                  v-model="sovereignty.needsFullAccess"
                >
                  Benötigt Vollzugriff auf die Daten
                </b-switch>
                <ValidationProvider v-if="sovereignty.needsFullAccess" rules="required|min:10|max:150" name="accessReason" v-slot="{ errors, valid }">
                  <b-field
                    :type="{ 'is-danger': errors[0], 'is-success': valid }"
                    :message="errors"
                  >
                    <b-input 
                      class="pt-2" 
                      v-model="sovereignty.accessReason"
                      placeholder="Grund für den vollständigen Zugriff" 
                      max="150"
                    ></b-input>
                  </b-field>
                </ValidationProvider>
              </div>
              <div v-bind:class="{ 'box': sovereignty.usesExternalService }">
                <b-switch 
                  v-model="sovereignty.usesExternalService" 
                  class="pt-2"
                >
                  Nutzt externen Service
                </b-switch>
                <ValidationProvider v-if="sovereignty.usesExternalService" rules="required|min:3|max:50" name="name" v-slot="{ errors, valid }">
                  <b-field
                    class="pt-2" 
                    :type="{ 'is-danger': errors[0], 'is-success': valid }"
                    :message="errors"
                  >
                    <b-input 
                      placeholder="Name des externen Services"  
                      v-if="sovereignty.usesExternalService"
                      v-model="sovereignty.externalService.name"
                      max="50"
                    ></b-input>
                  </b-field>
                </ValidationProvider>
                <ValidationProvider v-if="sovereignty.usesExternalService" rules="required|min:10|max:150" name="reason" v-slot="{ errors, valid }">
                  <b-field
                    class="pt-2" 
                    :type="{ 'is-danger': errors[0], 'is-success': valid }"
                    :message="errors"
                  >
                    <b-input 
                      v-if="sovereignty.usesExternalService"
                      v-model="sovereignty.externalService.reason"
                      placeholder="Grund für die Nutzung"  
                      max="150"
                    ></b-input>
                  </b-field>
                </ValidationProvider>
              </div>
            </div>
            <div class="next-btn columns">
              <b-button class="mr-1" @click="prevStep()">Zurück</b-button>
              <b-button class="ml-1" @click="handleSubmit(nextStep)">Weiter</b-button>
            </div>
          </ValidationObserver>
        </b-step-item>

        <b-step-item step="3" label="Beenden" :clickable="isStepsClickable">
          <h1 class="title has-text-centered">Hochladen & Beenden</h1>
          <div class="box">
            <div style="display:flex;">
              Servicename: 
              <h1 class="ml-3">{{ serviceMeta.name }}</h1>
              <b-tag type="is-info ml-2" style="align-self:center;">
                {{ serviceMeta.version }}
              </b-tag>
            </div>
            <h1 class="mt-2" style="text-align: left;">Herausgeber: {{ contact.company }}</h1>
            <li 
              v-if="sovereignty.usesExternalService || sovereignty.needsFullAccess" 
              class="box active-border has-text-danger mt-2" 
              style="text-align: left;"
            >
              <ul v-if="sovereignty.needsFullAccess">Benötigt vollständigen Datenzugriff</ul>
              <ul v-if="sovereignty.usesExternalService">Nutzt externen Service: {{ sovereignty.externalService.name }}</ul>
            </li>
          </div>
          <span v-if="fileError != ''" class="has-text-danger">{{ fileError }}</span>
          <div class="level pt-3">
            <div style="width: 75%;">
                <b-field class="file">
                  <b-upload 
                    v-model="file" 
                    expanded
                  >
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
              <b-button @click="uploadFile()">Hochladen</b-button>
            </div>
          </div>
          <div class="next-btn columns">
            <b-button class="mr-1" @click="prevStep()">Zurück</b-button>
          </div>
        </b-step-item>
      </b-steps>
    </section>
  </div>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import { extend } from 'vee-validate';      
import { required, email, min, max } from 'vee-validate/dist/rules';

export default {
  name: "ServiceCreatorComponent",
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      // obj für Datei
      file: null,
      fileError: "",

      // config für b-steps
      activeStep: 0,
      isStepsClickable: false,
      hasNavigation: true,
      mobileMode: 'minimalist',

      /**
       * Kontaktdaten zur Firma, die den Service anbietet.
       */
      contact: {
        company: "",
        url: "",
        email: "",
        tel: null,
      },

      /**
       * Metadaten zum eigentlichen Service.
       */
      serviceMeta: {
        name: "",
        version: "",
        description: "",
      },

      /**
       * Metadaten zur Datensouveränität
       */
      sovereignty: {
        needsFullAccess: false,
        accessReason: "",
        usesExternalService: false,
        externalService: {
          name: "",
          reason: "",
        },
      },
    };
  },
  methods: {
    /**
     * Wechselt auf die vorherige Seite der b-steps.
     */
    prevStep() {
      this.activeStep--;
    },
    /**
     * Wechselt auf die nächste Seite der b-steps.
     */
    nextStep() {
      this.activeStep++;
    },
    /**
     * Führt den File-Upload durch oder setzt eine Fehlermeldung,
     * wenn vorher keine Datei hochgeladen wurde.
     */
    uploadFile() {
      if(this.file == null) {
        this.fileError="Es wurde keine Datei hochgeladen!";
      } else {
        console.log("to the moon");
      }
    },
  }
};

/**
 * Required Regel für Pflichtfelder.
 */
extend('required', {
  ...required,
  message: 'Dies ist ein Pflichfeld'
});

/**
 * Email Regel.
 */
extend('email', {
  ...email,
  message: "Das ist keine korrekte Email-Adresse"
});

/**
 * Regel für min Anzahl an Zeichen.
 */
extend('min', {
  ...min,
  message: 'Diese Eingabe ist zu kurz'
});

/**
 * Regel für max Anzahl an Zeichen.
 */
extend('max', {
  ...max,
  message: 'Diese Eingabe is zu lang'
});

/**
 * Regel für Telefonnummern.
 */
extend('tel', {
  validate(value) {
    //eslint-disable-next-line
    var regex = /\(?\+?\(?4?9?\)?[ ()]?([- ()]?\d[- ()]?){10}/g;
    if(regex.test(value)) {
      return true;
    }
  },
  message: "Das ist keine korrekte Telefonnummer",
});

/**
 * Regeln für URLs.
 */
extend('url', {
  validate(value) {
    //eslint-disable-next-line
    var regex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
    if(regex.test(value)) {
      return true;
    }
  },
  message: "Das ist keine korrekte URL",
});
</script>

<style lang="scss" scoped>
@import '../assets/scss/_variables.scss';

.no-padding {
  padding: 0px;
}

.add-padding {
  padding: 1.25rem;
}

.active-border {
  border-left: 6px solid $danger!important;
  padding: 0.01em 16px;
}

.next-btn {
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  margin-top: 5px;
}
</style>