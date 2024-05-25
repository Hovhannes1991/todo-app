<script>
import {mapMutations} from "vuex";
import TodoListItemAnimatedCheckbox from "@/components/TodoList/TodoListItemAnimatedCheckbox.vue";
import {toggleTodo} from "@/services/todos.service.js";

export default {
  name: "TodoListItem",
  components: {TodoListItemAnimatedCheckbox},

  props: {
    todo: Object
  },

  methods: {
    ...mapMutations({toggleCompletedStatus: "todos/TOGGLE_COMPLETED_STATUS"}),
    async toggleCompleted(id) {
      try {
        //optimistic update VUEX
        this.toggleCompletedStatus({id});
        await toggleTodo(id);
      } catch (err) {
        //revert optimistic update
        this.toggleCompletedStatus({id});
        console.log(err)
      }
    }
  }
}
</script>

<template>
  <div class="todo-list-item" tabindex="0">
    <input
        @change="toggleCompleted(todo._id)"
        type="checkbox"
        class="todo-item__checkbox"
        :class="{ 'todo-item__checkbox-checked': todo.completed }"
        tabindex="-1"/>
    <TodoListItemAnimatedCheckbox/>
    <div class="todo-title">{{ todo.title }}</div>
  </div>

</template>

<style scoped lang="scss">
.todo-list-item {
  position: relative;
  display: flex;
  align-items: center;
  border: 2px solid transparent;
  border-radius: 0.8rem;
  padding: 1.5rem 3rem 1.5rem 1.0rem;
  font-size: 2rem;
  color: white;

  .todo-item__checkbox {
    width: 3rem;
    height: 3rem;
    cursor: pointer;
    opacity: 0;
  }

  .todo-title {
    margin-left: 1.5rem;
  }
}
</style>