<template>
  <div
    class="base-video-player relative max-width max-height grid"
    :class="[bgColor, {'base-video-player-no-header': isHideTopBar}]"
  >
    <div
      v-if="!isHideTopBar"
      class="video-player-header flex align-center justify-space-between"
      :style="videoPlayerHeaderStyle"
    >
      <h3 class="text-gray5">
        {{ videoDetail && videoDetail.title || "" }}
      </h3>
      <i
        class="fas fa-times-circle text-gray5 cursor-pointer"
        @click="videoOnClose"
      />
    </div>

    <div
      v-if="loading && (!standardErrors || !requestErrors)"
      class="video-loading-dialog bg-gray4
      flex max-width max-height justify-center align-center column-align"
    >
      <MoveBlockLoader bgColor="bg-gray1" />
      <p
        v-if="!videoLoadErrors"
        class="margin-vertical-10px text-gray2"
      >
        Please wait while the video is loading
      </p>
    </div>

    <div
      v-else-if="standardErrors || requestErrors || videoLoadErrors"
      class="max-width max-height flex justify-center align-center bg-gray4"
    >
      <GraphQLErrorParser
        v-if="!videoLoadErrors"
        isDisableKeyMessage
        :standardErrors="standardErrors"
        :requestErrors="requestErrors"
      />

      <p
        v-else
        class="text-gray2 margin-vertical-10px"
      >
        Video failed to load
      </p>
    </div>

    <p
      v-else-if="!videoDetail.url"
      class="margin-auto text-white"
    >
      Video not found
    </p>

    <div
      v-else
      class="max-width relative margin-auto
      video-player-stream-wrapper flex justify-center align-center"
    >
      <MoveBlockLoader
        color="bg-white"
        className="absolute"
        v-if="videoLoading"
      />

      <div
        class="relative max-width flex max-content-height"
        @mousemove="onVideoMouseOver"
      >
        <div
          class="video-overlay-back-btn-wrapper cursor-pointer
          absolute max-height cursor-pointer"
          @click="onNextVideo"
        >
          <i
            class="fas fa-chevron-right
            absolute video-overlay-back-btn text-white"
          />
        </div>
        <div
          class="video-overlay-next-btn-wrapper cursor-pointer
          absolute max-height curosr-pointer"
          @click="onPrevVideo"
        >
          <i
            class="fas fa-chevron-left
            absolute video-overlay-next-btn text-white"
          />
        </div>
        <div class="video-on-hover-overlay max-width max-height absolute" />

        <video
          id="video-player-stream"
          class="max-width self-center cursor-pointer"
          :class="{ inactive: loading }"
          :autoplay="isAutoPlay"
          @error="onVideoLoadError"
          @click="videoOnPress"
          @canplay="onVideoLoaded"
          @playing="onVideoPlaying"
          @pause="onVideoPaused"
        >
          <source
            :src="videoDetail.url"
            :type="videoDetail.type || ''"
          />
        </video>
      </div>
    </div>

    <BaseVideoPlayerControl
      className="absolute video-player-controls"
      :isHideNextButton="isHideNextButton"
      :isHideFullscreenButton="isHideFullscreenButton"
      :videoPlayerControllStyle="videoPlayerControllStyle"
      :isDisabledControl="loading"
      :videoElement="videoElement"
      :videoStreamProgress="videoStreamProgress"
      :isVideoPlaying="isVideoPlaying"
      :onNextClick="onNextVideo"
      :onVideoScreenExpandClick="videoScreenExpand"
    />
  </div>
</template>

<script>
/*
  eslint max-lines: [0], object-shorthand: 0, prefer-arrow-callback: 0
*/
import _ from 'lodash';
import colors from '@/utils/colors';
import BaseVideoPlayerControl from './BaseVideoPlayerControl.vue';
import videoPlayerOnKeyPressEvent,
{ computedKeyCodes } from './videoPlayerOnKeyPressEvent';

