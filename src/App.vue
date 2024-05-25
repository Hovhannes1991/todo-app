<script>
import {shallowRef} from 'vue';
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import EmptyLayout from "@/layouts/EmptyLayout.vue";

export default {
  name: "App",

  data() {
    return {
      layouts: {
        default: shallowRef(DefaultLayout),
        empty: shallowRef(EmptyLayout),
      },
    }
  },

  computed: {
    selectedLayout() {
      const layout = this.$route.meta.layout;
      return this.layouts[layout] || this.layouts.default;
    }
  }
}
</script>

<template>
  <div>
    <Component :is="selectedLayout">
      <RouterView/>
    </Component>
  </div>
</template>

<style scoped>
</style>
