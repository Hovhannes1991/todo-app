<script>
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

export default {
  name: "TodoListEmptyResults",
  components: {FontAwesomeIcon},

  props: {
    searchText: {
      type: String,
    }
  }
}
</script>

<template>
  <div class="empty-results">
    <span v-if="searchText">Your search didn't match any results</span>
    <span v-else>There is no items</span>
    <div>
      <FontAwesomeIcon icon="folder-open" size="3x"/>
    </div>
  </div>
</template>

<style scoped lang="scss">
.empty-results {
  display: flex;
  align-items: center;
  flex-direction: column;
  text-align: center;
  gap: 1rem;
  color: white;
  font-size: 2rem;
  padding: 3rem;
}
</style>