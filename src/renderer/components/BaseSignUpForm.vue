
<template>
  <BaseModalForm
    submitButtonLabel="Sign Up"
    uniqueFormName="signupForm"
    formTitle="Sign Up"
    leftButtonLabel="Already have an account?"
    :fields="fields"
    :onCloseCallback="formOnClose"
    :onSubmitCallback="onSignup"
    :leftButtonOnClickCallback="switchToLoginForm"
    :requestErrors="requestErrors"
    :standardErrors="standardErrors"
    isShowErrorOnInput
  />
</template>

<script>
import { SIGNUP_MUTATION, LOGIN_MUTATION } from '@/mutations';
import mutationFunc from '@/mutationFunc';

export default {
  name: 'BaseSignUpForm',

  components: {
    async BaseModalForm() {
      const { BaseModalForm } = await import('@/components');

      return BaseModalForm;
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
        label: 'Email',
        type: 'text',
        name: 'email',
      }, {
        label: 'Password',
        type: 'password',
        name: 'password',
      }, {
        label: 'Sign up as',
        type: 'radio',
        name: 'signUpAs',
        value: 'student',
        options: [{
          label: 'Student',
          value: 'student',
        }, {
          label: 'Instructor',
          value: 'instructor',
        }],
      }];
    },
  },

  methods: {
    formOnClose(formElement) {
      this.$store.commit('closeModal');

      formElement.password.value = '';

      this.standardErrors = null;
      this.requestErrors = null;
    },

    switchToLoginForm() {
      this.$store.commit('setModalContentComponent', 'BaseLoginForm');

      this.standardErrors = null;
      this.requestErrors = null;
    },

    async onSignup(values, elements) {
      this.standardErrors = null;
      this.requestErrors = null;

      const { signUpAs, ...rest } = values;

      rest.signupRole = signUpAs.toUpperCase();

      try {
        const signUpResponse = await mutationFunc(
          this,
          SIGNUP_MUTATION,
          rest,
          { debounce: 3000, throttle: 1000 },
        );

        const { data: { signup } } = signUpResponse;

        if (signup.ok) {
          const loginResponse = await mutationFunc(
            this,
            LOGIN_MUTATION,
            values,
          );

          const { data: { login } } = loginResponse;

          elements.password.value = '';

          this.$store.commit('setToken', login);
          this.$store.commit('closeModal');
        } else {
          this.standardErrors = signup.errors;
        }
      } catch (errors) {
        this.requestErrors = errors;
      }
    },
  },
};
</script>
