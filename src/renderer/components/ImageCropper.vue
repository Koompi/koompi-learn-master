<template>
  <div class="image-cropper flex column-align">
    <div
      class="profile-image-cropper-frame no-scroll"
      :style="{
        width: `${expandedCropWidth}px`,
        height: `${expandedCropHeight}px`
      }"
    >
      <Croppa
        ref="croppa"
        :width="expandedCropWidth"
        :height="expandedCropHeight"
        :initial-image="imageObject !== null ? imageObject : undefined"
      />
    </div>

    <div class="image-cropper-btn-group max-width flex justify-center">
      <div
        class="image-cropper-circle-btn bg-red cursor-pointer
        flex justify-center align-center"
        :class="{ 'bg-gray3': loading }"
        @click="removeCurrentImage"
      >
        <i class="fas fa-times text-white"/>
      </div>

      <div
        class="image-cropper-circle-btn bg-blue cursor-pointer
        flex justify-center align-center margin-horizontal-10px"
        :class="{ 'bg-gray3': loading }"
        @click="resetImageCrop"
      >
        <i class="fas fa-undo text-white"/>
      </div>

      <div
        class="image-cropper-circle-btn bg-blue cursor-pointer
        flex justify-center align-center"
        :class="{ 'bg-gray3': loading }"
        @click="saveImageCrop"
      >
        <i class="fas fa-check text-white"/>
      </div>
    </div>

    <div
      v-if="loading && optionalLoadingProgress !== null"
      class="image-cropper-optional-progress-bar"
    >
      <BaseProgressBar
        isShowPercent
        label="Uploading your profile image"
        :value="optionalLoadingProgress"
      />
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import Croppa from 'vue-croppa';
import { BaseButton, BaseProgressBar } from '@/components';

Vue.use(Croppa, { componentName: 'Croppa' });

export default {
  name: 'ImageCropper',

  components: { BaseButton, BaseProgressBar },

  props: {
    onSaveImageCrop: {
      type: Function,
      default: () => {},
    },

    imageObject: {
      type: HTMLImageElement,
      default: undefined,
    },

    loading: {
      type: Boolean,
      default: false,
    },

    optionalLoadingProgress: {
      type: Number,
      default: null,
    },

    cropWidth: {
      type: Number,
      default: 80,
    },

    cropHeight: {
      type: Number,
      default: 80,
    },
  },

  computed: {
    expandedCropWidth() { return this.cropWidth * 3; },

    expandedCropHeight() { return this.cropHeight * 3; },
  },

  methods: {
    saveImageCrop() {
      if (!this.loading) {
        this.onSaveImageCrop(this.$refs.croppa.generateDataUrl({
          type: 'image/jpeg',
        }));
      }
    },

    removeCurrentImage() {
      if (!this.loading) {
        this.$refs.croppa.remove();
      }
    },

    resetImageCrop() {
      if (!this.loading) {
        this.$refs.croppa.refresh();
      }
    },
  },
};
</script>

<style scoped>
.profile-image-cropper-frame {
  border-radius: 50%;
  border: 1px solid #ccc;
}
.image-cropper-circle-btn {
  padding: 10px;
  width: 25px !important;
  height: 25px;
  border-radius: 50%;
  width: max-content;
}
.image-cropper {padding: 10px;}
.image-cropper-btn-group {margin-top: 10px;}
.image-cropper-optional-progress-bar {margin-top: 10px;}
</style>
