<template>
  <div
    class="right-sidebar grid"
    :class="className"
  >
    <router-link
      v-if="isUseRouteLink"
      tag="a"
      class="right-tablinks cursor-pointer text-gray1"
      v-for="value in sidebar"
      :key="value.label"
      :to="{ name: value.link, params: value.params }"
      exact
    >
      <i
        :class="value.icon"
      />
      {{ value.label }}
    </router-link>

    <a
      v-if="!isUseRouteLink"
      class="right-tablinks cursor-pointer text-gray1"
      v-for="value in sidebar"
      :key="value.label"
      :href="`#${value.link}`"
      @click="routeLinkClick"
    >
      <i :class="value.icon"/>
      {{ value.label }}
    </a>

    <div v-if="page == 'CourseDetail'">
      <span class="btn-tablinks align-center justify-center flex">
        <BaseButton
          v-if="!isUserEnrollInThisCourse"
          label="Enroll"
          bgColor="bg-blue"
          textColor="text-white"
          className="right-sidebar-enroll-btn btn-large"
          :fontSize=16
          :onClick="onEnrollClick"
        />

        <BaseButton
          v-else
          label="Enter Class"
          bgColor="bg-blue"
          textColor="text-white"
          className="right-sidebar-enroll-btn btn-large"
          :fontSize=16
          :onClick="goToClass"
        />
      </span>

      <span class="btn-tablinks align-center justify-center flex">
        <BaseButton
          icon="fas fa-heart"
          label="Favorite"
          bgColor="bg-red"
          textColor="text-white"
          className="right-sidebar-enroll-btn btn-large"
          :fontSize=16
          :onClick="goToClass"
        />
      </span>
      <span
        class="price text-blue btn-tablinks align-center justify-center flex">
        {{ price>0?"$"+price:"Free" }}
      </span>
    </div>
  </div>
</template>
<script>
/*
  eslint object-shorthand: [0], max-lines: 0
*/
import { BaseButton } from '@/components';
import { ENROLL_MUTATION } from '@/mutations';
import mutationFunc from '@/mutationFunc';

export default {
  name: 'RightSidebarComponent',

  components: {
    async ModalComponent() {
      const Component = await import('@/components');
      return Component.ModalComponent;
    },
    async AddToWishList() {
      const Component = await import('@/components');
      return Component.AddToWishList;
    },
    BaseButton,
  },

  props: {
    sidebar: Array,
    price: String,
    page: String,
    courseId: String,
    courseTitle: String,
    isUseRouteLink: {
      type: Boolean,
      default: true,
    },
    className: {
      type: String,
      default: '',
    },
    isUserEnrollInThisCourse: {
      type: Boolean,
      default: false,
    },
    numberOfCourseVideo: Number,
    numberOfCourseChapter: Number,
    instructorName: String,
    coursePrice: Number,
  },

  data() {
    return {
      standardErrors: null,

      requestErrors: null,

      clickedElement: null,
    };
  },

  methods: {
    routeLinkClick(event) {
      if (this.clickedElement) {
        this.clickedElement.remove('text-blue');
      }

      this.clickedElement = event.target.classList;
      this.clickedElement.add('text-blue');
    },

    onEnrollClick() {
      const { token } = this.$store.state.user;

      if (!token) {
        this.$store.commit('openModal', {
          contentComponent: 'BaseLoginForm',
          contentProps: {
            onLoginSuccessCallback: this.onEnrollClick,
          },
        });

        return;
      }

      if (this.isUserEnroll) {
        return;
      }

      const {
        instructorName,
        numberOfCourseVideo,
        numberOfCourseChapter,
        courseTitle,
        coursePrice,
      } = this;

      this.$store.commit('openModal', {
        contentComponent: 'EnrollConfirmDialog',
        contentProps: {
          numberOfCourseChapter,
          numberOfCourseVideo,
          instructorName,
          courseTitle,
          coursePrice,
          onConfirmCallback: this.enrollIntoCourse,
        },
        closeOnOutsideClick: true,
      });
    },

    async enrollIntoCourse() {
      if (!this.isUserEnrollInThisCourse) {
        try {
          const response = await mutationFunc(
            this,
            ENROLL_MUTATION,
            { courseId: this.courseId },
            { throttle: 1000, debounce: 6000 },
          );
          const { data: { enroll } } = response;

          if (enroll.ok) {
            this.$store.commit('closeModal');
            this.$toasted.success('Successfully enrolled into course', {
              duration: 2000,
              singleton: true,
            });
            this.$router.push({
              name: 'course-view-info',
              params: this.courseId,
            });
          } else if (!enroll.ok) {
            this.$toasted.error('You have no enough credit to enroll', {
              duration: 2000,
              singleton: true,
            });
          }
        } catch (errors) {
          this.requestErrors = errors;
        }
      }
    },

    goToClass() {
      this.$router.push({
        name: 'course-view-info',
        params: { courseId: this.courseId },
      });
    },
  },
};
</script>
<style scoped>
.right-sidebar-enroll-btn { width: 90%; }
.iconclass { margin-right: 10px; }
.right-tablinks,.btn-tablinks {
  padding: 10px 20px;
  background-color: #FFF;
  font-size: 18px;
  border-width: 1px 1px 0 1px;
  border-style: solid;
  border-color: #979595;
  transition: .3s;
  will-change: background-color;
  text-decoration: none;
}
.right-tablinks:first-child{ border-radius: 5px 5px 0 0;}
.right-tablinks:last-child,
.btn-tablinks:last-child{ border-radius: 0 0 5px 5px;
  border-bottom: 1px solid #979595;}
.right-tablinks:hover {
  background-color: #979595;
}
.enroll-btn:hover, .wishlist-btn:hover {
  background: #979595;
  transition: .3s;
}
.price {
  font-size: 30px;
  font-weight: bold;
}
.btn-large{
  padding: 20px 10px;
  text-align: center;
  border-radius: 4px !important;
}
.price { font-size: 30px; font-weight: bold; }
</style>
