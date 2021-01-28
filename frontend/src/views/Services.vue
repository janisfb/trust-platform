<template>
  <div class="home mt-5">
    <section>
      <div class="columns">
        <div class="column">
          <div class="box fill-height">
            <ServiceExplorer></ServiceExplorer>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import ServiceExplorer from "@/components/ServiceExplorer"

export default {
  name: "Services",
  components: {
    ServiceExplorer,
  },
}
</script>

<style lang="scss" scoped>
.fill-height {
  height: 72vh;
}
</style>