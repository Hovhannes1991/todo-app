<script>
export default {
  name: "CheckboxSvgIcon",

  props: {
    checked: {
      type: Boolean,
      default: false
    },

    stopColor1: {
      type: String,
      default: "#0a495d"
    },

    stopColor2: {
      type: String,
      default: "#0fc0f5"
    }
  },

  computed: {
    svgClassName() {
      return this.checked ? "svg-checkbox checked" : "svg-checkbox unchecked";
    }
  }
}
</script>

<template>
  <svg
      :class="svgClassName"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop
            offset="0%"
            :style="{stopColor: stopColor1, stopOpacity: 1}"
        />
        <stop
            offset="100%"
            :style="{stopColor: stopColor2, stopOpacity: 1}"
        />
      </linearGradient>
    </defs>
    <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="2"
        ry="2"
        stroke="url(#gradient)"
        stroke-width="2"
        fill="none"
    />
    <path
        class="checkmark"
        d="M6 12L10 16L18 8"
        stroke="url(#gradient)"
        stroke-width="2"
        stroke-dasharray="20"
        stroke-dashoffset="20"
    />
  </svg>
</template>

<style scoped lang="scss">
.svg-checkbox {
  display: block;

  .checkmark {
    transition: stroke-dashoffset 0.5s;
  }

  &.checked {
    .checkmark {
      stroke-dashoffset: 0;
    }
  }

  &.unchecked {
    .checkmark {
      stroke-dashoffset: 20;
    }
  }
}
</style>