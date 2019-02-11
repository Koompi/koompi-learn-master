<template>
  <div>
    <BaseForm
      isShowErrorOnInput
      isVerticalStyling
      submitButtonLabel="Save Edit"
      :isShowSubmitButton=false
      :formTitle="`Editing course: ${courseTitle}`"
      :formFields="formFields"
    />

    <div class="flex align-center justify-between">
      <div class="flex align-center max-width">
        <span>Deactivate course:</span>
        <BaseToggleInput
          className="margin-horizontal-10px"
          :onToggle="onHideCourseToggle"
          :defaultValue="!isCourseActive"
        />
        <BaseButton
          textColor="text-white"
          isDebounce
          :bgColor="isCoursePublished ? 'bg-gray2' : 'bg-blue'"
          :loading="isPublishing"
          :isDisabled="coursePublished || isCoursePublished"
          :onClick="publishCourse"
          :label="coursePublished || isCoursePublished ?
            'Published' : 'Publish Course'
          "
        />
      </div>

      <BaseButton
        isDebounce
        label="Save Edit"
        bgColor="bg-blue"
        textColor="text-white"
        className="margin-vertical-10px course-info-edit-save-btn"
        :onClick="saveEdit"
        :isLoading="loading"
        :isDisabled="loading"
      />
    </div>
  </div>
</template>

<script>
/*
  eslint max-lines: [0]
*/
import { BaseForm, BaseButton, BaseToggleInput } from '@/components';
import {
  UPDATE_COURSE_INFO_MUTATION,
  PUBLISH_COURSE_MUTATION,
} from '@/mutations';
import { PRESIGN_URL_QUERY } from '@/queries';
import mutationFunc from '@/mutationFunc';
import s3Upload from '@/utils/s3Upload';
import transformS3Url from '@/utils/transformS3Url';

