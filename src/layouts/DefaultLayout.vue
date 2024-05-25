<script>
import {mapGetters} from "vuex";
import {defineComponent} from "vue";
import TheHeader from "@/components/TheHeader.vue";
import TheFooter from "@/components/TheFooter.vue";
import FullPageLoader from "@/components/FullPageLoader.vue";

export default defineComponent({
  components: {FullPageLoader, TheFooter, TheHeader},

  computed: {
    ...mapGetters({showFullPageLoader: "helpers/showFullPageLoader"})
  }
})
</script>

<template>
  <div v-if="showFullPageLoader" class="default-layout">
    <FullPageLoader/>
  </div>
  <div v-show="!showFullPageLoader" class="default-layout">
    <TheHeader/>
    <div class="default-layout-child">
      <slot/>
    </div>
    <TheFooter/>
  </div>
</template>

<style scoped>
.default-layout {
  position: relative;
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}
</style>