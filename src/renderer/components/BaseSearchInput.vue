
<template>
  <label
    class="search-input-label
    max-width
    relative
    flex
    justify-center
    align-center"
    :class="className"
  >
    <span class="search-icon absolute">
      <i class="fas fa-search text-gray1"/>
    </span>

    <input
      class="no-outline search-input text-gray1"
      type="text"
      :placeholder="placeholder"
      @keypress.enter="onEnter"
      @input="onInput"
    >
  </label>
</template>

<script>
import _ from 'lodash';

export default {
  name: 'BaseSearchInput',

  props: {
    placeholder: {
      type: String,
      default: 'Input search box',
    },

    className: {
      type: String,
      default: '',
    },

    onEnterHandler: {
      type: Function,
      default(value) { return value; },
    },

    onFocusHandler: {
      type: Function,
    },

    isDisabledEnter: {
      type: Boolean,
      default: false,
    },

    onInputHandler: {
      type: Function,
      default(val, e) { return [e, val]; },
    },
  },

  methods: {
    onEnter(event) {
      if (!this.isDisabledEnter) {
        this.onEnterHandler(event.target.value);
      }
    },

    onInput: _.debounce(function (event) {
      this.onInputHandler(event.target.value, event);
    }, 1000),
  },
};
</script>

<style scoped>
.search-icon {left: 16px; font-size: 24px;}
.search-input {
  min-height: 45px;
  width: 100%;
  padding-left: 60px;
  border-radius: 4px;
  font-size: 18px;
}
.search-input-label { max-width: 600px; z-index: 1;}

</style>
