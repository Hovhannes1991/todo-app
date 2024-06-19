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
      new_todo: "",

      color: "#039BE5"
    }
  },

  methods: {
    addTodo() {
      if (this.loading || !this.new_todo?.trim()) return;
      this.$emit("addTodo", this.new_todo);
      this.new_todo = "";
    }
  }
}
</script>

<template>
  <div class="todo-list-new-item">
    <BaseInput v-model="new_todo"
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