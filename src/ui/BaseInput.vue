<script>
//Font Awesome
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';

export default {
  name: "BaseInput",
  components: {FontAwesomeIcon},

  props: {
    modelValue: {
      type: String,
      required: true,
    },
    type: {
      validator(value) {
        const buttonVariants = ["text", "email", "password", "number", "date", "color"];
        return buttonVariants.includes(value);
      },
      default: "text"
    },
    name: {
      type: String,
    },
    label: {
      type: String,
    },
    main_color: {
      type: String,
      default: "white"
    },
    variant: {
      validator(value) {
        const buttonVariants = ["underlined"];
        return buttonVariants.includes(value);
      },
      required: false
    },
    icon: {
      type: String,
      required: false
    },
    icon_clickable: {
      type: Boolean,
      default: false
    },
    spinIcon: {
      type: Boolean,
      default: false
    },
    iconStyles: {
      type: Object,
      default: () => ({})
    },
    error: {
      type: String,
    },
    placeholder: {
      type: String,
    },
    tabIndex: {
      type: String,
      default: "0"
    },
    disabled: {
      type: Boolean,
      default: false
    },
    autocomplete: {
      type: String,
      default: ""
    }
  },

  emits: ["update:modelValue", "onIconClick"],

  computed: {
    classNames() {
      let className = "base-input";
      if (this.error) className += " has-error";
      if (this.icon) className += " with-icon";
      return className;
    },

    underlinedStyles() {
      return {
        backgroundColor: "transparent",
        border: "none",
        borderBottom: `2px solid ${this.main_color}`,
        borderRadius: 0,
        color: this.main_color
      }
    },

    inputStyles() {
      const map = {
        underlined: this.underlinedStyles
      }
      return map[this.variant] || {};
    }
  },

  methods: {
    onInput(value) {
      this.$emit('update:modelValue', value);
    },

    onIconClick() {
      this.$emit("onIconClick");
    }
  }
}

</script>

<template>
  <label class="base-input-label">
    <span v-if="label">{{ label }}</span>
    <span class="input-container">
      <input
          @input="onInput($event.target.value)"
          ref="inputRef"
          :class="classNames"
          :value="modelValue"
          :type="type"
          :aria-label="label"
          :placeholder="placeholder"
          :disabled="disabled"
          :tabindex="tabIndex"
          :name="name"
          :autocomplete="this.autocomplete || this.name"
          :style="inputStyles"/>
      <FontAwesomeIcon v-if="icon"
                       @click="onIconClick"
                       :icon="icon"
                       :style="iconStyles"
                       :spin="spinIcon"
                       :class="{'hk__cursor-pointer': icon_clickable}"/>
    </span>
    <span v-if="error" class="error-message">{{ error }}</span>
  </label>
</template>

<style scoped lang="scss">
$selected: #10b981;

.base-input-label {
  display: flex;
  flex-direction: column;
  color: #FFF;
  font-size: 2rem;

  .input-container {
    position: relative;
    display: flex;
    align-items: center;

    svg {
      position: absolute;
      right: 0.8rem;
      color: black;
    }
  }

  .error-message {
    color: var(--error-message);
    font-size: 1.4rem;
  }
}

.base-input {
  outline: none;
  border: 2px solid #000;
  border-radius: 0.8rem;
  width: 100%;
  min-height: 4rem;
  padding: 0 1.5rem;
  background-color: white;
  color: #000;
  font-size: 2rem;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;

  &.with-icon {
    padding-right: 3rem;
  }

  &:hover, &:focus {
    color: #000;
    border-color: #000;
  }

  &.has-error {
    color: var(--error-message);
    border-color: var(--error-message);
  }

  &:disabled {
    cursor: default;
    opacity: 0.5;
    color: black;

    &:hover, &:focus {
      border-color: black;
      color: black;
    }
  }
}
</style>