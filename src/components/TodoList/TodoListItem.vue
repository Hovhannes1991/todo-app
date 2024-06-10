<script>
import {mapMutations} from "vuex";
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";
import {toggleTodo} from "@/api/todos.service.js";

export default {
  name: "TodoListItem",
  components: {FontAwesomeIcon},

  props: {
    todo: Object
  },

  emits: ["editTodo", "deleteTodo"],

  methods: {
    ...mapMutations({updateTodo: "todos/UPDATE_TODO",}),
    async toggleCompleted(id, completed) {
      try {
        //optimistic update VUEX
        this.updateTodo({id, updated_props: {completed}});
        await toggleTodo(id);
      } catch (err) {
        //revert optimistic update
        this.updateTodo({id, updated_props: {completed}});
        console.log(err)
      }
    },

    deleteTodo(id) {
      this.$emit("deleteTodo", id);
    },

    editTodo(todo) {
      this.$emit("editTodo", todo);
    }
  }
}
</script>

<template>
  <div :class="{'todo-list-item': true, 'todo-list-item__disabled': todo.disabled}" tabindex="0">

    <label :for="todo._id">
      <span class="checkbox-icon">
        <img v-show="todo.completed" src="@/assets/icons/checked.svg" alt="">
        <img v-show="!todo.completed" src="@/assets/icons/unchecked.svg" alt="">
      </span>
      <input
          :id="todo._id"
          @change="toggleCompleted(todo._id, !todo.completed)"
          type="checkbox"
          class="todo-item__checkbox"
          :class="{ 'todo-item__checkbox-checked': todo.completed }"
          tabindex="-1"/>

      <div class="todo-title text-ellipsis">{{ todo.title }}</div>
    </label>

    <div class="todo-list-item__buttons">
      <span class="edit-todo-icon">
        <FontAwesomeIcon @click="editTodo(todo)" icon="pen-to-square"/>
      </span>
      <span class="delete-todo-icon">
        <FontAwesomeIcon @click="deleteTodo(todo._id)" icon="trash-can"/>
      </span>
    </div>
  </div>

</template>

<style scoped lang="scss">
.todo-list-item {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 0.8rem;
  align-items: center;
  border: 2px solid transparent;
  border-radius: 0.8rem;
  padding: 1.5rem 0;
  font-size: 2rem;
  color: white;

  .todo-list-item__buttons {
    display: flex;
    gap: 0.5rem;
    margin: 0 0 0 auto;

    .edit-todo-icon {
      color: #f97316;
      cursor: pointer;
    }

    .delete-todo-icon {
      color: #ef4444;
      cursor: pointer;
    }
  }

  label {
    overflow: hidden;
    display: flex;
    align-items: center;
    cursor: pointer;

    .checkbox-icon {
      width: 3rem;
      height: 3rem;

      img {
        width: 3rem;
        height: 3rem;
      }
    }
  }

  .todo-item__checkbox {
    display: none;
  }

  .todo-title {
    position: relative;
    margin-left: 2rem;
    width: 100%;

    &::before {
      content: "";
      display: block;
      width: 0;
      height: 4px;
      background-image: linear-gradient(45deg, #104758, #0fc0f5);
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      transition: width 0.4s ease-in-out;
    }
  }

  .todo-item__checkbox-checked + .todo-title {
    &::before {
      width: 100%;
    }
  }

  @media only screen and (max-width: 300px) {
    input[type='checkbox'] {
      position: absolute;
      left: 0;
    }
    .todo-title {
      margin-left: 1rem;
      font-size: 1.4rem;
    }
  }

  &.todo-list-item__disabled {
    pointer-events: none;
    opacity: 0.5;
    filter: blur(2px);
  }
}
</style>