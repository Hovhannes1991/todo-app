<script>
import BaseInput from "@/ui/BaseInput.vue";
import TodoListSort from "@/ui/SortBy.vue";
import FilterBy from "@/ui/FilterBy.vue";

export default {
  name: "TodoListSearchAndFilter",
  components: {FilterBy, TodoListSort, BaseInput},

  emits: ["searchChange", "orderChange", "filterChange"],

  props: ["orderBy", "filters"],

  data() {
    return {
      search: "",

      searchIconStyles: {
        color: 'var(--app-black)'
      }
    }
  },

  methods: {
    changeOrder() {
      this.$emit("orderChange");
    },

    onFilterChange(filters) {
      this.$emit("filterChange", filters);
    }
  },

  computed: {
    filterOptions() {
      return [
        {
          label: this.$t("status"),
          code: "status",
          items: [
            {label: this.$t("completed"), value: "status-completed"},
            {label: this.$t("pending"), value: "status-pending"}
          ]
        }
      ];
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
               :placeholder="$t('search')"
               variant="underlined"
               main_color="black"
               :icon-styles="searchIconStyles"/>

    <div class="sort-and-filters">
      <TodoListSort :order-by="orderBy"
                    :sort-by-key="$t('sort_by__date')"
                    @on-order-change="changeOrder"/>
      <FilterBy :options="this.filterOptions"
                :filters="filters"
                @on-change="onFilterChange"/>
    </div>
  </div>
</template>

<style lang="scss">
.todo-list-search {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 0;
  gap: 1rem;
  height: 9rem;
  background-color: var(--main-bg-color);

  @media only screen and (max-width: 370px) {
    padding: 1rem;
  }

  .sort-and-filters {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0 0.9rem 0 1.4rem;
  }
}
</style>