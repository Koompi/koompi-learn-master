
<template>
  <button
    class="no-outline base-button cursor-pointer"
    :class="
      `${className}
      ${isDisabled || isLoading ? disabledColor : bgColor} ${textColor}`
    "
    :style="{'font-size': `${fontSize}px`}"
    :type="type"
    :disabled="isDisabled"
    @click="buttonOnClick"
  >
    <MoveBlockLoader
      v-if="isLoading"
      className="margin-horizontal-auto"
      bgColor="bg-gray1"
    />
    <span v-else-if="isDisabled">
      {{ disabledLabel || label }}
    </span>
    <span v-else>
      <i
      v-if="icon"
      :class="icon"></i> {{ label }}
    </span>
  </button>
</template>

<script>
import _ from 'lodash';
import colors from '@/utils/colors';

export default {
  name: 'BaseButton',

  components: {
    async MoveBlockLoader() {
      const { MoveBlockLoader } = await import('@/components');

      return MoveBlockLoader;
    },
  },

  props: {
    label: {
      type: [String, Number],
      default: '',
    },

    icon: {
      type: [String, Number],
      default: '',
    },

    disabledLabel: {
      type: String,
      default: '',
    },

    type: {
      type: String,
      default: 'button',
    },

    onClick: {
      type: Function,
      default: () => {},
    },

    isLoading: {
      type: Boolean,
      default: false,
    },

    isDisabled: {
      type: Boolean,
      default: false,
    },

    bgColor: {
      type: String,
      validator(value) {
        return (Object.keys(colors.backgroundClasses)).indexOf(value) > -1;
      },
    },

    textColor: {
      type: String,
      validator(value) {
        return (Object.keys(colors.textClasses)).indexOf(value) > -1;
      },
    },

    fontSize: {
      type: Number,
      default: 12,
    },

    className: {
      type: String,
      default: '',
    },

    debounceDuration: {
      type: Number,
      default: 500,
    },

    isDebounce: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    disabledColor() {
      return 'bg-gray4 text-white';
    },
  },

  methods: {
    debounceOnClick: _.debounce(function () {
      this.onClick();
    }, 500),

    buttonOnClick() {
      if (this.isDebounce) {
        return this.debounceOnClick();
      }

      return this.onClick();
    },
  },
};
</script>

<style scoped>
.base-button {
  min-height: 38px;
  min-width: 60px;
  border-radius: 2px;
  will-change: filter;
  padding: 10px 15px;
  transition: .2s;
}

.base-button:hover {
  filter: grayscale(60%);
}
</style>
