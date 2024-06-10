<script>
import {mapGetters} from "vuex";
import TheHeader from "@/components/TheHeader.vue";
import TheFooter from "@/components/TheFooter.vue";
import FullPageLoader from "@/components/FullPageLoader.vue";

export default {
  components: {FullPageLoader, TheFooter, TheHeader},

  computed: {
    ...mapGetters({showFullPageLoader: "helpers/showFullPageLoader"})
  }
}
</script>

<template>
  <div v-if="showFullPageLoader" class="guest-layout">
    <FullPageLoader/>
  </div>
  <div v-show="!showFullPageLoader" class="guest-layout">
    <TheHeader :is-guest="true"/>
    <div class="guest-layout-child">
      <slot/>
    </div>
    <TheFooter/>
  </div>
</template>

<style scoped>
.guest-layout {
  position: relative;
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}
</style>