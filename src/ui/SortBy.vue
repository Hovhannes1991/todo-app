<script>
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

export default {
  name: "SortBy",
  components: {FontAwesomeIcon},

  emits: ["onOrderChange"],

  props: {
    sortByKey: {
      type: String
    },

    orderBy: {
      validator(value) {
        return ["asc", "desc"].includes(value);
      },
      default: "asc"
    }
  },

  computed: {
    iconClass() {
      return `sort-by__icon ${this.orderBy}`;
    }
  }
}
</script>

<template>
<div class="sort-by" @click="$emit('onOrderChange')">
  <span>Sorted by {{ sortByKey }}</span>
  <span :class="iconClass">
    <font-awesome-icon icon="arrow-up-short-wide"/>
  </span>
</div>
</template>

<style scoped lang="scss">
.sort-by {
  color: black;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.5rem;
  cursor: pointer;

  .sort-by__icon {
    transition: transform 0.3s ease-in-out;

    &.desc {
      transform: rotateX(180deg);
    }
  }
}
</style>