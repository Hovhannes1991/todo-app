<script>
import BaseInput from "@/ui/BaseInput.vue";
import BaseButton from "@/ui/BaseButton.vue";

export default {
  name: "TodoListItemEdit",
  components: {BaseButton, BaseInput},

  emits: ["saveTodo", "cancelEditing"],

  props: {
    updating: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      show: false,
      original_title: "",
      errors: {},

      todo: {}
    }
  },

  computed: {
    hasChanges() {
      return this.original_title !== this.todo.title;
    }
  },

  methods: {
    async openModal(todo) {
      this.todo = {...todo};
      this.original_title = todo.title;
      this.show = true;
      await this.$nextTick();
      this.$refs.title_ref.$refs.input_ref.focus();
    },

    closeModal() {
      this.show = false;
    },

    saveTodo() {
      if(!this.hasChanges) return;

      if (!this.todo.title?.trim()) {
        this.errors.title = "Field is required";
        return;
      }
      this.$emit("saveTodo", this.todo);
    },

    cancel() {
      this.$emit("cancelEditing");
    }
  },
}
</script>

<template>
  <div v-if="show" class="edit-modal" @keydown.esc="cancel">
    <p class="modal-info">Editing: <span><b>{{ original_title }}</b></span></p>
    <BaseInput
        ref="title_ref"
        v-model="todo.title"
        @keydown.enter="saveTodo"
        :disabled="updating"
        :error="errors.title"/>
    <div class="dialog-buttons">
      <BaseButton label="Save" @click="saveTodo" :loading="updating" :disabled="!hasChanges"/>
      <BaseButton label="Cancel" @click="cancel" :disabled="updating" variant="secondary"/>
    </div>
  </div>
</template>

<style scoped lang="scss">
.edit-modal {
  position: fixed;
  top: 5rem;
  left: 50%;
  transform: translateX(-50%);
  width: 300px;
  max-width: 80vw;
  min-height: 200px;

  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: white;
  padding: 2rem 2rem 3rem 2rem;
  box-shadow: 0 0 10px 2px #5caf8a;
  border-radius: 0.5rem;

  .modal-info {
    font-size: 2rem;
  }

  .dialog-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;

    button {
      width: 120px;
      min-width: unset;
    }
  }
}
</style>