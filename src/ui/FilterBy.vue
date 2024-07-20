<script>
import MultiSelect from 'primevue/multiselect';
import {FontAwesomeIcon} from "@fortawesome/vue-fontawesome";

export default {
  name: "FilterBy",
  components: {MultiSelect, FontAwesomeIcon},

  emits: ["onChange"],

  props: {
    options: {
      type: [Object],
      default: () => ([])
    },

    filters: {
      type: Object,
      required: true
    }
  },

  created() {
    let initial_filters = [];
    for (let key in this.filters) {
      const arr = this.filters[key];
      arr.forEach(item => {
        initial_filters.push(`${key}-${item}`);
      })
    }
    this.value = initial_filters;
  },

  data() {
    return {
      open: false,
      value: []
    }
  },

  methods: {
    toggle() {
      this.open = !this.open;
    },

    hideFilter() {
      this.open = false;
    },

    onChange() {
      //set filters like { status: [] }
      const filters = {}
      this.value.forEach(filter => {
        const [key, value] = filter.split("-");
        if (!filters[key]) filters[key] = [];
        filters[key].push(value);
      })

      for (let key in filters) {
        const options = this.options.find(option => option.code === key);
        if (filters[key].length === options.items.length) {
          filters[key] = [];
        }
      }
      this.$emit("onChange", filters);
    }
  }
}
</script>

<template>
  <div class="filter-by">
    <FontAwesomeIcon @click="toggle" icon="filter"/>

    <div v-show="open" class="filter-menu w-20rem">
      <MultiSelect v-model="value"
                   @hide="hideFilter"
                   :options="options"
                   @change="onChange"
                   optionValue="value"
                   optionGroupChildren="items"
                   optionGroupLabel="label"
                   optionLabel="label"
                   :placeholder="$t('filters')"
                   :maxSelectedLabels="3"
                   class="w-full md:w-20rem">
        <template #optiongroup="slotProps">
          <div class="flex align-items-center">
            <div>{{ slotProps.option.label }}</div>
          </div>
        </template>
      </MultiSelect>
    </div>
  </div>
</template>

<style scoped lang="scss">
.filter-by {
  font-size: 2rem;
  cursor: pointer;
  position: relative;

  .filter-menu {
    position: absolute;
    right: 0;
    z-index: 100;
  }
}
</style>