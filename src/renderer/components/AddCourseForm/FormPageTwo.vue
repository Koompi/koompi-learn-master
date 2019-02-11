<template>
  <div
    class="margin-horizontal-auto max-width
    add-course-form-course-section-wrapper"
  >
    <div
      class="add-course-form-course-section relative
      bg-white max-width size-calc-spacing-include"
      v-for="(courseSection, index) in courseSections"
      :key="index"
    >
      <i
        class="fas fa-times absolute cursor-pointer"
        @click="() => removeCourseSection(index)"
      />

      <BaseLabelInput
        v-for="(csField, i) in courseSectionFields(index)"
        :key="i"
        :name="`course-section-${csField.name}-${index}`"
        :value="courseSection[csField.name]"
        :type="csField.type"
        :label="csField.label"
        :placeholder="csField.placeholder"
        :isRequired="csField.isRequired"
        :validationErrorMessage="csField.validationErrorMessage"
        :onChange="
          value => newCourseSectionOnChange(index, csField.name, value)"
      />

      <div class="course-section-videos">
        <div
          class="course-section-video relative"
          v-for="
            (courseSectionVideo, i) in courseSection.courseSectionVideos"
          :key="i"
        >
          <i
            class="fas fa-times absolute cursor-pointer"
            @click="() => removeCourseSectionVideo(index, i)"
          />

          <BaseLabelInput
            v-for="(csvField, idx) in courseSectionVideoFields(index, i)"
            :key="idx"
            :name="`course-section-video-${index}-${csvField.type}-${i}`"
            :value="courseSectionVideo[csvField.name]"
            :type="csvField.type"
            :label="csvField.label"
            :placeholder="csvField.placeholder"
            :isRequired="csvField.isRequired"
            :validationErrorMessage="csvField.validationErrorMessage"
            :onChange="
              value =>
                newCourseSectionVideoOnChange(index, i, csvField.name, value)"
          />

          <BaseLabelInput
            type="video"
            label="Course Section Video"
            :contentProps="{
              label: 'Drag and drop video here or click to select',
            }"
            :url="getCourseSectionVideoValue(courseSectionVideo.videoFile)"
            :name="`course-section-${index}-video-file-${i}`"
            :onChange="
              value =>
                newCourseSectionVideoOnChange(index, i, 'videoFile', value)"
          />
        </div>

        <BaseButtonGroup
          :buttons="addNewCourseSectionVideoButton(index)"
          className="margin-vertical-10px"
        />
      </div>
    </div>

    <BaseButtonGroup
      :buttons="addNewCourseSectionButton"
      className="margin-vertical-10px"
    />
  </div>
</template>

<script>
/*
  eslint max-lines: [0], dot-notation: [0]
*/
import { BaseLabelInput, BaseButtonGroup } from '@/components';

export default {
  name: 'FormPageTwo',

  components: { BaseLabelInput, BaseButtonGroup },

  data() {
    const { getters } = this.$store;

    return {
      courseSections: getters.newCourseSections,
    };
  },

  computed: {
    addNewCourseSectionButton() {
      return [{
        label: '+ Course Section',
        bgColor: 'bg-blue',
        textColor: 'text-white',
        fontSize: 15,
        onClick: this.addNewCourseSection,
      }];
    },
  },

  methods: {
    getCourseSectionVideoValue(videoFile) {
      if (videoFile && videoFile.length) {
        return videoFile[1];
      }

      return '';
    },

    removeCourseSection(index) {
      this.$store.commit('removeCourseSection', index);
    },

    removeCourseSectionVideo(courseSectionKey, courseSectionVideoIndex) {
      this.$store.commit(
        'removeCourseSectionVideo',
        [courseSectionKey, courseSectionVideoIndex],
      );
    },

    addNewCourseSectionVideoButton(courseSectionId) {
      return [{
        label: '+ Video',
        bgColor: 'bg-gray2',
        textColor: 'text-white',
        fontSize: 13,
        onClick: () => this.addNewCourseSectionVideo(courseSectionId),
      }];
    },

    addNewCourseSection() { this.$store.commit('addCourseSection'); },

    addNewCourseSectionVideo(courseSectionId) {
      this.$store.commit('addCourseSectionVideo', courseSectionId);
    },

    newCourseSectionOnChange(index, fieldToUpdate, title) {
      this.$store.commit('updateCourseSection', [index, fieldToUpdate, title]);
    },

    newCourseSectionVideoOnChange(
      courseSectionKey,
      courseSectionVideoIndex,
      fieldToUpdate,
      value,
    ) {
      this.$store.commit(
        'updateCourseSectionVideo',
        [
          courseSectionKey,
          courseSectionVideoIndex,
          fieldToUpdate,
          value,
        ],
      );
    },

    parseJsonError(error) {
      try {
        const errors = JSON.parse(error);

        return errors;
      } catch (e) {
        return false;
      }
    },

    courseSectionFields(index) {
      const {
        newCourse: { standardErrors, courseSections },
      } = this.$store.state;

      const errors = {};

      if (standardErrors && standardErrors.length) {
        if (!courseSections[index].title) {
          errors.title = 'Title is required';
        }

        if (!courseSections[index].description) {
          errors.description = 'Description is required';
        }
      }

      return [{
        type: 'text',
        label: 'Course Section Title',
        name: 'title',
        placeholder: 'Eg: Chapter 1: Ansible - Prologue',
        validationErrorMessage: errors.title ? errors.title : '',
        isRequired: true,
      }, {
        type: 'textarea',
        label: 'Course Section Description',
        name: 'description',
        validationErrorMessage: errors.description ? errors.description : '',
        placeholder: 'Eg: Ansible, the best configuration management tool...',
        isRequired: true,
      }, {
        type: 'number',
        label: 'Course Section Order Numbering',
        name: 'orderAs',
      }];
    },

    courseSectionVideoFields(parentKey, index) {
      const {
        newCourse: { standardErrors, courseSections },
      } = this.$store.state;

      const errors = {};

      if (standardErrors && standardErrors.length) {
        if (!courseSections[parentKey].courseSectionVideos[index].title) {
          errors.title = 'Title is required';
        }
      }

      return [{
        type: 'text',
        label: 'Course Section Video Title',
        name: 'title',
        validationErrorMessage: errors.title ? errors.title : '',
        placeholder: 'Eg: Intro to the world of IT automation',
        isRequired: true,
      }, {
        type: 'number',
        label: 'Course Section Video Ordering',
        name: 'orderAs',
      }];
    },
  },
};
</script>

<style lang="scss" scoped>
$padding-amount: 10;
$input-label-title-margin: 10;

.add-course-form-course-section .fa-times {
  font-size: 20px;
  right: #{$padding-amount + 2}px;
  top: #{$padding-amount + $input-label-title-margin}px;
}
.add-course-form-course-section-wrapper {max-width: 95%;}
.add-course-form-course-section {
  padding: #{$padding-amount}px;
  border-radius: 6px;
  margin-bottom: 10px;
}
.add-course-form-course-section .course-section-video {
  padding: #{$padding-amount}px;
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>
