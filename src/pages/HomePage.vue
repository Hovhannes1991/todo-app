<script>
import TodoList from "@/components/TodoList/TodoList.vue";

export default {
  name: "HomePage",
  components: {TodoList}
}

</script>

<template>
  <div class="home-page">
    <TodoList/>
  </div>
</template>

<style scoped lang="scss">
.home-page {
  min-height: 70vh;
}
</style>