<template>
  <label
    class="base-label-file-input flex justify-center align-center
    max-width cursor-pointer bg-gray4 no-scroll relative
    size-calc-spacing-include border-gray4"
    :for="uniqueId || `${this.name}-file-input`"
    :class="baseLabelClass"
    @dragover="onDragOver"
    @dragleave="setDragFalse"
    @dragend="setDragFalse"
    @drop="onDrop"
  >
    <div
      v-if="loading || error || (!value && !url && !valueReadFromFile)"
      class="label-file-input-placeholder
      flex align-center justify-center column-align"
    >
      <MoveBlockLoader
        v-if="loading"
        bgColor="bg-gray1"
      />
      <i
        v-else-if="!error && !loading"
        class="fas label-file-input-placeholder-icon text-gray2"
        :class="iconClass"
      />
      <h3 class="text-gray2">{{ renderLabelText() }}</h3>
    </div>

    <video
      class="max-width max-height"
      v-else-if="isRenderVideoTag && (value || url)"
      controls
      :name="name"
    >
      <source
        @error="fileOnLoadError"
        :src="valueReadFromFile || url"
      />
    </video>

    <img
      class="max-width max-height image-cover-fit"
      v-else-if="isRenderImageTag && (value || url)"
      @error="fileOnLoadError"
      :name="name"
      :src="valueReadFromFile || url"
    />

    <span
      v-if="isRenderVideoTag && (value || url)"
      class="base-label-media-video-clear-btn absolute color-gray2 bg-white"
      @click="clearVideoContent"
    >
      Select Other Video
    </span>

    <input
      type="file"
      class="label-file-input-tag"
      :id="uniqueId || `${this.name}-file-input`"
      :accept="`${type}/*`"
      @change="fileOnChange"
    />
  </label>
</template>

<script>
/*
  eslint object-shorthand: [0], max-lines: [0]
*/
import readFile from '@/readFile';

export default {
  name: 'BaseLabelMediaInput',

  components: {
    async MoveBlockLoader() {
      const { MoveBlockLoader } = await import('@/components');

      return MoveBlockLoader;
    },
  },

  props: {
    type: {
      type: String,
      validator(value) {
        return ['video', 'image'].indexOf(value) > -1;
      },
      required: true,
    },

    label: {
      type: String,
      default: 'Drag and drop file here or click to select one',
    },

    name: {
      type: String,
      default: '',
    },

    uniqueId: {
      type: String,
      default: null,
    },

    url: {
      type: String,
      default: '',
    },

    fileObjectAsValue: {
      type: [File, Object],
      default: null,
    },

    onChange: {
      type: Function,
      default: () => {},
    },
  },

  async created() {
    if (this.fileObjectAsValue) {
      try {
        this.valueReadFromFile =
          await readFile(this.type, this.fileObjectAsValue);
      } catch (error) {
        this.error = 'Failed to read the file, please re-upload or try refresh';
      }
    }
  },

  watch: {
    'valueReadFromFile'() {
      if (this.type === 'video') {
        const videoElement = document.getElementsByName(this.name);

        if (videoElement && videoElement.length) {
          videoElement[0].load();
        }
      }

      this.onChange([this.value, this.valueReadFromFile]);
    },
  },

  data() {
    return {
      isDraggingOver: false,

      value: this.fileObjectAsValue,

      valueReadFromFile: this.url,

      loading: false,

      error: null,
    };
  },

  computed: {
    isRenderImageTag() { return this.type === 'image'; },

    isRenderVideoTag() { return this.type === 'video'; },

    baseLabelClass() {
      return `base-label-${this.type}-input`;
    },

    iconClass() { return `fa-${this.type}`; },
  },

  methods: {
    clearVideoContent() { this.valueReadFromFile = null; },

    onDragOver(event) {
      event.preventDefault();
      this.error = null;

      this.isDraggingOver = true;
    },

    setDragFalse() { this.isDraggingOver = false; },

    async onDrop(event) {
      event.preventDefault();

      this.loading = true;
      this.error = null;

      this.value = event.dataTransfer.files[0];

      try {
        this.valueReadFromFile = await readFile(this.type, this.value);
      } catch (error) {
        console.log(error);
      }

      this.loading = false;
    },

    async fileOnChange(event) {
      event.preventDefault();

      this.loading = true;
      this.error = null;

      this.value = event.target.files[0];

      try {
        this.valueReadFromFile = await readFile(this.type, this.value);
      } catch (error) {
        console.log(error);
      }

      this.loading = false;
    },

    renderLabelText() {
      if (this.error) {
        return this.error;
      }

      if (this.loading) {
        return 'Loading your file';
      }

      if (this.isDraggingOver) {
        return 'Release your mouse now to choose the image';
      }

      return this.label;
    },

    fileOnLoadError() {
      this.error = 'Something went wrong, Make sure the file format is correct';
    },
  },
};
</script>

<style scoped>
.base-label-file-input {
  border-radius: 8px;
  height: 360px;
  transition: .3s;
}

.label-file-input-tag {
  height: 0.1px;
  width: 0.1px;
  opacity: 0;
  z-index: 0;
}

.label-file-input-placeholder-icon {
  font-size: 100px;
}

.label-file-input-placeholder {
  width: calc(100% - 60px);
  height: 300px;
  border: 6px dotted gray;
}
.base-label-media-video-clear-btn {
  font-size: 16px;
  padding: 10px;
  top: 10px;
  right: 10px;
  border-radius: 3px;
}
</style>
