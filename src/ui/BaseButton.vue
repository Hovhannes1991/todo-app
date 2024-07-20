<script>
export default {
  name: "BaseButton",

  props: {
    type: {
      type: String,
      default: "button"
    },
    label: {
      type: String,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    variant: {
      validator(value) {
        const buttonVariants = ["app-button", "primary", "secondary", "success", "warning", "danger", "link"];
        return buttonVariants.includes(value);
      },
      default: "primary"
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    classNames() {
      return `base-button ${this.variant || ''} ${this.loading ? 'with-loader' : ''}`
    }
  }
}

</script>

<template>
  <button :class="classNames"
          :type="type"
          :disabled="disabled"
          :aria-label="label">
    <span v-show="loading" class="loader"></span>
    <span v-show="!loading">{{ label }}</span>
  </button>
</template>

<style scoped lang="scss">
$primary: #1ab188;
$secondary: #1c4857;
$success: #10b981;
$warning: #f97316;
$danger: #ef4444;
$text-color: #FFF;

.base-button {
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
  border: 2px solid $primary;
  border-radius: 0.8rem;
  min-width: 15rem;
  min-height: 4rem;
  padding: 0 3rem;
  background-color: $primary;
  color: $text-color;
  font-size: 2rem;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;

  &:hover {
    background-color: darken($primary, 10%);
    border-color: darken($primary, 10%);
  }

  &.app-button {
    background-color: var(--main-bg-color);
    border: 2px solid var(--main-bg-color);
    color: var(--main-fg-color);

    &:hover,
    &:focus-visible {
      background-color: var(--main-bg-color-darken);
      border-color: var(--main-bg-color-darken);
    }
  }

  &.primary {
    background-color: $primary;
    border: 2px solid $primary;

    &:hover,
    &:focus-visible {
      background-color: darken($primary, 10%);
      border-color: darken($primary, 10%);
    }
  }

  &.secondary {
    background-color: $secondary;
    border: 2px solid $secondary;

    &:hover,
    &:focus-visible {
      background-color: darken($secondary, 10%);
      border-color: darken($secondary, 10%);
    }
  }

  &.success {
    background-color: $success;
    border: 2px solid $success;

    &:hover,
    &:focus-visible {
      background-color: darken($success, 10%);
      border-color: darken($success, 10%);
    }
  }

  &.warning {
    background-color: $warning;
    border: 2px solid $warning;

    &:hover,
    &:focus-visible {
      background-color: darken($warning, 10%);
      border-color: darken($warning, 10%);
    }
  }

  &.danger {
    background-color: $danger;
    border: 2px solid $danger;

    &:hover,
    &:focus-visible {
      background-color: darken($danger, 10%);
      border-color: darken($danger, 10%);
    }
  }

  &.link {
    background: transparent;
    border: none;
    min-width: unset;
    min-height: unset;
    padding: 0;
  }

  &:disabled {
    cursor: default;
    opacity: 0.5;
  }

  &.with-loader {
    pointer-events: none;
  }


  .loader {
    width: 2.5rem;
    height: 2.5rem;
    border: 3px solid #FFF;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
  }

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>