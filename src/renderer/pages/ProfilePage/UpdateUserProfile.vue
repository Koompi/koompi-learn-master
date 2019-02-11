<template>
  <BaseForm
    v-if="userProfile"
    className="update-user-profile-page scroll-y max-height"
    formTitle="Update Profile"
    submitButtonLabel="Update"
    isShowErrorOnInput
    :onSubmit="onSubmit"
    :formFields="formFields"
    :requestErrors="requestErrors"
    :standardErrors="standardErrors"
  />

  <div
    class="flex max-width justify-center align-center"
    v-else
  >
    <h3>User profile is missing, it should have passed along to this page</h3>
  </div>
</template>

<script>
import { BaseForm } from '@/components';
import { UPDATE_USER_PROFILE_MUTATION } from '@/mutations';
import mutationFunc from '@/mutationFunc';

export default {
  name: 'UpdateUserProfile',

  components: { BaseForm },

  props: {
    userProfile: {
      type: Object,
      validator(value) {
        if (
          typeof value.firstName !== 'string' ||
          typeof value.lastName !== 'string' ||
          typeof value.email !== 'string' ||
          typeof value.phone !== 'string' ||
          typeof value.bio !== 'string' ||
          typeof value.gender !== 'string'
        ) {
          return false;
        }

        return true;
      },
      required: true,
    },
  },

  data() {
    return {
      requestErrors: null,
      standardErrors: null,
    };
  },

  computed: {
    formFields() {
      return [{
        name: 'lastName',
        label: 'Last Name',
        type: 'text',
        value: this.userProfile.lastName,
        isOptional: this.userProfile.lastName,
      }, {
        name: 'firstName',
        label: 'First Name',
        type: 'text',
        value: this.userProfile.firstName,
        isOptional: this.userProfile.firstName,
      }, {
        name: 'phoneNumber',
        label: 'Phone Number',
        type: 'text',
        value: this.userProfile.phone,
        isOptional: this.userProfile.phone,
      }, {
        name: 'email',
        label: 'Email',
        type: 'email',
        value: this.userProfile.email,
        isOptional: this.userProfile.email,
      }, {
        name: 'gender',
        label: 'Gender',
        type: 'select',
        value: this.userProfile.gender,
        isOptional: this.userProfile.gender,
        options: [{
          label: 'Male',
          value: 'male',
        }, {
          label: 'Female',
          value: 'female',
        }],
      }, {
        name: 'bio',
        label: 'Short Bio',
        type: 'textarea',
        value: this.userProfile.bio,
        isOptional: this.userProfile.bio,
      }];
    },
  },

  methods: {
    async onSubmit(values) {
      const variables = this.filterEmptyProperty(values);

      try {
        const response = await mutationFunc(
          this,
          UPDATE_USER_PROFILE_MUTATION,
          variables,
          { throttle: 1000, debounce: 3000 },
        );

        const { data: { updateUserProfile }, networkStatus } = response;

        if (networkStatus === 8) {
          this.standardErrors = [{
            key: 'Network',
            message: 'Unresolved',
          }];
        } else if (updateUserProfile.ok) {
          this.$toasted.success(
            'Successfully updated user profile',
            { duration: 1000, singleton: true },
          );
        }
      } catch (error) {
        this.requestErrors = error;
      }
    },

    filterEmptyProperty(values) {
      const keys = Object.keys(values);
      const obj = {};

      keys.forEach((key) => {
        if (values[key]) {
          obj[key] = values[key];
        }
      });

      return obj;
    },
  },
};
</script>

