<script>
import BaseInput from "@/ui/BaseInput.vue";

export default {
  name: "TodoListSearchAndFilter",
  components: {BaseInput},

  emits: ["searchChange"],

  data() {
    return {
      search: "",

      search_icon_styles: {
        color: 'white'
      }
    }
  },

  watch: {
    search(value) {
      this.$emit("searchChange", value);
    }
  }
}
</script>

<template>
  <div class="todo-list-search">
    <BaseInput icon="search"
               v-model="search"
               placeholder="Search"
               variant="underlined"
               :icon-styles="search_icon_styles"/>
  </div>
</template>

<style lang="scss">
.todo-list-search {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 9rem;
  overflow: hidden;
  background-color: #009888;

  @media only screen and (max-width: 370px) {
    height: 7rem;
    padding: 1rem;
  }
}
</style>