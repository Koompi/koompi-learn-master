
<template>
  <div
    v-if="loading"
    class="flex justify-center align-center column-align max-height"
  >
    <MoveBlockLoader color="bg-gray1" />
    <p class="margin-vertical-10px">
      Please wait while we are getting you the course info
    </p>
  </div>

  <div
    v-else-if="!errors && course"
    class="scroll-y max-height"
    @scroll="onDivScroll"
  >
    <TitlePreview
      :title="course.title"
      :enrollCounts="course.enrollCounts"
      :insertedAt="course.insertedAt"
      :publishLabel="isCoursePublished"
    />
    <div class="flex justify-space-between course-detail">
      <div class="content">
        <Overview
          :title="course.title"
          :description="course.description"
        />
        <Preview
          class="margin-top-20"
          :introImageUrl="transformUrl(course.introImageUrl)"
          :introVideoUrl="transformUrl(course.introVideoUrl)"
        />
        <Instructor
          class="margin-top-20"
          :username="course.instructor.username"
          :instructorProfile="course.instructor"
        />
        <Syllabus
          class="margin-top-20"
          :isUserEnrollInThisCourse="isUserEnrollInThisCourse"
          :courseSections="sortCourseSectionOrder(course.courseSections)"
          :courseId="course.id"
        />
        <FAQs class="margin-top-20" />
        <Review class="margin-top-20" />

        <BaseGridContainer
          :minItemWidth=100
          :maxItemWidth=260
          :gridGap=20
          :numberOfItemPerRow=3
          className="course-detail-page-related-courses"
          isFillAutoWithGivenMaxMin
        >
          <BaseCourseCard
            v-if="course.coursesByTheInstructor &&
            course.coursesByTheInstructor.length"
            v-for="(c, index) in course.coursesByTheInstructor"
            :key="index"
            :courseTitle="c.title"
            :courseCreatedAt="c.insertedAt"
            :courseInstructorName="course.instructor.username"
            :courseIntroImageThumbUrl="transformUrl(c.introImageUrl)"
            :cardOnClick="() => goToPage('course-detail', { courseId: c.id })"
          />
        </BaseGridContainer>
      </div>

      <div class="sidebar relative">
        <RightSidebar
          :sidebar="sidebar"
          :price="course.price"
          :page="page"
          :courseId="course.id"
          :courseTitle="course.title"
          :isUseRouteLink=false
          :numberOfCourseChapter="numberOfCourseChapter"
          :numberOfCourseVideo="numberOfCourseVideo"
          :instructorName="course.instructor.username"
          :coursePrice="parseInt(course.price)"
          :isUserEnrollInThisCourse="isUserEnrollInThisCourse"
          className="course-detail-right-sidebar"
        />
      </div>
    </div>
  </div>

  <div
    v-else
    class="flex justify-center align-center column-align max-height"
  >
    <p v-if="errors">{{errors[0]}}</p>
    <p v-else>Something went wrong</p>
  </div>
</template>

<script>
/*
  eslint max-lines: [0], object-shorthand: [0]
*/
import {
  TitlePreview,
  Overview,
  RightSidebar,
  Preview,
  Instructor,
  Syllabus,
  FAQs,
  Review,
  AllCourseTitle,
  MoveBlockLoader,
  BaseGridContainer,
  BaseCourseCard,
} from '@/components';
import { COURSE_DETAIL_QUERY, IS_USER_ENROLL_QUERY } from '@/queries';
import transformS3Url from '@/utils/transformS3Url';

