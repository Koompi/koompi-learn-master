<template>
  <div class="enroll-confirm-dialog flex">
    <div class="enroll-course-left-content">
      <h4>Course title: {{ courseTitle }}</h4>
      <h4 class="margin-vertical-10px">Taught by: {{ instructorName }}</h4>
      <h4>Number of chapters: {{ numberOfCourseChapter }}</h4>
      <h4 class="margin-vertical-10px">
        Number of course videos: {{ numberOfCourseVideo }}
      </h4>
      <h4>Course price: <span class="text-blue">{{ coursePrice }}$</span></h4>
    </div>

    <hr class="margin-horizontal-10px" />

    <div
      class="enroll-course-right-content flex column-align
      justify-space-between"
    >
      <div>
        <h4 class="flex align-center justify-space-between">
          My current money: <span class="text-blue"> 0$</span>
        </h4>
        <h4
          class="margin-vertical-10px
          flex align-center justify-space-between"
        >
          Money after enroll: <span class="text-red"> 0$</span>
        </h4>
      </div>

      <BaseButton
        isDebounce
        label="Confirm to Enroll"
        bgColor="bg-blue"
        textColor="text-white"
        :isLoading="loading"
        :isDisabled="loading"
        :onClick="confirmEnroll"
      />
    </div>
</div>
</template>

<script>
import { BaseButton } from '@/components';

export default {
  name: 'EnrollConfirmDialog',

  components: { BaseButton },

  props: {
    instructorName: {
      type: String,
      default: '',
    },

    courseTitle: {
      type: String,
      default: '',
    },

    coursePrice: {
      type: Number,
      default: 0,
    },

    numberOfCourseChapter: {
      type: Number,
      default: 0,
    },

    numberOfCourseVideo: {
      type: Number,
      default: 0,
    },

    onConfirmCallback: {
      type: Function,
      default: () => {},
    },
  },

  data() {
    return {
      loading: false,
    };
  },

  methods: {
    async confirmEnroll() {
      this.loading = true;

      await this.onConfirmCallback();

      this.loading = false;
    },
  },
};
</script>

<style scoped>
.enroll-confirm-dialog {
  padding: 30px; border-radius: 3px;
  min-width: 200px;
}
.enroll-course-right-content {
  min-width: 200px;
}
</style>