export default {
  name: 'CourseInfoEdit',

  components: { BaseForm, BaseButton, BaseToggleInput },

  props: {
    courseTitle: {
      type: String,
      default: '',
    },

    coursePrice: {
      type: Number,
      default: 0,
    },

    courseDescription: {
      type: String,
      default: '',
    },

    courseSubjects: {
      type: Array,
      default: () => [],
    },

    courseIntroImageUrl: {
      type: String,
      default: '',
    },

    courseIntroVideoUrl: {
      type: String,
      default: '',
    },

    isCourseActive: {
      type: Boolean,
      default: true,
    },

    isCoursePublished: {
      type: Boolean,
      default: false,
    },

    courseId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      loading: false,
      isPublishing: false,
      coursePublished: null,
      requestErrors: null,
      standardErros: null,
      values: {},
    };
  },

  computed: {
    formFields() {
      const { state: { subjects } } = this.$store;

      return [{
        label: 'Course Title',
        value: this.courseTitle,
        type: 'text',
        name: 'title',
        onChange: value => this.onChangeValue('title', value),
      }, {
        label: 'Course Description',
        value: this.courseDescription,
        type: 'text',
        name: 'description',
        onChange: value => this.onChangeValue('description', value),
      }, {
        label: 'Course Price',
        value: this.coursePrice,
        type: 'number',
        name: 'price',
        onChange: value => this.onChangeValue('price', value),
      }, {
        label: 'Course Related Subjects',
        values: this.courseSubjects,
        name: 'subjects',
        type: 'tag',
        options: subjects.value,
        contentProps: {
          labelProperty: 'field',
        },
        onChange: values => this.onChangeValue('subjects', values),
      }, {
        label: 'Course Intro Video Image Thumbnail',
        url: transformS3Url(this.courseIntroImageUrl),
        type: 'image',
        name: 'introVideoImageFile',
        isOptional: true,
        contentProps: {
          label: 'Drag and drop image here or click to select them',
        },
        uniqueId: 'introVideoThumb',
        onChange: value => this.onChangeValue('introImageFile', value),
      }, {
        label: 'Course Intro Video',
        url: transformS3Url(this.courseIntroVideoUrl),
        type: 'video',
        name: 'introVideoFile',
        isOptional: true,
        contentProps: {
          label: 'Drag and drop video here or click to select them',
        },
        uniqueId: 'introVideoFile',
        onChange: value => this.onChangeValue('introVideoFile', value),
      }];
    },

    fileUploadOptions() {
      return {
        headers: [['ACL', 'public-read']],
        progressCallback: this.onFileUploadProgress,
      };
    },
  },

  methods: {
    async saveEdit() {
      this.loading = true;

      try {
        if (Object.keys(this.values).length > 0) {
          const { introVideoFile, introImageFile, ...variables } = this.values;
          const toUpload = [];
          const fileMapper = [];
          const objectMapper = [];

          if (introVideoFile) {
            toUpload.push({
              query: PRESIGN_URL_QUERY,
              variables: { fileType: introVideoFile[0].type },
              fetchPolicy: 'network-only',
            });
            objectMapper.push('introVideoUrl');
            fileMapper.push(introVideoFile[0]);
          }

          if (introImageFile) {
            toUpload.push({
              query: PRESIGN_URL_QUERY,
              variables: { fileType: introImageFile[0].type },
              fetchPolicy: 'network-only',
            });
            objectMapper.push('introImageUrl');
            fileMapper.push(introImageFile[0]);
          }

          if (toUpload.length > 0) {
            const urlResponses = await Promise.all(toUpload.map(async (q) => {
              const { data } = await this.$apollo.query(q);

              return data.presignUrl;
            }));

            this.$store.commit('openModal', 'TheFileUploadProgressDialog');

            const fileUrls =
              await Promise.all(urlResponses.map(async (u, i) => {
                const result =
                  await s3Upload(fileMapper[i], u, this.fileUploadOptions);

                return result;
              }));

            fileUrls.map((url, i) => {
              variables[objectMapper[i]] = url.remoteUrl;
              return url;
            });

            this.$store.commit('closeModal');
            this.$store.commit('clearFilesUploadingStatus');
          }

          variables.courseId = this.$route.params.courseId;

          if (variables.subjects) {
            variables.subjects = variables.subjects.map(s => s.field);
          }

          const { data } = await mutationFunc(
            this,
            UPDATE_COURSE_INFO_MUTATION,
            variables,
            { throttle: 2000, debounce: 2000 },
          );

          if (data.errors) {
            this.standardErrors = data.errors;
          } else if (data.updateCourse.ok) {
            this.$toasted.success('Successfully updated', {
              singleton: true,
              duration: 3000,
            });
          }
        }
      } catch (errors) {
        this.requestErrors = errors;
        console.log(errors);
      }

      this.loading = false;
    },

    onChangeValue(property, value) { this.values[property] = value; },

    async onHideCourseToggle(isHide) {
      try {
        const { data } = await mutationFunc(
          this,
          UPDATE_COURSE_INFO_MUTATION,
          { courseId: this.courseId, active: !isHide },
          { throttle: 2000, debounce: 2000 },
        );

        const msg = isHide ? 'deactivated' : 'actiavted';

        if (data.updateCourse && data.updateCourse.ok) {
          this.$toasted.success(`Succesfully ${msg} course`, {
            duration: 2000,
            singleton: true,
          });
        }
      } catch (errors) {
        this.$toasted.error('Something went wrong', { duration: 2000 });
      }
    },

    onFileUploadProgress(progress, file, id) {
      this.$store.commit('setFileUploadingProgress', {
        filename: file.name,
        progress,
        id,
      });
    },

    async publishCourse() {
      this.isPublishing = true;

      try {
        const { data } = await mutationFunc(
          this,
          PUBLISH_COURSE_MUTATION,
          { courseId: this.courseId },
          { debounce: 2000, throttle: 2000 },
        );

        if (data.publishCourse) {
          if (data.publishCourse.ok) {
            this.coursePublished = true;
          } else if (data.publishCourse.errors) {
            console.log(data.publishCourse.errors);
          }
        }
      } catch (errors) {
        this.$toasted.error(
          'This course has not yet been approved to be published',
          { duration: 3000, singleton: true },
        );
        this.$toasted.info(
          'You will be inform via email if the course has approved',
          { duration: 6000, singleton: true },
        );
      }

      this.isPublishing = false;
    },
  },
};
</script>

<style scoped>
.course-info-edit-save-btn {
  width: 100px;
}
</style>

