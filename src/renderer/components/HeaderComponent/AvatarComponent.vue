<template>
  <div class="flex popover">
    <span>
      <i
        v-if="!profileImageUrl"
        class="far fa-user-circle icon-width text-gray3"
      />
      <img
        v-else
        :src="profileImageUrlFetch"
        class="avatar-component-profile-image"
      />
    </span>
    <span>
      <i class="fas fa-angle-down text-gray3"></i>
    </span>
    <div class="bg-gray5 popover-content cursor-pointer">
      <p
        class="popover-message"
        @click="() => goToPage('user-profile')"
      >
        <a>My Profile</a>
      </p>

      <p class="popover-message">
        <a>Setting</a>
      </p>

      <p
        v-if="loadingAdminRole"
        class="popover-message"
      >
        <MoveBlockLoader color="bg-gray3"/>
      </p>

      <p
        v-if="isAdmin && !loadingAdminRole"
        class="popover-message"
        @click="() => goToPage('admin-dashboard')"
      >
        <a>Admin Panel</a>
      </p>

      <p
        class="popover-message cursor-pointer"
        @click="onLogoutPress"
      >
        Logout
      </p>
    </div>
  </div>
</template>
<script>
/*
  eslint object-shorthand: [0]
*/
import { IS_MY_ROLE_QUERY, PROFILE_IMAGE_QUERY } from '@/queries';
import transformS3Url from '@/utils/transformS3Url';

export default {
  name: 'AvatarComponent',

  components: {
    MoveBlockLoader: async () => {
      const { MoveBlockLoader } = await import('@/components');

      return MoveBlockLoader;
    },
  },

  props: {
    title: {
      type: String,
      default: 'Title',
    },
    subTitle: {
      type: String,
      default: 'Sub Title',
    },
    userStateChanges: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      isAdmin: false,

      profileImageUrl: null,

      me: {},

      loadingProfileImage: true,
      loadingAdminRole: true,
    };
  },

  apollo: {
    isMyRole: {
      query: IS_MY_ROLE_QUERY,

      fetchPolicy: 'network-only',

      throttle: 3000,
      debounce: 3000,

      variables() {
        return { role: 'admin' };
      },

      error(errors) {
        console.log(errors);
      },

      result({ data, networkStatus }) {
        if (networkStatus === 8) {
          this.$toasted.error(
            'Connection error while checking user role, please relogin',
            { duration: 5000 },
          );
        }

        this.isAdmin = data.isMyRole;

        this.loadingAdminRole = false;
      },
    },

    me: {
      query: PROFILE_IMAGE_QUERY,
      throttle: 2000,
      debounce: 2000,
      fetchPolicy: 'network-only',

      error(errors) {
        console.log(errors);
      },

      result({ data, networkStatus }) {
        if (networkStatus === 8) {
          this.$toasted.error(
            'Connection error while getting profile image, please relogin',
            { duration: 5000 },
          );
        } else if (data.me && data.me.profile) {
          this.profileImageUrl = data.me.profile.profileImageUrl;
        }
      },
    },
  },

  methods: {
    onLogoutPress() {
      this.$store.commit('clearToken');
    },

    goToPage(name, params) {
      this.$router.push({ name, params });
    },

    transformUrl(url) { return transformS3Url(url); },
  },

  computed: {
    profileImageUrlFetch() {
      if (this.userStateChanges && this.userStateChanges.profileImageUrl) {
        return this.transformUrl(this.userStateChanges.profileImageUrl);
      }

      return this.transformUrl(this.profileImageUrl);
    },
  },
};
</script>
<style scoped>
  .fa-angle-down {
    font-size: 24px;
    padding-top: 20px;
    padding-left: 7px;
  }

  .icon-width {
    font-size: 53px;
    padding: 0px;
  }

  .avatar-component-profile-image {
    height: 50px;
    width: 50px;
    border-radius: 50%;
  }
</style>
