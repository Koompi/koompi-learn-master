<template>
  <div
    class="base-toggle-input relative no-scroll cursor-pointer no-interaction"
    :class="[{ active: toggleValue }, className]"
    @click="toggle"
  >
    <span
      class="max-width max-height base-toggle-input-on text-white
      absolute size-calc-spacing-include flex align-center"
    >
      On
    </span>
    <span
      class="max-width max-height base-toggle-input-off
      absolute flex align-center justify-end
      bg-white size-calc-spacing-include"
    >
      Off
    </span>
    <div class="base-toggle-input-toggler bg-white absolute" />
  </div>
</template>

<script>
import _ from 'lodash';

export default {
  name: 'BaseToggleInput',

  props: {
    defaultValue: {
      type: Boolean,
      default: false,
    },

    onToggle: {
      type: Function,
      default: () => {},
    },

    className: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      toggleValue: this.defaultValue,
    };
  },

  methods: {
    toggle: _.debounce(function () {
      this.toggleValue = !this.toggleValue;

      this.onToggle(this.toggleValue);
    }, 200),
  },
};
</script>

<style lang="scss" scoped>
$toggle-input-height: 30;
$toggle-input-width: 80;
$toggle-input-border-radius: 10;
$toggle-input-padding: 5;
$toggle-input-border-width: 1;

.base-toggle-input {
  width: #{$toggle-input-width}px;
  height: #{$toggle-input-height}px;
  border-radius: #{$toggle-input-height / 2}px;
  border: #{$toggle-input-border-width}px solid #ccc;
}
.base-toggle-input-toggler {
  width: #{$toggle-input-height - $toggle-input-padding}px;
  height: #{$toggle-input-height - $toggle-input-padding}px;
  border-radius: 50%;
  border: 1px solid #ccc;
  top: #{$toggle-input-border-width}px;
  transform: translateX(#{$toggle-input-border-width}px);
  transition: .2s;
  will-change: transform;
}
.base-toggle-input-on,
.base-toggle-input-off {
  padding: #{$toggle-input-padding * 2 + $toggle-input-border-width}px;
  transition: .2s;
  will-change: opacity;
}
.base-toggle-input-on {
  background-color: yellowgreen;
  opacity: 0;
}
.base-toggle-input-off { opacity: 1; }

.base-toggle-input.active {
  .base-toggle-input-on { opacity: 1; }
  .base-toggle-input-off { opacity: 0; }
  .base-toggle-input-toggler {
    transform: translateX(
      #{
        $toggle-input-width +
        $toggle-input-border-width -
        $toggle-input-height
      }px
    );
  }
}
</style>
