<template>
  <div
    class="base-grid-container
    grid max-width size-calc-spacing-include"
    :name="randomUniqueId"
    :class="[className, { 'justify-center': isAlignCenter }]"
    :style="computedStyle"
  >
    <slot>
    </slot>
  </div>
</template>

<script>
/*
  eslint object-shorthand: [0]
*/
import shortid from 'shortid';
export default {
  name: 'BaseGridContainer',

  props: {
    numberOfItemPerRow: {
      type: Number,
      default: 4,
    },

    isFillAutoWithGivenMaxMin: {
      type: Boolean,
      default: false,
    },

    minItemWidth: {
      type: Number,
      default: 100,
    },

    maxItemWidth: {
      type: Number,
      default: 300,
    },

    className: {
      type: String,
      default: '',
    },

    gridGap: {
      type: Number,
      default: 20,
    },

    isAlignCenter: {
      type: Boolean,
      default: true,
    },
  },

  mounted() {
    this.gridContainerElement =
      document.getElementsByName(this.randomUniqueId)[0];

    this.gridContainerWidth = this.gridContainerElement.offsetWidth;

    this.$nextTick(() => {
      window.addEventListener('resize', () => {
        this.gridContainerWidth = this.gridContainerElement.offsetWidth;
      });
    });
  },

  watch: {
    'window.innerWidth'(newWidth) {
      this.gridContainerWidth = newWidth;
    },
  },

  data() {
    const gridContainerWidth = window.innerWidth;

    return {
      gridContainerWidth,

      gridContainerElement: null,
    };
  },

  computed: {
    renderNumberOfItemPerRow() {
      if (this.gridContainerWidth <= 768) {
        return this.numberOfItemPerRow - 1;
      }

      return this.numberOfItemPerRow;
    },

    randomUniqueId() { return `base-grid-container-${shortid.generate()}`; },

    computedStyle() {
      if (this.isFillAutoWithGivenMaxMin) {
        const min = this.minItemWidth;
        const max = this.maxItemWidth;

        return {
          gridTemplateColumns:
            `repeat(auto-fill, minmax(${min}px, ${max}px))`,

          gridGap: `${this.gridGap}px`,
        };
      }

      return {
        gridTemplateColumns: `repeat(${
          this.renderNumberOfItemPerRow
        }, minmax(${this.minItemWidth}px, ${this.maxItemWidth}px))`,

        gridGap: `${this.gridGap}px`,
      };
    },
  },
};
</script>

<style scoped>
.base-grid-container {height: 100%;}
</style>

