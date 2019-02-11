<template>
  <div
    class="relative"
    id="syllabus-section"
  >
    <AllCourseTitle title="Syllabus" />
    <div class="syllabus-content">
      <div
        class="grid"
        v-for="section in courseSections"
        :key="section.id"
      >
        <span class="syl-tablinks bg-gray4 cursor-pointer text-gray1">
          {{ section.title }}
        </span>

        <span
          class="syl-tablinks cursor-pointer text-gray1"
          v-for="csv
            in sortCourseSectionVideoOrder(section.courseSectionVideos)"
          :key="csv.id"
          @click="() => goToCourseViewPage(csv.id)"
        >
          <i class="iconclass far fa-play-circle"></i>
          {{ csv.title }}
          <i
            v-if="!isUserEnrollInThisCourse"
            class="fas fa-lock float-right"
          />
        </span>
      </div>
    </div>

    <div class="flex justify-center align-center margin-vertical-10px">
      <button
        class="button text-gray1 cursor-pointer"
        @click="showAll = !showAll"
      >
        View more
      </button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SyllabusComponent',

  components: {
    async AllCourseTitle() {
      const Component = await import('@/components');
      return Component.AllCourseTitle;
    },
  },

  props: {
    courseSections: {
      type: Array,
      default: [],
    },

    isUserEnrollInThisCourse: {
      type: Boolean,
      default: false,
    },

    courseId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      showAll: false,
    };
  },

  methods: {
    sortCourseSectionVideoOrder(csv) {
      return [...csv].sort((a, b) => {
        if (a.orderAs < b.orderAs) {
          return -1;
        } else if (a.orderAs > b.orderAs) {
          return 1;
        }

        return 0;
      });
    },

    goToCourseViewPage(courseSectionVideoId) {
      if (this.isUserEnrollInThisCourse) {
        this.$router.push({
          name: 'course-section-video',
          params: { courseSectionVideoId, courseId: this.courseId },
        });
      }
    },
  },
};
</script>
<style scoped>
.syllabus-content {
  margin-top: 20px;
  border: 1px solid #979595;
  border-radius: 5px;
  background: #ffffff;
}
.iconclass {
  margin-right: 10px;
}

.syl-tablinks,.btn-tablinks {
  padding: 10px 20px;
  font-size: 18px;
  border-width: 0 0 1px 0;
  border-style: solid;
  border-color: #979595;
  transition: .3s;
  will-change: background-color;
  text-decoration: none;
}
.syl-tablinks:first-child{ border-radius: 5px 5px 0 0;
  background: #C4C4C4;
}
.syl-tablinks:last-child{
  border: none;
}
</style>

