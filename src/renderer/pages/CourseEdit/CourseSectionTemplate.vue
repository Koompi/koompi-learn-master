<template>
  <div
    class="course-section-template scroll-y max-height size-calc-spacing-include"
  >
    <h4 class="margin-vertical-10px">
      {{ courseSection ? 'Edit Course Section' : 'Add Course Section' }}
    </h4>

    <BaseRecursiveComponent
      v-for="(cs, index) in transformDataToRenderRecursively(courseSections)"
      className="size-calc-spacing-include course-section-template-content"
      :key="index"
      :data="cs"
      :customComponent="baseLabelInput"
    />

    <div class="flex justify-end align-center max-width">
      <BaseButton
        label="+ Course Section Video"
        bgColor="bg-blue"
        textColor="text-white"
        :onClick="addCourseSectionVideo"
      />

      <BaseButton
        isDebounce
        label="Save"
        bgColor="bg-blue"
        textColor="text-white"
        className="margin-horizontal-10px"
        :loading="loading"
        :isDisabled="loading"
        :onClick="saveCourseSection"
      />
    </div>
  </div>
</template>

<script>
/*
  eslint dot-notation: [0], no-unexpected-multiline: [0], max-lines: 0, indent: 0, max-len: 0
*/
import shortid from 'shortid';
import _ from 'lodash';
import {
  BaseRecursiveComponent,
  BaseLabelInput,
  BaseButton,
} from '@/components';
import transformS3Url from '@/utils/transformS3Url';

