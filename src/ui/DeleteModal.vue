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
    <p>{{ $t('are_you_sure_you_want_to_delete_item') }}</p>
    <div class="flex justify-content-end gap-2">
      <Button type="button" :label="$t('cancel')" severity="secondary" @click="cancel"></Button>
      <Button type="button" :label="$t('delete')" severity="danger" @click="confirm"></Button>
    </div>
  </Dialog>
</template>

<style scoped lang="scss">

</style>