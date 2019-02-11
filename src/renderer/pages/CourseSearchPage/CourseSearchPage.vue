<template>
  <div class="category-page max-height size-calc-spacing-include">
    <div class="flex justify-space-between">
      <span class="text-gray1 course-founded">
        {{ courses ? courses.length : 0 }} courses found
      </span>
      <div class="course-nav">
        <CourseNavigation
          v-for="navigation in navigates"
          :key="navigation.label"
          :label="navigation.label"
          :subLabels="navigation.subLabels"
        />
      </div>
    </div>

    <div
      v-if="loading"
      class="flex justify-center align-center column-align max-height"
    >
      <MoveBlockLoader color="bg-gray1" />
      <p class="margin-vertical-10px">
        Please wait while we are fetching those course you searches
      </p>
    </div>

    <h3 v-else-if="errors" >
      {{ errors[0] }}
    </h3>

    <BaseGridContainer
      v-else-if="courses && courses.length"
      :gridGrap=20
      :minItemWidth=100
      :maxItemWidth=300
      :numberOfItemPerRow=3
      isFillAutoWithGivenMaxMin
      className="scroll-y course-search-page-container"
    >
      <BaseCourseCard
        v-for="(course, index) in courses"
        :key="index"
        :courseIntroImageThumbUrl="transformUrl(course.introImageUrl)"
        :courseInstructorName="course.instructorName"
        :courseCreatedAt="course.insertedAt"
        :courseTitle="course.title"
        :cardOnClick="() => goToPage('course-detail', { courseId: course.id })"
      />
    </BaseGridContainer>
  </div>
</template>
<script>
/*
  eslint object-shorthand: [0]
*/
import transformS3Url from '@/utils/transformS3Url';
import { COURSES_QUERY } from '@/queries';
import {
  CourseNavigation,
  MoveBlockLoader,
  BaseCourseCard,
  BaseGridContainer,
} from '@/components';

export default {
  name: 'CourseSearchPage',

  components: {
    CourseNavigation,
    MoveBlockLoader,
    BaseGridContainer,
    BaseCourseCard,
  },

  data() {
    return {
      loading: true,

      errors: null,

      courses: [],
    };
  },

  watch: {
    '$route.params'() {
      this.loading = true;
    },
  },

  apollo: {
    courses: {
      query: COURSES_QUERY,

      fetchPolicy: 'network-only',
      throttle: 1000,
      debounce: 3000,

      variables() {
        const vars = {};
        const { courseTitle, courseSubject } = this.$route.params;

        if (courseSubject) { vars.subjects = [courseSubject]; }

        vars.title = courseTitle;

        return vars;
      },

      loadingKey: 'loading',

      error(error) {
        this.errors = [error];
      },

      result({ loading, networkStatus }) {
        if (networkStatus === 8) {
          this.errors = ['Network unresolved'];
        }

        this.loading = loading;
      },
    },
  },

  computed: {
    navigates() {
      return [
        {
          label: 'Level',
          subLabels: [
            {
              name: 'Level 1',
              link: '/',
            },
            {
              name: 'Level 2',
              link: '/',
            },
          ],
        },
        {
          label: 'Languages',
          subLabels: [
            {
              name: 'Khmer',
              link: '/',
            },
            {
              name: 'English',
              link: '/',
            },
          ],
        },
        {
          label: 'Sort',
          subLabels: [
            {
              name: 'Newest',
              link: '/',
            },
            {
              name: 'Most viewed',
              link: '/',
            },
            {
              name: 'Most rated',
              link: '/',
            },
            {
              name: 'Hightest price',
              link: '/',
            },
            {
              name: 'Lowest price',
              link: '/',
            },
          ],
        },
      ];
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

.category-page {
  padding: 10px 20px;
}

.text-gray1 {
  margin-left: 10px;
}

.course-nav{
  margin-bottom: 5px;
}

.course-founded {
  padding-top: 8px;
  font-size: 20px;
}

.course-search-page-container {
  height: calc(100% - 30px) !important;
  padding-bottom: 20px;
}
</style>
