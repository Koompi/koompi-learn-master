<template>
  <div class="relative profile-information scroll-y max-height">
    <AllCourseTitle title="Information" />

    <div class="profile-content max-width size-calc-spacing-include">
      <label
        v-if="userProfile && userProfile !== {}"
        class="profile-label float-left text-gray1"
        v-for="(data, key) in userProfile"
        :key="key"
      >
        {{ data.label }}:
        <span class="text-gray1"> {{ data.value }}</span>
      </label>

      <h4 v-if="!userProfile.length">
        You have not yet update your user profile
      </h4>
      <label class="about flex max-width max-height"></label>
    </div>

    <BaseGridContainer
      v-if="courseEnrolls && courseEnrolls.length"
      className="margin-vertical-10px"
      :gridGap=20
      :isAlignCenter=false
      :minItemWidth=260
      :maxItemWidth=260
      :numberOfItemPerRow=3
    >
      <BaseCourseCard
        v-for="(course, index) in courseEnrolls"
        :key="index"
        :courseTitle="course.title"
        :courseCreatedAt="course.insertedAt"
        :courseIntroImageThumbUrl="course.introImageUrl"
        :cardOnClick="() =>
          goToPage('course-view-info', { courseId: course.id })"
      />
    </BaseGridContainer>
  </div>
</template>
<script>
import { BaseGridContainer, BaseCourseCard } from '@/components';
export default {
  name: 'ProfileInformation',

  components: {
    async AllCourseTitle() {
      const Component = await import('@/components');
      return Component.AllCourseTitle;
    },

    BaseGridContainer,
    BaseCourseCard,
  },

  props: {
    username: {
      type: String,
      default: '',
    },

    email: {
      type: String,
      default: '',
    },

    profile: {
      type: Object,
    },

    courseEnrolls: {
      type: Array,
      validator(value) {
        if (value && !value.length) {
          return true;
        }

        let index = 0;

        for (; index < value.length; index += 1) {
          if (
            typeof value[index].title === 'string' &&
            typeof value[index].id === 'string' &&
            typeof value[index].insertedAt === 'string' &&
            typeof value[index].introImageUrl === 'string'
          ) {
            return true;
          }
        }

        return false;
      },
      default: null,
    },
  },

  data() {
    return {
    };
  },

  computed: {
    userProfile() {
      if (this.profile) {
        const keys = Object.getOwnPropertyNames({ ...this.profile });
        const arr = [];
        let value = null;

        if (keys.indexOf('profileImageUrl') > -1) {
          keys.splice(keys.indexOf('profileImageUrl'), 1);
        }

        arr.push({ label: 'Email', value: this.email });

        keys.forEach((key) => {
          value = this.profile[key];

          if (key !== '__typename' && key !== 'function' && value) {
            arr.push({
              label: key[0].toUpperCase() + key.substring(1),
              value,
            });
          }
        });

        return arr;
      }

      return [];
    },
  },

  methods: {
    goToPage(name, params) {
      this.$router.push({ name, params });
    },
  },
};
</script>
<style scoped>

.profile-content {
  margin-top: 20px;
  padding: 15px;
  background: #ffffff;
  border: 1px solid #979595;
  border-radius: 5px;
}

.profile-label {
  padding: 15px 0px;
  width: 50%;
  font-size: 16px;
}

.profile-label span {
  font-size: 17px;
  font-weight: 600;
}

.about {
  clear: both;
  width: 100%;
  padding: 15px 0px;
}

.profile-content p {
  font-size: 14px;
  line-height: 1.4em;
}

.profile-information {overflow-x: hidden;}
</style>
