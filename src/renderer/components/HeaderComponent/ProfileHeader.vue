<template>
  <div
    class="banner relative flex text-gray4 max-width"
    :style="{ 'background-image': `url(${bannerCover})` }">
      <div
        class="header-avatar"
        @click="openEditProfileImageModal">
        <img
          :src="transformUrl(profileImageUrl) || avatarIcon"
          alt="Avatar"
          class="header-avatar-img cursor-pointer">
        <i class="fas fa-edit absolute cursor-pointer"/>
      </div>
      <div class="header-text">
        <p class="title">{{ username }}</p>
        <p class="sub-title">{{ capitalizeGender }}</p>
      </div>
      <router-link
        tag="i"
        class="fas fa-user-edit absolute"
        :to="{ name: me.link,params: me.params }"
        exact></router-link>
    <div class="header-image absolute max-width max-height"/>
  </div>
</template>
<script>
/*
  eslint max-lines: 0
*/
import { ImageCropper } from '@/components';
import staticImages from '@/utils/staticImages';
import base64ToImageFileObject from '@/utils/base64ToImageFileObject';
import s3Upload from '@/utils/s3Upload';
import transformS3Url from '@/utils/transformS3Url';
import { PRESIGN_URL_QUERY, ME_QUERY } from '@/queries';
import { UPDATE_USER_PROFILE_MUTATION } from '@/mutations';

export default {
  name: 'ProfileHeader',

  props: {
    username: {
      type: String,
      default: '',
    },

    gender: {
      type: String,
      validator(value) {
        return ['male', 'female'].indexOf(value) > -1;
      },
      default: '',
    },

    profileImageUrl: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      me: {},
      isSavingImage: false,
      standardErrors: null,
      requestErrors: null,
      uploadErrors: null,
      uploadProgress: null,
    };
  },

  apollo: {
    me: {
      query: ME_QUERY,

      throttle: 1000,
      debounce: 2000,

      // fetchPolicy: 'network-only',

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
    ...staticImages,

    capitalizeGender() {
      if (this.gender) return this.gender.toUpperCase();

      return '';
    },
    profile() {
      this.me = {
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
      };
    },
  },

  methods: {
    openEditProfileImageModal() {
      const imageObject = this.profileImageUrl ? new Image(80, 80) : null;
      if (imageObject) {
        imageObject.setAttribute('crossOrigin', 'anonymous');
        imageObject.src = this.transformUrl(this.profileImageUrl);
      }

      this.$store.commit('openModal', {
        contentComponent: ImageCropper,
        contentProps: {
          imageObject,
          onSaveImageCrop: this.onSaveEditImage,
          loading: this.isSavingImage,
          optionalLoadingProgress: this.uploadProgress,
        },
        closeOnOutsideClick: !this.isSavingImage,
      });
    },
    async onSaveEditImage(url) {
      this.isSavingImage = true;

      const [file, fileType] = base64ToImageFileObject(url, 'cropped_image');

      try {
        const { data } = await this.$apollo.query({
          query: PRESIGN_URL_QUERY,
          variables: { fileType },
          throttle: 2000,
          debounce: 2000,
          fetchPolicy: 'network-only',
        });

        if (data.presignUrl) {
          const [uploadResult, mutationResult] = await Promise.all([
            s3Upload(file, data.presignUrl, {
              progressCallback: this.onUploading,
              headers: [['ACL', 'public-read']],
              errorCallback: this.onUploadError,
            }),

            this.$apollo.mutate({
              mutation: UPDATE_USER_PROFILE_MUTATION,
              throttle: 2000,
              debounce: 2000,
              variables: { profileImageUrl: data.presignUrl.url },
            }),
          ]);

          if (uploadResult.remoteUrl) {
            const { commit, state: { user } } = this.$store;

            commit('setNonPersistentChanges', {
              id: user.id,
              data: { profileImageUrl: uploadResult.remoteUrl },
            });
          }

          if (mutationResult.data && mutationResult.data.errors) {
            this.standardErrors = mutationResult.data.errors;
          }
        } else if (data.errors) {
          this.standardErrors = data.errors;
          console.log(data.errors);
        }

        if (this.uploadErrors || this.standardErrors) {
          this.$toasted.error(
            'Something went wrong while uploading profile image',
            { duration: 3000 },
          );
        } else {
          this.$toasted.success('Successfully uploaded profile image', {
            duration: 3000,
          });
        }
      } catch (errors) {
        this.requestErrors = errors;
        console.log(this.requestErrors);
      }

      this.isSavingImage = false;
    },

    onUploading(progress) { this.uploadProgress = progress; },

    onUploadError(error) {
      this.uploadErrors = error;
      console.log(error);
    },

    transformUrl(url) { return transformS3Url(url); },
  },
};
</script>
<style scoped>
.header-avatar {
  text-align: center;
  width: 150px;
  padding-top: 40px;
  z-index: 1;
  left: 0;
}
.header-avatar-image {
  margin-left: 50px;
  width: 120px;
  z-index: 10;
}
.header-text {
  width: calc(100% - 120px);
  padding-top: 40px;
  padding-left: 100px;
  z-index: 1;
}
.fa-user-circle{
  font-size: 120px;
  z-index: 1;
}
.fa-user-edit {
  font-size: 30px;
  z-index: 1;
  right: 20px;
  top: 150px;
}
.banner {height: 200px;background-size: cover;}
.header-image{
  background: linear-gradient(to right,
  rgba(0,0,0,.6) 60%,
  rgba(0,0,0,.4) 80%,
  rgba(0,0,0,.2) 100%);
}
.title{font-size: 42px;margin-bottom: 20px;}
.sub-title {font-size: 28px;}
.header-avatar-img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}
</style>
