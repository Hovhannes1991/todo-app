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
    <span v-if="searchText">{{ $t('your_search_didnt_match_any_results') }}</span>
    <span v-else>{{ $t('there_is_no_items') }}</span>
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