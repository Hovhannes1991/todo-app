<script>
import {mapGetters, mapMutations} from "vuex";
import {toastSuccess, toastError} from "@/services/toast.service.js";
import {getUserTodos, addTodo, editTodo, deleteTodo} from "@/services/http/todos.service.js";
import TodoListSearchAndFilter from "@/components/TodoList/TodoListSearchAndFilter.vue";
import TodoListItem from "@/components/TodoList/TodoListItem.vue";
import TodoListNewItem from "@/components/TodoList/TodoListNewItem.vue";
import SkeletonListLoader from "@/ui/SkeletonListLoader.vue";
import TodoListEmptyResults from "@/components/TodoList/TodoListEmptyResults.vue";
import BaseInput from "@/ui/BaseInput.vue";
import TodoListItemEdit from "@/components/TodoList/TodoListItemEdit.vue";

export default {
  name: "TodoList",
  components: {
    TodoListItemEdit,
    BaseInput, TodoListEmptyResults, SkeletonListLoader, TodoListSearchAndFilter, TodoListNewItem, TodoListItem
  },

  data() {
    return {
      search: "",
      filters: {
        status: ""
      },

      loading: false,
      add_todo_loading: false,
      updating_todo: false,
    }
  },

  created() {
    this.fetchUserTodos();
  },

  computed: {
    ...mapGetters({user: "auth/user", todos: "todos/todos"}),
    todosToShow() {
      const search_text = this.search.trim().toLowerCase();
      //todo handle filters
      if (!this.search) return this.todos;

      return this.todos.filter(todo => todo.title.trim().toLowerCase().startsWith(search_text));
    }
  },

  methods: {
    ...mapMutations({
      setTodos: "todos/SET_TODOS",
      addTodo: "todos/ADD_TODO",
      updateTodo: "todos/UPDATE_TODO",
      deleteTodo: "todos/DELETE_TODO"
    }),
    async fetchUserTodos() {
      this.loading = true;
      try {
        const {data} = await getUserTodos(this.user._id);
        this.setTodos(data);
      } catch (err) {
        console.log(err);
      }
      this.loading = false;
    },

    async onAddTodo(todo) {
      try {
        this.add_todo_loading = true;
        const {data} = await addTodo(todo);
        toastSuccess("Todo added successfully");
        this.addTodo({todo: data.new_todo});
      } catch (err) {
        toastError("Something went wrong");
      }
      this.add_todo_loading = false;
    },

    async onDeleteTodo(id) {
      try {
        this.updateTodo({id, updated_props: {disabled: true}});
        const {data} = await deleteTodo(id);
        this.deleteTodo({id});
        toastSuccess(data.message);
      } catch (err) {
        console.log(err)
      }
    },

    onStartEditTodo(todo) {
      this.$refs.edit_todo_modal.openModal(todo);
    },

    async onSaveEdit(todo) {
      try {
        this.updating_todo = true;
        const {data} = await editTodo(todo);
        this.updateTodo({id: todo._id, updated_props: todo});
        this.$refs.edit_todo_modal.closeModal();
        toastSuccess(data.message);
      } catch (err) {
        console.log(err);
      }
      this.updating_todo = false;
    },

    onCancelEdit() {
      this.$refs.edit_todo_modal.closeModal();
      this.updating_todo = false;
    },

    onSearchChange(value) {
      this.search = value;
    },
  }
}
</script>

<template>
  <main class="todo-list-component">
    <div class="todo-list-container">
      <TodoListSearchAndFilter @search-change="onSearchChange"/>
      <TodoListNewItem @add-todo="onAddTodo" :loading="add_todo_loading"/>
      <div class="todo-list">
        <SkeletonListLoader v-if="loading" :items-count="10" :item-styles="{height: '3rem', marginBlock: '1.5rem' }"/>
        <template v-if="!loading">
          <TodoListEmptyResults v-if="!todosToShow.length" :search-text="search"/>

          <TodoListItem v-for="todo in todosToShow"
                        :todo="todo"
                        @delete-todo="onDeleteTodo"
                        @edit-todo="onStartEditTodo"
                        :key="todo._id"/>
        </template>
      </div>

      <TodoListItemEdit ref="edit_todo_modal"
                        @cancel-editing="onCancelEdit"
                        @save-todo="onSaveEdit"
                        :updating="updating_todo"/>
    </div>
  </main>
</template>

<style scoped lang="scss">
.todo-list-component {
  padding: 5rem 0;
  display: flex;
  align-items: center;
  justify-content: center;

  .todo-list-container {
    width: 45rem;
    max-width: 90vw;
    max-height: 70rem;
    padding: 0;
    margin: 0 auto;
    background-color: #151515;
    border-radius: 2rem 2rem 1rem 1rem;
    overflow: hidden;

    .todo-list {
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
      width: 100%;
      height: 50rem;
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: #0AB6AB #28313b;
      padding: 0.8rem 2rem;

      @media only screen and (max-width: 300px) {
        padding: 0 0.5rem;
      }
    }
  }
}
</style>