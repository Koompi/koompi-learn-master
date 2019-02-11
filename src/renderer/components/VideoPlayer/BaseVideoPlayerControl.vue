<template>
  <div
    id="video-player-controls"
    class="max-height justify-center
    flex size-calc-spacing-include align-center max-width"
    :class="className"
    :style="videoPlayerControllStyle"
  >
    <div
      class="video-player-controls-wrapper
      flex justify-space-between max-width"
    >
      <div
        id="video-frame-controls"
        class="flex align-center relative"
      >
        <i
          class="fas fa-play text-white relative"
          v-if="!isVideoPlaying"
          @click="onPlayButtonPress"
        />
        <i
          class="fas fa-pause text-white relative"
          v-if="isVideoPlaying"
          @click="onPauseButtonPress"
        />

        <BaseProgressBar
          isAllowProgressChangeByClick
          className="margin-horizontal-10px max-width"
          :value="videoStreamProgress"
          :onClick="progressBarOnClick"
        />

        <i
          v-if="!isHideNextButton"
          class="fas fa-step-forward text-white relative"
          @click="onForwardButtonPress"
        />
      </div>

      <div
        id="video-mist-controls"
        class="flex justify-end"
      >
        <span class="relative volume-control-tooltip">
          <i
            v-if="!isMuted"
            class="fas fa-volume-up text-white relative"
            @click="onVolumePress"
          />
          <i
            v-else
            class="fas fa-volume-off text-white relative"
            @click="onVolumePress"
          />
          <TheHoverPopUpVolumeSlider
            :isActive="volumeHoverActive"
            :callback="onVolumeChange"
            :initialVolumeLevel="initialVolumeLevel"
            className="volume-hover-tooltip"
          />
        </span>

        <i
          v-if="!isHideFullscreenButton"
          class="fas fa-expand text-white fa-expand-left-margin relative"
          @click="onVideoScreenExpand"
        />
      </div>
    </div>
  </div>
</template>

<script>
/*
  eslint max-lines: [0], object-shorthand: [0]
*/
import videoPlayerControlPropTypes from './videoPlayerControlPropTypes';

export default {
  name: 'VideoPlayerControl',

  components: {
    async TheHoverPopUpVolumeSlider() {
      const Comp = await import('./TheHoverPopUpVolumeSlider.vue');

      return Comp;
    },

    async BaseProgressBar() {
      const { BaseProgressBar } = await import('@/components');

      return BaseProgressBar;
    },
  },

  props: { ...videoPlayerControlPropTypes },

  data() {
    return {
      isHoverOnProgressBar: false,

      isMuted: false,

      volumeHoverActive: false,
    };
  },

  methods: {
    onPlayButtonPress() {
      if (!this.isDisabledControl && this.videoElement) {
        this.videoElement.play();
      }
    },

    onPauseButtonPress() {
      if (!this.isDisabledControl && this.videoElement) {
        this.videoElement.pause();
      }
    },

    onForwardButtonPress() {
      this.onNextClick();
    },

    onVideoScreenExpand() {
      if (!this.isDisabledControl && this.videoElement) {
        this.onVideoScreenExpandClick();
      }
    },

    progressBarOnClick(progressValue, event) {
      if (!this.isDisabledControl && this.videoElement) {
        const actualTimeFrame =
          this.calculateActualTimeFrameFromProgressValue(progressValue);

        event.target.value = progressValue;

        this.videoElement.currentTime = actualTimeFrame;
      }
    },

    calculateProgressValueFromActualTimeFrame() {
      const value =
        this.videoElement.currentTime / this.videoElement.seekable.end(0);

      return value * 100;
    },

    calculateActualTimeFrameFromProgressValue(progressValue) {
      return (progressValue * this.videoElement.seekable.end(0)) / 100;
    },

    onVolumePress() {
      if (!this.isDisabledControl && this.videoElement) {
        this.videoElement.muted = !this.videoElement.muted;

        this.isMuted = this.videoElement.muted;
      }
    },

    onVolumeMouseOver() { this.volumeHoverActive = true; },

    onVolumeMouseOut() { this.volumeHoverActive = false; },

    onVolumeChange(value) {
      this.isMuted = false;
      this.videoElement.muted = false;
      this.videoElement.volume = value / 10.0;
    },
  },
};
</script>

<style lang="scss" scoped>
#video-player-controls {z-index: 0;}

.video-player-controls-wrapper {max-width: 500px;}

#video-player-controls .fas {
  font-size: 22px;
  cursor: pointer;
  will-change: filter;
  transition: .3s;
}

#video-player-controls .fas:hover {
  filter: blur(1px) brightness(130%);
}

#video-frame-controls {flex: .8;}
#video-mist-controls {flex: .2;}

.fa-expand-left-margin {margin-left: 10px;}

.volume-control-tooltip {
  display: inline-block;
}

.volume-control-tooltip:hover .volume-hover-tooltip {
  visibility: visible;
  opacity: 1;
}

@media only screen and (max-width: 320px) {
  .fa-expand-left-margin {margin-left: 6px;}
  #video-player-controls .fas {font-size: 18px;}
}
</style>
