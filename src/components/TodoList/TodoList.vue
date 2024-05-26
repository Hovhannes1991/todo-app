<script>
import {mapGetters, mapMutations} from "vuex";
import {toast} from "vue3-toastify";
import {getUserTodos, addTodo, deleteTodo} from "@/services/todos.service.js";
import TodoListSearchAndFilter from "@/components/TodoList/TodoListSearchAndFilter.vue";
import TodoListItem from "@/components/TodoList/TodoListItem.vue";
import TodoListNewItem from "@/components/TodoList/TodoListNewItem.vue";
import SkeletonListLoader from "@/ui/SkeletonListLoader.vue";
import TodoListEmptyResults from "@/components/TodoList/TodoListEmptyResults.vue";
import BaseInput from "@/ui/BaseInput.vue";

export default {
  name: "TodoList",
  components: {
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
        const {data} = await getUserTodos(this.user.id);
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
        toast.success("Todo added successfully");
        this.addTodo({todo: data.new_todo});
      } catch (err) {
        toast.error("Something went wrong");
      }
      this.add_todo_loading = false;
    },

    async onDeleteTodo(id) {
      try {
        this.updateTodo({id, updated_props: {disabled: true}});
        const {data} = await deleteTodo(id);
        this.deleteTodo({id});
        toast.success(data.message);
      } catch (err) {
        console.log(err)
      }
    },

    async onEditTodo(id) {
      //todo
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
                        @edit-todo="onEditTodo"
                        :key="todo._id"/>
        </template>
      </div>
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