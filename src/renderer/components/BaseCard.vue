<template>
  <div
    class="base-card relative flex column-align"
    :class="className"
    @click="cardOnClick"
  >
    <slot name="base-card-content">
    </slot>

    <slot name="base-card-footer">
    </slot>
  </div>
</template>

<script>
export default {
  name: 'BaseCard',

  props: {
    className: {
      type: Array,
      default: () => [],
    },

    cardOnClick: {
      type: Function,
      default: () => {},
    },
  },
};
</script>

<style scoped>
.base-card {
  box-shadow: 2px 2px 3px 0px rgba(0, 0, 0, .4);
}
.base-card::after {
  content: "";
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-shadow: 5px 5px 5px 0px rgba(0, 0, 0, .4);
  opacity: 0;
  transition: opacity .3s;
  will-change: opacity;
}
.base-card:hover::after {
  opacity: 1;
}
</style>
