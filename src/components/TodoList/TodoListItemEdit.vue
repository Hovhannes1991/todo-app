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
    },

    errorMessages() {
      const error_messages = {}
      for (let key in this.errors) {
        error_messages[key] = this.errors[key] ? this.$t(this.errors[key]) : null;
      }
      return error_messages;
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

    removeErrors(name) {
      this.errors[name] = null;
    },

    saveTodo() {
      if (!this.hasChanges) return;

      if (!this.todo.title?.trim()) {
        this.errors.title = "field_is_required";
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
    <p class="modal-info">{{ $t('title') }}: <span><b>{{ original_title }}</b></span></p>
    <BaseInput
        ref="title_ref"
        v-model="todo.title"
        @input="removeErrors('title')"
        @keydown.enter="saveTodo"
        :disabled="updating"
        :error="errorMessages.title"/>
    <div class="dialog-buttons">
      <BaseButton :label="$t('save')" @click="saveTodo" :loading="updating" variant="app-button" :disabled="!hasChanges"/>
      <BaseButton :label="$t('cancel')" @click="cancel" :disabled="updating" variant="secondary"/>
    </div>
  </div>
</template>

<style scoped lang="scss">
.edit-modal {
  position: fixed;
  top: 7rem;
  left: 50%;
  transform: translateX(-50%);
  width: 400px;
  max-width: 80vw;
  min-height: 200px;

  display: flex;
  flex-direction: column;
  gap: 2rem;
  background-color: white;
  padding: 3rem 3rem 5rem 3rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
  border-radius: 1rem;

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

  @media screen and (max-width: 450px){
    width: 300px;
    padding: 2rem 2rem 3rem 2rem;
  }
}
</style>