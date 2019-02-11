<template>
  <BaseVideoPlayer
    :videoDetail="courseSectionVideoDetailFetch || {}"
    :loading="loading"
    :requestErrors="requestErrors"
    :standardErrors="standardErrors"
    :playListAsId="courseSectionVideoIds"
    :onClose="videoOnClose"
    isListenToKeyboardAsControl
    isOnHoverShowControl
  />
</template>

<script>
/*
  eslint object-shorthand: [0]
*/
import { BaseVideoPlayer } from '@/components';
import { COURSE_SECTION_VIDEO_DETAIL_QUERY } from '@/queries';
import transformS3Url from '@/utils/transformS3Url';

export default {
  name: 'CourseVideoView',

  components: { BaseVideoPlayer },

  watch: {
    '$route.params.courseSectionVideoId'() {
      this.loading = true;
    },
  },

  props: {
    courseSectionVideoIds: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      loading: true,

      requestErrors: null,
      standardErrors: null,

      courseSectionVideoDetailFetch: {},
    };
  },

  apollo: {
    courseSectionVideoDetail: {
      query: COURSE_SECTION_VIDEO_DETAIL_QUERY,

      variables() {
        return {
          courseSectionVideoId: this.$route.params.courseSectionVideoId,
        };
      },

      throttle: 1000,
      debounce: 3000,

      error(errors) {
        this.loading = false;
        this.requestErrors = errors;
      },

      result({ data, networkStatus, loading }) {
        if (networkStatus === 8) {
          this.standardErrors = [{
            key: 'Network',
            message: 'Unresolved',
          }];
        }

        this.courseSectionVideoDetailFetch =
          { ...data.courseSectionVideoDetail };

        if (data.courseSectionVideoDetail) {
          if (data.courseSectionVideoDetail.url) {
            this.courseSectionVideoDetailFetch.url =
              transformS3Url(this.courseSectionVideoDetailFetch.url);
          }
        }

        this.loading = loading;
      },
    },
  },

  methods: {
    videoOnClose() {
      this.$router.push({
        name: 'course-detail',
        params: { courseId: this.$route.params.courseId },
      });
    },
  },
};
</script>
