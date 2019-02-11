
<template>
  <div
    class="course-view-intro flex
    column-align margin-horizontal-auto"
  >
    <h2 class="course-view-intro-title">{{ courseTitle }}</h2>

    <p>
      Student enrolled: {{ courseEnrollCounts }}
    </p>
    <p class="margin-vertical-10px">
      Created at: {{ transformDate(courseCreatedAt) }}
    </p>
    <p>
      Last updated: {{ transformDate(courseUpdatedAt) }}
    </p>

    <div class="course-view-intro-subjects bg-white margin-vertical-10px">
      <h3>Course Related Subjects</h3>
      <div class="flex course-view-intro-subject-container flex-wrap">
        <span
          class="course-view-intro-subject-tag bg-gray1 text-white"
          v-for="(subject, index) in courseSubjects"
          :key="index"
        >
          {{ subject.field }}
        </span>
      </div>
    </div>

    <div class="course-view-intro-desc margin-vertical-10px bg-white">
      <h3>Course Description:</h3>
      <p>{{ courseDescription }}</p>
    </div>

    <UserProfileContainer
      :infos="instructorInfos"
      :profileBio="instructor.bio"
      :username="instructor.username"
      :gender="instructor.gender"
    />

    <div class="course-view-intro-video max-width">
      <BaseVideoPlayer
        isHideTopBar
        isHideNextButton
        :videoDetail="{ url: transformUrl(courseIntroVideoUrl) }"
      />
    </div>
  </div>
</template>

<script>
import staticImages from '@/utils/staticImages';
import transformS3Url from '@/utils/transformS3Url';
import { BaseVideoPlayer, UserProfileContainer } from '@/components';
import moment from 'moment';

export default {
  name: 'CourseViewIntro',

  components: { BaseVideoPlayer, UserProfileContainer },

  props: {
    courseTitle: {
      type: String,
      default: 'Course Title',
    },

    courseDescription: {
      type: String,
      default: 'Course Description',
    },

    courseIntroImageUrl: {
      type: String,
      default: staticImages.bannerCover(),
    },

    courseIntroVideoUrl: {
      type: String,
      default: '',
    },

    courseCreatedAt: {
      type: String,
      default: '',
    },

    courseUpdatedAt: {
      type: String,
      default: '',
    },

    courseEnrollCounts: {
      type: Number,
      default: 0,
    },

    courseSubjects: {
      type: Array,
      default: null,
    },

    instructor: {
      type: Object,
      default: () => ({}),
    },

    instructorInfos: {
      type: Object,
      default: () => ({}),
    },
  },

  methods: {
    transformUrl(url) { return transformS3Url(url); },

    transformDate(dateAsString) {
      return moment(dateAsString).format('YYYY MMMM Do');
    },
  },
};
</script>

<style scoped>
.course-view-intro {
  padding: 10px;
  max-width: 768px;
}
.course-view-intro-subjects,
.course-view-intro-desc {
  border-radius: 5px;
  border: 1px solid #ccc;
}

.course-view-intro-desc { padding: 10px; }
.course-view-intro-subjects { padding: 10px 5px 5px 5px; }

.course-view-intro-subject-tag { padding: 5px 10px; margin: 5px; }

.course-view-intro-video {
  margin: 10px auto;
  height: 500px;
}
.course-view-intro-subjects > h3 { margin-left: 5px; }
.course-view-intro-title {
  margin-bottom: 10px;
}
</style>
