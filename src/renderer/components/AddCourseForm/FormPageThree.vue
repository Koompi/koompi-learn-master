<template>
  <BaseRecursiveFormReview
    :data="courseFormTransformed"
    headerTitle="New Course Review"
    className="new-course-form-page-three margin-horizontal-auto"
  />
</template>

<script>
import readFile from '@/readFile';
import { BaseRecursiveFormReview } from '@/components';

export default {
  name: 'FormPageThree',

  components: { BaseRecursiveFormReview },

  data() {
    const { getters } = this.$store;

    return { newCourseForm: { ...getters.newCourseForm } };
  },

  computed: {
    courseFormTransformed() {
      const {
        courseSections,
        subjects,
        introImageFile,
        introVideoFile,
        standardErrors,
        requestErrors,
        ...rest
      } = this.newCourseForm;

      function transformCustomPayload(file, tagToRender) {
        if (file && file.length) {
          return {
            customValue: file[1],
            isRenderCustomTag: true,
            tagToRender,
          };
        }
        return 'Course Section Video not uploaded';
      }

      const courseSectionsModified =
        [...courseSections].reduce((acc, elem, index) => {
          acc[index] = {
            renderAsFlattenList: true,
            headerTitle: elem.title || `Course Section Title ${index}`,
            data: {
              description: elem.description || 'Course description havent set',
              list: elem.courseSectionVideos.map(elem => ({
                title: elem.title,
                orderAs: elem.orderAs,
                'Course Section Video':
                  transformCustomPayload(elem.videoFile, 'video'),
              })),
            },
          };

          return acc;
        }, new Array(courseSections.length));

      const val = {};

      if (introImageFile) {
        val['Course Intro Video Thumbnail'] =
          transformCustomPayload(introImageFile, 'img');
      }

      if (introVideoFile) {
        val['Course Intro Video'] =
          transformCustomPayload(introVideoFile, 'video');
      }

      if (subjects && subjects.length) {
        val.subjects = {
          isRenderAsList: true,
          propertyOfValueForRenderAsList: 'field',
          renderAsListPropertyLabel: 'Course Related Subjects',
          list: subjects,
        };
      }

      return {
        ...rest,
        ...val,

        courseSectionsModified,
      };
    },
  },

  methods: {
    async readVideoFile(videoFile) {
      const url = await readFile('video', videoFile);

      return url;
    },
  },
};
</script>

<style scoped>
.new-course-form-page-three {max-width: 95%;}
</style>
