<template>
  <CourseSectionTemplate
    :courseSection="courseSection"
    :standardErrors="standardErrors"
    :requestErrors="requestErrors"
    :onSaveCourseSection="onSaveCourseSection"
    :onCourseSectionVideoRemove="onCourseSectionVideoRemove"
  />
</template>

<script>
import shortid from 'shortid';
import _ from 'lodash';
import {
  UPDATE_COURSE_SECTION_MUTATION,
  UPDATE_COURSE_SECTION_VIDEO_MUTATION,
  ADD_COURSE_SECTION_VIDEO_MUTATION,
} from '@/mutations';
import { PRESIGN_URL_QUERY } from '@/queries';
import s3Upload from '@/utils/s3Upload';
import CourseSectionTemplate from './CourseSectionTemplate.vue';

export default {
  name: 'CourseSectionEdit',

  components: { CourseSectionTemplate },

  props: {
    courseSection: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      requestErrors: null,
      standardErrors: null,
    };
  },

  methods: {
    fileUploadOptions(errorAccumulator) {
      return {
        headers: [['ACL', 'public-read']],
        progressCallback: this.onFileUploadProgress,
        errorCallback:
          error => this.onFileUploadError(error, errorAccumulator),
      };
    },

    onCourseSectionVideoRemove(courseSectionVideo) {
      console.log(courseSectionVideo);
    },

    onFileUploadProgress(progress, file, id) {
      this.$store.commit('setFileUploadingProgress', {
        filename: file.name,
        progress,
        id,
      });
    },

    onFileUploadError(error, errorArrayAccumulator) {
      errorArrayAccumulator.push(error);
    },

    flattenArray(arr) {
      return arr.reduce((acc, innerArr, index) => {
        acc[index] = innerArr[0];

        return acc;
      }, new Array(arr.length));
    },

    async onSaveCourseSection(values) {
      const courseSectionInfo = _.pick(
        values, ['description', 'orderAs', 'title']);
      const { courseSectionVideos } = _.pick(values, ['courseSectionVideos']);
      courseSectionInfo.courseSectionId = this.courseSection.id;

      const operations = [];
      const toUpload = [];
      const infoUpdateErrors = [];
      const fileUploadErrors = [];

      if (courseSectionInfo.title === this.courseSection.title) {
        delete courseSectionInfo.title;
      }

      const isUpload = true;

      operations.push(['mutation', {
        mutation: UPDATE_COURSE_SECTION_MUTATION,
        variables: courseSectionInfo,
        throttle: 2000,
      }]);

      try {
        await Promise.all(
          courseSectionVideos.map(async (csv) => {
            const { videoFile, id, ...rest } = csv;
            let mutation = UPDATE_COURSE_SECTION_VIDEO_MUTATION;

            if (videoFile && videoFile.length && videoFile[0]) {
              const { data } = await this.$apollo.query({
                query: PRESIGN_URL_QUERY,
                fetchPolicy: 'network-only',
                throttle: 2000,
                variables: {
                  fileType: videoFile[0].type,
                  tempId: shortid.generate(),
                },
              });

              console.log(data);

              rest.url = data.presignUrl.url;

              toUpload.push({
                file: videoFile[0],
                url: data.presignUrl,
              });

              operations.push(['upload', {
                file: videoFile[0],
                url: data.presignUrl,
              }]);
            }

            const variables = {
              courseSectionVideo: { ...rest },
            };

            if (!id || id.length < 36) {
              mutation = ADD_COURSE_SECTION_VIDEO_MUTATION;
              variables.courseSectionId = this.courseSection.id;
            } else {
              variables.courseSectionVideoId = id;
            }

            operations.push(['mutation', {
              mutation,
              variables,
              throttle: 2000,
              debounce: 2000,
            }]);
          }),
        );

        console.log(operations);

        if (isUpload) {
          if (toUpload.length) {
            this.$store.commit('openModal', 'TheFileUploadProgressDialog');
          }

          await Promise.all(operations.map(async (op) => {
            if (op[0] === 'mutation') {
              const { data } = await this.$apollo.mutate(op[1]);

              if (data.errors) {
                infoUpdateErrors.push(data.errors);
              }

              return op;
            }

            await s3Upload(
              op[1].file,
              op[1].url,
              this.fileUploadOptions(fileUploadErrors),
            );

            return op;
          }));

          if (toUpload.length) {
            this.$store.commit('closeModal');
            this.$store.commit('clearFilesUploadingStatus');
          }

          const isInfoUpdateSuccess = infoUpdateErrors.length <= 0;
          const isFileUploadSuccess = fileUploadErrors.length <= 0;

          if (isInfoUpdateSuccess) {
            this.$toasted.success(
              'Successfully updated course section infos',
              { duration: 2000, singleton: true },
            );
          }

          if (isFileUploadSuccess) {
            this.$toasted.success(
              'Successfully updated course section videos',
              { duration: 2000, singleton: true },
            );
          }
        }
      } catch (errors) {
        this.requestErrors = errors;
      }
    },
  },
};
</script>

<style scoped>

</style>

