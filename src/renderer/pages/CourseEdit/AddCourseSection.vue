<template>
  <CourseSectionTemplate
    :standardErrors="standardErrors"
    :requestErrors="requestErrors"
    :onSaveCourseSection="onSaveCourseSection"
  />
</template>

<script>
import shortid from 'shortid';
import { PRESIGN_URL_QUERY } from '@/queries';
import { ADD_COURSE_SECTION_MUTATION } from '@/mutations';
import mutationFunc from '@/mutationFunc';
import s3Upload from '@/utils/s3Upload';
import CourseSectionTemplate from './CourseSectionTemplate.vue';

export default {
  name: 'AddCourseSection',

  components: { CourseSectionTemplate },

  data() {
    return {
      standardErrors: null,
      requestErrors: null,
    };
  },

  computed: {
    fileUploadOptions() {
      return {
        headers: [['ACL', 'public-read']],
        progressCallback: this.onFileUploadProgress,
      };
    },
  },

  methods: {
    onFileUploadProgress(progress, file, id) {
      this.$store.commit('setFileUploadingProgress', {
        filename: file.name,
        progress,
        id,
      });
    },

    flattenArray(arr) {
      return arr.reduce((acc, innerArr, index) => {
        acc[index] = innerArr[0];

        return acc;
      }, new Array(arr.length));
    },

    async onSaveCourseSection(values) {
      const toUpload = [];

      try {
        const { courseSectionVideos, ...rest } = values;
        const formatedValues = rest;
        this.standardErrors = null;
        this.requestErrors = null;

        const isUpload = true;

        if (courseSectionVideos && courseSectionVideos.length) {
          const newCsv = new Array(courseSectionVideos.length);

          await Promise.all(courseSectionVideos.map(
            async (csv, i) => {
              const { id, videoFile, ...rest } = csv;
              const newElem = { ...rest };
              newElem.orderAs = parseInt(newElem.orderAs, 10);
              newElem.length = 0;

              if (videoFile && videoFile.length && videoFile[0]) {
                const { data } = await this.$apollo.query({
                  query: PRESIGN_URL_QUERY,
                  variables: {
                    fileType: videoFile[0].type,
                    tempId: shortid.generate(),
                  },
                  throttle: 2000,
                  fetchPolicy: 'network-only',
                });

                newElem.url = data.presignUrl.url;

                toUpload.push({
                  file: videoFile[0],
                  url: data.presignUrl,
                });
              }

              newCsv[i] = newElem;

              return csv;
            }));

          formatedValues.courseSectionVideos = newCsv;
        }

        formatedValues.courseId = this.$route.params.courseId;
        formatedValues.orderAs =
          parseInt(formatedValues.orderAs, 10);

        if (isUpload) {
          const { data } = await mutationFunc(
            this,
            ADD_COURSE_SECTION_MUTATION,
            formatedValues,
            { throttle: 2000, debounce: 2000 },
          );

          if (data.addCourseSection) {
            if (data.addCourseSection.errors) {
              this.standardErrors = data.addCourseSection.errors;
            } else if (toUpload.length) {
              this.$store.commit('openModal', 'TheFileUploadProgressDialog');

              await Promise.all(toUpload.map(upload =>
                s3Upload(
                  upload.file,
                  upload.url,
                  this.fileUploadOptions,
                ),
              ));

              this.$store.commit('closeModal');
              this.$store.commit('clearFilesUploadingStatus');
            }

            if (data.addCourseSection.ok) {
              this.$toasted.success('Successfully added course section', {
                duration: 2000,
              });
              this.$router.back();
            }
          }
        }
      } catch (errors) {
        this.requestErrors = errors;
      }
    },
  },
};
</script>
