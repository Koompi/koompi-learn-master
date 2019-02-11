<template>
  <BaseForm
    formTitle="Change Password"
    submitButtonLabel="Update"
    isVerticalStyling
    isShowErrorOnInput
    :onSubmit="onSubmit"
    :formFields="formFields"
    :standardErrors="standardErrors"
    :requestErrors="requestErrors"
  />
</template>

<script>
import { BaseForm } from '@/components';
import mutationFunc from '@/mutationFunc';
import { UPDATE_PASSWORD_MUTATION } from '@/mutations';

export default {
  name: 'ChangeUserPassword',

  components: { BaseForm },

  computed: {
    formFields() {
      return [{
        name: 'oldPassword',
        label: 'Old Password',
        type: 'password',
      }, {
        name: 'newPassword',
        label: 'New Password',
        type: 'password',
      }, {
        name: 'newPasswordRetype',
        label: 'Confirm Password',
        type: 'password',
      }];
    },
  },

  data() {
    return {
      standardErrors: null,
      requestErrors: null,
    };
  },

  methods: {
    async onSubmit(values) {
      try {
        const response = await mutationFunc(
          this,
          UPDATE_PASSWORD_MUTATION,
          { ...values },
          { throttle: 2000, debounce: 2000 },
        );

        const { data: { updatePassword } } = response;

        if (updatePassword.ok) {
          this.$toasted.success('Successfully updated new password', {
            duration: 2000,
            singleton: true,
          });
        } else if (updatePassword.errors) {
          this.standardErrors = updatePassword.errors;
        }
      } catch (errors) {
        this.requestErrors = errors;
      }
    },
  },
};
</script>

<style scoped>

</style>
