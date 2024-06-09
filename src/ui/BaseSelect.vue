<script>
import Dropdown from 'primevue/dropdown';

export default {
  name: "BaseSelect",
  components: {Dropdown},

  props: {
    value: {
      required: true
    },
    options: {
      type: Array,
      required: true
    },
    optionValue: {
      type: String,
      default: null
    },
    optionLabel: {
      type: String,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    errorMessage: {
      type: String,
      default: null
    },
    placeholder: {
      type: String,
      default: ""
    }
  },

  emits: ["onChange"],

  data() {
    return {
      select_value: this.value
    }
  },

  methods: {
    onChange(e) {
      this.$emit("onChange", e.value);
    }
  }
}
</script>

<template>
  <div class="base-select">
    <Dropdown v-model="select_value"
              :options="options"
              @change="onChange"
              filter
              showClear
              :disabled="disabled"
              :option-value="optionValue"
              :optionLabel="optionLabel"
              :invalid="!!errorMessage"
              :placeholder="placeholder"/>
    <span class="error-message">{{ errorMessage }}</span>
  </div>
</template>

<style scoped lang="scss">
$error: #ef4444;

.base-select {
  display: flex;
  flex-direction: column;

  .error-message {
    color: $error;
    font-size: 1.4rem;
  }
}
</style>