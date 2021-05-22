<template>
  <div style="text-align: left; overflow-x: auto;" class="box no-padding">
    <section class="hero is-light">
      <div class="hero-body">
        <div class="title">
          <div class="tile is-ancestor">
            <div class="tile is-child pl-2">
              <div style="display:flex;">
                <h1 class="info-title">{{ serviceElement.serviceMeta.name }}</h1>
                <b-tag type="is-info ml-3" style="align-self:center;">
                  {{ serviceElement.serviceMeta.version }}
                </b-tag>
              </div>
              <div class="subtitle">
                <h1 class="info-title">Von {{ serviceElement.contact.company }}</h1>
              </div>
            </div>
            <div style="max-width: 35%;" class="tile is-child subtitle contact-panel">
              <div class="pl-3" style="justify-content: middle;">
                <p>{{ serviceElement.contact.url }}</p>
                <p>{{ serviceElement.contact.email }}</p>
                <p>{{ serviceElement.contact.tel }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <div class="add-padding">
      <section>
        {{ serviceElement.serviceMeta.description }}
      </section>
      <div v-if="serviceElement.sovereignty.needsFullAccess || serviceElement.sovereignty.usesExternalService">
        <hr>
        <b-message v-if="serviceElement.sovereignty.needsFullAccess" type="is-danger" has-icon>
          <p>Dieser Service benötigt Vollzugriff auf Ihre Dateien. Durch die Nutzung könnte der Datenschutz und die Sicherheit der Daten beeinträchtigt werden.</p>
          <p class="mt-2">Grund <small>(Anbieterangabe)</small>: <i>{{ serviceElement.sovereignty.accessReason }}</i></p>
          <b-button class="mt-2" size="is-small">Mehr dazu</b-button>
        </b-message>
        <b-message v-if="serviceElement.sovereignty.usesExternalService" type="is-danger" has-icon>
          <p>Dieser Service nutzt einen externen Service. Durch die Nutzung könnte der Datenschutz, die Sicherheit der Daten und die Nachvollziehbarkeit beeinträchtigt werden.</p>
          <p class="mt-2">Name externer Service: <i>{{ serviceElement.sovereignty.externalService.name }}</i></p>
          <p>Grund <small>(Anbieterangabe)</small>: <i>{{ serviceElement.sovereignty.externalService.reason }}</i></p>
          <b-button class="mt-2" size="is-small">Mehr dazu</b-button>
        </b-message>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ServiceDetailView",
  props: {
    serviceElement: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../assets/scss/_variables.scss';
.info-title {
  font-size: 85%;
}

.no-padding {
  padding: 0px;
}

.add-padding {
  padding: 1.25rem;
}

.contact-panel {
  font-size: 15px;
  border-left: 3px double $grey;
  margin: auto!important;
}
</style>
