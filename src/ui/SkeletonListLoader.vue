<script>
export default {
  name: "SkeletonListLoader",
  props: {
    itemsCount: {
      type: Number,
      default: 5
    },

    itemStyles: {
      type: Object,
    },
  }
}
</script>

<template>
  <div class="skeleton-list-loader">
    <div v-for="_ in itemsCount"
         class="skeleton-item"
         :style="itemStyles">
    </div>
  </div>
</template>

<style scoped lang="scss">
.skeleton-list-loader {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  .skeleton-item {
    height: 5rem;
    background-image: linear-gradient(90deg, #000000 25%, #151515 50%, #000000 75%);
    background-size: 200% 100%;
    animation: skeleton_loading 1.5s infinite linear;
  }
}


@keyframes skeleton_loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>