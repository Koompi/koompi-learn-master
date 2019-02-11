<template>
  <BaseModalForm
    submitButtonLabel="Save"
    uniqueFormName="resetChangePassword"
    formTitle="Change Password Form"
    :fields="fields"
    :onCloseCallback="formOnClose"
    :onSubmitCallback="onChangePassword"
    :requestErrors="requestErrors"
    :standardErrors="standardErrors"
    isShowErrorOnInput
  />
</template>

<script>
import { BaseModalForm } from '@/components';
import { UPDATE_PASSWORD_AS_RESET_MUTATION } from '@/mutations';

export default {
  name: 'BaseResetChangePasswordModalForm',

  components: { BaseModalForm },

  data() {
    return {
      standardErrors: null,
      requestErrors: null,
    };
  },

  computed: {
    fields() {
      return [{
        label: 'New Password',
        type: 'password',
        name: 'newPassword',
      }, {
        label: 'Retype New Password',
        type: 'password',
        name: 'newPasswordRetype',
      }];
    },
  },

  methods: {
    resetErrors() {
      this.standardErrors = null;
      this.requestErrors = null;
    },

    formOnClose(formElements) {
      formElements.newPassword.value = '';
      formElements.newPasswordRetype.value = '';

      this.resetErrors();
    },

    async onChangePassword(variables, elements) {
      this.resetErrors();

      try {
        const { data } = await this.$apollo.mutate({
          mutation: UPDATE_PASSWORD_AS_RESET_MUTATION,
          throttle: 2000,
          debounce: 2000,
          variables,
        });

        if (data.updatePasswordWithReset.ok) {
          this.$toasted.success('Successfully reset password', {
            duration: 3000,
            singleton: true,
          });

          elements.newPassword.value = '';
          elements.newPasswordRetype.value = '';

          this.$store.commit('clearToken');
          this.$store.commit('setModalContentComponent', 'BaseLoginForm');
        } else if (data.errors) {
          this.standardErrors = data.errors;
        }
      } catch (errors) {
        this.requestErrors = errors;
      }
    },
  },
};
</script>
