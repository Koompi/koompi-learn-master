<template>
  <div
    v-if="loading || requestErrors || standardErrors"
    class="flex justify-center align-center max-width max-height"
  >
    <div
      v-if="loading"
      class="flex column-align justify-center align-center"
    >
      <MoveBlockLoader />
      <p class="margin-vertical-10px">Loading course detail</p>
    </div>

    <GraphQLErrorParser
      v-else
      :standardErrors="standardErrors"
      :requestErrors="requestErrors"
    />
  </div>

  <div
    v-else
    class="course-edit scroll-y"
    :style="{ height: `calc(100% - ${topbarHeight}px + 20px)` }"
  >
    <CourseInfoEdit
      :courseTitle="course.title"
      :coursePrice="parseInt(course.price)"
      :courseDescription="course.description"
      :courseSubjects="course.subjects"
      :courseIntroImageUrl="course.introImageUrl"
      :courseIntroVideoUrl="course.introVideoUrl"
      :isCourseActive="course.active"
      :isCoursePublished="course.isPublish"
      :courseId="course.id"
    />

    <div class="course-edit-sections">
      <div
        class="course-edit-section-title flex bg-white align-center"
        v-for="(cs, index) in course.courseSections"
        :class="index % 2 ? 'margin-vertical-10px' : ''"
        :key="index"
      >
        <router-link
          tag="a"
          class="max-width course-edit-section-title-text text-gray1"
          :to="{ name: 'course-section-edit', params: { courseSection: cs } }"
        >
          {{ cs.title }}
        </router-link>

        <i
          class="fas fa-times cursor-pointer text-gray1"
          @click="() => openRemoveCourseSectionDialog(cs.id, cs.title)"
        />
        <i
          class="fas fa-edit cursor-pointer text-gray1"
          @click="() =>
            goToPage('course-section-edit', {
              courseSection: cs,
            })"
        />
      </div>
    </div>

    <BaseButton
      label="+ Course Section"
      bgColor="bg-blue"
      textColor="text-white"
      className="float-right course-edit-add-course-section-button"
      :loading="isAddingCourseSection"
      :isDisabled="isAddingCourseSection"
      :onClick="goToAddCourseSectionPage"
    />
  </div>
</template>

<script>
import { MoveBlockLoader, GraphQLErrorParser, BaseButton } from '@/components';
import appLayout from '@/utils/appLayout';
import { COURSE_DETAIL_QUERY } from '@/queries';
import CourseInfoEdit from './CourseInfoEdit.vue';

export default {
  name: 'CourseEdit',

  components: {
    MoveBlockLoader,
    CourseInfoEdit,
    GraphQLErrorParser,
    BaseButton,
  },

  data() {
    return {
      course: {},

      loading: true,
      isAddingCourseSection: false,

      requestErrors: null,
      standardErrors: null,
    };
  },

  apollo: {
    course: {
      query: COURSE_DETAIL_QUERY,

      variables() { return { courseId: this.$route.params.courseId }; },

      fetchPolicy: 'network-only',

      throttle: 1000,
      debounce: 2000,

      result({ data, networkStatus, loading }) {
        if (networkStatus === 8) {
          this.standardErrors = [{
            key: 'Network',
            message: 'Unresolved',
          }];
        } else if (data.errors) {
          this.standardErrors = data.errors;
        }

        this.loading = loading;
      },
    },
  },

  computed: {
    ...appLayout,
  },

  methods: {
    openRemoveCourseSectionDialog(courseSectionId, courseSectionTitle) {
      this.$store.commit('openModal', {
        contentComponent: 'BaseModalConfirmDialog',
        contentProps: {
          confirmMessage:
            `Are you sure this course section("${
              courseSectionTitle
            }") will be deleted?`,
          onConfirm: () => this.onConfirmRemoveCourseSection(courseSectionId),
        },
        closeOnOutsideClick: true,
      });
    },

    onConfirmRemoveCourseSection(courseSectionId) {
      console.log(courseSectionId);
    },

    goToPage(name, params) {
      this.$router.push({ name, params });
    },

    goToAddCourseSectionPage() {
      this.goToPage('new-course-section', {
        courseId: this.$route.params.courseId,
      });
    },
  },
};
</script>


<style scoped>
.course-edit {padding: 20px;}
.course-edit-section-title {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
.course-edit-section-title .fas {min-width: 20px;}
.course-edit-section-title-text {
  border-right: 1px solid #ccc; margin-right: 16px;
  text-decoration: none;
}
.course-edit-add-course-section-button {margin-top: 10px;}
</style>
