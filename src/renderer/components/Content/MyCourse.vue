<template>
  <BaseGridContainer
    v-if="courses && courses.length"
    :gridGap=20
    :minItemWidth=200
    :maxItemWidth=300
    :numberOfItemPerRow=3
    className="my-course-page scroll-y"
  >
    <BaseCourseCard
      v-for="(course, index) in courses"
      :key="index"
      :courseTitle="course.title"
      :courseCreatedAt="course.insertedAt"
      :courseInstructorName="instructor.username"
      :courseIntroImageThumbUrl="transformUrl(course.introImageUrl)"
      :cardOnClick="() => goToPage('course-detail', { courseId: course.id })"
      :cardEditOnClick="() => goToPage('course-edit', { courseId: course.id })"
      isShowEditIcon
    />
  </BaseGridContainer>
</template>
<script>
import { BaseGridContainer, BaseCourseCard } from '@/components';
import transformS3Url from '@/utils/transformS3Url';

export default {
  name: 'MyCourse',

  components: { BaseGridContainer, BaseCourseCard },

  props: {
    courses: {
      validator(value) {
        if (value && !value.length) {
          return true;
        }

        let index = 0;

        for (; index < value.length; index += 1) {
          if (
            typeof value[index].title === 'string' &&
            typeof value[index].id === 'string' &&
            typeof value[index].insertedAt === 'string'
          ) {
            return true;
          }
        }

        return false;
      },
      default: null,
    },

    username: {
      type: String,
      default: '',
    },
  },

  computed: {
    instructor() {
      return { username: this.username };
    },
  },

  methods: {
    goToPage(name, params) {
      this.$router.push({ name, params });
    },

    transformUrl(url) {
      return transformS3Url(url);
    },
  },
};
</script>

<style scoped>
.my-course-page {padding: 5px;}
</style>
