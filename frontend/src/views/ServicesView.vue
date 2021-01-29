<template>
  <div class="home mt-5">
    <section>
      <div class="columns">
        <div class="column">
          <div class="box fill-height">
            <service-list-component></service-list-component>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import ServiceListComponent from "../components/ServiceListComponent.vue";

export default {
  name: "ServicesView",
  components: {
    ServiceListComponent,
  },
};
</script>

<style lang="scss" scoped>
.fill-height {
  height: 72vh;
}
</style>