export default {
  name: 'CourseDetailPage',

  components: {
    TitlePreview,
    Overview,
    RightSidebar,
    Preview,
    Instructor,
    Syllabus,
    FAQs,
    Review,
    AllCourseTitle,
    MoveBlockLoader,
    BaseGridContainer,
    BaseCourseCard,
  },

  watch: {
    '$route.params.courseId'() {
      this.loading = true;
    },

    async course(course) {
      const { user } = this.$store.state;

      if (user.token && !user.isResetPassword) {
        await this.checkIsUserEnrollInThisCourse(course.id);
      }
    },

    async '$store.state.user'(user) {
      if (user.token && !user.isResetPassword && this.course.id) {
        await this.checkIsUserEnrollInThisCourse(this.course.id);
      } else {
        this.isUserEnrollInThisCourse = false;
      }
    },
  },

  data() {
    return {
      loading: true,
      errors: null,
      course: null,
      price: '250$',
      page: 'CourseDetail',
      numberOfCourseChapter: 0,
      numberOfCourseVideo: 0,
      isUserEnrollInThisCourse: false,
    };
  },

  computed: {
    sidebar() {
      return [
        {
          label: 'Overview',
          icon: 'iconclass far fa-file-alt',
          link: 'overview-section',
        },
        {
          label: 'Preview',
          icon: 'iconclass far fa-play-circle',
          link: 'preview-section',
        },
        {
          label: 'FAQs',
          icon: 'iconclass far fa-question-circle',
          link: 'faq-section',
        },
        {
          label: 'Instructor',
          icon: 'iconclass fas fa-user-circle',
          link: 'instructor-section',
        },
        {
          label: 'Review',
          icon: 'iconclass fas fa-star',
          link: 'review-section',
        },
      ];
    },

    isCoursePublished() {
      if (!this.course.isPublish) {
        return 'Not Published Yet';
      }

      return '';
    },
  },

  apollo: {
    course: {
      query: COURSE_DETAIL_QUERY,

      throttle: 1000,
      debounce: 2000,

      fetchPolicy: 'network-only',

      addTypename: false,

      variables() {
        return {
          courseId: this.$route.params.courseId,
        };
      },

      error(error) {
        this.errors = [error];
      },

      async result({ data, networkStatus }) {
        if (networkStatus === 8) {
          this.errors = ['Network unresolved'];
        } else if (data.course) {
          let length = 0;

          this.numberOfCourseChapter = data.course.courseSections.length;
          data.course.courseSections.map((cs) => {
            cs.courseSectionVideos.map((csv) => {
              length += 1;

              return csv;
            });

            return cs;
          });

          this.numberOfCourseVideo = length;
        }

        this.loading = false;
      },
    },
  },

  methods: {
    sortCourseSectionOrder(courseSections) {
      return [...courseSections].sort((a, b) => {
        if (a.orderAs < b.orderAs) {
          return -1;
        } else if (a.orderAs > b.orderAs) {
          return 1;
        }
        return 0;
      });
    },

    goToPage(name, params) {
      this.$router.push({ name, params });
    },

    async checkIsUserEnrollInThisCourse(courseId) {
      const { data } = await this.$apollo.query({
        query: IS_USER_ENROLL_QUERY,
        throttle: 2000,
        debounce: 2000,
        fetchPolicy: 'network-only',
        variables: { courseId },
      });

      console.log(data);

      if (data.isUserEnroll) {
        this.isUserEnrollInThisCourse = data.isUserEnroll;
      }
    },

    transformUrl(url) { return transformS3Url(url); },

    onDivScroll({ target: { scrollTop } }) {
      const el =
        document.getElementsByClassName('course-detail-right-sidebar')[0];

      if (scrollTop > 200) {
        if (el) {
          el.style.transform = `translateY(${scrollTop - 200}px)`;
        }
      } else if (el) {
        el.style.transform = 'translateY(0px)';
      }
    },
  },
};
</script>
<style scoped>
.course-detail {
  padding: 20px;
}
.content {
  padding-right: 15px;
  max-width: 1060px;
  width: 75%;
}
.margin-top-20 {
  margin-top: 20px;
}
.sidebar{
  max-width: 342px;
  width: 25%;
}
.course-detail-page-related-courses {height: auto !important;}
</style>
