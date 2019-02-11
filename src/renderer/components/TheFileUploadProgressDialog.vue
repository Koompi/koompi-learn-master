<template>
  <div
    class="file-upload-progress-dialog bg-white flex-wrap
    flex column-align justify-center align-center"
  >
    <BaseProgressBar
      v-for="(value, key) in filesUploadingStatus"
      isShowPercent
      className="max-width"
      :key="key"
      :label="value.filename"
      :value="value.progress"
    />
  </div>
</template>

<script>
import { BaseProgressBar } from '@/components';

export default {
  name: 'TheFileUploadProgressDialog',

  components: { BaseProgressBar },

  computed: {
    filesUploadingStatus() {
      const { getters } = this.$store;

      const uploading = { ...getters.getCurrentFilesUploadingContent };
      const keys = Object.keys(uploading);

      if (keys.length) {
        const data = new Array(keys.length);

        keys.map((key, index) => {
          data[index] = {
            filename: uploading[key].filename,

            progress: parseInt(uploading[key].progress, 10),
          };

          return key;
        });

        return data;
      }

      return [];
    },
  },
};
</script>

<style scoped>
.file-upload-progress-dialog {
  padding: 10px;
  border-radius: 6px;
  min-height: 200px;
  min-width: 200px;
}
</style>
