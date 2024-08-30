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
      orderByValue: "desc",
      filters: {
        status: []
      },

      loading: false,
      addTodoLoading: false,
      updatingTodo: false,

      deletingId: null
    }
  },

  computed: {
    ...mapGetters({user: "auth/user", todos: "todos/todos"}),

    hasFilterByStatus() {
      return !!this.filters?.status?.length;
    },

    todosToShow() {
      let todos = [...this.todos];

      //Search text
      const searchText = this.search.trim().toLowerCase();
      if (this.search) todos = this.searchInTodos(todos, searchText);

      //Filter By Status
      if (this.hasFilterByStatus) {
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
        this.addTodoLoading = true;
        const {data} = await addTodo(todo);
        toastSuccess(this.$t("todo_add_success"));
        this.addTodo({todo: data.newTodo});
      } catch (err) {
        toastError(this.$t('default_error_message'));
      }
      this.addTodoLoading = false;
    },

    async onConfirmDeleteTodo() {
      const id = this.deletingId;
      try {
        this.updateTodo({id, updatedProps: {disabled: true}});
        const {data} = await deleteTodo(id);
        this.deleteTodo({id});
        toastSuccess(data.message);
      } catch (err) {
        console.log(err)
      }
      this.deletingId = null;
    },

    onCancelDelete() {
      this.deletingId = null;
    },

    openDeleteModal(id) {
      this.deletingId = id;
      this.$refs.deleteModalRef.showModal();
    },

    onStartEditTodo(todo) {
      this.$refs.editModalRef.openModal(todo);
    },

    async onSaveEdit(todo) {
      try {
        this.updatingTodo = true;
        const {data} = await editTodo(todo);
        this.updateTodo({id: todo._id, updatedProps: todo});
        this.$refs.editModalRef.closeModal();
        toastSuccess(data.message);
      } catch (err) {
        console.log(err);
      }
      this.updatingTodo = false;
    },

    onCancelEdit() {
      this.$refs.editModalRef.closeModal();
      this.updatingTodo = false;
    },

    onSearchChange(value) {
      this.search = value;
    },

    onFilterChange(value) {
      this.filters = value;
    },

    onOrderByChange() {
      this.orderByValue = this.orderByValue === "asc" ? "desc" : "asc";
    },

    searchInTodos(todoList, searchText) {
      return todoList.filter(todo => todo.title.trim().toLowerCase().startsWith(searchText));
    },

    filterByStatus(todoList) {
      const status = this.filters.status[0];
      todoList = todoList.filter(item => {
        if (item.justUpdated) return true; //keep animation for just toggled items

        if (status === "completed") return item.completed;
        else if (status === "pending") return !item.completed;

        return true;
      })
      return todoList;
    },

    orderBy(todoList) {
      if (this.orderByValue === "asc") {
        return todoList.toSorted((a, b) => a.updatedAt.localeCompare(b.updatedAt));
      } else {
        return todoList.toSorted((a, b) => b.updatedAt.localeCompare(a.updatedAt));
      }
    }
  }
}
</script>

<template>
  <main class="todo-list-component">
    <div class="todo-list-container">
      <TodoListSearchAndFilter :order-by="orderByValue"
                               :filters="filters"
                               @search-change="onSearchChange"
                               @filter-change="onFilterChange"
                               @order-change="onOrderByChange"/>
      <TodoListNewItem @add-todo="onAddTodo" :loading="addTodoLoading"/>
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

      <TodoListItemEdit ref="editModalRef"
                        @cancel-editing="onCancelEdit"
                        @save-todo="onSaveEdit"
                        :updating="updatingTodo"/>
      <DeleteModal ref="deleteModalRef"
                   @onCancel="onCancelDelete"
                   @onConfirm="onConfirmDeleteTodo"
                   :message="$t('are_you_sure_you_want_to_delete_item')"/>
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