
<template>
  <div
    id="top-bar"
  >
    <div class="container flex justify-space-between align-center">
      <BaseSearchInput
        placeholder="Find your favorite courses..."
        class="search-box"
        :onEnterHandler="goToSearchPage"
      />

      <AvatarComponent
        v-if="$store.state.user.token && !$store.state.user.isResetPassword"
        class="float-right"
        :userStateChanges="
          $store.state.nonPersistentChanges.userData[$store.state.user.id]
        "
      />

      <div
        v-else
        class="top-bar-auth flex justify-end align-center max-width max-height"
      >
        <span
          class="margin-horizontal-10px cursor-pointer text-gray1 sing-up"
          @click="openSignUpModal"
        >
          Sign Up
        </span>
        <span
          class="cursor-pointer text-gray1"
          @click="openLoginModal"
        >
          Sign In
        </span>
      </div>
    </div>
  </div>
</template>

<script>
/*
  eslint object-shorthand: 0
*/
import { BaseSearchInput } from '@/components';
export default {
  name: 'TheTopbar',

  components: {
    BaseSearchInput,
    async AvatarComponent() {
      const Component = await import('@/components');
      return Component.AvatarComponent;
    },
  },

  methods: {
    goToSearchPage(courseTitle) {
      this.$router.push({ name: 'search', params: { courseTitle } });
    },

    openSignUpModal() {
      this.$store.commit('openModal', 'BaseSignUpForm', {});
    },

    openLoginModal() {
      this.$store.commit('openModal', 'BaseLoginForm', {});
    },
  },
};
</script>


<style>
#top-bar {
  grid-area: topbar;
  padding: 10px 50px 15px 30px;
}
.container {
  max-width: 1360px;
  margin: 0 auto;
}
.search-box {
  flex: .8;
}
.top-bar-auth {
  flex: .2;
}
.search-input {
  height: 50px;
}
.sing-up{
  border-right:1px solid;
  padding-right: 10px;
}
</style>

