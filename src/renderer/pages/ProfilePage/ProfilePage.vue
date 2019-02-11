<template>
  <div
    v-if="loading"
    class="flex justify-center align-center max-width max-height column-align"
  >
    <MoveBlockLoader bgColor="bg-gray1" />
    <p class="margin-vertical-10px">Fetching user profile</p>
  </div>

  <div
    v-else-if="errors"
    class="flex justify-center align-center max-width max-height column-align"
  >
    <p>{{ errors[0] }}</p>
  </div>

  <div
    class="max-height"
    v-else
  >
    <ProfileHeader
      :gender="(me.profile && me.profile.gender) || null"
      :username="me.username"
      :profileImageUrl="me.profile && me.profile.profileImageUrl"
    />

    <div
      class="flex justify-space-between
      profile-page-content max-height scroll-y"
    >
      <div class="content">
        <router-view v-bind="me"/>
      </div>

      <div class="sidebar">
        <RightSidebar
          :sidebar="sidebar"
        />
      </div>
    </div>
  </div>
</template>

<script>
/*
  eslint object-shorthand: [0]
*/
import {
  ProfileHeader,
  RightSidebar,
  ProfileInformation,
  MoveBlockLoader,
} from '@/components';
import { ME_QUERY } from '@/queries';

export default {
  name: 'ProfilePage',

  components: {
    ProfileHeader,
    RightSidebar,
    ProfileInformation,
    MoveBlockLoader,
  },

  data() {
    return {
      me: {},

      errors: null,

      loading: true,
    };
  },

  apollo: {
    me: {
      query: ME_QUERY,

      throttle: 1000,
      debounce: 2000,

      fetchPolicy: 'network-only',

      error(error) {
        this.errors = [error];
      },

      result({ data, loading, networkStatus }) {
        if (networkStatus === 8) {
          this.errors = ['Network unresolved'];
        } else if (data && data.me) {
          this.me = data.me;
        } else {
          this.errors = ['Something went wrong, refresh the page to retry'];
        }

        this.loading = loading;
      },
    },
  },

  computed: {
    sidebar() {
      return [{
        label: 'Information',
        icon: 'iconclass far fa-file-alt',
        link: 'user-profile',
      }, {
        label: 'Wishlist',
        icon: 'iconclass fas fa-heart',
        link: 'user-wishlist',
      }, {
        label: 'My Courses',
        icon: 'iconclass fas fa-check',
        link: 'user-courses',
      }, {
        label: 'Change Password',
        icon: 'iconclass fas fa-lock',
        link: 'change-password',
      }, {
        label: 'Update Profile',
        icon: 'iconclass fas fa-user',
        link: 'update-user-profile',
        params: {
          userProfile: {
            firstName: '',
            lastName: '',
            phone: '',
            gender: '',
            bio: '',
            email: this.me.email,
            ...this.me.profile,
          },
        },
      }, {
        label: 'Add New Course',
        icon: 'iconclass fas fa-book-open',
        link: 'add-new-course',
      }];
    },
  },
};
</script>
<style scoped>

.profile-page-content {
  padding: 20px;
  height: calc(100% - 220px);
}

.content {
  padding-right: 15px;
  max-width: 1040px;
  width: 75%;
}

.sidebar{
  max-width: 342px;
  width: 25%;
}

</style>
