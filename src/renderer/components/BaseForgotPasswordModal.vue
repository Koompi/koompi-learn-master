<template>
  <BaseModalForm
    submitButtonLabel="Reset"
    uniqueFormName="forgotPasswordForm"
    formTitle="Password Reset"
    leftButtonLabel="Sign up new account?"
    :fields="fields"
    :onCloseCallback="formOnClose"
    :onSubmitCallback="onResetPassword"
    :leftButtonOnClickCallback="switchToSignupNewAccount"
    :requestErrors="requestErrors"
    :standardErrors="standardErrors"
    isShowErrorOnInput
  />
</template>

<script>
import { BaseModalForm } from '@/components';
import { RESET_PASSWORD_MUTATION } from '@/mutations';
import mutationFunc from '@/mutationFunc';

export default {
  name: 'BaseForgotPasswordModal',

  components: { BaseModalForm },

  data() {
    return {
      requestErrors: null,
      standardErrors: null,
    };
  },

  computed: {
    fields() {
      return [{
        label: 'Email to send reset to',
        type: 'text',
        name: 'email',
      }];
    },
  },

  methods: {
    async onResetPassword(values, elements) {
      try {
        const { data } = await mutationFunc(
          this,
          RESET_PASSWORD_MUTATION,
          values,
          { throttle: 2000, debounce: 2000 },
        );

        if (data.resetPassword && data.resetPassword.ok) {
          elements.email.value = '';

          this.$toasted.success(
            `Please check your email for the reset password, then use it to
             login in order to change for new password`,
            { duration: 5000, singleton: true },
          );
        } else if (data.resetPassword && data.resetPassword.errors) {
          this.standardErrors = data.errors;
        }
      } catch (errors) {
        this.requestErrors = errors;
      }
    },

    formOnClose(formElement) {
      this.$store.commit('closeModal');

      formElement.email.value = '';

      this.standardErrors = [];
      this.requestErrors = null;
    },

    switchToSignupNewAccount() {
      this.$store.commit('setModalContentComponent', 'BaseSignUpForm');

      this.standardErrors = null;
      this.requestErrors = null;
    },
  },
};
</script>

<style scoped>
</style>
