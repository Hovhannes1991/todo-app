<script>
import {toast} from 'vue3-toastify';
import TodoList from "@/components/TodoList/TodoList.vue";

export default {
  name: "HomePage",
  components: {TodoList},

  mounted() {
    this.showWelcomeMessage();
  },

  methods: {
    showWelcomeMessage() {
      const user = this.$store.state.auth.user;
      if (user?.new_registered) {
        toast.success("Congratulation, registration completed successfully!!!");
      } else if (user?.new_legged_in) {
        toast.success("Welcome, " + user.firstname.toUpperCase());
      }
    }
  }
}

</script>

<template>
  <div class="home-page">
    <TodoList />
  </div>
</template>

<style scoped lang="scss">
.home-page {
  min-height: 70vh;
}
</style>