<template>
  <div
    class="base-progress-bar"
    :class="className"
  >
    <p>{{ label }}</p>

    <div class="flex align-center max-width">
      <progress
        class="cursor-pointer
        relative base-progress-bar-progress no-scroll max-width"
        :class="{ 'hoverable': isAllowProgressChangeByClick }"
        :id="`base-progress-bar-progress-${uniqueKey}`"
        :value="value"
        :min=0
        :max="max"
        @click="progressBarOnClick"
      />

      <span v-if="isShowPercent">
        {{ value }}%
      </span>
    </div>
  </div>
</template>

<script>
import shortid from 'shortid';

export default {
  name: 'BaseProgressBar',

  props: {
    className: {
      type: String,
      default: '',
    },

    value: {
      type: Number,
      default: 0,
    },

    onClick: {
      type: Function,
      default: () => {},
    },

    max: {
      type: Number,
      default: 100,
    },

    isShowPercent: {
      type: Boolean,
      default: false,
    },

    label: {
      type: String,
      default: '',
    },

    isAllowProgressChangeByClick: {
      type: Boolean,
      default: false,
    },

    uniqueKey: {
      type: String,
      default: shortid.generate(),
    },

    mountedCallback: {
      type: Function,
      default: () => {},
    },
  },

  mounted() {
    this.progressBarElement =
      document.getElementById(`base-progress-bar-progress-${this.uniqueKey}`);
  },

  data() {
    return {
      progressBarElement: null,
    };
  },

  methods: {
    progressBarOnClick(event) {
      const clientRect = this.progressBarElement.getBoundingClientRect();

      if (this.isAllowProgressChangeByClick) {
        const progressValue =
          ((event.clientX - clientRect.left) /
            this.progressBarElement.offsetWidth) * 100;

        this.onClick(progressValue, event);
      }
    },
  },
};
</script>


<style lang="scss" scoped>
$progress-bar-border-radius: 6;
$blue: #2196f3;

.base-progress-bar-progress {
  height: 8px;
  border: 0px;
  -webkit-appearance: none;
}

.base-progress-bar-progress::-webkit-progress-bar {
  border-radius: #{$progress-bar-border-radius}px;
}

.base-progress-bar-progress::-webkit-progress-value {
  border-radius: #{$progress-bar-border-radius - 1}px;
  transition: .3s;
  will-change: filter;
  background-color: $blue;
}

.base-progress-bar-progress.active,
.base-progress-bar-progress.hoverable:hover {
  &::-webkit-progress-value {
    filter: blur(1px) brightness(200%);
  }
}
</style>
