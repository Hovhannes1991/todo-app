<script>
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import InputText from "primevue/inputtext";

export default {
  name: "DeleteModal",
  components: {Dialog, Button, InputText},

  emits: ["onCancel", "onConfirm"],

  data() {
    return {
      visible: false
    }
  },

  methods: {
    showModal() {
      this.visible = true;
    },

    hideModal() {
      this.visible = false;
    },

    cancel() {
      this.$emit("onCancel");
      this.hideModal();
    },

    confirm() {
      this.$emit("onConfirm");
      this.hideModal();
    }
  }
}
</script>

<template>
  <Dialog v-model:visible="visible" :style="{ width: '30rem' }">
    <p>Are You Sure you want to delete todo item?</p>
    <div class="flex justify-content-end gap-2">
      <Button type="button" label="Cancel" severity="secondary" @click="cancel"></Button>
      <Button type="button" label="Delete" severity="danger" @click="confirm"></Button>
    </div>
  </Dialog>
</template>

<style scoped lang="scss">

</style>