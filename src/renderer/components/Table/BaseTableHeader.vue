<template>
  <div class="base-table-header flex justify-end">
    <BaseSearchInput
      isDisabledEnter
      placeholder="Search for courses..."
      className="base-table-header-search-input no-scroll"
      :onInputHandler="onSearchInput"
    />
  </div>
</template>

<script>
import { BaseButton, BaseSearchInput } from '@/components';

export default {
  name: 'BaseTableHeader',

  components: { BaseButton, BaseSearchInput },

  props: {
    onInputSearch: {
      type: Function,
      default: () => {},
    },

    loading: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      searchString: '',

      sortOrderingType: 'asc',
    };
  },

  methods: {
    setSortTypeAscending() {
      this.sortOrderingType = 'asc';
    },

    setSortTypeDescending() {
      this.sortOrderingType = 'desc';
    },

    onSearchInput(value) {
      if (!this.loading) {
        this.searchString = value;

        this.onInputSearch(value);
      }
    },
  },
};
</script>

<style scoped>
.base-table-header {height: max-content;}
.base-table-header-search-input {
  width: 300px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
</style>
