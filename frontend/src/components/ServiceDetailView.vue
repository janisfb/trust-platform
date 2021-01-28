<template>
  <div class="box no-padding" style="text-align:left;">
    <section class="hero is-light">
      <div class="hero-body">
        <div class="title" style="display:flex;">
          <h1>{{serviceElement.name}}</h1>
          <b-tag type="is-info ml-5" style="align-self:center;">{{serviceElement.version}}</b-tag>
        </div>
        <div class="subtitle">
          <h1>Von {{serviceElement.creator}}</h1>
        </div>
      </div>
    </section>
    <section class="add-padding">
      {{serviceElement.description}}
    </section>
  </div>
</template>

<script>
export default {
  name: 'ServiceDetailView',
  props: {
    serviceElement: Object,
  }
}
</script>

<style>
.no-padding {
  padding: 0px;
}

.add-padding {
  padding: 1.25rem;
}
</style>