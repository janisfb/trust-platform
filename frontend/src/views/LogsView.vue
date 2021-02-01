<template>
  <div class="home mt-5">
    <section>
      <div class="columns">
        <div class="column">
          <div class="box fill-height">
            <logs-list-component></logs-list-component>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import LogsListComponent from '../components/LogsListComponent.vue';

export default {
  name: "LogsView",
  components: {LogsListComponent},
};
</script>

<style lang="scss" scoped>
.fill-height {
  height: 72vh;
}
</style>
