
<template>
  <div
    v-if="loading"
    class="flex max-width max-height justify-center align-center column-align"
  >
    <MoveBlockLoader bgColor="bg-gray1"/>
    <p class="margin-vertical-10px">
      Loading the course content
    </p>
  </div>

  <div
    v-else-if="standardErrors || requestErrors"
    class="flex max-width max-height justify-center align-center column-align"
  >
    <GraphQLErrorParser
      :standardErrors="standardErrors"
      :requestErrors="requestErrors"
    />

    <BaseButton
      label="Go Back"
      bgColor="bg-red"
      textColor="text-white"
      :onClick="() => $router.back()"
    />
  </div>

  <div
    v-else
    id="course-video-layout"
    :style="{ 'grid-template-columns': `${sidebarWidth}px 1fr` }"
    class="grid max-height justify-center relative"
  >
    <TheSidebar
      activeControlledByProps
      :headerTitle="courseViewProps.courseTitle"
      :tabs="courseSections"
    />

    <div class="scroll-y video-dialog">
      <router-view
        v-bind="courseViewProps"
      />
    </div>
  </div>
</template>

<script>
/*
  eslint object-shorthand: [0], max-lines: [0]
*/
import _ from 'lodash';
import appLayout from '@/utils/appLayout';
import {
  TheSidebar,
  MoveBlockLoader,
  GraphQLErrorParser,
  BaseButton,
} from '@/components';
import { COURSE_SECTIONS_QUERY } from '@/queries';
import arrayObjectSort from '@/utils/arrayObjectSort';

export default {
  name: 'CourseViewLayout',

  components: { TheSidebar, MoveBlockLoader, GraphQLErrorParser, BaseButton },

  mounted() {
    window.addEventListener('keydown', this.keyDownListener, {
      passive: true,
    });
  },

  beforeDestroy() {
    window.removeEventListener('keydown', this.keyDownListener, {
      passive: true,
    });
  },

  data() {
    return {
      courseSections: [],

      courseViewProps: {},

      loading: true,

      standardErrors: null,

      requestErrors: null,
    };
  },

  apollo: {
    course: {
      query: COURSE_SECTIONS_QUERY,
      throttle: 1000,
      debounce: 3000,
      variables() {
        return {
          courseId: this.$route.params.courseId,
        };
      },

      error(errors) {
        this.requestErrors = errors;
      },

      result({ data, networkStatus, loading }) {
        if (data.course) {
          const [transformedCourseSections, csvIds] =
            this.courseSectionsTransform(data.course.courseSections || []);
          this.courseSections = _.cloneDeep(transformedCourseSections);

          const { instructor } = data.course;
          const obj = {};

          if (instructor) {
            obj.instructor = { username: instructor.username };
          }

          if (instructor && instructor.profile) {
            const { bio, gender, ...rest } = instructor.profile;
            const { __typename, ...r } = rest;

            obj.infos = r;
            obj.instructor.gender = gender;
            obj.instructor.bio = bio;
          }

          this.courseViewProps.courseId = data.course.id;
          this.courseViewProps.courseTitle = data.course.title;
          this.courseViewProps.courseDescription = data.course.description;
          this.courseViewProps.courseIntroImageUrl = data.course.introImageUrl;
          this.courseViewProps.courseIntroVideoUrl = data.course.introVideoUrl;
          this.courseViewProps.courseEnrollCounts = data.course.enrollCounts;
          this.courseViewProps.courseCreatedAt = data.course.insertedAt;
          this.courseViewProps.courseUpdatedAt = data.course.updatedAt;
          this.courseViewProps.courseSubjects = data.course.subjects;
          this.courseViewProps.instructor = obj.instructor;
          this.courseViewProps.instructorInfos = obj.infos;
          this.courseViewProps.courseSectionVideoIds = csvIds;
        } else if (networkStatus === 8) {
          this.standardErrors = [{
            key: 'Network',
            message: 'Unresolved',
          }];
        }

        this.loading = loading;
      },
    },
  },

  computed: {
    ...appLayout,
  },

  methods: {
    courseSectionsTransform(courseSections) {
      const sorted = arrayObjectSort(courseSections, 'orderAs');
      const courseSectionVideoIds = [];
      let isChildSelected = false;

      return [sorted.reduce((accumulator, cs, index) => {
        isChildSelected = false;

        accumulator[index] = {
          label: cs.title,
          value: cs.id,

          childTabs: (arrayObjectSort(cs.courseSectionVideos, 'orderAs'))
            .reduce((acc, el, i) => {
              acc[i] = {
                label: el.title,
                value: el.id,
                isSelected:
                  this.$route.params.courseSectionVideoId === el.id,
                callback: () => this.viewSectionVideo(el.id),
              };

              courseSectionVideoIds.push(el.id);

              if (acc[i].isSelected) {
                isChildSelected = acc[i].isSelected;
              }

              return acc;
            }, new Array(cs.courseSectionVideos.length)),
        };

        if (isChildSelected) {
          accumulator[index].isCollapsed = true;
        }

        return accumulator;
      }, new Array(sorted.length)), courseSectionVideoIds];
    },

    viewSectionVideo(courseSectionVideoId) {
      this.$router.push({
        name: 'course-section-video',
        params: { courseSectionVideoId },
      });
    },

    keyDownListener(event) {
      this.$store.state.app.sourceKeyEventListenerCallback(event);
    },
  },
};
</script>

<style scoped>
#course-video-layout {
  grid-template-areas: 'sidebar video-content';
  grid-template-rows: 1fr;
  background-color: #eee;
  z-index: 0;
  overflow: hidden;
}
.video-dialog {
  grid-area: video-content;
  height: auto;
}
</style>
