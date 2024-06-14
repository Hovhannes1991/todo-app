<script>
import {mapGetters, mapMutations} from "vuex";
import {toastSuccess, toastError} from "@/services/toast.service.js";
import {getUserTodos, addTodo, editTodo, deleteTodo} from "@/api/todos.service.js";
import TodoListSearchAndFilter from "@/components/TodoList/TodoListSearchAndFilter.vue";
import TodoListItem from "@/components/TodoList/TodoListItem.vue";
import TodoListNewItem from "@/components/TodoList/TodoListNewItem.vue";
import SkeletonListLoader from "@/ui/SkeletonListLoader.vue";
import TodoListEmptyResults from "@/components/TodoList/TodoListEmptyResults.vue";
import BaseInput from "@/ui/BaseInput.vue";
import TodoListItemEdit from "@/components/TodoList/TodoListItemEdit.vue";
import DeleteModal from "@/ui/DeleteModal.vue";

export default {
  name: "TodoList",
  components: {
    TodoListItemEdit, DeleteModal,
    BaseInput, TodoListEmptyResults, SkeletonListLoader, TodoListSearchAndFilter, TodoListNewItem, TodoListItem
  },

  created() {
    this.fetchUserTodos();
  },

  data() {
    return {
      search: "",
      order_by: "asc",
      filters: {
        status: []
      },

      loading: false,
      add_todo_loading: false,
      updating_todo: false,

      deleting_id: null
    }
  },

  computed: {
    ...mapGetters({user: "auth/user", todos: "todos/todos"}),
    todosToShow() {
      let todos = [...this.todos];

      //Search text
      const search_text = this.search.trim().toLowerCase();
      if (this.search) todos = this.searchInTodos(todos, search_text);

      //Filter By Status
      if (this.filters?.status?.length) {
        todos = this.filterByStatus(todos);
      }

      //Order By
      todos = this.orderBy(todos);

      return todos;
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

    async onConfirmDeleteTodo() {
      const id = this.deleting_id;
      try {
        this.updateTodo({id, updated_props: {disabled: true}});
        const {data} = await deleteTodo(id);
        this.deleteTodo({id});
        toastSuccess(data.message);
      } catch (err) {
        console.log(err)
      }
      this.deleting_id = null;
    },

    onCancelDelete() {
      this.deleting_id = null;
    },

    openDeleteModal(id) {
      this.deleting_id = id;
      this.$refs.delete_modal.showModal();
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

    onFilterChange(value) {
      this.filters = value;
    },

    onOrderByChange() {
      this.order_by = this.order_by === "asc" ? "desc" : "asc";
    },

    searchInTodos(todo_list, search_text) {
      return todo_list.filter(todo => todo.title.trim().toLowerCase().startsWith(search_text));
    },

    filterByStatus(todo_list) {
      const status = this.filters.status[0];
      todo_list = todo_list.filter(item => {
        if (status === "completed") return item.completed;
        else if (status === "pending") return !item.completed;
        return true;
      })
      return todo_list;
    },

    orderBy(todo_list) {
      if (this.order_by === "asc") {
        return todo_list.toSorted((a, b) => a.updatedAt.localeCompare(b.updatedAt));
      } else {
        return todo_list.toSorted((a, b) => b.updatedAt.localeCompare(a.updatedAt));
      }
    }
  }
}
</script>

<template>
  <main class="todo-list-component">
    <div class="todo-list-container">
      <TodoListSearchAndFilter :order-by="order_by"
                               :filters="filters"
                               @search-change="onSearchChange"
                               @filter-change="onFilterChange"
                               @order-change="onOrderByChange"/>
      <TodoListNewItem @add-todo="onAddTodo" :loading="add_todo_loading"/>
      <div class="todo-list">
        <SkeletonListLoader v-if="loading" :items-count="10" :item-styles="{height: '3rem', marginBlock: '1.5rem' }"/>
        <template v-if="!loading">
          <TodoListEmptyResults v-if="!todosToShow.length" :search-text="search"/>

          <TodoListItem v-for="todo in todosToShow"
                        :todo="todo"
                        @delete-todo="openDeleteModal"
                        @edit-todo="onStartEditTodo"
                        :key="todo._id"/>
        </template>
      </div>

      <TodoListItemEdit ref="edit_todo_modal"
                        @cancel-editing="onCancelEdit"
                        @save-todo="onSaveEdit"
                        :updating="updating_todo"/>
      <DeleteModal ref="delete_modal"
                   @onCancel="onCancelDelete"
                   @onConfirm="onConfirmDeleteTodo"
                   message="Are You sure you want to delete item?"/>
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
      scrollbar-color: var(--main-bg-color) var(--main-fg-color);
      padding: 0.8rem 2rem;

      @media only screen and (max-width: 300px) {
        padding: 0 0.5rem;
      }
    }
  }
}
</style>