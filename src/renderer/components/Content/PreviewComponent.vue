<template>
  <div
    class="Preview relative"
    id="preview-section"
  >
    <AllCourseTitle title="Preview" />

    <div class="preview-content cursor-pointer relative max-width no-scroll">
      <div
        v-if="!isPreviewPlaying"
        class="max-width max-height flex justify-center align-center"
        @click="togglePreview"
      >
        <img
          :src="introImageUrl"
          alt="Avatar"
          class="max-width preview-bg"
        >
        <button class="btn-play absolute">
          Play Preview
        </button>
      </div>

      <BaseVideoPlayer
        isHideTopBar
        isAutoPlay
        isHideNextButton
        isHideFullscreenButton
        :loading="!isPreviewPlaying"
        :videoDetail="videoDetail"
      />
    </div>
  </div>
</template>
<script>
import staticImages from '@/utils/staticImages';
import { BaseVideoPlayer } from '@/components';

export default {
  name: 'PreviewComponent',

  components: {
    async AllCourseTitle() {
      const Component = await import('@/components');
      return Component.AllCourseTitle;
    },

    BaseVideoPlayer,
  },

  props: {
    introImageUrl: {
      type: String,
      default: this.bannerCover,
    },

    introVideoUrl: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      isPreviewPlaying: false,
    };
  },

  computed: {
    ...staticImages,

    videoDetail() {
      return {
        url: this.introVideoUrl,
      };
    },
  },

  methods: {
    togglePreview() {
      this.isPreviewPlaying = !this.isPreviewPlaying;
    },
  },
};
</script>
<style scoped>

.preview-content {
  margin-top: 20px;
  height: 380px;
  background-color: gray;
}

.preview-bg {
  filter: brightness(60%);
  object-fit: cover;
  height: auto;
}

.btn-play{
  width: 260px;
  height: 80px;
  font-size: 28px;
  padding: 10px 20px;
  top: calc(50% - 40px);
  left: calc(50% - 130px);
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
  border: 2px solid #ffffff;
  cursor: pointer;
}
</style>
