<script>
import BaseInput from "@/ui/BaseInput.vue";

export default {
  name: "TodoListNewItem",
  components: {BaseInput},

  props: {
    loading: {
      type: Boolean,
      required: true
    }
  },

  emits: ["addTodo"],

  data() {
    return {
      newTodo: "",

      color: "#039BE5"
    }
  },

  methods: {
    addTodo() {
      if (this.loading || !this.newTodo?.trim()) return;
      this.$emit("addTodo", this.newTodo);
      this.newTodo = "";
    }
  }
}
</script>

<template>
  <div class="todo-list-new-item">
    <BaseInput v-model="newTodo"
               @on-icon-click="addTodo"
               @keydown.enter="addTodo"
               variant="underlined"
               :placeholder="$t('todo_title')"
               :icon="loading ? 'spinner' : 'plus'"
               :spin-icon="loading"
               :main_color="color"
               :icon_clickable="!loading"
               :icon-styles="{color: color}"/>
  </div>
</template>

<style scoped lang="scss">

</style>