<template>
  <form
    :action="action"
    method="POST"
  >
    <div>
      <label
        class="text-gray1"
        for="username"
      >
        {{ username }}
      </label>
      <input
        type="text"
        name="username"
      >
    </div>
    <div v-if="isSignUp">
      <label
        class="text-gray1"
        for="email"
      >
        Email
      </label>
      <input
        type="text"
        name="email"
      >
    </div>
    <div>
      <label
        class="text-gray1"
        for="password"
      >
        Password
      </label>
      <input
        type="password"
        name="password"
      >
    </div>
    <div class="flex justify-space-between">
      <span
        class="cursor-pointer"
        @click="changeValue()"
      >
        {{ spanText }}
      </span>
      <button
        class="button bg-blue cursor-pointer text-white"
      >
        {{ buttonText }}
      </button>
    </div>
  </form>
</template>
<script>
export default {
  name: 'EnrollComponent',

  data() {
    return {
      isSignUp: true,
      name: 'Sign Up',
      action: 'singup',
      username: 'Username',
      buttonText: 'Signup',
      spanText: 'Already have account?',
    };
  },
  methods: {
    changeValue() {
      if (this.isSignUp === true) {
        this.isSignUp = false;
        this.$parent.name = 'Sign In';
        this.action = 'signin';
        this.username = 'Email or Username';
        this.buttonText = 'Login';
        this.spanText = 'Have no account?';
      } else {
        this.isSignUp = true;
        this.$parent.name = 'Sign Up';
        this.action = 'signup';
        this.username = 'Username';
        this.buttonText = 'SignUp';
        this.spanText = 'Already have account?';
      }
    },
  },

};
</script>
<style scoped>
  input[type=text], input[type=password] {
    margin: 10px 0px;
    font-size: 18px;
    width: 550px;
    padding: 10px;
    border: 1px solid #979595;
    border-radius: 5px;
  }
  input[type=text]:focus, input[type=password]:focus {
    background-color: #E5E5E5;
    outline: none;
  }
</style>