export default {
  name: 'BaseVideoPlayer',

  components: {
    BaseVideoPlayerControl,
    async MoveBlockLoader() {
      const { MoveBlockLoader } = await import('@/components');
      return MoveBlockLoader;
    },

    async GraphQLErrorParser() {
      const { GraphQLErrorParser } = await import('@/components');
      return GraphQLErrorParser;
    },
  },

  mounted() {
    if (this.isListenToKeyboardAsControl) {
      this.$store.commit(
        'setAppSourceKeyEventListenerCallback',
        this.videoPlayerOnKeyPressEvent,
      );
    } else {
      this.$store.commit('clearAppSourceKeyEventListenerCallback');
    }
  },

  props: {
    isHideTopBar: {
      type: Boolean,
      default: false,
    },

    isAutoPlay: {
      type: Boolean,
      default: false,
    },

    bgColor: {
      type: String,
      validator(value) {
        return (Object.keys(colors.backgroundClasses)).indexOf(value) > -1;
      },
      default: 'bg-black',
    },

    videoPlayerHeaderStyle: {
      type: Object,
      default: () => ({
        padding: '0px 20px',
      }),
    },

    videoPlayerControllStyle: {
      type: Object,
      default: () => ({
        padding: '0px 20px',
      }),
    },

    videoDetail: {
      type: Object,
      required: true,
    },

    loading: {
      type: Boolean,
      deafult: true,
    },

    requestErrors: {
      type: Error,
      default: null,
    },

    playListAsId: {
      type: Array,
      default: () => [],
    },

    standardErrors: {
      type: Array,
      default: null,
    },

    onClose: {
      type: Function,
      default: () => {},
    },

    isHideNextButton: {
      type: Boolean,
      default: false,
    },

    isListenToKeyboardAsControl: {
      type: Boolean,
      default: false,
    },

    isHideFullscreenButton: {
      type: Boolean,
      default: false,
    },

    isOnHoverShowControl: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      videoLoadErrors: null,

      videoElement: null,

      timeFrameListener: null,
      videoStreamProgress: 0,
      isVideoPlaying: false,

      isFullscreen: false,

      videoLoading: true,
    };
  },

  computed: {
    ...computedKeyCodes,
  },

  methods: {
    videoOnClose() {
      this.onClose(this.videoElement);
    },

    onVideoLoadError(error) {
      this.videoLoadErrors = [error];
    },

    videoScreenExpand() {
      this.$fullscreen.toggle(
        document.getElementsByClassName('base-video-player')[0],
        {
          wrap: false,
          callback: this.fullscreenChanges,
        },
      );
    },

    fullscreenChanges(isFullScreen) { this.isFullscreen = isFullScreen; },

    onVideoLoaded() {
      this.videoElement =
        document.getElementById('video-player-stream');

      if (this.videoElement) {
        this.videoElement.volume = 0.5;
      }

      this.videoLoading = false;
    },

    videoOnPress() {
      if (this.videoElement && this.videoElement.paused) {
        this.videoElement.play();
      } else if (!this.loading) {
        this.videoElement.pause();
      }
    },

    onVideoPlaying() {
      this.isVideoPlaying = true;

      this.timeFrameListener = setInterval(() => {
        this.videoStreamProgress = this.calculateTimeFrameToProgress();
      }, 100);
    },

    onVideoPaused() {
      clearInterval(this.timeFrameListener);

      this.isVideoPlaying = false;
    },

    calculateTimeFrameToProgress() {
      const value =
        this.videoElement.currentTime / this.videoElement.seekable.end(0);

      return value * 100;
    },

    videoIndexNavigate(isNext) {
      if (this.playListAsId && this.playListAsId.length) {
        const length = this.playListAsId.length;
        const index = this.$route.params.courseSectionVideoId;
        const videoIndex =
          this.playListAsId.indexOf(index) + (isNext ? 1 : -1);

        if (videoIndex < length && videoIndex > -1) {
          this.$router.push({
            name: 'course-section-video',
            params: {
              courseSectionVideoId: this.playListAsId[videoIndex],
            },
          });
        }
      }
    },

    onNextVideo() { this.videoIndexNavigate(true); },

    onPrevVideo() { this.videoIndexNavigate(false); },

    videoPlayerOnKeyPressEvent,

    onVideoMouseOver({ target }) {
      if (this.isOnHoverShowControl) {
        target.parentNode.classList.add('base-video-wrapper-on-hover');

        this.removeHoverWrapperClass(target.parentNode);
      }
    },

    removeHoverWrapperClass: _.debounce(function (node) {
      node.classList.remove('base-video-wrapper-on-hover');
    }, 500),
  },
};
</script>

<style scoped>
#video-player-stream {height: auto; max-height: 100%;}
.video-loading-dialog, .video-player-stream-wrapper {
  grid-area: video-stream; height: calc(100% - 60px);
}
.video-player-header {grid-area: video-header; z-index: 2;}
.video-player-controls {grid-area: video-controls; height: auto;}
.base-video-player {
  grid-template-areas: 'video-header' 'video-stream' 'video-controls';
  grid-template-columns: 1fr;
  grid-template-rows: 50px 1fr 60px;}

.base-video-player-no-header {
  grid-template-areas: 'video-stream' 'video-controls';
  grid-template-rows: 1fr 60px;
}
.base-video-player .fa-times-circle {font-size: 20px;}
.video-player-stream-fullscreen {
  position: fixed;
  left: 0;
  top: 0;
}
.video-overlay-back-btn,
.video-overlay-next-btn {
  font-size: 50px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.video-overlay-back-btn-wrapper,
.video-overlay-next-btn-wrapper {
  width: 20%;
  z-index: 1;
}
.video-overlay-back-btn-wrapper {
  right: 0px;
}
.video-overlay-next-btn-wrapper {
  left: 0px;
}
.video-on-hover-overlay {
  background-image: radial-gradient(transparent, black);
  left: 0;
  top: 0;
}
.video-overlay-back-btn-wrapper,
.video-overlay-next-btn-wrapper,
.video-on-hover-overlay {
  transition: .2s;
  opacity: 0;
  will-change: opacity;
}
.base-video-wrapper-on-hover .video-overlay-back-btn-wrapper,
.base-video-wrapper-on-hover .video-overlay-next-btn-wrapper,
.base-video-wrapper-on-hover .video-on-hover-overlay {
  opacity: 1;
}
</style>
