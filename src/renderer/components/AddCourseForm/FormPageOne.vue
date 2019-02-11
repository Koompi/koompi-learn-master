<template>
  <BaseForm
    isVerticalStyling
    isNoSubmitOnEnter
    isShowErrorOnInput
    className="max-width add-course-form-page-one"
    submitButtonLabel="Save Course"
    :isShowSubmitButton=false
    :isShowTitleLineBreak="false"
    :formFields="formFields"
    :requestErrors="requestErrors"
    :standardErrors="standardErrors"
  />
</template>

<script>
import addErrorToSchemaFields from '@/utils/addErrorToSchemaFields';
import { BaseForm } from '@/components';

export default {
  name: 'FormPageOne',

  components: { BaseForm },

  data() {
    return {
      standardErrors: null,

      requestErrors: null,

      subjects: null,
    };
  },

  methods: {
    copyString(str) { return str ? str.slice(0) : str; },
  },

  computed: {
    formFields() {
      const { state: { subjects }, commit, getters } = this.$store;

      const url = {};

      if (
        getters.newCourseIntroImageFile &&
        getters.newCourseIntroImageFile.length
      ) {
        url.imageFile = getters.newCourseIntroImageFile[1];
      }

      if (
        getters.newCourseIntroVideoFile &&
        getters.newCourseIntroVideoFile.length
      ) {
        url.videoFile = getters.newCourseIntroVideoFile[1];
      }

      const formFields = [{
        label: 'Course Title',
        name: 'title',
        type: 'text',
        isRequired: true,
        value: this.copyString(getters.newCourseTitle),
        onChange: title => commit('setCourseTitle', title),
      }, {
        label: 'Course Description',
        name: 'description',
        type: 'textarea',
        isRequired: true,
        value: this.copyString(getters.newCourseDescription),
        onChange: desc => commit('setCourseDescription', desc),
      }, {
        label: 'Course Price',
        name: 'price',
        type: 'number',
        value: 0,
      }, {
        label: 'Course Related Subject',
        name: 'subjects',
        type: 'tag',
        isRequired: true,
        values: [...getters.newCourseRelatedSubjects],
        options: subjects.value,
        contentProps: {
          labelProperty: 'field',
        },
        uniqueId: 'newCourseRelatedSubject',
        isOptional: true,
        onChange: subjects => commit('setCourseRelatedSubject', subjects),
      }, {
        label: 'Course Intro Video Thumbnail',
        name: 'courseIntroVideoThumbnail',
        type: 'image',
        url: url.imageFile,
        isOptional: true,
        contentProps: {
          label: 'Drag and drop image here or click to select them',
        },
        onChange: imageFile => commit('setCourseIntroImageFile', imageFile),
        uniqueId: 'newCourseVideoThumbnail',
      }, {
        label: 'Course Intro Video',
        name: 'courseIntroVideo',
        type: 'video',
        url: url.videoFile,
        isOptional: true,
        contentProps: {
          label: 'Drag and drop video here or click to select them',
        },
        onChange: videoFile => commit('setCourseIntroVideoFile', videoFile),
        uniqueId: 'newCourseIntroVideo',
      }];

      const possibleErrors =
        getters.newCourseFormValidationErrors;

      possibleErrors.map((errors) => {
        if (errors) {
          addErrorToSchemaFields(formFields, errors);
        }

        return errors;
      });

      return formFields;
    },
  },
};
</script>

<style scoped>
.add-course-form-page-one {max-width: 95%}
</style>
