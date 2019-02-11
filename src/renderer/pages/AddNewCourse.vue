<template>
  <BaseWizard
    formComponent="AddCourseForm"
    isAllowSetStep
    :steps="steps"
    :onSubmit="onSubmit"
  />
</template>

<script>
/*
  eslint max-lines: [0]
*/
import shortid from 'shortid';
import { BaseWizard } from '@/components';
import flattenArrayObjectByField from '@/utils/flattenArrayObjectByField';
import { ADD_COURSE_MUTATION } from '@/mutations';
import { PRESIGN_URL_QUERY } from '@/queries';
import mutationFunc from '@/mutationFunc';
import queryFunc from '@/queryFunc';
import s3Upload from '@/utils/s3Upload';
import { formatNetworkErrors } from '@/utils/formatGraphQLErrors';

export default {
  name: 'AddNewCourse',

  components: { BaseWizard },

  computed: {
    steps() {
      return [{
        label: 'Course Info',
      }, {
        label: 'Course Section Videos',
      }, {
        label: 'Submit for Review',
      }];
    },
  },

  methods: {
    fileUploadProgress(progress, file, id) {
      this.$store.commit('setFileUploadingProgress', {
        filename: file.name,
        progress,
        id,
      });
    },

    async setPresignUrl(
      file,
      objectToSetTo,
      propertyToSetAs,
      ArrToStoreForLaterUpload,
      uploadOptions,
      tempId = '',
    ) {
      const { data: { presignUrl } } = await queryFunc(
        this,
        PRESIGN_URL_QUERY,
        { fileType: file[0].type, tempId },
        { fetchPolicy: 'network-only' },
      );

      objectToSetTo[propertyToSetAs] = presignUrl.url;

      ArrToStoreForLaterUpload.push([
        file[0],
        presignUrl,
        uploadOptions,
      ]);
    },

    async onSubmit({ values, clear: clearNewCourseFormContent }) {
      const {
        subjects: unflattenSubjects,
        courseSections,
        standardErrors,
        requestErrors,
        introImageFile,
        introVideoFile,
        isSavingToServer,
        ...rest
      } = values;

      console.log(isSavingToServer);

      this.$store.commit('setSavingNewCourseToServer', true);

      const subjects = flattenArrayObjectByField(unflattenSubjects, 'field');

      const filesToUpload = [];

      const fileUploadOptions = {
        progressCallback: this.fileUploadProgress,
        headers: [['ACL', 'public-read']],
      };

      try {
        if (introImageFile && introImageFile.length) {
          await this.setPresignUrl(
            introImageFile,
            rest,
            'introImageUrl',
            filesToUpload,
            fileUploadOptions,
          );
        }

        if (introVideoFile && introVideoFile.length) {
          await this.setPresignUrl(
            introVideoFile,
            rest,
            'introVideoUrl',
            filesToUpload,
            fileUploadOptions,
          );
        }

        const filteredCourseSections =
          courseSections.reduce(async (acc, elem, index) => {
            await acc;

            acc[index] = elem;
            acc[index].courseSectionVideos =
              await elem.courseSectionVideos.reduce(async (ac, el, i) => {
                await ac;

                const val = {
                  title: el.title,
                  orderAs: el.orderAs,
                };

                if (el.videoFile && el.videoFile.length) {
                  await this.setPresignUrl(
                    el.videoFile,
                    val,
                    'url',
                    filesToUpload,
                    fileUploadOptions,
                    shortid.generate(),
                  );
                }

                ac[i] = val;

                return ac;
              }, new Array(elem.courseSectionVideos.length));

            return acc;
          }, new Array(courseSections.length));

        const isUpload = true;

        rest.courseSections = await filteredCourseSections;
        rest.subjects = subjects;

        if (isUpload) {
          const response = await mutationFunc(
            this,
            ADD_COURSE_MUTATION,
            rest,
            { throttle: 3000, debounce: 6000 },
          );

          const
            { data: { addCourse: { ok, errors } }, networkStatus } = response;

          if (ok) {
            if (filesToUpload && filesToUpload.length) {
              await this.uploadFiles(filesToUpload);
            }

            this.handleSuccess();
            clearNewCourseFormContent();
            this.$router.push({ name: 'user-courses' });
          } else if (networkStatus === 8) {
            this.handleNetworkError();
          } else {
            this.handleStandardErrors(errors);
          }
        }
      } catch (requestErrors) {
        this.handleRequestErrors(requestErrors);
      }

      this.$store.commit('closeModal');
      this.$store.commit('clearFilesUploadingStatus');
      this.$store.commit('setSavingNewCourseToServer', false);
    },

    uploadFiles(filesToUpload) {
      this.$store.commit('setIsFileUploadCompleted', false);
      this.$store.commit('openModal', 'TheFileUploadProgressDialog');

      return Promise.all(filesToUpload.map(file => s3Upload(...file)));
    },

    handleSuccess() {
      this.$toasted.success(
        'Your new course has been successfully added',
        { duration: 1000, singleton: true },
      );
    },

    handleNetworkError() {
      this.$toasted.error(
        'Network unresolved, please try to submit again',
        { duration: 1000, singleton: true },
      );
    },

    handleStandardErrors(errors) {
      const errs = new Array(errors.length);

      let strConcat = '';
      let isPageTwoErrorPrompted = false;
      let isProblemAtPageOne = false;

      errors.forEach((error, index) => {
        errs[index] = error;

        if (error.isJson && !isPageTwoErrorPrompted) {
          this.$toasted.error(
            'There are many required field that have ' +
            'not fill in page two',
            { duration: 10000, singleton: true },
          );

          isPageTwoErrorPrompted = true;
        } else if (!error.isJson) {
          if (['title', 'description', 'subjects'].indexOf(error.key) > -1) {
            isProblemAtPageOne = true;
          }

          strConcat = `Course ${error.key}: ${error.message}\n`;

          this.$toasted.error(
            strConcat, { duration: 10000, singleton: true });
        }

        return error;
      });

      this.$toasted.info(
        'Required field has asterisk(*) on top of field label',
        { duration: 10000, singleton: true },
      );

      this.$store.commit('setNewCourseStandardErrors', errs);

      if (isProblemAtPageOne) {
        this.$store.commit('setFormWizardStep', 0);
      } else if (isPageTwoErrorPrompted) {
        this.$store.commit('setFormWizardStep', 1);
      }
    },

    handleRequestErrors(requestErrors) {
      const {
        networkError,
        graphQLErrors,
      } = JSON.parse(JSON.stringify(requestErrors));

      if (graphQLErrors && graphQLErrors.length) {
        this.$toasted.error(graphQLErrors[0].message, {
          duration: 1000,
          singleton: true,
        });
      } else {
        this.$toasted.error(formatNetworkErrors(networkError), {
          duration: 1000,
          singleton: true,
        });
      }
    },
  },
};
</script>
