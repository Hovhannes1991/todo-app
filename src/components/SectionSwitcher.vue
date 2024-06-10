<script>
import BaseButton from "@/ui/BaseButton.vue";

export default {
  name: "SectionSwitcher",
  components: {BaseButton},

  props: {
    sections: Array,
    selected_section: String,
  },

  emits: ["selectSection"],

  methods: {
    selectSection(section) {
      this.$emit("selectSection", section);
    }
  }
}
</script>

<template>
  <div class="section-switcher">
    <BaseButton v-for="section in sections"
                :variant="selected_section === section ? 'app-button' : 'secondary'"
                @click="selectSection(section)"
                :label="section"
                :key="section"/>
  </div>
</template>

<style scoped lang="scss">
.section-switcher {
  display: flex;
  width: 100%;
  border-radius: 0.8rem;
  overflow: hidden;

  @media screen and (max-width: 756px) {
    flex-direction: column;
  }

  button {
    width: 100%;
    border-radius: 0;
    text-transform: capitalize;
  }
}
</style>