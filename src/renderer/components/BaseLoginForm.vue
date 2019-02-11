
<template>
  <BaseModalForm
    submitButtonLabel="Login"
    uniqueFormName="loginForm"
    formTitle="Login"
    leftButtonLabel="Forgot your password?"
    :fields="fields"
    :onCloseCallback="formOnClose"
    :onSubmitCallback="onLogin"
    :leftButtonOnClickCallback="switchToPasswordReset"
    :requestErrors="requestErrors"
    :standardErrors="standardErrors"
    isShowErrorOnInput
  />
</template>

<script>
import { BaseModalForm } from '@/components';
import { LOGIN_MUTATION } from '@/mutations';
import mutationFunc from '@/mutationFunc';

export default {
  name: 'BaseLoginForm',

  components: { BaseModalForm },

  props: {
    onLoginSuccessCallback: {
      type: Function,
      default: () => {},
    },
  },

  data() {
    return {
      requestErrors: null,
      standardErrors: null,
    };
  },

  computed: {
    fields() {
      return [{
        label: 'Username',
        type: 'text',
        name: 'username',
      }, {
        label: 'Password',
        type: 'password',
        name: 'password',
      }];
    },
  },

  methods: {
    formOnClose(formElement) {
      formElement.password.value = '';

      this.standardErrors = [];
      this.requestErrors = null;
    },

    switchToPasswordReset() {
      this.$store.commit('setModalContentComponent', 'BaseForgotPasswordModal');

      this.standardErrors = null;
      this.requestErrors = null;
    },

    async onLogin(values, elements) {
      this.standardErrors = [];
      this.requestErrors = null;

      try {
        const response = await mutationFunc(
          this,
          LOGIN_MUTATION,
          values,
          { debounce: 10000, throttle: 1000 },
        );

        const { data: { login }, errors } = response;

        if (login.token) {
          elements.password.value = '';

          this.$store.commit('setToken', login);

          if (login.isResetPassword) {
            this.$store.commit(
              'setModalContentComponent',
              'BaseResetChangePasswordModalForm',
            );
          } else {
            this.$store.commit('closeModal');
          }

          this.onLoginSuccessCallback();
        } else {
          this.standardErrors = errors;
        }
      } catch (errors) {
        this.requestErrors = errors;
      }
    },
  },
};
</script>