export default {
  name: 'CourseSectionTemplate',

  components: { BaseRecursiveComponent, BaseButton },

  props: {
    courseSection: {
      type: Object,
      default: null,
    },

    isEditExisting: {
      type: Boolean,
      default: false,
    },

    onSaveCourseSection: {
      type: Function,
      default: () => {},
    },

    onCourseSectionVideoRemove: {
      type: Function,
      default: () => {},
    },

    standardErrors: {
      type: Array,
      default: null,
    },

    requestErrors: {
      type: Error,
      default: null,
    },
  },

  data() {
    return {
      courseSections: [this.processCourseSectionProps(this.courseSection)],
      courseSectionData: [this.processCourseSectionProps(this.courseSection)],
      loading: false,
    };
  },

  methods: {
    processCourseSectionProps(courseSection) {
      if (courseSection) {
        const courseSectionVideos =
          (_.result(courseSection, 'courseSectionVideos')).map((csv) => {
            const newCsv =
              _.pick(
                csv, ['url', 'title', 'description', 'orderAs']);

            newCsv.id = csv.id;
            newCsv.videoFile = [null, newCsv.url];
            delete newCsv.url;

            return newCsv;
          });

        const { title, description, orderAs } = courseSection;

        return {
          title,
          description,
          orderAs,
          courseSectionVideos,
        };
      }

      return this.courseSectionInitialState();
    },

    addCourseSection() {
      this.standardErrors = null;
      this.requestErrors = null;
      this.courseSections = _.cloneDeep(this.courseSectionData);
      this.courseSections.push(this.courseSectionInitialState());
      this.courseSectionData.push(this.courseSectionInitialState());
    },

    removeCourseSection(courseSectionIndex) {
      this.courseSections.splice(courseSectionIndex, 1);
      this.courseSectionData.splice(courseSectionIndex, 1);
    },

    addCourseSectionVideo(courseSectionIndex = 0) {
      this.standardErrors = null;
      this.requestErrors = null;
      this.courseSections = _.cloneDeep(this.courseSectionData);
      this.courseSections[courseSectionIndex].courseSectionVideos.push(
        this.courseSectionVideoInitialState(
          this.courseSections[courseSectionIndex].courseSectionVideos.length,
        ),
      );
      this.courseSectionData[courseSectionIndex].courseSectionVideos.push(
        this.courseSectionVideoInitialState(
          this.courseSections[courseSectionIndex].courseSectionVideos.length,
        ),
      );
    },

    removeCourseSectionVideo(courseSectionIndex, courseSectionVideoIndex) {
      this.onCourseSectionVideoRemove(
        this
          .courseSections[courseSectionIndex]
          .courseSectionVideos[courseSectionVideoIndex],
      );
      this.courseSections[courseSectionIndex].courseSectionVideos.splice(
        courseSectionVideoIndex,
        1,
      );
      this.courseSectionData[courseSectionIndex].courseSectionVideos.splice(
        courseSectionVideoIndex,
        1,
      );
    },

    courseSectionInitialState() {
      return {
        title: '',
        orderAs: this.courseSections ? this.courseSections.length : 0,
        description: '',
        courseSectionVideos: [this.courseSectionVideoInitialState()],
      };
    },

    courseSectionVideoInitialState(orderAs = 0) {
      return {
        id: shortid.generate(),
        title: '',
        orderAs,
        description: '',
        videoFile: null,
      };
    },

    transformDataToRenderRecursively(courseSections) {
      const data = new Array(courseSections.length);
      let keys = null;

      courseSections.map((cs, index) => {
        keys = Object.keys(cs);

        data[index] = { objectList: new Array(keys.length - 1) };

        keys.map((k, i) => {
          if (k !== 'courseSectionVideos') {
            data[index].objectList[i] = this.constructUniqueLabelInputProps(
              k,
              { index, prefix: `course-section-${k}` },
              {
                label: `Course Section ${this.capitalizeString(k)}`,
                value: this.courseSections[index][k],
                type: this.parseTypeFromKey(k),
                onChange: value => this.valueOnChange(value, index, k),
              },
            );

            if (this.standardErrors && this.standardErrors.length) {
              this.standardErrors.map((error) => {
                if (error.key === k) {
                  data[index].objectList[i].validationErrorMessage =
                    error.message;

                  document
                    .getElementsByClassName('course-section-template')[0]
                    .scrollTop = 0;
                }

                return error;
              });
            }
          }

          return k;
        });

        if (cs.courseSectionVideos.length) {
          data[index].recursive = {
            dataArray: new Array(cs.courseSectionVideos.length),
            className: 'course-section-template-video size-calc-spacing-include',
          };

          cs.courseSectionVideos.map((csv, i) => {
            const { id, ...rest } = csv;
            let hasError = false;

            keys = Object.keys(rest);
            data[index].recursive.dataArray[i] = {
              objectList: new Array(keys.length + 1),
            };

            if (this.standardErrors && this.standardErrors.length) {
              hasError = true;
            }

            keys.map((k, idx) => {
              const type = this.parseTypeFromKey(k);
              const props = {
                label: `Course Section Video ${this.capitalizeString(k)}`,
                type,
                validationErrorMessage:
                  hasError &&
                  !csv[k] &&
                  k !== 'orderAs' ?
                    'Can\'t be blank' : '',
                value:
                  k !== 'videoFile' ? csv[k] : '',
                onChange: value => this.valueOnChange(value, i, k, index),
              };

              if (k === 'videoFile' && csv[k]) {
                props.url = transformS3Url(csv[k][1]);
              }

              data[index].recursive.dataArray[i].objectList[idx] =
                this.constructUniqueLabelInputProps(
                  k,
                  { index: i, prefix: `course-section-video-${k}-${index}` },
                  props,
                );

              return k;
            });

            data[index]
              .recursive.dataArray[i]
              .objectList[keys.length]
              = {
                customComponent: BaseButton,
                className: 'margin-vertical-10px',
                label: 'Remove Course Section Video',
                bgColor: 'bg-gray2',
                textColor: 'text-white',
                onClick: () => this.removeCourseSectionVideo(index, i),
              };

            return csv;
          });
        }

        return cs;
      });

      return data;
    },

    valueOnChange(value, index, property, parentIndex) {
      if (!parentIndex && isNaN(parentIndex)) {
        this.courseSectionData[index][property] = value;
      } else {
        this.courseSectionData
          [parentIndex]
          ['courseSectionVideos']
          [index]
          [property] = value;
      }
    },

    parseTypeFromKey(key) {
      switch (key) {
        case 'videoFile': return 'video';
        case 'orderAs': return 'number';
        case 'description': return 'textarea';
        default: return 'text';
      }
    },

    constructUniqueLabelInputProps(key, uniqueIdentifiers, props) {
      const { index, prefix } = uniqueIdentifiers;

      return {
        label: this.capitalizeString(key),
        name: `${prefix}-${index}`,
        ...props,
      };
    },

    capitalizeString(str) {
      return str.charAt(0).toUpperCase() + str.substr(1);
    },

    async saveCourseSection() {
      this.loading = true;

      this.onSaveCourseSection(this.courseSectionData[0]);

      this.courseSections = _.cloneDeep(this.courseSectionData);

      this.loading = false;
    },
  },

  computed: {
    baseLabelInput() {
      return BaseLabelInput;
    },
  },
};
</script>

<style>
.course-section-template-video,
.course-section-template-content,
.course-section-template {padding: 10px;}
.course-section-template-video {border: 1px solid #ccc; margin-top: 10px;}
.course-section-template-content {margin-bottom: 10px;}
</style>
