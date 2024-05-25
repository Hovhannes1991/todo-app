<script>
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome';
export default {
  name: "TheFooter",
  components: {FontAwesomeIcon},
}
</script>

<template>
<footer class="the-footer">
  <ul>
    <li>
      <FontAwesomeIcon :icon="['fab', 'instagram']"/>
    </li>
  </ul>
</footer>
</template>

<style scoped lang="scss">
.the-footer {
  background-color: white;
  min-height: 8rem;
}
</style>