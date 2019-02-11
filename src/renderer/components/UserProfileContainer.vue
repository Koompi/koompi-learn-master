<template>
  <div
    class="flex user-profile-container bg-white"
    :class="className"
  >
    <div
      class="user-profile-container-profile flex justify-center column-align"
    >
      <img
        class="user-profile-container-profile-img margin-horizontal-auto"
        :src="profileImageUrl || avatarIcon"
      />
      <p class="margin-vertical-10px">Username: {{ username }}</p>
      <p>Gender: {{ gender }}</p>
    </div>

    <div class="user-profile-container-infos padding-vertical-10px">
      <div class="user-profile-container-infos-wrapper grid">
        <div
          class="user-profile-container-info"
          v-for="(value, key) in infos"
          :key="key"
        >
          <p><b>{{ transformPropertyName(key) }}</b>: {{ value }}</p>
        </div>
      </div>

      <p class="user-profile-container-info-bio">
        {{ profileBio }}
      </p>
    </div>
  </div>
</template>

<script>
import staticImages from '@/utils/staticImages';

export default {
  name: 'UserProfileContainer',

  props: {
    className: {
      type: String,
      default: '',
    },

    username: {
      type: String,
      default: '',
    },

    gender: {
      type: String,
      default: '',
    },

    profileImageUrl: {
      type: String,
      default: '',
    },

    infos: {
      type: Object,
      default: () => ({}),
    },

    profileBio: {
      type: String,
      default: '',
    },
  },

  computed: {
    ...staticImages,
  },

  methods: {
    stringCapitalize(str) {
      return str.charAt(0).toUpperCase() + str.substr(1);
    },

    transformPropertyName(propertyName) {
      return this.stringCapitalize(propertyName).split(/(?=[A-Z])/).join(' ');
    },
  },
};
</script>

<style scoped>
.user-profile-container,
.user-profile-container-profile {
  border: 1px solid #ccc;
}

.user-profile-container {
  padding: 10px;
  border-radius: 5px;
}

.user-profile-container-infos-wrapper {
  padding: 10px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
  border-radius: 5px;
  grid-template-columns: 1fr 1fr;
}

.user-profile-container-profile {
  border-radius: 5px;
  flex-basis: 180px;
  padding: 10px;
}

.user-profile-container-infos {
  flex: 1;
}
.user-profile-container-profile-img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}
</style>

