<template>
  <div
    class="relative"
    id="instructor-section"
  >
    <AllCourseTitle title="Instructor" />
    <div class="instructor-content flex justify-space-between">
      <div class="instructor-avatar">
        <i
          v-if="!instructorProfile.profile ||
          !instructorProfile.profile.profileImageUrl"
          class="far fa-user-circle text-gray3"
        />
        <img
          v-else
          :src="transformUrl(instructorProfile.profile.profileImageUrl)"
          class="instructor-avatar-img"
        />
        <h4 class="margin-vertical-10px">{{ username }}</h4>
        <button
          class="btn-gray bg-gray4 cursor-pointer"
          @click="viewInstructorModal"
        >
          View Profile
        </button>
      </div>
      <div class="instructor-text text-gray2">
        <p>
          {{
            instructorProfile.profile ?
              instructorProfile.profile.bio : 'Profile have not yet update'
          }}
        </p>
      </div>

    </div>
  </div>
</template>
<script>
import transformS3Url from '@/utils/transformS3Url';

export default {
  name: 'InstructorComponent',

  props: {
    username: {
      type: String,
      default: '',
    },

    instructorProfile: {
      type: Object,
      default: () => ({}),
    },
  },

  components: {
    async AllCourseTitle() {
      const Component = await import('@/components');
      return Component.AllCourseTitle;
    },
  },

  methods: {
    viewInstructorModal() {
      const obj = { username: this.username };

      if (this.instructorProfile.profile) {
        const {
          gender,
          bio,
          profileImageUrl,
          __typename,
          ...rest
        } = this.instructorProfile.profile;
        obj.gender = gender;
        obj.profileBio = bio;
        obj.infos = rest;
        obj.profileImageUrl = this.transformUrl(profileImageUrl);
      }

      this.$store.commit('openModal', {
        contentComponent: 'UserProfileContainer',
        contentProps: obj,
        closeOnOutsideClick: true,
      });
    },

    transformUrl(url) { return transformS3Url(url); },
  },
};
</script>
<style scoped>

.instructor-content {
  margin-top: 20px;
  padding: 15px;
  background: #ffffff;
  border: 1px solid #979595;
  border-radius: 5px;
}

.instructor-avatar {
  text-align: center;
  width: 150px;
}
.instructor-avatar .fa-user-circle{
  font-size: 120px;
}
.btn-gray{
  width: 80%;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
  font-size: 14px;
}
.instructor-text {
  width: calc(100% - 150px);
  padding-left: 20px;
}

.instructor-text p {
  line-height: 1.4em;
  margin-bottom: 10px;
  font-size: 14px;
}
.instructor-avatar-img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
</style>
