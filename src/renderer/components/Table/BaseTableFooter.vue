<template>
  <div class="base-table-footer flex justify-end align-center">
    <span>
      Total Entry: {{ numberOfEntry }} ;
    </span>

    <span class="margin-horizontal-10px">
      Pages: {{ pageIndex + 1 }} / {{ numberOfPages }}
    </span>

    <BaseButton
      icon="fas fa-chevron-left"
      bgColor="bg-blue"
      textColor="text-white"
      :onClick="setPreviousIndex"
    />

    <BaseLabelInput
      type="number"
      name="pageIndex"
      className="margin-horizontal-10px base-table-footer-page-index-input"
      :value="pageIndex"
      :onChange="setPageIndex"
    />

    <BaseButton
      icon="fas fa-chevron-right"
      bgColor="bg-blue"
      textColor="text-white"
      :onClick="setNextIndex"
    />
  </div>
</template>

<script>
/*
  eslint no-loop-func: [0]
*/
import { BaseButton, BaseLabelInput } from '@/components';

export default {
  name: 'BaseTableFooter',

  components: { BaseButton, BaseLabelInput },

  props: {
    loading: {
      type: Boolean,
      default: false,
    },

    numberOfEntry: {
      type: Number,
      default: 0,
    },

    numberOfEntryPerPage: {
      type: Number,
      default: 10,
    },

    onPageIndexChange: {
      type: Function,
      default: () => {},
    },
  },

  data() {
    return {
      pageIndex: 0,
    };
  },

  computed: {
    numberOfPages() {
      return Math.round(this.numberOfEntry / this.numberOfEntryPerPage);
    },
  },

  methods: {
    setPageIndex(index) {
      if (!this.loading) {
        if (index >= 0 && index < this.numberOfPages) {
          this.pageIndex = index;
        } else if (index > this.numberOfPages) {
          this.pageIndex = this.numberOfPages - 1;
        } else if (index < 0) {
          this.pageIndex = 0;
        }

        this.onPageIndexChange(this.pageIndex);
      }
    },

    setNextIndex() {
      if (!this.loading) {
        this.setPageIndex(this.pageIndex + 1);
      }
    },
    setPreviousIndex() {
      if (!this.loading) {
        this.setPageIndex(this.pageIndex - 1);
      }
    },
  },
};
</script>

<style scoped>
.base-table-footer-page-index-input {width: 80px; height: max-content;}
</style>
