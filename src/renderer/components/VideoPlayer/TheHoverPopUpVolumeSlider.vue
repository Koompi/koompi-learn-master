
<template>
  <div
    class="hover-popup-volume-slider
    absolute justify-center align-center"
    :class="`${popUpBgColor} ${className}`"
  >
    <input
      min="0"
      max="10"
      type="range"
      class="volume-slider no-outline"
      :value="initialVolumeLevel"
      @change="volumeOnChange"
    />
  </div>
</template>

<script>
import colors from '@/utils/colors';

export default {
  name: 'TheHoverPopUpVolumeSlider',

  props: {
    callback: {
      type: Function,
      default: val => val,
    },

    popUpBgColor: {
      type: String,
      validator(value) {
        return (Object.keys(colors.backgroundClasses)).indexOf(value) > -1;
      },
      default: 'bg-gray2',
    },

    className: {
      type: String,
      default: '',
    },

    initialVolumeLevel: {
      type: Number,
      default: 5,
    },
  },

  methods: {
    volumeOnChange(event) {
      this.callback(event.target.value);
    },
  },
};
</script>

<style lang="scss" scoped>
$slider-thumb-height: 10px;
$slider-track-height: 5px;
$slider-track-width: 100;

$blue-pallete: #2196f3;

.hover-popup-volume-slider {
  display: inline-flex;
  top: -26px;
  left: 13px;
  transform: rotateZ(-90deg);
  transform-origin: left;
  visibility: hidden;
  opacity: 0;
  transition: .3s;
  height: 40px;
  padding: 0 10px;
  border-radius: 3px;
  will-change: opacity, z-index, visibility;
}

.volume-slider {
  border-radius: 3px;
  width: #{$slider-track-width}px;
  height: $slider-track-height;
  overflow: hidden;
  -webkit-appearance: none;
}

@function tail-shadow($length) {
  $value: -1px 0px 0px 0px $blue-pallete;

  @for $index from 2 through $length {
    $value: #{$value}, -#{$index}px 0px 0px 0px $blue-pallete;
  }

  @return $value;
}

.volume-slider::-webkit-slider-thumb {
  height: $slider-thumb-height;
  width: 10px;
  border-radius: 5px;
  background-color: $blue-pallete;
  box-shadow: tail-shadow($slider-track-width);
  -webkit-appearance: none;
}

.volume-slider::-webkit-slider-runnable-track {
  width: 100%;
  height: 10px;
  border-radius: 3px;
}
</style>
