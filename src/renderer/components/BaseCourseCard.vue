<template>
  <BaseCard
    :className="['cursor-pointer base-course-card', className]"
    :cardOnClick="onClickCard"
  >
    <div
      slot="base-card-content"
      class="base-course-card-content relative max-width no-scroll bg-white"
    >
      <img
        class="base-course-card-content-image max-height max-width"
        :src="courseIntroImageThumbUrl || koompiLaptopImage"
      />

      <img
        class="base-course-card-content-start-arrow absolute"
        :src="playIcon"
      />

      <div
        v-if="isShowEditIcon"
        class="base-course-card-edit absolute bg-white"
      >
        <i class="fas fa-edit"/>
      </div>
    </div>

    <div
      slot="base-card-footer"
      class="base-course-card-footer bg-white"
    >
      <div class="flex justify-space-between align-center">
        <span>{{ courseInstructorName }}</span>
        <span class="time-ago text-gray1">
          {{ timeCourseHasBeenCreated }} ago</span>
      </div>

      <p class="margin-vertical-10px base-course-card-title no-scroll">
        {{ courseTitle }}
      </p>
    </div>
  </BaseCard>
</template>

<script>
import BaseCard from '@/components/BaseCard.vue';
import moment from 'moment';
import staticImages from '@/utils/staticImages';

export default {
  name: 'BaseCourseCard',

  components: { BaseCard },

  props: {
    courseTitle: {
      type: String,
      default: '',
    },

    courseCreatedAt: {
      type: String,
      default: '',
    },

    courseInstructorName: {
      type: String,
      default: '',
    },

    courseIntroImageThumbUrl: {
      type: String,
      default: '',
    },

    className: {
      type: String,
      default: '',
    },

    cardOnClick: {
      type: Function,
      default: () => {},
    },

    isShowEditIcon: {
      type: Boolean,
      default: false,
    },

    cardEditOnClick: {
      type: Function,
      default: () => {},
    },
  },

  computed: {
    ...staticImages,

    timeCourseHasBeenCreated() {
      if (this.courseCreatedAt) {
        return moment(new Date()).from(this.courseCreatedAt, true);
      }

      return '';
    },
  },

  methods: {
    onClickCard({ target }) {
      if (
        target.classList.contains('base-course-card-edit') ||
        target.classList.contains('fa-edit')
      ) {
        return this.cardEditOnClick();
      }

      return this.cardOnClick();
    },
  },
};
</script>

<style scoped>
.base-course-card-content-image {
  object-fit: cover;
}
.base-course-card-content {
  height: 200px;
}
.base-course-card-content-start-arrow {
  max-width: 70px;
  max-height: 70px;
  left: 50%;
  top: 50%;
  opacity: 0;
  transform: translate(-50%, -50%) scale(.6);
  transition: .3s;
  will-change: opacity, transform;
}
.base-course-card:hover .base-course-card-content-start-arrow {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1.1);
}
.base-course-card-footer {
  padding: 10px;
  flex: 1;
}
.base-course-card {max-height: 320px;}
.base-course-card-title {
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  display: -webkit-box;
}
.base-course-card-edit {
  top: -2px;
  right: -2px;
  z-index: 1;
  padding: 10px;
  border-bottom-left-radius: 6px;
  box-shadow: -1px 1px 6px 1px rgba(1, 1, 1, .2);
}
span.time-ago{
  font-size: 14px;
}
</style>
