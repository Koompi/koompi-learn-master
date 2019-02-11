
<template>
  <div
    id="entry-layout"
    class="grid scroll-y"
  >
    <div
      class="banner relative flex align-center justify-center column-align"
      :style="{ 'background-image': `url(${bannerCover})` }"
    >
      <h1 class="title">COSMOS CENTER</h1>
      <h2 class="margin-vertical-10px sub-title">
        Learn anywhere, anytime with Koompi
      </h2>
      <BaseSearchInput
        placeholder="Find your favorite courses..."
        :onEnterHandler="goToSearchPage"
      />
      <div class="header-image absolute max-width max-height"/>
    </div>

    <TabGroup :tabs="subjects"/>

    <div
      v-if="loading || errors"
      class="flex max-width max-height
      justify-center align-center column-align"
    >
      <div
        class="flex align-center column-align"
        v-if="loading"
      >
        <MoveBlockLoader color="bg-gray1"/>
        <p class="margin-vertical-10px">
          Getting all the best courses for you
        </p>
      </div>

      <p v-else-if="errors">{{ errors[0] }}</p>
    </div>

    <BaseGridContainer
      v-else-if="!errors"
      className="entry-layout-content"
      :gridGap=20
      :minItemWidth=100
      :maxItemWidth=300
      :numberOfItemPerRow=4
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
import transformS3Url from '@/utils/transformS3Url';
import {
  BaseSearchInput,
  TabGroup,
  BaseGridContainer,
  BaseCourseCard,
  MoveBlockLoader,
} from '@/components';
import { COURSES_QUERY } from '@/queries';
import staticImages from '@/utils/staticImages';

export default {
  name: 'EntryLayout',

  components: {
    BaseSearchInput,
    TabGroup,
    MoveBlockLoader,
    BaseGridContainer,
    BaseCourseCard,
  },

  data() {
    return {
      courses: [],

      loading: true,

      errors: null,
    };
  },

  computed: {
    subjects() {
      const { value: subjects } = this.$store.state.subjects;

      if (subjects && subjects.length) {
        let index = 0;
        const length = 5;

        const filtered = new Array(length);

        for (; index < length; index += 1) {
          filtered[index] = {
            label: subjects[index].field,
            value: subjects[index].field,
            onClick: this.filterBySubject,
          };
        }


        return filtered;
      }

      return null;
    },

    ...staticImages,
  },

  methods: {
    goToSearchPage(courseTitle) {
      this.goToPage('search', { courseTitle });
    },

    goToPage(name, params) {
      this.$router.push({ name, params });
    },

    filterBySubject(courseSubject) {
      this.$router.push({
        name: 'search',
        params: { courseSubject },
      });
    },

    transformUrl(url) {
      return transformS3Url(url);
    },
  },

  apollo: {
    courses: {
      query: COURSES_QUERY,

      throttle: 1000,
      debounce: 2000,

      variables() {
        return {
          limit: 12,
          isMostView: true,
        };
      },

      loadingKey: 'loading',

      error(error) {
        this.errors = [error];
      },

      result({ loading, networkStatus }) {
        this.loading = loading;

        if (networkStatus === 8) {
          this.errors = ['Network unresolved'];
        }
      },
    },
  },
};
</script>

<style scoped>
#entry-layout {
  grid-template-columns: 1fr;
  grid-template-rows: minmax(100px, 350px) 80px 1fr;
  background: #eee;
  min-height: 100%;
}

.banner { background-size: cover; }
.header-image{
  background: linear-gradient(to right,
  rgba(0,0,0,.6) 60%,
  rgba(0,0,0,.4) 80%,
  rgba(0,0,0,.2) 100%);
}
.title {
  font-size: 42px;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 10px;
  z-index: 1;
}
.sub-title {
  font-size: 24px;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 30px;
  z-index: 1;
}
.entry-layout-content {padding: 0px 10px 20px 10px;}
</style>
